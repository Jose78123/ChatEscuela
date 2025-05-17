const { generateResponse } = require('../services/openaiService');

const preguntar = async (req, res) => {
  try {
    const { pregunta } = req.body;
    
    // Validación mejorada de la pregunta
    if (!pregunta) {
      return res.status(400).json({ 
        error: 'La pregunta es requerida',
        mensaje: 'Por favor, proporciona una pregunta válida'
      });
    }

    if (pregunta.length < 3) {
      return res.status(400).json({
        error: 'Pregunta demasiado corta',
        mensaje: 'Por favor, proporciona una pregunta más detallada'
      });
    }

    if (pregunta.length > 500) {
      return res.status(400).json({
        error: 'Pregunta demasiado larga',
        mensaje: 'Por favor, limita tu pregunta a 500 caracteres'
      });
    }

    console.log('Procesando pregunta:', pregunta);
    const respuesta = await generateResponse(pregunta);
    console.log('Respuesta generada exitosamente');

    res.json({ 
      respuesta,
      metadata: {
        timestamp: new Date().toISOString(),
        preguntaLength: pregunta.length
      }
    });
  } catch (error) {
    console.error('Error en el controlador de preguntas:', error);
    
    // Manejo de errores más específico
    if (error.message.includes('API key')) {
      return res.status(500).json({ 
        error: 'Error de configuración',
        mensaje: 'Error en la configuración de la API'
      });
    }

    if (error.message.includes('rate limit')) {
      return res.status(429).json({
        error: 'Límite de peticiones excedido',
        mensaje: 'Por favor, intenta de nuevo en unos minutos'
      });
    }

    res.status(500).json({ 
      error: 'Error al procesar la pregunta',
      mensaje: 'Ha ocurrido un error al procesar tu pregunta. Por favor, intenta de nuevo.'
    });
  }
};

module.exports = {
  preguntar
}; 