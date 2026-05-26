// ファイルベース SE (魔王魂) + Web Audio API シンセ フォールバック
// 使用素材: 魔王魂 https://maou.audio/  (利用規約: 無料・クレジット表記推奨)

let _ctx: AudioContext | null = null;
let _muted = false;
let _volume = 0.35;

function getCtx(): AudioContext | null {
  if (_muted) return null;
  if (!_ctx) {
    try {
      _ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      // AudioContext 作成直後にSEをバックグラウンドロード
      _loadAll().catch(() => {});
    } catch {
      return null;
    }
  }
  if (_ctx.state === 'suspended') {
    _ctx.resume().catch(() => {});
  }
  return _ctx;
}

export function setSoundMuted(v: boolean)  { _muted = v; }
export function setSoundVolume(v: number)  { _volume = Math.max(0, Math.min(1, v)); }
export function isSoundMuted(): boolean    { return _muted; }
export function getSoundVolume(): number   { return _volume; }

// ─── SE ファイル定義 ─────────────────────────────────────
// 素材: 魔王魂 (maou.audio) — 各ファイルは public/sounds/ に配置
const SOUND_MAP: Record<string, { file: string; vol: number }> = {
  hit:      { file: 'maou_se_battle09.mp3',   vol: 0.70 }, // 打撃音
  magic:    { file: 'maou_se_magical27.mp3',  vol: 0.50 }, // 魔法
  heal:     { file: 'maou_se_magical25.mp3',  vol: 0.55 }, // しゃーきらきら
  buff:     { file: 'maou_se_system25.mp3',   vol: 0.65 }, // 決定音
  debuff:   { file: 'maou_se_magical28.mp3',  vol: 0.55 }, // 能力低下
  break:    { file: 'maou_se_battle19.mp3',   vol: 0.75 }, // 衝撃
  paradigm: { file: 'maou_se_system29.mp3',   vol: 0.60 }, // 決定音
  victory:  { file: 'maou_se_jingle05.mp3',   vol: 0.55 }, // 当たり(ファンファーレ)
  defeat:   { file: 'maou_se_onepoint06.mp3', vol: 0.60 }, // ガーン！
  buy:      { file: 'maou_se_system09.mp3',   vol: 0.65 }, // メニュー/決定音
  levelup:  { file: 'maou_se_jingle06.mp3',   vol: 0.55 }, // 当たり2(レベルアップ)
};

const _buffers = new Map<string, AudioBuffer>();
let _loadingPromise: Promise<void> | null = null;

async function _loadAll(): Promise<void> {
  if (_loadingPromise) return _loadingPromise;
  const ctx = _ctx;
  if (!ctx) return;

  _loadingPromise = Promise.allSettled(
    Object.entries(SOUND_MAP).map(async ([key, { file }]) => {
      try {
        const base = (import.meta.env.BASE_URL as string) ?? '/';
        const url = `${base}sounds/${file}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ab = await res.arrayBuffer();
        const buf = await ctx.decodeAudioData(ab);
        _buffers.set(key, buf);
      } catch (e) {
        console.warn(`[SE] load failed: ${key}`, e);
      }
    })
  ).then(() => {});

  return _loadingPromise;
}

function playBuffer(key: string): void {
  const ctx = getCtx();
  const buf = _buffers.get(key);
  if (!ctx || !buf) return;
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = buf;
  src.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.value = (SOUND_MAP[key]?.vol ?? 0.6) * _volume;
  src.start();
}

// ─── シンセ フォールバック ─────────────────────────────────

type WaveType = OscillatorType;

interface ToneParams {
  freq: number;
  type?: WaveType;
  duration?: number;
  gain?: number;
  attack?: number;
  decay?: number;
  fadeEnd?: number;
}

function playTone(params: ToneParams, delayMs = 0): void {
  const ctx = getCtx();
  if (!ctx) return;
  const { freq, type = 'sine', duration = 0.12, gain = 0.4, attack = 0.01, decay = 0.02, fadeEnd = duration } = params;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type = type;
  osc.frequency.value = freq;

  const startAt = ctx.currentTime + delayMs / 1000;
  gainNode.gain.setValueAtTime(0, startAt);
  gainNode.gain.linearRampToValueAtTime(gain * _volume, startAt + attack);
  gainNode.gain.linearRampToValueAtTime(gain * _volume * 0.7, startAt + attack + decay);
  gainNode.gain.linearRampToValueAtTime(0, startAt + fadeEnd);

  osc.start(startAt);
  osc.stop(startAt + fadeEnd + 0.02);
}

// ─── SE 定義（ファイル優先 → シンセ フォールバック）───────────

/** 物理攻撃ヒット */
export function seHit(): void {
  if (_buffers.has('hit')) { playBuffer('hit'); return; }
  playTone({ freq: 220, type: 'sawtooth', duration: 0.08, gain: 0.25, attack: 0.002, decay: 0.01, fadeEnd: 0.08 });
  playTone({ freq: 180, type: 'square',   duration: 0.06, gain: 0.15, attack: 0.002, decay: 0.01, fadeEnd: 0.06 }, 20);
}

/** 魔法・属性ヒット */
export function seMagicHit(): void {
  if (_buffers.has('magic')) { playBuffer('magic'); return; }
  playTone({ freq: 660, type: 'sine',     duration: 0.12, gain: 0.2,  attack: 0.005, decay: 0.02, fadeEnd: 0.12 });
  playTone({ freq: 880, type: 'sine',     duration: 0.10, gain: 0.15, attack: 0.005, decay: 0.01, fadeEnd: 0.10 }, 30);
}

/** 回復 */
export function seHeal(): void {
  if (_buffers.has('heal')) { playBuffer('heal'); return; }
  [440, 550, 660].forEach((f, i) => {
    playTone({ freq: f, type: 'sine', duration: 0.18, gain: 0.22, attack: 0.01, decay: 0.03, fadeEnd: 0.18 }, i * 60);
  });
}

/** バフ付与 */
export function seBuff(): void {
  if (_buffers.has('buff')) { playBuffer('buff'); return; }
  [330, 440, 660].forEach((f, i) => {
    playTone({ freq: f, type: 'triangle', duration: 0.14, gain: 0.2, attack: 0.01, decay: 0.02, fadeEnd: 0.14 }, i * 50);
  });
}

/** デバフ付与 */
export function seDebuff(): void {
  if (_buffers.has('debuff')) { playBuffer('debuff'); return; }
  [330, 260, 200].forEach((f, i) => {
    playTone({ freq: f, type: 'sawtooth', duration: 0.1, gain: 0.18, attack: 0.005, decay: 0.02, fadeEnd: 0.1 }, i * 60);
  });
}

/** ブレイク発生 */
export function seBreak(): void {
  if (_buffers.has('break')) { playBuffer('break'); return; }
  [220, 330, 440, 660].forEach((f, i) => {
    playTone({ freq: f, type: 'sawtooth', duration: 0.22, gain: 0.3, attack: 0.005, decay: 0.03, fadeEnd: 0.22 }, i * 30);
  });
  playTone({ freq: 110, type: 'square', duration: 0.3, gain: 0.35, attack: 0.01, decay: 0.05, fadeEnd: 0.3 }, 130);
}

/** オプティマ切替 */
export function seParadigmShift(): void {
  if (_buffers.has('paradigm')) { playBuffer('paradigm'); return; }
  [440, 550, 880].forEach((f, i) => {
    playTone({ freq: f, type: 'triangle', duration: 0.15, gain: 0.25, attack: 0.005, decay: 0.02, fadeEnd: 0.15 }, i * 40);
  });
}

/** ビクトリー */
export function seVictory(): void {
  if (_buffers.has('victory')) { playBuffer('victory'); return; }
  const melody = [523, 659, 784, 1047];
  melody.forEach((f, i) => {
    playTone({ freq: f, type: 'triangle', duration: 0.28, gain: 0.28, attack: 0.01, decay: 0.03, fadeEnd: 0.28 }, i * 120);
  });
}

/** デフィート */
export function seDefeat(): void {
  if (_buffers.has('defeat')) { playBuffer('defeat'); return; }
  const melody = [440, 349, 262, 196];
  melody.forEach((f, i) => {
    playTone({ freq: f, type: 'sawtooth', duration: 0.3, gain: 0.22, attack: 0.01, decay: 0.03, fadeEnd: 0.3 }, i * 150);
  });
}

/** 購入 */
export function seBuy(): void {
  if (_buffers.has('buy')) { playBuffer('buy'); return; }
  [660, 880].forEach((f, i) => {
    playTone({ freq: f, type: 'sine', duration: 0.1, gain: 0.2, attack: 0.005, decay: 0.01, fadeEnd: 0.1 }, i * 60);
  });
}

/** レベルアップ */
export function seLevelUp(): void {
  if (_buffers.has('levelup')) { playBuffer('levelup'); return; }
  [523, 659, 784, 1047, 1319].forEach((f, i) => {
    playTone({ freq: f, type: 'triangle', duration: 0.2, gain: 0.25, attack: 0.005, decay: 0.02, fadeEnd: 0.2 }, i * 80);
  });
}
