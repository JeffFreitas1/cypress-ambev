/**
 * Gera um timestamp no formato YYYYMMDD.HHmmss.
 * Exemplo: 20260327.142315
 */
const timestamp = () => {
  const agora = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const data = agora.toISOString().slice(0, 10).replace(/-/g, '');
  const hora = `${pad(agora.getHours())}${pad(agora.getMinutes())}${pad(agora.getSeconds())}`;
  return `${data}.${hora}`;
};

/**
 * Gera um email único por segundo no formato: jefambev.20260327.142315@serverest.dev
 */
const gerarEmail = () => `jefambev.${timestamp()}@serverest.dev`;

/**
 * Retorna um payload de usuário cliente com dados padrão, mesclando qualquer override.
 * @param {object} overrides - campos a sobrescrever no payload
 */
const criarPayloadUsuario = (overrides = {}) => ({
  nome: 'Usuário Cypress',
  email: gerarEmail(),
  password: 'Senha123!',
  administrador: 'false',
  ...overrides,
});

/**
 * Retorna um payload de usuário administrador com dados padrão, mesclando qualquer override.
 * @param {object} overrides - campos a sobrescrever no payload
 */
const criarPayloadAdmin = (overrides = {}) =>
  criarPayloadUsuario({ administrador: 'true', nome: 'Admin Cypress', ...overrides });

module.exports = { gerarEmail, criarPayloadUsuario, criarPayloadAdmin };
