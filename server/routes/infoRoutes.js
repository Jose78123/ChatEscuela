const express = require('express');
const router = express.Router();
const infoController = require('../controllers/infoController');

// Rutas para obtener información
router.get('/carreras', infoController.getCarreras);
router.get('/noticias', infoController.getNoticias);
router.get('/eventos', infoController.getEventos);

module.exports = router; 