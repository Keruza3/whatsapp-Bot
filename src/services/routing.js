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
3. Asesor recomendado: 'juanjo' (pedidos, nuevos clientes, consultas generales) o 'mari' (administrativo, pagos, facturación)
4. Respuesta automática: true/false

IMPORTANTE:
- Solo pon "auto_respuesta": false si la consulta es muy compleja, requiere intervención humana, datos personales, pagos, reclamos, o no puedes responder con la información disponible.
- Si la consulta es una pregunta frecuente, información general, saludo, consulta de horarios, formas de compra, productos, o cualquier cosa que pueda responder el bot, pon "auto_respuesta": true.

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

    // Derivar solo si es un reclamo, pago, o algo muy administrativo
    if (
      texto.includes('factura') ||
      texto.includes('devolución') ||
      texto.includes('reclamo') ||
      texto.includes('pago') ||
      texto.includes('transferencia') ||
      texto.includes('problema') ||
      texto.includes('error')
    ) {
      return { tipo: 'administrativo', urgencia: 'alta', asesor: 'mari', auto_respuesta: false };
    }

    // Para todo lo demás, responde automáticamente
    return { tipo: 'general', urgencia: 'baja', asesor: 'juanjo', auto_respuesta: true };
  }

  async derivarCliente(telefonoCliente, analisis) {
    try {
      const cliente = await db.obtenerCliente(telefonoCliente);
      
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