import { apiClient } from "./apiClient.js";

export const marcaService = {
  listar: () => apiClient.get("/marca"),
  cadastrar: (dados) => apiClient.post("/marca", dados),
  atualizar: (id, dados) => apiClient.patch(`/marca/${id}`, dados),
  excluir: (id) => apiClient.delete(`/marca/${id}`),
};
