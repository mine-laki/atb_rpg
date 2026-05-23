import { useRef } from 'react';
import { useSaveLoad } from '../../hooks/useSaveLoad';
import type { SaveData } from '../../types';

interface SaveLoadPanelProps {
  gameData: SaveData;
  onLoad: (data: SaveData) => void;
}

export function SaveLoadPanel({ gameData, onLoad }: SaveLoadPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { save, load } = useSaveLoad();

  return (
    <div className="save-load-panel">
      <button className="btn-save" onClick={() => save(gameData)}>💾 セーブ</button>
      <button className="btn-load" onClick={() => fileRef.current?.click()}>📂 ロード</button>
      <input
        type="file"
        accept=".json"
        ref={fileRef}
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            const data = await load(file);
            onLoad(data);
          } catch (err) {
            alert((err as Error).message);
          }
          e.target.value = '';
        }}
      />
    </div>
  );
}
