const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const funciones = require('./funciones');

// Número del asesor
const numeroAsesor = '54911xxxxxx@c.us'; // el numero tiene que tener codigo de area ej 54911 y al final @c.us

//conexion con el wpp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']//para evitar problemas al compilar el codigo(hay problemas con ciertos modulos)
    }
});
//esto genera el qr en la terminal para conectarse al wpp(queda guardado para otra vez)
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('📲 Escaneá el QR con WhatsApp Web');
});

//avisa que ya esta conectado al wpp y si hay mensajes viejos los analiza para ver si tiene que derivar o no
client.on('ready', () => {
    console.log('✅ Bot conectado y listo');
    funciones.responderMensajesViejos(client, numeroAsesor);
});

//aca se responden los mensajes que llegan cuando el bot esta prendido
client.on('message', message => {
    funciones.responderMensajesActuales(client, message, numeroAsesor);
});

client.initialize();

/*NOTAS

- ver si se puede hostear la api

- diferenciar a quien derivar

- 


*/