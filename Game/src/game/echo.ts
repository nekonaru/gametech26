import { assetUrl } from '../core/paths.js';

export interface EchoEntry {
  id: string;
  titleKey: string;
  bodyKey: string;
  unlockClue?: string;
}

/** Katalog rekaman echo. Datanya lokal, jadi gagal muat berarti daftar kosong. */
export async function loadEchoes(): Promise<Record<string, EchoEntry>> {
  try {
    const response = await fetch(assetUrl('data/echoes.json'));
    if (!response.ok) return {};
    const data = await response.json() as { echoes?: EchoEntry[] };
    const result: Record<string, EchoEntry> = {};
    for (const entry of data.echoes ?? []) result[entry.id] = entry;
    return result;
  } catch (error) {
    console.warn('[echo] gagal memuat katalog:', error);
    return {};
  }
}
