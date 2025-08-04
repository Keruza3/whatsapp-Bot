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
Analiza el siguiente mensaje de un cliente y responde SOLO con un objeto JSON válido, sin texto adicional. El JSON debe tener estos campos:
{
  "tipo": "nuevo_cliente" | "pedido" | "administrativo" | "general",
  "urgencia": "baja" | "media" | "alta",
  "asesor": "juanjo" | "mari",
  "auto_respuesta": true | false
}

Reglas:
1. "tipo" debe ser "nuevo_cliente" si el cliente es nuevo, "pedido" si es sobre un producto o compra, "administrativo" si es sobre pagos, facturación o reclamos, y "general" para consultas generales.
2. "urgencia" debe ser "alta" si el mensaje requiere atención inmediata, "media" si es importante pero no urgente, y "baja" si puede esperar.
3. "asesor" debe ser "juanjo" para pedidos y consultas generales, y "mari" para temas administrativos.
4. "auto_respuesta" debe ser true si el bot puede responder automáticamente, y false si se requiere intervención humana.

Ejemplo de respuesta válida:
{
  "tipo": "pedido",
  "urgencia": "alta",
  "asesor": "juanjo",
  "auto_respuesta": true
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
        logger.info(`Cliente nuevo detectado: ${telefonoCliente}`);
        await db.crearCliente(telefonoCliente);
      }

      const numeroAsesor = this.asesores[analisis.asesor];
      if (!numeroAsesor) {
        throw new Error(`Asesor ${analisis.asesor} no encontrado`);
      }

      const estado = analisis.auto_respuesta ? 'manejo_bot' : 'derivado_humano';
      await db.actualizarEstadoCliente(telefonoCliente, estado, analisis.asesor);
      
      logger.info(`Cliente ${telefonoCliente} derivado a ${analisis.asesor} (${estado})`);
      
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