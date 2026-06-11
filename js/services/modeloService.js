import { apiClient } from "./apiClient.js";

export const modeloService = {
  listar: () => apiClient.get("/modelo"),
  cadastrar: (dados) => apiClient.post("/modelo", dados),
  atualizar: (id, dados) => apiClient.patch(`/modelo/${id}`, dados),
  excluir: (id) => apiClient.delete(`/modelo/${id}`),
};
