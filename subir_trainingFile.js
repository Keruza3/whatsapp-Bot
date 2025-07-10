const { uploadTrainingFile } = require('./src/services/openai');

async function main() {
  try {
    const fileId = await uploadTrainingFile('data/entrenamiento_limpio.jsnol');
    console.log('✅ ID del archivo subido:', fileId);
  } catch (error) {
    console.error('❌ Error al subir el archivo:', error);
  }
}

main();