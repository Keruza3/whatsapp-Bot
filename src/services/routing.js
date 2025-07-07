const { chatGPT } = require('./openai');
const db = require('../core/database');
const logger = require('../utils/logger');

class RoutingService {
  constructor() {
    this.asesores = {
      'juanjo': process.env.JUANJO_NUMBER || '54911xxxxxx@c.us',
      'mari': process.env.MARI_NUMBER || '54911yyyyyy@c.us'
    };
  }

  async analizarMensaje(mensaje, telefonoCliente) {
    const promptAnalisis = `
      Analiza el siguiente mensaje de un cliente y determina:
      1. Tipo de consulta: 'nuevo_cliente', 'pedido', 'administrativo', 'general'
      2. Urgencia: 'baja', 'media', 'alta'
      3. Asesor recomendado: 'juanjo' (pedidos y nuevos clientes) o 'mari' (administrativo)
      4. Respuesta automática: true/false
      
      Responde SOLO en formato JSON válido:
      {
        "tipo": "tipo_consulta",
        "urgencia": "nivel_urgencia", 
        "asesor": "nombre_asesor",
        "auto_respuesta": true/false
      }
      
      Mensaje: "${mensaje}"
    `;

    try {
      const analisis = await chatGPT(promptAnalisis, [], 'gpt-3.5-turbo');
      const analisisParseado = JSON.parse(analisis);
      
      // Validar que tenga los campos requeridos
      if (!analisisParseado.tipo || !analisisParseado.urgencia || !analisisParseado.asesor || typeof analisisParseado.auto_respuesta !== 'boolean') {
        throw new Error('Respuesta de GPT incompleta');
      }
      
      return analisisParseado;
    } catch (error) {
      logger.warn('Error analizando mensaje con GPT, usando fallback:', error.message);
      return this.analisisFallback(mensaje);
    }
  }

  analisisFallback(mensaje) {
    const texto = mensaje.toLowerCase();
    
    if (texto.includes('pedido') || texto.includes('comprar') || texto.includes('precio')) {
      return { tipo: 'pedido', urgencia: 'media', asesor: 'juanjo', auto_respuesta: false };
    }
    
    if (texto.includes('factura') || texto.includes('devolución') || texto.includes('reclamo')) {
      return { tipo: 'administrativo', urgencia: 'alta', asesor: 'mari', auto_respuesta: false };
    }
    
    return { tipo: 'general', urgencia: 'baja', asesor: 'juanjo', auto_respuesta: true };
  }

  async derivarCliente(telefonoCliente, analisis) {
    try {
      const cliente = await db.getCliente(telefonoCliente);
      
      if (!cliente) {
        await db.crearCliente(telefonoCliente);
      }

      const numeroAsesor = this.asesores[analisis.asesor];
      if (!numeroAsesor) {
        throw new Error(`Asesor ${analisis.asesor} no encontrado`);
      }

      const estado = analisis.auto_respuesta ? 'manejo_bot' : 'derivado_humano';
      await db.actualizarEstadoCliente(telefonoCliente, estado, analisis.asesor);
      
      return {
        numeroAsesor,
        nombreAsesor: analisis.asesor,
        debeDerivar: !analisis.auto_respuesta
      };
    } catch (error) {
      logger.error('Error en derivarCliente:', error);
      throw error;
    }
  }
}

module.exports = new RoutingService(); 