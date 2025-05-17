require('dotenv').config();
const express = require("express");
const cors = require("cors");
const openai = require('./config/openai');
const { scrapeInfo } = require('./services/scraperService');
const { preguntar } = require("./controllers/preguntaController");

// Configurar la API key directamente
process.env.OPENAI_API_KEY = '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';

const app = express();
app.use(cors());
app.use(express.json());

// Rutas de la API
app.post("/api/preguntar", preguntar);

app.get("/", (req, res) => {
  res.send("🤖 API ChatBot Escolar funcionando");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
