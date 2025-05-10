const express = require("express")
const router = express.Router()
const chatbotController = require("../controllers/chatbotController")
const scrapingController = require("../controllers/scrapingController")

// Ruta principal del chatbot
router.post("/chatbot", chatbotController.procesarMensaje)

// Rutas para obtener datos
router.get("/rutas-titulacion", chatbotController.obtenerRutasTitulacion)
router.get("/preguntas-frecuentes", chatbotController.obtenerPreguntasFrecuentes)

// Ruta para realizar web scraping
router.get("/scraping", scrapingController.scrapeWebsite)

module.exports = router
