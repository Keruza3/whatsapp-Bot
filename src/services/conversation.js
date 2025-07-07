const { chatGPT } = require('./openai');
const db = require('../core/database');
const logger = require('../utils/logger');

class ConversationService {
  async generateResponse(message, customerPhone, context = []) {
    const customer = await db.getCustomer(customerPhone);
    const isNewCustomer = !customer || customer.conversation_count === 0;
    const systemPrompt = this.buildSystemPrompt(isNewCustomer, customer);

    try {
      const response = await chatGPT(message, [
        { role: 'system', content: systemPrompt },
        ...context
      ]);
      
      if (customer) {
        await db.logConversation(customer.id, message, response);
      }
      
      return response;
    } catch (error) {
      logger.error('Error generando respuesta:', error);
      return this.getFallbackResponse();
    }
  }

  buildSystemPrompt(isNewCustomer, customer) {
    let prompt = `Eres un asistente de atención al cliente amigable y profesional. 
    
    Tono: Cálido, empático, pero profesional. Usa emojis ocasionalmente para ser más humano.
    
    Reglas:
    - Si es un cliente nuevo, preséntate y pregunta cómo puedes ayudar
    - Si es un cliente existente, usa su nombre si lo conoces
    - Sé conciso pero completo
    - Si no estás seguro, sugiere contactar a un asesor humano
    - Nunca des información personal o financiera específica
    
    Contexto del cliente: ${isNewCustomer ? 'Cliente nuevo' : `Cliente existente, ${customer.conversation_count} conversaciones previas`}
    
    Responde de manera natural y conversacional.`;

    return prompt;
  }

  getFallbackResponse() {
    return "Hola! 👋 Disculpa, estoy teniendo algunos problemas técnicos. Te voy a conectar con uno de nuestros asesores que te podrá ayudar mejor. En breve te contactan.";
  }

  async shouldReengage(customerPhone) {
    const customer = await db.getCustomer(customerPhone);
    if (!customer) return true;
    
    // Re-engage si pasaron más de 24 horas desde la última interacción
    const lastInteraction = new Date(customer.last_interaction);
    const hoursSinceLastInteraction = (Date.now() - lastInteraction.getTime()) / (1000 * 60 * 60);
    
    return hoursSinceLastInteraction > 24;
  }
}

module.exports = new ConversationService(); 