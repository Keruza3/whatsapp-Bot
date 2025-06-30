const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Lista de clientes derivados (para que el bot no les responda)
const clientesDerivados = new Set();

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('📲 Escaneá el QR con WhatsApp Web');
});

client.on('ready', () => {
    console.log('✅ Bot conectado y listo');
});

client.on('message', message => {
    const numero = message.from;

    // Si ya fue derivado, no responde
    if (clientesDerivados.has(numero)) return;

    const texto = message.body.toLowerCase();

    // Si el mensaje contiene ciertas palabras, derivar
    if (texto.includes('problema') || texto.includes('asesor') || texto.includes('humano')) {
        clientesDerivados.add(numero);

        message.reply('📨 Derivamos tu consulta a un asesor. En breve te contactan Juanjo o Mari.');
        console.log(`🚨 Derivado el cliente ${numero} a humano.`);

        // Aquí podés agregar un aviso externo (mail, Telegram, etc.)

    } else {
        message.reply('👋 Hola, soy el bot. ¿En qué puedo ayudarte? Escribí "asesor" si necesitás hablar con alguien.');
    }
});

client.initialize();
