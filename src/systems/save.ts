import type { SaveData } from '../types';

const SAVE_VERSION = '1.0.0';
const LS_KEY = 'emoji_paradigm_save';

export function exportSave(data: SaveData): void {
  const payload: SaveData = {
    ...data,
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
  };

  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const ts = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15);
  const filename = `emoji_paradigm_${ts}.json`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);

  try { localStorage.setItem(LS_KEY, json); } catch { /* ignore quota */ }
}

export async function importSave(file: File): Promise<SaveData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = JSON.parse(e.target?.result as string) as SaveData;
        const validated = validateSave(raw);
        try { localStorage.setItem(LS_KEY, JSON.stringify(validated)); } catch { /**/ }
        resolve(validated);
      } catch (err) {
        reject(new Error('セーブデータの読み込みに失敗しました: ' + (err as Error).message));
      }
    };
    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
    reader.readAsText(file);
  });
}

/** Write to localStorage without triggering a file download (used for auto-save on victory). */
export function syncToCache(data: SaveData): void {
  try {
    const payload: SaveData = { ...data, version: SAVE_VERSION, savedAt: new Date().toISOString() };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  } catch { /* ignore quota errors */ }
}

export function loadFromCache(): SaveData | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return validateSave(JSON.parse(raw));
  } catch {
    return null;
  }
}

function validateSave(raw: unknown): SaveData {
  if (typeof raw !== 'object' || raw === null) throw new Error('無効なデータ形式');
  const d = raw as Record<string, unknown>;
  if (typeof d.version !== 'string') throw new Error('version フィールドがありません');
  if (typeof d.savedAt !== 'string') throw new Error('savedAt フィールドがありません');
  if (!d.player || !d.progress) throw new Error('必須フィールドが不足しています');
  return migrateIfNeeded(d as unknown as SaveData);
}

function migrateIfNeeded(data: SaveData): SaveData {
  return { ...data, version: SAVE_VERSION };
}
