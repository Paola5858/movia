import { apiClient } from './apiClient.js';

export const unidadeMedidaService = {
  listar: () => apiClient.get('/unidade_medida'),
  cadastrar: (dados) => apiClient.post('/unidade_medida', dados),
  atualizar: (id, dados) => apiClient.patch(`/unidade_medida/${id}`, dados),
  excluir: (id) => apiClient.delete(`/unidade_medida/${id}`),
};
