const { Client, LocalAuth } = require('whatsapp-web.js');

/**
 * Crea e inicializa un cliente de WhatsApp Web.
 * Utiliza autenticación local para mantener la sesión.
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
