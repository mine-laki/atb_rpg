// ファイルベース SE (魔王魂 / 効果音ラボ) + Web Audio API シンセ フォールバック
// 魔王魂: https://maou.audio/  効果音ラボ: https://soundeffect-lab.info/

let _ctx: AudioContext | null = null;
let _muted = false;
let _volume = 0.35;

function getCtx(): AudioContext | null {
  if (_muted) return null;
  if (!_ctx) {
    try {
      _ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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
interface SoundDef {
  file: string;
  vol: number;
  duration?: number;   // 再生秒数を制限（省略=全体）
  fadeOut?: number;    // フェードアウト開始位置 (秒)
}

const SOUND_MAP: Record<string, SoundDef> = {
  // 物理ヒット: 戦闘17 斬る音
  hit:      { file: 'maou_se_battle17.mp3',           vol: 0.75 },
  // 魔法ヒット: 爆発03
  magic:    { file: 'maou_se_battle_explosion03.mp3', vol: 0.50 },
  // 回復: きらきら (前作引き続き)
  heal:     { file: 'maou_se_magical25.mp3',          vol: 0.55 },
  // バフ: マジカル01
  buff:     { file: 'maou_se_magical01.mp3',          vol: 0.55 },
  // デバフ: マジカル02 を 0.5秒でカット
  debuff:   { file: 'maou_se_magical02.mp3',          vol: 0.55, duration: 0.5 },
  // ブレイク: 効果音ラボ 石割れ
  break:    { file: 'stone-break1.mp3',               vol: 0.80 },
  // 勝利: 効果音ラボ きら2
  victory:  { file: 'kira2.mp3',                      vol: 0.55 },
  // 敗北: 効果音ラボ ショック2
  defeat:   { file: 'shock2.mp3',                     vol: 0.60 },
  // 購入・装備強化: システム47
  buy:      { file: 'maou_se_system47.mp3',           vol: 0.65 },
  // レベルアップ: システム46
  levelup:  { file: 'maou_se_system46.mp3',           vol: 0.60 },
  // 戦闘開始: ショック2 を 1秒でフェードアウト
  battlestart: { file: 'shock2.mp3',                  vol: 0.55, duration: 1.2, fadeOut: 0.2 },
  // 作戦切替: シンセのみ (おとなしい)
};

const _buffers = new Map<string, AudioBuffer>();
let _loadingPromise: Promise<void> | null = null;

async function _loadAll(): Promise<void> {
  if (_loadingPromise) return _loadingPromise;
  const ctx = _ctx;
  if (!ctx) return;

  _loadingPromise = Promise.allSettled(
    Object.entries(SOUND_MAP).map(async ([key, { file }]) => {
      if (!file) return;
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

/** バッファ再生（duration指定で途中カット、fadeOut指定でフェードアウト） */
function playBuffer(key: string): void {
  const ctx = getCtx();
  const buf = _buffers.get(key);
  if (!ctx || !buf) return;

  const def = SOUND_MAP[key];
  const vol = (def?.vol ?? 0.6) * _volume;
  const dur = def?.duration;
  const fadeAt = def?.fadeOut;

  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = buf;
  src.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(vol, now);

  if (dur !== undefined && fadeAt !== undefined) {
    // フェードアウト区間
    const fadeStart = now + fadeAt;
    const fadeEnd   = now + dur;
    gain.gain.setValueAtTime(vol, fadeStart);
    gain.gain.linearRampToValueAtTime(0, fadeEnd);
    src.start(now);
    src.stop(fadeEnd + 0.05);
  } else if (dur !== undefined) {
    // 途中カット（フェードなし）
    src.start(now);
    src.stop(now + dur);
  } else {
    src.start(now);
  }
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

// ─── SE 定義 ─────────────────────────────────────────────

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

/** オプティマ切替（おとなしめのシンセ） */
export function seParadigmShift(): void {
  // ファイルなし、シンセで控えめに
  playTone({ freq: 440, type: 'triangle', duration: 0.10, gain: 0.12, attack: 0.005, decay: 0.02, fadeEnd: 0.10 });
  playTone({ freq: 660, type: 'triangle', duration: 0.08, gain: 0.10, attack: 0.005, decay: 0.01, fadeEnd: 0.08 }, 60);
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

/** 購入・装備強化 */
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

/** 戦闘開始 (shock2 を 1秒フェードアウト) */
export function seBattleStart(): void {
  if (_buffers.has('battlestart')) { playBuffer('battlestart'); return; }
  // fallback: 短い低音
  playTone({ freq: 180, type: 'sawtooth', duration: 0.6, gain: 0.20, attack: 0.02, decay: 0.1, fadeEnd: 0.6 });
}
