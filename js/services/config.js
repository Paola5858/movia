// Ponto único de configuração da API.
// Para trocar de ambiente (dev → prod), edite apenas aqui.
//
// ⚠️  NUNCA coloque tokens de autenticação ou chaves secretas neste arquivo.
//     Credenciais devem ficar em um backend proxy, nunca no cliente web.
//     Consulte o README para instruções de configuração por ambiente.

export const API_BASE = "https://x8ki-letl-twmt.n7.xano.io/api:wKeJgzVa";

// Host extraído de API_BASE — usado pelo apiClient para validar a URL antes
// de cada requisição e impedir que uma alteração acidental aponte para outro host.
export const ALLOWED_HOST = "x8ki-letl-twmt.n7.xano.io";
