const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'chatbot_whatsapp',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    this.init();
  }

  async init() {
    try {
      // Verificar conexión
      const connection = await this.pool.getConnection();
      logger.info('Base de datos MySQL conectada');
      connection.release();
    } catch (error) {
      logger.error('Error conectando a la base de datos:', error);
      throw error;
    }
  }

  async getCliente(telefono) {
    try {
      const [rows] = await this.pool.execute(
        'SELECT * FROM clientes WHERE telefono = ?',
        [telefono]
      );
      return rows[0];
    } catch (error) {
      logger.error('Error obteniendo cliente:', error);
      throw error;
    }
  }

  async crearCliente(telefono, nombre = null) {
    try {
      const [result] = await this.pool.execute(
        'INSERT INTO clientes (telefono, nombre) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
        [telefono, nombre]
      );
      return result.insertId;
    } catch (error) {
      logger.error('Error creando cliente:', error);
      throw error;
    }
  }

  async actualizarEstadoCliente(telefono, estado, asesor = null) {
    try {
      await this.pool.execute(
        'UPDATE clientes SET estado = ?, asesor_asignado = ?, ultima_interaccion = CURRENT_TIMESTAMP WHERE telefono = ?',
        [estado, asesor, telefono]
      );
    } catch (error) {
      logger.error('Error actualizando estado del cliente:', error);
      throw error;
    }
  }

  async registrarConversacion(clienteId, mensaje, respuesta, derivadoA = null) {
    try {
      await this.pool.execute(
        'INSERT INTO conversaciones (cliente_id, mensaje, respuesta, derivado_a) VALUES (?, ?, ?, ?)',
        [clienteId, mensaje, respuesta, derivadoA]
      );
    } catch (error) {
      logger.error('Error registrando conversación:', error);
      throw error;
    }
  }

  async incrementarConversaciones(telefono) {
    try {
      await this.pool.execute(
        'UPDATE clientes SET cantidad_conversaciones = cantidad_conversaciones + 1 WHERE telefono = ?',
        [telefono]
      );
    } catch (error) {
      logger.error('Error incrementando conversaciones:', error);
      throw error;
    }
  }

  async obtenerEstadisticas() {
    try {
      const [rows] = await this.pool.execute(`
        SELECT 
          COUNT(*) as total_clientes,
          COUNT(CASE WHEN estado = 'activo' THEN 1 END) as clientes_activos,
          COUNT(CASE WHEN estado = 'derivado_humano' THEN 1 END) as derivados_humano,
          SUM(cantidad_conversaciones) as total_conversaciones
        FROM clientes
      `);
      return rows[0];
    } catch (error) {
      logger.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
}

module.exports = new Database(); 