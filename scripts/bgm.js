(() => {
  const button = document.getElementById('music-toggle');
  const label = document.getElementById('music-label');
  if (!button) return;
  let context = null, master = null, timer = null, step = 0;
  const notes = [261.63, 329.63, 392.00, 329.63, 293.66, 349.23, 440.00, 349.23];
  function playNote() {
    if (!context || !master) return;
    const now = context.currentTime;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = 'sine';
    osc.frequency.value = notes[step % notes.length];
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);
    osc.connect(gain); gain.connect(master);
    osc.start(now); osc.stop(now + 2.15);
    step++;
  }
  async function start() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) { label.textContent = 'Music unavailable'; return; }
    if (!context) {
      context = new AudioCtx();
      master = context.createGain();
      master.gain.value = 0.28;
      master.connect(context.destination);
    }
    await context.resume();
    playNote();
    timer = window.setInterval(playNote, 1550);
    button.setAttribute('aria-pressed', 'true');
    button.setAttribute('aria-label', 'Pause background music');
    label.textContent = 'Pause calm music';
  }
  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
    if (master && context) master.gain.setTargetAtTime(0.0001, context.currentTime, 0.08);
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', 'Play background music');
    label.textContent = 'Play calm music';
  }
  button.addEventListener('click', async () => {
    if (timer) stop();
    else {
      if (master && context) master.gain.setTargetAtTime(0.28, context.currentTime, 0.08);
      await start();
    }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && timer) stop(); });
})();