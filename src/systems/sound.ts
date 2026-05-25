// Web Audio API を使った SE システム（外部ファイル不要）
// AudioContext は初回ユーザー操作後にのみ作成可能

let _ctx: AudioContext | null = null;
let _muted = false;
let _volume = 0.35; // デフォルト音量

function getCtx(): AudioContext | null {
  if (_muted) return null;
  if (!_ctx) {
    try {
      _ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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

// ─── SE 定義 ───────────────────────────────────────────────

/** 物理攻撃ヒット */
export function seHit(): void {
  playTone({ freq: 220, type: 'sawtooth', duration: 0.08, gain: 0.25, attack: 0.002, decay: 0.01, fadeEnd: 0.08 });
  playTone({ freq: 180, type: 'square',   duration: 0.06, gain: 0.15, attack: 0.002, decay: 0.01, fadeEnd: 0.06 }, 20);
}

/** 魔法・属性ヒット */
export function seMagicHit(): void {
  playTone({ freq: 660, type: 'sine',     duration: 0.12, gain: 0.2,  attack: 0.005, decay: 0.02, fadeEnd: 0.12 });
  playTone({ freq: 880, type: 'sine',     duration: 0.10, gain: 0.15, attack: 0.005, decay: 0.01, fadeEnd: 0.10 }, 30);
}

/** 回復 */
export function seHeal(): void {
  [440, 550, 660].forEach((f, i) => {
    playTone({ freq: f, type: 'sine', duration: 0.18, gain: 0.22, attack: 0.01, decay: 0.03, fadeEnd: 0.18 }, i * 60);
  });
}

/** バフ付与 */
export function seBuff(): void {
  [330, 440, 660].forEach((f, i) => {
    playTone({ freq: f, type: 'triangle', duration: 0.14, gain: 0.2, attack: 0.01, decay: 0.02, fadeEnd: 0.14 }, i * 50);
  });
}

/** デバフ付与 */
export function seDebuff(): void {
  [330, 260, 200].forEach((f, i) => {
    playTone({ freq: f, type: 'sawtooth', duration: 0.1, gain: 0.18, attack: 0.005, decay: 0.02, fadeEnd: 0.1 }, i * 60);
  });
}

/** ブレイク発生 */
export function seBreak(): void {
  // 上昇和音 → 衝撃音
  [220, 330, 440, 660].forEach((f, i) => {
    playTone({ freq: f, type: 'sawtooth', duration: 0.22, gain: 0.3, attack: 0.005, decay: 0.03, fadeEnd: 0.22 }, i * 30);
  });
  playTone({ freq: 110, type: 'square', duration: 0.3, gain: 0.35, attack: 0.01, decay: 0.05, fadeEnd: 0.3 }, 130);
}

/** オプティマ切替 */
export function seParadigmShift(): void {
  [440, 550, 880].forEach((f, i) => {
    playTone({ freq: f, type: 'triangle', duration: 0.15, gain: 0.25, attack: 0.005, decay: 0.02, fadeEnd: 0.15 }, i * 40);
  });
}

/** ビクトリー */
export function seVictory(): void {
  const melody = [523, 659, 784, 1047]; // C5 E5 G5 C6
  melody.forEach((f, i) => {
    playTone({ freq: f, type: 'triangle', duration: 0.28, gain: 0.28, attack: 0.01, decay: 0.03, fadeEnd: 0.28 }, i * 120);
  });
}

/** デフィート */
export function seDefeat(): void {
  const melody = [440, 349, 262, 196]; // 下降
  melody.forEach((f, i) => {
    playTone({ freq: f, type: 'sawtooth', duration: 0.3, gain: 0.22, attack: 0.01, decay: 0.03, fadeEnd: 0.3 }, i * 150);
  });
}

/** 購入 */
export function seBuy(): void {
  [660, 880].forEach((f, i) => {
    playTone({ freq: f, type: 'sine', duration: 0.1, gain: 0.2, attack: 0.005, decay: 0.01, fadeEnd: 0.1 }, i * 60);
  });
}

/** レベルアップ */
export function seLevelUp(): void {
  [523, 659, 784, 1047, 1319].forEach((f, i) => {
    playTone({ freq: f, type: 'triangle', duration: 0.2, gain: 0.25, attack: 0.005, decay: 0.02, fadeEnd: 0.2 }, i * 80);
  });
}
