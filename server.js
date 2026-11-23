const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const MIME = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'application/javascript; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.ico':'image/x-icon' };
const hits = new Map();

const SYSTEM_PROMPT = `You are Mind Matters Assistant on a teenage mental-health-awareness website. The audience includes minors. Be warm, respectful, calm, non-judgmental, age-appropriate and concise. You provide general wellbeing education and supportive listening, not therapy, diagnosis, medical advice or emergency care.

You may discuss ordinary stress, exam worries, emotions, friendships, bullying, sleep routines, healthy habits and how to ask a trusted adult for help. Offer small, safe, practical coping ideas. Do not shame, label, diagnose or promise confidentiality. Never ask for identifying details, contact details, school name, address, passwords or private records. Do not encourage secrecy from safe adults. For medication or clinical questions, encourage speaking with a qualified health professional and a trusted adult. Do not provide graphic descriptions or instructions related to self-harm, suicide, violence, dangerous substances or other dangerous activities.

If a user says they may hurt themselves, may end their life, cannot stay safe, or someone is in immediate danger: respond compassionately, encourage them to tell a trusted adult immediately and stay with that adult, and direct them to emergency services. For users in India, mention 112 for immediate emergencies and Tele-MANAS 14416 for mental-health support. Do not provide methods, details, or ask them to describe any plan. If location is unknown, say to contact their local emergency number. Do not imply that this chat is monitored or that you can dispatch help.

If the question is outside your role, say so plainly and suggest a trusted adult or qualified professional. Never claim to be human. Keep answers easy for teenagers to understand.`;

function send(res, status, body, type='application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'strict-origin-when-cross-origin', 'X-Frame-Options':'SAMEORIGIN' });
  res.end(type.startsWith('application/json') ? JSON.stringify(body) : body);
}
function limited(req) {
  const ip = req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = hits.get(ip) || { start: now, count: 0 };
  if (now - record.start > 60_000) { record.start = now; record.count = 0; }
  record.count++;
  hits.set(ip, record);
  return record.count > 15;
}
async function handleChat(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error:'Method not allowed.' });
  if (limited(req)) return send(res, 429, { error:'Please wait a moment before sending another message.' });
  if (!API_KEY) return send(res, 503, { error:'The AI assistant has not been configured yet. The website owner needs to add OPENAI_API_KEY in the hosting environment.' });
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 12_000) return send(res, 413, { error:'Message is too long.' });
  }
  let payload;
  try { payload = JSON.parse(raw || '{}'); } catch { return send(res, 400, { error:'Invalid request.' }); }
  if (!Array.isArray(payload.messages) || payload.messages.length < 1 || payload.messages.length > 20) return send(res, 400, { error:'Invalid conversation.' });
  const messages = [];
  for (const item of payload.messages) {
    if (!item || !['user','assistant'].includes(item.role) || typeof item.content !== 'string' || !item.content.trim() || item.content.length > 1200) return send(res, 400, { error:'Invalid message.' });
    messages.push({ role:item.role, content:item.content.trim() });
  }
  if (messages[messages.length - 1].role !== 'user') return send(res, 400, { error:'A user message is required.' });
  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST',
      headers:{ 'Authorization':`Bearer ${API_KEY}`, 'Content-Type':'application/json' },
      body:JSON.stringify({ model:MODEL, temperature:0.5, max_tokens:450, messages:[{ role:'system', content:SYSTEM_PROMPT }, ...messages] }),
      signal:AbortSignal.timeout(30_000)
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error('AI provider request failed:', upstream.status, data.error?.type || 'unknown');
      return send(res, 502, { error:'The assistant could not respond just now. Please try again later.' });
    }
    const reply = data.choices?.[0]?.message?.content;
    if (typeof reply !== 'string' || !reply.trim()) return send(res, 502, { error:'The assistant returned an empty reply. Please try again.' });
    return send(res, 200, { reply:reply.trim() });
  } catch (error) {
    console.error('AI request error:', error.name || 'Error');
    return send(res, 504, { error:'The assistant timed out. Please try again.' });
  }
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/api/chat') return handleChat(req, res);
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error:'Method not allowed.' });
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { return send(res, 400, 'Bad request', 'text/plain; charset=utf-8'); }
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.resolve(ROOT, '.' + pathname);
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== path.join(ROOT, 'index.html')) return send(res, 403, 'Forbidden', 'text/plain; charset=utf-8');
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
    const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type':type, 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'strict-origin-when-cross-origin' });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(filePath).pipe(res);
  });
});
server.listen(PORT, () => console.log(`Mind Matters website listening on ${PORT}`));
