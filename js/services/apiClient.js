import { API_BASE, ALLOWED_HOST } from "./config.js";

const TIMEOUT_MS = 15000;

/**
 * Valida que a URL pertence ao host permitido antes de disparar a requisição.
 * Mitiga SSRF caso API_BASE seja alterado inadvertidamente.
 */
function assertTrustedUrl(url) {
  try {
    const { hostname } = new URL(url);
    if (hostname !== ALLOWED_HOST) {
      throw new Error(`Host não permitido: ${hostname}`);
    }
  } catch (e) {
    if (e.message.startsWith("Host não permitido")) throw e;
    throw new Error(`URL inválida: ${url}`);
  }
}

function mapearErroHttp(status, path) {
  const mapa = {
    400: "Dados inválidos enviados ao servidor.",
    401: "Não autorizado. Verifique as credenciais da API.",
    403: "Acesso negado.",
    404: `Recurso não encontrado: ${path}`,
    409: "Conflito: registro já existe.",
    422: "Dados não processáveis pelo servidor.",
    429: "Muitas requisições. Aguarde e tente novamente.",
    500: "Erro interno do servidor. Tente novamente mais tarde.",
    503: "Serviço indisponível. Tente novamente mais tarde.",
  };
  return mapa[status] ?? `Erro inesperado [${status}].`;
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  assertTrustedUrl(url);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...options.headers },
    });

    if (!response.ok) {
      throw new Error(mapearErroHttp(response.status, path));
    }

    if (response.status === 204) return null;

    return response.json();
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("A requisição demorou muito. Verifique sua conexão.");
    }
    if (err.message === "Failed to fetch") {
      throw new Error("Sem conexão com o servidor. Verifique sua internet.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, data) => request(path, { method: "POST", body: JSON.stringify(data) }),
  patch: (path, data) => request(path, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (path) => request(path, { method: "DELETE" }),
};
