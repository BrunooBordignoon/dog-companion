import pako from 'pako';

export type CharacterExportData = {
  characterType: 'detetive' | 'soldado' | 'feiticeiro';
  data: Record<string, string>; // todos os valores do localStorage
  exportedAt: string;
  characterName?: string; // Para exibir no banner
};

/**
 * Exporta todos os dados do personagem do localStorage
 */
export function exportCharacterData(characterType: 'detetive' | 'soldado' | 'feiticeiro'): string {
  if (typeof window === 'undefined') {
    throw new Error('exportCharacterData can only be called on client side');
  }

  // Coletar TODOS os dados do localStorage relacionados ao personagem
  const data: Record<string, string> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes(characterType) || key === 'dogCompanion' || key === 'soldado-sword-data' || key === 'feiticeiro-grimorio-data')) {
      const value = localStorage.getItem(key);
      if (value) {
        data[key] = value;
      }
    }
  }

  // Tentar extrair o nome do personagem
  let characterName = 'Personagem';
  if (characterType === 'detetive') characterName = 'José';
  if (characterType === 'soldado') characterName = 'Moyza';
  if (characterType === 'feiticeiro') characterName = 'Welliton';

  const nameKey = `${characterType}-character-name`;
  if (data[nameKey]) {
    characterName = data[nameKey];
  }

  const exportData: CharacterExportData = {
    characterType,
    data,
    exportedAt: new Date().toISOString(),
    characterName,
  };

  // JSON → Gzip → Base64
  const json = JSON.stringify(exportData);
  const compressed = pako.gzip(json);
  const base64 = btoa(String.fromCharCode(...Array.from(compressed)));

  return base64;
}

/**
 * Importa dados de personagem de uma string Base64
 */
export function importCharacterData(base64: string): CharacterExportData {
  try {
    // Base64 → Gzip → JSON
    const compressed = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const json = pako.ungzip(compressed, { to: 'string' });
    const data = JSON.parse(json) as CharacterExportData;

    // Validação básica
    if (!data.characterType || !data.data || !data.exportedAt) {
      throw new Error('Invalid character data structure');
    }

    return data;
  } catch (e) {
    console.error('Failed to import character data:', e);
    throw new Error('Dados de personagem inválidos ou corrompidos');
  }
}

/**
 * Gera URL de compartilhamento completa
 */
export function generateShareURL(characterType: 'detetive' | 'soldado' | 'feiticeiro'): string {
  const base64 = exportCharacterData(characterType);
  const baseURL = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseURL}/view?data=${encodeURIComponent(base64)}&char=${characterType}`;
}

/**
 * Formata timestamp para exibição
 */
export function formatExportDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora há pouco';
  if (diffMins < 60) return `há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;

  return date.toLocaleDateString('pt-BR');
}
