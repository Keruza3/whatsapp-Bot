// src/services/faq.js
const db = require('../core/database');
const { extraerPalabrasClave } = require('../utils/faqUtils');

async function buscarRespuesta(pregunta) {
  const palabrasClave = extraerPalabrasClave(pregunta);
  if (palabrasClave.length === 0) return null;

  let sql = "SELECT respuesta FROM preguntas WHERE ";
  sql += palabrasClave.map(p => `pregunta LIKE '%${p}%'`).join(' AND ');
  sql += " LIMIT 1";

  const [rows] = await db.pool.execute(sql);
  if (rows.length > 0) {
    return rows[0].respuesta;
  } else {
    return null;
  }
}

module.exports = { buscarRespuesta };