import { useCallback } from 'react';
import { exportSave, importSave, loadFromCache } from '../systems/save';
import type { SaveData } from '../types';

export function useSaveLoad() {
  const save = useCallback((data: SaveData) => {
    exportSave(data);
  }, []);

  const load = useCallback(async (file: File): Promise<SaveData> => {
    return importSave(file);
  }, []);

  const loadCache = useCallback((): SaveData | null => {
    return loadFromCache();
  }, []);

  return { save, load, loadCache };
}
