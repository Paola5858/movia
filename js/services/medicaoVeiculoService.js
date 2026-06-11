import { apiClient } from './apiClient.js';

export const medicaoVeiculoService = {
  listar: () => apiClient.get('/medicao_veiculo'),
  cadastrar: (dados) => apiClient.post('/medicao_veiculo', dados),
  atualizar: (id, dados) => apiClient.patch(`/medicao_veiculo/${id}`, dados),
  excluir: (id) => apiClient.delete(`/medicao_veiculo/${id}`),
};
