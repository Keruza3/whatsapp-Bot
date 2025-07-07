/**
 * Script de configuración inicial
 * Crea las carpetas necesarias y verifica la configuración
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando el bot de WhatsApp...');

// Crear carpetas necesarias
const folders = ['data', 'logs'];
folders.forEach(folder => {
    const folderPath = path.join(__dirname, folder);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`✅ Carpeta creada: ${folder}`);
    } else {
        console.log(`�� Carpeta ya existe: ${folder}`);
    }
});

// Verificar archivo .env
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('⚠️  Archivo .env no encontrado');
    console.log('📝 Crea un archivo .env con las siguientes variables:');
    console.log('   OPENAI_API_KEY=tu_api_key_aqui');
    console.log('   JUANJO_NUMBER=54911xxxxxx@c.us');
    console.log('   MARI_NUMBER=54911yyyyyy@c.us');
} else {
    console.log('✅ Archivo .env encontrado');
}

console.log('🎉 Configuración completada!');
console.log('�� Ejecuta "npm start" para iniciar el bot'); 