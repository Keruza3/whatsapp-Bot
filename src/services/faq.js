// src/services/faq.js
const mysql = require('mysql2/promise');

const stopwords = [
  'el', 'la', 'los', 'las', 'de', 'con', 'y', 'a', 'en', 'por', 'para', 'un', 'una', 'que', 'al', 'del',
  'tengo', 'tiene', 'tienen', 'tienes', 'yo', 'tu', 'usted', 'ustedes', 'mi', 'su', 'sus', 'es', 'son',
  'ser', 'fue', 'fueron', 'soy', 'eres', 'somos', 'sea', 'sean', 'como', 'pero', 'si', 'no', 'sí', 'o',
  'u', 'ni', 'ya', 'le', 'lo', 'se', 'me', 'te', 'nos', 'os', 'les'
];

function extraerPalabrasClave(pregunta) {
  return pregunta
    .toLowerCase()
    .replace(/[¿?¡!.,;]/g, '')
    .split(' ')
    .filter(palabra => !stopwords.includes(palabra) && palabra.length > 2);
}

async function buscarRespuesta(pregunta) {
  const palabrasClave = extraerPalabrasClave(pregunta);

  if (palabrasClave.length === 0) return null;

  let sql = "SELECT respuesta FROM preguntas WHERE ";
  sql += palabrasClave.map(p => `pregunta LIKE '%${p}%'`).join(' AND ');
  sql += " LIMIT 1";

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'TU_USUARIO',
    password: 'TU_PASSWORD',
    database: 'whatsapp_bot'
  });

  const [rows] = await connection.execute(sql);
  await connection.end();

  if (rows.length > 0) {
    return rows[0].respuesta;
  } else {
    return null;
  }
}

module.exports = { buscarRespuesta };