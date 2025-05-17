require('dotenv').config();
const express = require("express");
const cors = require("cors");
const openai = require('./config/openai');
const { scrapeInfo } = require('./services/scraperService');
const { preguntar } = require("./controllers/preguntaController");

// Verificar variables de entorno
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY no está definida');
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Rutas de la API
app.post("/api/preguntar", async (req, res) => {
  try {
    const respuesta = await preguntar(req, res);
    res.json(respuesta);
  } catch (error) {
    console.error('Error en /api/preguntar:', error);
    res.status(500).json({ error: 'Error al procesar la pregunta' });
  }
});

app.get("/", (req, res) => {
  res.send("🤖 API ChatBot Escolar funcionando");
});

// Ruta de prueba para verificar variables de entorno
app.get("/api/test", (req, res) => {
  res.json({
    message: "API funcionando",
    env: {
      nodeEnv: process.env.NODE_ENV,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
