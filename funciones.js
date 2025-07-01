function responderMensajesViejos(client, numeroAsesor) {
    client.getChats().then(chats => {
        chats.forEach(async chat => {
            if (chat.isGroup) return;

            const messages = await chat.fetchMessages({ limit: 5 });

            messages.forEach(message => {
                const numero = message.from;
                const texto = message.body?.toLowerCase();

                if (!message.fromMe && texto && (
                    texto.includes('problema') || texto.includes('asesor') || texto.includes('humano')
                )) {
                    message.reply('📨 Derivamos tu consulta a un asesor. En breve te contactan Juanjo o Mari.');
                    console.log(`⚠️ Mensaje viejo derivado del cliente ${numero}`);
                    client.sendMessage(numeroAsesor, `📬 Cliente ${numero} fue derivado (mensaje atrasado). Mensaje: "${message.body}"`);
                }
            });
        });
    });
}

function responderMensajesActuales(client, message, numeroAsesor) {
    const numero = message.from;
    const texto = message.body.toLowerCase();

    if (/*clientesDerivados.has(numero)*/ false) return;

    if (texto.includes('problema') || texto.includes('asesor') || texto.includes('humano')) {
        message.reply('📨 Derivamos tu consulta a un asesor. En breve te contactan Juanjo o Mari.');
        console.log(`➡️ Derivado el cliente ${numero} a humano.`);
        client.sendMessage(numeroAsesor, `📬 Cliente ${numero} fue derivado. Mensaje: "${message.body}"`);
    } else {
        message.reply('👋 Hola, soy el bot. ¿En qué puedo ayudarte? Escribí "asesor" si necesitás hablar con alguien.');
    }
}

module.exports = {
    responderMensajesViejos,
    responderMensajesActuales
};
