const { chatGPT } = require('./openai');
const baseDeDatos = require('../core/database');
const logger = require('../utils/logger');

class ServicioConversacion {
  async generarRespuesta(mensaje, telefonoCliente, contexto = []) {
    const cliente = await baseDeDatos.obtenerCliente(telefonoCliente);
    const esClienteNuevo = !cliente || cliente.cantidad_conversaciones === 0;
    const promptSistema = this.construirPromptSistema(esClienteNuevo, cliente);

    try {
      const respuesta = await chatGPT(
        mensaje,
        [
          { role: 'system', content: promptSistema },
          ...contexto
        ],
        'gpt-3.5-turbo'
      );

      if (!cliente) {
        const clienteId = await baseDeDatos.crearCliente(telefonoCliente);
        await baseDeDatos.registrarConversacion(clienteId, mensaje, respuesta);
        await baseDeDatos.incrementarConversaciones(telefonoCliente);
      } else {
        await baseDeDatos.registrarConversacion(cliente.id, mensaje, respuesta);
        await baseDeDatos.incrementarConversaciones(telefonoCliente);
      }

      return respuesta;
    } catch (error) {
      logger.error('Error generando respuesta:', error);
      return this.obtenerRespuestaFallback();
    }
  }

  construirPromptSistema(esClienteNuevo, cliente) {
    let prompt = `Eres un asistente de atención al cliente para El Paraíso de Paso, distribuidor mayorista e importador de lencería, Ropa interior, marroquinería y blanquería 100 % online desde Once, CABA.
con despachos al interior y además puntos de retiro en picking point en Once y Moreno.

Tono: cálido, cercano y profesional. Podés usar emojis con moderación para ser más humano y amable.

Reglas:
- Si es cliente nuevo, preséntate y preguntá en qué podés ayudar (¿Ya viste nuestros productos en la pagina?, querés comprar, hacer consulta?).
- Si ya es un cliente existente y conocemos su nombre, úsalo.
- Sé breve pero completo: respondé lo más claro posible y evitá respuestas demasiado largas.
- No des información sensible ni promesas de envío exactas.
- Si no estás seguro o la consulta es compleja, sugerí derivar a un asesor humano.

Contexto del cliente:
- Cliente nuevo → “Cliente nuevo”.
- Cliente existente → “Cliente existente, {cantidad_conversaciones} conversaciones previas”.

Empresa: El Paraíso de Paso – mayorista online de moda, con más de 50 años de trayectoria. Vendés por mayor exclusivamente. Compra mínima $100.000 + IVA. Venta solo vía plataforma web www.elparaisodepaso.com.ar . Retiro por local en Once, sin showroom. Envíos a todo el país con Correo Argentino o transporte privado. Atención por Whatsapp de lunes a Viernes.

Objetivo:
– Entender la intención del cliente (consulta pre venta, saber como se trabaja, intencion de como hacer un pedido, consultar acerca del pago luego de hacer el pedido, modificación de datos, devoluciones).
– Derivar correctamente a Juanjo (para consultas preventa de productos, como trabajamos, donde nos encontramos, compras o envío) o a Mari (en caso de hacer un pedido, para cobranzas, pagos o confirmaciones).
– Responder automáticamente si es una pregunta frecuente entrenada; si no, derivar.

Mensaje recibido: {mensajeUsuario}`;
    return prompt;
  }

  obtenerRespuestaFallback() {
    return "Hola! 👋 Disculpa, estoy teniendo algunos problemas técnicos. Te voy a conectar con uno de nuestros asesores que te podrá ayudar mejor. En breve te contactan.";
  }

  async debeReenganchar(telefonoCliente) {
    const cliente = await baseDeDatos.obtenerCliente(telefonoCliente);
    if (!cliente) return true;
    
    // Re-enganchar si pasaron más de 24 horas desde la última interacción
    const ultimaInteraccion = new Date(cliente.ultima_interaccion);
    const horasDesdeUltimaInteraccion = (Date.now() - ultimaInteraccion.getTime()) / (1000 * 60 * 60);
    
    return horasDesdeUltimaInteraccion > 24;
  }
}

module.exports = new ServicioConversacion(); 