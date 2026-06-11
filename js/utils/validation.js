/**
 * Retorna uma string de erro ou null se válido.
 * @param {{ nome: string }} dados
 * @returns {string|null}
 */
export function validarMarca(dados) {
  if (!dados.nome || dados.nome.trim().length < 2)
    return "O nome da marca deve ter pelo menos 2 caracteres.";
  if (dados.nome.trim().length > 100)
    return "O nome da marca deve ter no máximo 100 caracteres.";
  return null;
}

/**
 * @param {{ nome: string }} dados
 * @returns {string|null}
 */
export function validarModelo(dados) {
  if (!dados.nome || dados.nome.trim().length < 2)
    return "O nome do modelo deve ter pelo menos 2 caracteres.";
  if (dados.nome.trim().length > 100)
    return "O nome do modelo deve ter no máximo 100 caracteres.";
  return null;
}

/**
 * @param {{ descricao: string, ano: number, horimetro: number, marca_id: number, modelo_id: number }} dados
 * @returns {string|null}
 */
export function validarVeiculo(dados) {
  if (!dados.descricao || dados.descricao.trim().length < 2)
    return "A descrição deve ter pelo menos 2 caracteres.";
  if (dados.descricao.trim().length > 150)
    return "A descrição deve ter no máximo 150 caracteres.";
  if (!Number.isInteger(dados.ano) || dados.ano < 1900 || dados.ano > 2100)
    return "Informe um ano válido entre 1900 e 2100.";
  if (!Number.isInteger(dados.horimetro) || dados.horimetro < 0)
    return "O horímetro deve ser um número inteiro não negativo.";
  if (!dados.marca_id || isNaN(dados.marca_id))
    return "Selecione uma marca.";
  if (!dados.modelo_id || isNaN(dados.modelo_id))
    return "Selecione um modelo.";
  return null;
}
