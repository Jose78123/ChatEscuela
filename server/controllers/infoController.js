const sheetsService = require('../services/sheetsService');

exports.getCarreras = async (req, res) => {
  try {
    const carreras = await sheetsService.getCarreras();
    res.json(carreras);
  } catch (error) {
    console.error('Error al obtener carreras:', error);
    res.status(500).json({ error: 'Error al obtener las carreras' });
  }
};

exports.getNoticias = async (req, res) => {
  try {
    const noticias = await sheetsService.getNoticias();
    res.json(noticias);
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    res.status(500).json({ error: 'Error al obtener las noticias' });
  }
};

exports.getEventos = async (req, res) => {
  try {
    const eventos = await sheetsService.getEventos();
    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ error: 'Error al obtener los eventos' });
  }
}; 