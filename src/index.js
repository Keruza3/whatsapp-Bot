/**
 * Punto de entrada del bot de WhatsApp.
 * Crea el cliente, registra los eventos y lo inicializa.
 */
const crearCliente = require('./client');
const registrarEventos = require('./handlers');

const client = crearCliente();
registrarEventos(client);
client.initialize();
