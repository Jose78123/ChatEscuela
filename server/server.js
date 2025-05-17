require('dotenv').config();
const express = require("express");
const cors = require("cors");
const openai = require('./config/openai');
const { scrapeInfo } = require('./services/scraperService');
const { preguntar } = require("./controllers/preguntaController");

// Log inicial
console.log('🚀 Iniciando servidor...');
console.log('📝 Variables de entorno:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  hasOpenAIKey: !!process.env.OPENAI_API_KEY
});

// Verificar variables de entorno
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY no está definida');
  process.exit(1); // Salir si no hay API key
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`📨 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Ruta de prueba para verificar variables de entorno
app.get("/api/test", (req, res) => {
  try {
    console.log('🔍 Probando ruta /api/test');
    res.json({
      message: "API funcionando",
      env: {
        nodeEnv: process.env.NODE_ENV,
        hasOpenAIKey: !!process.env.OPENAI_API_KEY,
        port: process.env.PORT
      }
    });
  } catch (error) {
    console.error('❌ Error en /api/test:', error);
    res.status(500).json({ error: 'Error en ruta de prueba' });
  }
});

// Rutas de la API
app.post("/api/preguntar", async (req, res) => {
  try {
    console.log('🤖 Procesando pregunta:', req.body);
    const respuesta = await preguntar(req, res);
    console.log('✅ Respuesta generada');
    res.json(respuesta);
  } catch (error) {
    console.error('❌ Error en /api/preguntar:', error);
    res.status(500).json({ 
      error: 'Error al procesar la pregunta',
      message: error.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("🤖 API ChatBot Escolar funcionando");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
