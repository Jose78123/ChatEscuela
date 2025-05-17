const preguntas = require("./questions.json");
const data = require("../scraper/data.json");

function responderPregunta(preguntaUsuario) {
  const normalizada = preguntaUsuario.trim().toLowerCase();
  for (const [pregunta, seccion] of Object.entries(preguntas)) {
    if (normalizada === pregunta.toLowerCase()) {
      return data[seccion] || "No encontré información actualizada para esa sección.";
    }
  }
  return "Lo siento, no tengo esa información registrada. Intenta con otra pregunta.";
}

module.exports = responderPregunta;
