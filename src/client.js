const { Client, LocalAuth } = require('whatsapp-web.js');

/**
 * Crea una instancia del cliente de WhatsApp usando autenticación local.
 * La instancia se configura para ejecutarse en modo headless y sin sandbox
 * para evitar problemas en entornos sin interfaz gráfica.
 *
 * @returns {Client} Cliente de whatsapp-web.js listo para inicializar.
 */
function crearCliente() {
  return new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  });
}

module.exports = crearCliente;