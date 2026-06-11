import { apiClient } from './apiClient.js';

export const medicaoService = {
  listar: () => apiClient.get('/medicao'),
  cadastrar: (dados) => apiClient.post('/medicao', dados),
  atualizar: (id, dados) => apiClient.patch(`/medicao/${id}`, dados),
  excluir: (id) => apiClient.delete(`/medicao/${id}`),
};
