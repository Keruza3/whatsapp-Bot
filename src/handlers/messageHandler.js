const routingService = require('../services/routing');
const conversationService = require('../services/conversation');
const db = require('../core/database');
const logger = require('../utils/logger');

class MessageHandler {
  async manejarMensaje(client, mensaje) {
    const telefonoCliente = mensaje.from;
    const textoMensaje = mensaje.body;
    
    try {
      // 1. Analizar el mensaje
      const analisis = await routingService.analizarMensaje(textoMensaje, telefonoCliente);
      logger.info(`Análisis del mensaje:`, analisis);
      
      // 2. Verificar si el cliente está en modo "derivado"
      const cliente = await db.getCliente(telefonoCliente);
      if (cliente && cliente.estado === 'derivado_humano') {
        // Verificar si debe re-enganchar
        if (await conversationService.debeReenganchar(telefonoCliente)) {
          await db.actualizarEstadoCliente(telefonoCliente, 'activo');
        } else {
          // Reenviar al asesor asignado
          const numeroAsesor = routingService.asesores[cliente.asesor_asignado];
          if (numeroAsesor) {
            client.sendMessage(numeroAsesor, `Cliente ${telefonoCliente} escribió: "${textoMensaje}"`);
            return;
          }
        }
      }
      
      // 3. Determinar derivación
      const derivacion = await routingService.derivarCliente(telefonoCliente, analisis);
      
      // 4. Procesar respuesta
      if (derivacion.debeDerivar) {
        await this.derivarAHumano(client, mensaje, derivacion, analisis);
      } else {
        await this.enviarRespuestaAutomatica(client, mensaje, analisis);
      }
      
    } catch (error) {
      logger.error('Error procesando mensaje:', error);
      await this.manejarError(client, mensaje);
    }
  }

  async derivarAHumano(client, mensaje, derivacion, analisis) {
    try {
      const respuesta = `👨‍ Perfecto! Te voy a conectar con ${derivacion.nombreAsesor} que es especialista en este tipo de consultas. En breve te contacta.`;
      
      await mensaje.reply(respuesta);
      
      const notificacion = `🔔 Cliente ${mensaje.from} derivado a ${derivacion.nombreAsesor}
      
Tipo: ${analisis.tipo}
Urgencia: ${analisis.urgencia}
Mensaje: "${mensaje.body}"`;
      
      client.sendMessage(derivacion.numeroAsesor, notificacion);
      
      logger.info(`Cliente ${mensaje.from} derivado a ${derivacion.nombreAsesor}`);
    } catch (error) {
      logger.error('Error en derivarAHumano:', error);
      throw error;
    }
  }

  async enviarRespuestaAutomatica(client, mensaje, analisis) {
    try {
      const respuesta = await conversationService.generarRespuesta(
        mensaje.body, 
        mensaje.from
      );
      
      await mensaje.reply(respuesta);
      logger.info(`Respuesta automática enviada a ${mensaje.from}`);
    } catch (error) {
      logger.error('Error en enviarRespuestaAutomatica:', error);
      throw error;
    }
  }

  async manejarError(client, mensaje) {
    try {
      const respuestaError = "⚠️ Disculpa, tuve un problema técnico. Te voy a conectar con un asesor humano.";
      await mensaje.reply(respuestaError);
      
      // Notificar al asesor principal
      const notificacion = `❗ Error técnico con cliente ${mensaje.from}: "${mensaje.body}"`;
      const asesorPorDefecto = process.env.JUANJO_NUMBER || '54911xxxxxx@c.us';
      client.sendMessage(asesorPorDefecto, notificacion);
    } catch (error) {
      logger.error('Error en manejarError:', error);
    }
  }
}

module.exports = new MessageHandler(); 