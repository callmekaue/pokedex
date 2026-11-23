/* =========================================================
   Trilha de fundo original em estilo chiptune (8 bits).
   Composição própria, gerada em tempo real com a Web Audio API:
   não usa arquivos de áudio nem músicas dos jogos.
   Uso: DexMusic.start(), DexMusic.stop(), DexMusic.duck(ms)
   ========================================================= */

(() => {
  const BPM = 132;
  const STEP = 60 / BPM / 2;          // duração de uma colcheia, em segundos
  const VOLUME = 0.07;

  // Notas MIDI (60 = Dó central). null = pausa.
  // Melodia: 8 compassos de 8 colcheias.
  const MELODY = [
    64, 67, 72, 67, 64, 62, 64, 67,
    69, 67, 64, 60, 62, 64, 60, 57,
    65, 69, 72, 69, 67, 65, 64, 65,
    67, null, 62, 67, 71, 69, 67, null,
    64, 67, 72, 74, 76, 74, 72, 67,
    71, 67, 64, 67, 71, 72, 71, 67,
    69, 72, 69, 65, 67, 69, 65, 62,
    62, 64, 65, 67, 59, 62, 67, null,
  ];

  // Baixo: uma nota por compasso (acordes C, Am, F, G, C, Em, F, G)
  const BASS_ROOTS = [36, 33, 29, 31, 36, 28, 29, 31];

  const freq = (midi) => 440 * 2 ** ((midi - 69) / 12);

  let ctx = null;
  let master = null;
  let timer = null;
  let step = 0;
  let nextTime = 0;
  let playing = false;

  function setup() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
  }

  function tone(type, f, start, dur, vol) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = f;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.01);
    gain.gain.setValueAtTime(vol, start + dur * 0.6);
    gain.gain.linearRampToValueAtTime(0, start + dur);
    osc.connect(gain).connect(master);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  function hat(start) {
    const len = Math.floor(ctx.sampleRate * 0.03);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 6000;
    gain.gain.value = 0.25;
    src.buffer = buffer;
    src.connect(filter).connect(gain).connect(master);
    src.start(start);
  }

  function schedule(i, t) {
    const note = MELODY[i % MELODY.length];
    if (note !== null) tone('square', freq(note), t, STEP * 0.9, 0.22);

    const bar = Math.floor(i / 8) % BASS_ROOTS.length;
    const beat = i % 8;
    const root = BASS_ROOTS[bar];
    // baixo alternando fundamental e oitava a cada colcheia
    tone('triangle', freq(beat % 2 === 0 ? root : root + 12), t, STEP * 0.85, 0.5);

    if (beat % 2 === 1) hat(t);
  }

  function tick() {
    while (nextTime < ctx.currentTime + 0.12) {
      schedule(step, nextTime);
      nextTime += STEP;
      step++;
    }
  }

  function start() {
    if (playing) return;
    if (!ctx) setup();
    ctx.resume();
    playing = true;
    step = 0;
    nextTime = ctx.currentTime + 0.05;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(VOLUME, ctx.currentTime + 0.8);  // entra suave
    timer = setInterval(tick, 25);
  }

  function stop() {
    if (!playing) return;
    playing = false;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + 0.4);                    // sai suave
    setTimeout(() => { if (!playing) clearInterval(timer); }, 450);
  }

  // abaixa o volume por um tempo (ex.: enquanto toca o grito do Pokémon)
  function duck(ms = 1500) {
    if (!playing) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(VOLUME * 0.2, now + 0.1);
    master.gain.setValueAtTime(VOLUME * 0.2, now + ms / 1000);
    master.gain.linearRampToValueAtTime(VOLUME, now + ms / 1000 + 0.5);
  }

  window.DexMusic = { start, stop, duck, get playing() { return playing; } };
})();
