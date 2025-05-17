const { OpenAI } = require('openai');

// Verificar que la API key existe
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY no está definida en las variables de entorno');
  // No salir del proceso, solo mostrar el error
  console.log('⚠️ Intentando continuar sin API key...');
}

console.log('✅ Configurando OpenAI...');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = openai; 