const fs = require('fs');
const path = require('path');

const scrapeInfo = async (pregunta) => {
  try {
    console.log('🔄 Buscando respuesta predefinida para:', pregunta);
    
    // Leer el archivo data.json
    const dataPath = path.join(process.cwd(), 'scraper', 'data.json');
    console.log('📂 Ruta del archivo:', dataPath);
    
    if (!fs.existsSync(dataPath)) {
      console.error('❌ No se encontró el archivo data.json en:', dataPath);
      return "Lo siento, no pude acceder a la información. Por favor, contacta a soporte técnico.";
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log('📋 Claves disponibles:', Object.keys(data));

    // Leer el archivo questions.json
    const questionsPath = path.join(process.cwd(), 'server', 'questions.json');
    const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
    console.log('📋 Preguntas disponibles:', Object.keys(questions));

    // Primero intentar coincidencia exacta con questions.json
    const preguntaLower = pregunta.toLowerCase().trim();
    for (const [preguntaKey, dataKey] of Object.entries(questions)) {
      if (preguntaLower === preguntaKey.toLowerCase()) {
        console.log('✅ Coincidencia exacta encontrada en questions.json:', preguntaKey);
        return data[dataKey];
      }
    }

    // Si no hay coincidencia exacta, buscar por palabras clave
    const mapeoPreguntas = {
      'preinscripcion': ['preinscripcion', 'preinscribir', 'preinscripción', 'preinscripciones'],
      'examenAdmision': ['examen', 'admision', 'admisión', 'examen de admisión'],
      'inscripcion': ['inscripcion', 'inscribir', 'inscripción', 'inscripciones', 'inscribirme'],
      'reinscripcion': ['reinscripcion', 'reinscribir', 'reinscripción', 'reinscripciones', 'reinscribirme'],
      'constancia': ['constancia', 'constancias', 'historial'],
      'certificado': ['certificado', 'certificados'],
      'cartaPasante': ['carta pasante', 'carta de pasante'],
      'modalidadesTitulacion': ['modalidades', 'titulación', 'titulacion'],
      'titulacion': ['titulacion', 'titulación', 'titularme'],
      'titulo': ['titulo', 'título'],
      'residencia': ['residencia', 'residencia profesional']
    };

    // Buscar por palabras clave
    for (const [clave, palabras] of Object.entries(mapeoPreguntas)) {
      for (const palabra of palabras) {
        if (preguntaLower.includes(palabra)) {
          const respuesta = data[clave];
          if (respuesta) {
            console.log('✅ Coincidencia encontrada para clave:', clave);
            return respuesta;
          }
        }
      }
    }

    console.log('❌ No se encontró respuesta para:', pregunta);
    return "Lo siento, no tengo información específica sobre ese tema. Por favor, visita la página web del instituto o contacta a control escolar.";
  } catch (error) {
    console.error('❌ Error al buscar respuesta predefinida:', error);
    return "Lo siento, hubo un error al obtener la información. Por favor, intenta más tarde o visita la página web del instituto.";
  }
};

module.exports = {
  scrapeInfo
}; 