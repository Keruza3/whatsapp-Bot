/**
 * funciones.js
 * ------------
 * Contiene la lógica de respuesta para mensajes nuevos y mensajes pendientes.
 */

const { chatGPT } = require('./openai');

/**
 * Procesa y responde mensajes que llegan mientras el bot está activo.
 * - Si detecta palabras clave, deriva al asesor.
 * - En caso contrario, consulta a GPT y reenvía la respuesta.
 *
 * @param {Client} client      - Instancia de whatsapp-web.js
 * @param {Message} message    - Objeto mensaje recibido
 * @param {string} numeroAsesor - Número WhatsApp del asesor (formato 54911XXXXXX@c.us)
 */
async function responderMensajesActuales(client, message, numeroAsesor) {
  const numero = message.from;
  const texto  = message.body.toLowerCase();

  // Caso de derivación
  if (texto.includes('problema') || texto.includes('asesor') || texto.includes('humano')) {
    message.reply('📨 Derivamos tu consulta a un asesor. En breve te contactan Juanjo o Mari.');
    console.log(`➡️ Derivado el cliente ${numero} a humano.`);
    client.sendMessage(numeroAsesor, `📬 Cliente ${numero} fue derivado. Mensaje: "${message.body}"`);
    return;
  }

  // Caso de IA (ChatGPT)
  try {
    const aiReply = await chatGPT(
      message.body,
      [ { role: 'system', content: 'Eres un asistente amistoso de atención al cliente.' } ]
    );
    message.reply(aiReply);
    console.log(`🤖 GPT respondió a ${numero}:`, aiReply);
  } catch (err) {
    console.error('❌ Error llamando a GPT:', err);
    message.reply('⚠️ Lo siento, tuve un fallo técnico. Te contacto con un asesor.');
    client.sendMessage(numeroAsesor, `❗ Error GPT para ${numero}: ${err.message}`);
  }
}

/**
 * Revisa mensajes recientes de todos los chats
 * que llegaron mientras el bot estaba desconectado.
 * Deriva igual que en mensajes actuales.
 *
 * @param {Client} client       - Instancia de whatsapp-web.js
 * @param {string} numeroAsesor - Número del asesor
 */
async function responderMensajesViejos(client, numeroAsesor) {
  const chats = await client.getChats();
  for (const chat of chats) {
    if (chat.isGroup) continue;
    const messages = await chat.fetchMessages({ limit: 5 });
    for (const message of messages) {
      const numero = message.from;
      const texto  = message.body?.toLowerCase();
      if (!message.fromMe && texto && (
          texto.includes('problema') ||
          texto.includes('asesor') ||
          texto.includes('humano')
        )) {
        message.reply('📨 Derivamos tu consulta a un asesor. En breve te contactan Juanjo o Mari.');
        console.log(`⚠️ Mensaje viejo derivado del cliente ${numero}`);
        client.sendMessage(numeroAsesor, `📬 Cliente ${numero} fue derivado (mensaje atrasado). Mensaje: "${message.body}"`);
      }
    }
  }
}

module.exports = {
  responderMensajesActuales,
  responderMensajesViejos
};
