const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('../utils/logger');

class Database {
  constructor() {
    const dbPath = path.join(__dirname, '../../data/customers.db');
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        logger.error('Error conectando a la base de datos:', err);
        throw err;
      }
      logger.info('Base de datos SQLite conectada');
    });
    this.init();
  }

  init() {
    this.db.serialize(() => {
      // Tabla de clientes
      this.db.run(`
        CREATE TABLE IF NOT EXISTS customers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          phone TEXT UNIQUE NOT NULL,
          name TEXT,
          status TEXT DEFAULT 'active',
          assigned_advisor TEXT,
          last_interaction DATETIME DEFAULT CURRENT_TIMESTAMP,
          conversation_count INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          logger.error('Error creando tabla customers:', err);
        } else {
          logger.info('Tabla customers creada/verificada');
        }
      });

      // Tabla de conversaciones
      this.db.run(`
        CREATE TABLE IF NOT EXISTS conversations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_id INTEGER,
          message TEXT,
          response TEXT,
          routed_to TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES customers (id)
        )
      `, (err) => {
        if (err) {
          logger.error('Error creando tabla conversations:', err);
        } else {
          logger.info('Tabla conversations creada/verificada');
        }
      });
    });
  }

  async getCustomer(phone) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM customers WHERE phone = ?', [phone], (err, row) => {
        if (err) {
          logger.error('Error obteniendo cliente:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async createCustomer(phone, name = null) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT OR IGNORE INTO customers (phone, name) VALUES (?, ?)',
        [phone, name],
        function(err) {
          if (err) {
            logger.error('Error creando cliente:', err);
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  async updateCustomerStatus(phone, status, advisor = null) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE customers SET status = ?, assigned_advisor = ?, last_interaction = CURRENT_TIMESTAMP WHERE phone = ?',
        [status, advisor, phone],
        (err) => {
          if (err) {
            logger.error('Error actualizando estado del cliente:', err);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async logConversation(customerId, message, response, routedTo = null) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO conversations (customer_id, message, response, routed_to) VALUES (?, ?, ?, ?)',
        [customerId, message, response, routedTo],
        (err) => {
          if (err) {
            logger.error('Error registrando conversación:', err);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
}

module.exports = new Database(); 