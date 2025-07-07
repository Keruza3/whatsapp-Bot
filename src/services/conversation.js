const { chatGPT } = require('./openai');
const db = require('../core/database');
const logger = require('../utils/logger');

class ConversationService {
  async generarRespuesta(mensaje, telefonoCliente, contexto = []) {
    const cliente = await db.getCliente(telefonoCliente);
    const esClienteNuevo = !cliente || cliente.cantidad_conversaciones === 0;
    const promptSistema = this.construirPromptSistema(esClienteNuevo, cliente);

    try {
      const respuesta = await chatGPT(mensaje, [
        { role: 'system', content: promptSistema },
        ...contexto
      ]);
      
      if (!cliente) {
        const clienteId = await db.crearCliente(telefonoCliente);
        await db.registrarConversacion(clienteId, mensaje, respuesta);
        await db.incrementarConversaciones(telefonoCliente);
      } else {
        await db.registrarConversacion(cliente.id, mensaje, respuesta);
        await db.incrementarConversaciones(telefonoCliente);
      }
      
      return respuesta;
    } catch (error) {
      logger.error('Error generando respuesta:', error);
      return this.obtenerRespuestaFallback();
    }
  }

  construirPromptSistema(esClienteNuevo, cliente) {
    let prompt = `Eres un asistente de atención al cliente amigable y profesional. 
    
    Tono: Cálido, empático, pero profesional. Usa emojis ocasionalmente para ser más humano.
    
    Reglas:
    - Si es un cliente nuevo, preséntate y pregunta cómo puedes ayudar
    - Si es un cliente existente, usa su nombre si lo conoces
    - Sé conciso pero completo
    - Si no estás seguro, sugiere contactar a un asesor humano
    - Nunca des información personal o financiera específica
    
    Contexto del cliente: ${esClienteNuevo ? 'Cliente nuevo' : `Cliente existente, ${cliente.cantidad_conversaciones} conversaciones previas`}
    
    Responde de manera natural y conversacional.`;

    return prompt;
  }

  obtenerRespuestaFallback() {
    return "Hola! 👋 Disculpa, estoy teniendo algunos problemas técnicos. Te voy a conectar con uno de nuestros asesores que te podrá ayudar mejor. En breve te contactan.";
  }

  async debeReenganchar(telefonoCliente) {
    const cliente = await db.getCliente(telefonoCliente);
    if (!cliente) return true;
    
    // Re-enganchar si pasaron más de 24 horas desde la última interacción
    const ultimaInteraccion = new Date(cliente.ultima_interaccion);
    const horasDesdeUltimaInteraccion = (Date.now() - ultimaInteraccion.getTime()) / (1000 * 60 * 60);
    
    return horasDesdeUltimaInteraccion > 24;
  }
}

module.exports = new ConversationService(); 