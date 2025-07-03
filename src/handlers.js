const qrcode = require('qrcode-terminal');
const { numeroAsesor } = require('./config');
const {
  responderMensajesActuales,
  responderMensajesViejos,
} = require('./responses');

/**
 * Registra los eventos principales sobre el cliente de WhatsApp.
 * @param {Client} client Instancia del cliente ya inicializado
 */
function registrarEventos(client) {
  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('📲 Escaneá el QR con WhatsApp Web');
  });

  client.on('ready', () => {
    console.log('✅ Bot conectado y listo');
    responderMensajesViejos(client, numeroAsesor);
  });

  client.on('message', (message) => {
    responderMensajesActuales(client, message, numeroAsesor);
  });
}

module.exports = registrarEventos;