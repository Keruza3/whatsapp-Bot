const { chatGPT } = require('./openai');
const db = require('../core/database');
const logger = require('../utils/logger');

class RoutingService {
  constructor() {
    this.advisors = {
      'juanjo': process.env.JUANJO_NUMBER || '54911xxxxxx@c.us',
      'mari': process.env.MARI_NUMBER || '54911yyyyyy@c.us'
    };
  }

  async analyzeMessage(message, customerPhone) {
    const analysisPrompt = `
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
      
      Mensaje: "${message}"
    `;

    try {
      const analysis = await chatGPT(analysisPrompt, [], 'gpt-3.5-turbo');
      const parsed = JSON.parse(analysis);
      
      // Validar que tenga los campos requeridos
      if (!parsed.tipo || !parsed.urgencia || !parsed.asesor || typeof parsed.auto_respuesta !== 'boolean') {
        throw new Error('Respuesta de GPT incompleta');
      }
      
      return parsed;
    } catch (error) {
      logger.warn('Error analizando mensaje con GPT, usando fallback:', error.message);
      return this.fallbackAnalysis(message);
    }
  }

  fallbackAnalysis(message) {
    const text = message.toLowerCase();
    
    if (text.includes('pedido') || text.includes('comprar') || text.includes('precio')) {
      return { tipo: 'pedido', urgencia: 'media', asesor: 'juanjo', auto_respuesta: false };
    }
    
    if (text.includes('factura') || text.includes('devolución') || text.includes('reclamo')) {
      return { tipo: 'administrativo', urgencia: 'alta', asesor: 'mari', auto_respuesta: false };
    }
    
    return { tipo: 'general', urgencia: 'baja', asesor: 'juanjo', auto_respuesta: true };
  }

  async routeCustomer(customerPhone, analysis) {
    try {
      const customer = await db.getCustomer(customerPhone);
      
      if (!customer) {
        await db.createCustomer(customerPhone);
      }

      const advisorNumber = this.advisors[analysis.asesor];
      if (!advisorNumber) {
        throw new Error(`Asesor ${analysis.asesor} no encontrado`);
      }

      const status = analysis.auto_respuesta ? 'bot_handling' : 'routed_to_human';
      await db.updateCustomerStatus(customerPhone, status, analysis.asesor);
      
      return {
        advisorNumber,
        advisorName: analysis.asesor,
        shouldRoute: !analysis.auto_respuesta
      };
    } catch (error) {
      logger.error('Error en routeCustomer:', error);
      throw error;
    }
  }
}

module.exports = new RoutingService(); 