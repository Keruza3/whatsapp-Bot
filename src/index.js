/**
 * WhatsApp Bot - Punto de entrada principal
 * -----------------------------------------
 * Usa la nueva arquitectura modular para mejor escalabilidad
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const messageHandler = require('./handlers/messageHandler');
const logger = require('./utils/logger');

// ——————————————————————
// Inicialización del cliente
// ——————————————————————

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

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    logger.info('QR generado - Escanear con WhatsApp Web');
    console.log('📲 Escaneá el QR con WhatsApp Web');
});

client.on('ready', () => {
    logger.info('Bot conectado y listo');
    console.log('✅ Bot conectado y listo');
    console.log('🤖 Arquitectura modular activa');
    console.log('📊 Base de datos SQLite inicializada');
});

client.on('message', async message => {
    try {
        await messageHandler.handleMessage(client, message);
    } catch (error) {
        logger.error('Error en el manejo de mensaje:', error);
        console.error('❌ Error procesando mensaje:', error.message);
    }
});

client.on('disconnected', (reason) => {
    logger.warn('Bot desconectado:', reason);
    console.log('🔌 Bot desconectado:', reason);
});

// ——————————————————————
// Manejo de errores global
// ——————————————————————

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    console.error('❌ Error no manejado:', reason);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    console.error('❌ Excepción no capturada:', error);
    process.exit(1);
});

// ——————————————————————
// Arranque del bot
// ——————————————————————

console.log('🚀 Iniciando WhatsApp Bot con arquitectura modular...');
client.initialize();
