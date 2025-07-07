const routingService = require('../services/routing');
const conversationService = require('../services/conversation');
const db = require('../core/database');
const logger = require('../utils/logger');

class MessageHandler {
  async handleMessage(client, message) {
    const customerPhone = message.from;
    const messageText = message.body;
    
    try {
      // 1. Analizar el mensaje
      const analysis = await routingService.analyzeMessage(messageText, customerPhone);
      logger.info(`Análisis del mensaje:`, analysis);
      
      // 2. Verificar si el cliente está en modo "routed"
      const customer = await db.getCustomer(customerPhone);
      if (customer && customer.status === 'routed_to_human') {
        // Verificar si debe re-enganchar
        if (await conversationService.shouldReengage(customerPhone)) {
          await db.updateCustomerStatus(customerPhone, 'active');
        } else {
          // Reenviar al asesor asignado
          const advisorNumber = routingService.advisors[customer.assigned_advisor];
          if (advisorNumber) {
            client.sendMessage(advisorNumber, `Cliente ${customerPhone} escribió: "${messageText}"`);
            return;
          }
        }
      }
      
      // 3. Determinar routing
      const routing = await routingService.routeCustomer(customerPhone, analysis);
      
      // 4. Procesar respuesta
      if (routing.shouldRoute) {
        await this.routeToHuman(client, message, routing, analysis);
      } else {
        await this.sendAutoResponse(client, message, analysis);
      }
      
    } catch (error) {
      logger.error('Error procesando mensaje:', error);
      await this.handleError(client, message);
    }
  }

  async routeToHuman(client, message, routing, analysis) {
    try {
      const response = `👨‍ Perfecto! Te voy a conectar con ${routing.advisorName} que es especialista en este tipo de consultas. En breve te contacta.`;
      
      await message.reply(response);
      
      const notification = `🔔 Cliente ${message.from} derivado a ${routing.advisorName}
      
Tipo: ${analysis.tipo}
Urgencia: ${analysis.urgencia}
Mensaje: "${message.body}"`;
      
      client.sendMessage(routing.advisorNumber, notification);
      
      logger.info(`Cliente ${message.from} derivado a ${routing.advisorName}`);
    } catch (error) {
      logger.error('Error en routeToHuman:', error);
      throw error;
    }
  }

  async sendAutoResponse(client, message, analysis) {
    try {
      const response = await conversationService.generateResponse(
        message.body, 
        message.from
      );
      
      await message.reply(response);
      logger.info(`Respuesta automática enviada a ${message.from}`);
    } catch (error) {
      logger.error('Error en sendAutoResponse:', error);
      throw error;
    }
  }

  async handleError(client, message) {
    try {
      const errorResponse = "⚠️ Disculpa, tuve un problema técnico. Te voy a conectar con un asesor humano.";
      await message.reply(errorResponse);
      
      // Notificar al asesor principal
      const notification = `❗ Error técnico con cliente ${message.from}: "${message.body}"`;
      const defaultAdvisor = process.env.JUANJO_NUMBER || '54911xxxxxx@c.us';
      client.sendMessage(defaultAdvisor, notification);
    } catch (error) {
      logger.error('Error en handleError:', error);
    }
  }
}

module.exports = new MessageHandler(); 