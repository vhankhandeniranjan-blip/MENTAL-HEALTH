# Mind Matters AI chatbot setup

The website now includes a floating AI chatbot and a small Node.js backend. The browser never receives the OpenAI API key. The backend provides basic input validation and rate limiting, and the chatbot prompt is designed for a teenage mental-health-awareness site. It is an educational support tool, not a clinical or emergency service.

## Run locally

1. Install Node.js 18 or newer.
2. In this folder, set `OPENAI_API_KEY` in your terminal environment.
3. Run `npm start`.
4. Open `http://localhost:3000`.

Example (PowerShell):

```powershell
$env:OPENAI_API_KEY="your_api_key_here"
npm start
```

## Deploy on Render

1. Push the contents of this ZIP to a GitHub repository.
2. In Render, create a **New Web Service** and connect that repository.
3. Use **Build Command** `npm install` and **Start Command** `npm start` (or let Render use `render.yaml`).
4. In Render → Environment, add `OPENAI_API_KEY` with your own API key. Keep it secret; do not put it in HTML, JavaScript, GitHub or this ZIP.
5. Keep `OPENAI_MODEL` as `gpt-4.1-mini` unless you choose another model available to your API account.
6. Deploy. The chatbot sends requests to the same website domain at `/api/chat`.

The original site files and styling are retained. The supplied ZIP only contained `index.html`, `scripts/script.js`, `styles/style.css` and the favicon, so the chatbot is integrated into the supplied home page. Add the same widget markup and `scripts/chatbot.js` include to any additional HTML pages you later add if you want it on every page.
