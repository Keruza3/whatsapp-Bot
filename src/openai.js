/**
 * openai.js
 * ----------
 * Módulo para:
 *  1) Subir archivos de entrenamiento (JSONL) a OpenAI.
 *  2) Lanzar y consultar jobs de fine-tuning.
 *  3) Enviar mensajes al modelo (base o fine-tuned).
 */
require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

// Instancia del cliente de OpenAI usando la API key de .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Sube un archivo JSONL con tu dataset de fine-tuning.
 *
 * @param {string} filePath - Ruta local al archivo .jsonl
 * @returns {Promise<string>} El ID del archivo subido (file_id)
 */
async function uploadTrainingFile(filePath) {
  const resp = await openai.files.create({
    file: fs.createReadStream(path.resolve(filePath)),
    purpose: 'fine-tune'
  });
  console.log('✅ Archivo subido. file_id =', resp.id);
  return resp.id;
}

/**
 * Lanza un trabajo de fine-tuning sobre gpt-3.5-turbo.
 *
 * @param {string} trainingFileId - El file_id obtenido al subir el JSONL
 * @returns {Promise<string>} El ID del job de fine-tune (fineTuneId)
 */
async function createFineTuneJob(trainingFileId) {
  const resp = await openai.fineTunes.create({
    model: 'gpt-3.5-turbo',
    training_file: trainingFileId
  });
  console.log('🚀 Fine-tune lanzado. job =', resp.id);
  return resp.id;
}

/**
 * Consulta el estado de un fine-tune job en curso o finalizado.
 *
 * @param {string} fineTuneId - El ID del job de fine-tune
 * @returns {Promise<Object>} Objeto con información del estado y modelo entrenado
 */
async function getFineTuneStatus(fineTuneId) {
  const status = await openai.fineTunes.retrieve({ fineTuneId });
  console.log('🔎 Estado:', status.status);
  if (status.status === 'succeeded') {
    console.log('🎉 Modelo fine-tuned =', status.fineTunedModel);
  }
  return status;
}

/**
 * Envía un mensaje a un modelo de chat y devuelve la respuesta.
 *
 * @param {string} userMessage       - El texto ingresado por el usuario
 * @param {Array<Object>} context    - Array opcional de mensajes previos para contexto
 * @param {string|null} modelOverride - Nombre de un modelo fine-tuned, o null para usar gpt-3.5-turbo
 * @returns {Promise<string>}        - Contenido de la respuesta generada
 */
async function chatGPT(userMessage, context = [], modelOverride = null) {
  const model = modelOverride || 'gpt-3.5-turbo';
  const messages = [
    ...context,
    { role: 'user', content: userMessage }
  ];
  const resp = await openai.chat.completions.create({ model, messages });
  return resp.choices[0].message.content;
}

// Exportamos las funciones para usarlas en index.js o en funciones.js
module.exports = {
  uploadTrainingFile,
  createFineTuneJob,
  getFineTuneStatus,
  chatGPT
};
