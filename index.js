/**
 * WhatsApp Bot principal
 * ----------------------
 * Usa whatsapp-web.js para automatizar respuestas y derivaciones de consultas.
 * Genera un QR para vincular el número, responde mensajes en tiempo real
 * y revisa mensajes pendientes al inicio.
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const messageHandler = require('./src/handlers/messageHandler'); // ← Corrección aquí

// ——————————————————————
// Configuración
// ——————————————————————

/** 
 * Número de WhatsApp del asesor que recibirá notificaciones.
 * Debe incluir código de país + área (ej: 54911…) y terminar en “@c.us”
 */
const numeroAsesor = '549111133303995@c.us';

// ——————————————————————
// Inicialización del cliente
// ——————————————————————

/**
 * Crea una nueva instancia de Client:
 * - authStrategy: guarda sesión local para no escanear QR cada vez.
 * - puppeteer: ejecuta Chromium en modo headless sin sandbox (evita errores en entornos root).
 */
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// ——————————————————————
// Eventos principales
// ——————————————————————

/**
 * Evento 'qr'
 * ------------ 
 * Se dispara cuando se necesita vincular el número.
 * Genera un código QR en la consola para escanear desde el celular.
 */
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('📲 Escaneá el QR con WhatsApp Web');
});

/**
 * Evento 'ready'
 * ---------------
 * Se dispara cuando el bot ya está conectado y listo.
 * - Muestra un mensaje de confirmación.
 * - Llama a la función que revisa mensajes antiguos.
 */
client.on('ready', () => {
    console.log('✅ Bot conectado y listo');
    // Si en el futuro agregas un método para responder mensajes viejos, lo llamas aquí.
    // Por ahora, solo mostramos el mensaje de conexión.
});

/**
 * Evento 'message'
 * -----------------
 * Se dispara por cada mensaje nuevo recibido mientras el bot está activo.
 * Llama a la función que procesa y responde mensajes actuales.
 */
client.on('message', message => {
    messageHandler.manejarMensaje(client, message); // ← Corrección aquí
});

// ——————————————————————
// Arranque del bot
// ——————————————————————

/**
 * Inicializa la conexión y comienza a escuchar los eventos.
 */
client.initialize();


/*NOTAS

- ver si se puede hostear la api | se puede porque es una libreria no api
- diferenciar a quien derivar | si lo que pense es decirle al bot que le diga al usuario que ponga quiero hablar con juanjo y ahi lo toma el bot y lo deriva a el

- 


*/