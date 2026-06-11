import { apiClient } from "./apiClient.js";

// Mapper defensivo para normalizar o formato do backend em um shape consistente
// com o que os controllers esperam. Baseado no JSON de exemplo recebido, a API
// retorna keys em lower-case (descricao, ano, horimetro, marca, modelo).
// Ajuste aqui se a API passar a usar PascalCase (Descricao, Ano, Horimetro, MarcaId...).
function normalizar(v) {
  return {
    id: v.id,
    descricao: v.descricao ?? v.Descricao ?? "",
    ano: Number(v.ano ?? v.Ano ?? 0),
    horimetro: Number(v.horimetro ?? v.Horimetro ?? 0),
    // normalizamos para *_id no frontend para consistência com os forms
    marca_id: v.marca ?? v.MarcaId ?? v.marca_id ?? null,
    modelo_id: v.modelo ?? v.ModeloId ?? v.modelo_id ?? null,
    created_at: v.created_at ?? v.CreatedAt ?? null,
  };
}

export const veiculoService = {
  listar: () =>
    apiClient.get("/veiculo").then((lista) => lista.map(normalizar)),
  cadastrar: (dados) => apiClient.post("/veiculo", dados),
  atualizar: (id, dados) => apiClient.patch(`/veiculo/${id}`, dados),
  excluir: (id) => apiClient.delete(`/veiculo/${id}`),
};
