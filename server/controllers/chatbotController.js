const RutaTitulacion = require("../models/RutaTitulacion")
const ServicioEscolar = require("../models/ServicioEscolar")
const PreguntaFrecuente = require("../models/PreguntaFrecuente")
const Conversacion = require("../models/Conversacion")
const { v4: uuidv4 } = require("uuid")

// Función para procesar mensajes del chatbot
exports.procesarMensaje = async (req, res) => {
  try {
    const { message, history, sessionId, metadata } = req.body
    const currentSessionId = sessionId || uuidv4()

    // Guardar el mensaje del usuario en la base de datos
    let conversacion = await Conversacion.findOne({ sessionId: currentSessionId })

    if (!conversacion) {
      // Si no existe la conversación, crear una nueva
      conversacion = new Conversacion({
        sessionId: currentSessionId,
        mensajes: [],
        metadata: metadata || {},
      })
    }

    // Añadir el mensaje del usuario a la conversación
    conversacion.mensajes.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    })

    await conversacion.save()

    // Procesar el mensaje y generar una respuesta
    const respuesta = await generarRespuesta(message, history)

    // Guardar la respuesta del asistente en la base de datos
    conversacion.mensajes.push({
      role: "assistant",
      content: respuesta,
      timestamp: new Date(),
    })

    await conversacion.save()

    // Devolver la respuesta al cliente
    res.json({
      response: respuesta,
      sessionId: currentSessionId,
      status: "success",
    })
  } catch (error) {
    console.error("Error en el procesamiento del chatbot:", error)
    res.status(500).json({
      response: "Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, intenta nuevamente más tarde.",
      status: "error",
      error: error.message,
    })
  }
}

// Función para generar respuestas basadas en el mensaje del usuario
const generarRespuesta = async (mensaje, history) => {
  const mensajeLowerCase = mensaje.toLowerCase()

  // Buscar en preguntas frecuentes primero
  const preguntaFrecuente = await buscarPreguntaFrecuente(mensajeLowerCase)
  if (preguntaFrecuente) {
    // Incrementar el contador de esta pregunta
    preguntaFrecuente.contador += 1
    await preguntaFrecuente.save()
    return preguntaFrecuente.respuesta
  }

  // Si no se encuentra en preguntas frecuentes, buscar por categorías
  if (
    mensajeLowerCase.includes("titulación") ||
    mensajeLowerCase.includes("titularse") ||
    mensajeLowerCase.includes("titular")
  ) {
    return await obtenerInformacionTitulacion(mensajeLowerCase)
  }

  if (
    mensajeLowerCase.includes("servicios escolares") ||
    mensajeLowerCase.includes("trámites") ||
    mensajeLowerCase.includes("tramites")
  ) {
    return await obtenerInformacionServicios(mensajeLowerCase)
  }

  // Analizar el mensaje para determinar la intención
  if (
    mensajeLowerCase.includes("hola") ||
    mensajeLowerCase.includes("saludos") ||
    mensajeLowerCase.includes("buenos días") ||
    mensajeLowerCase.includes("buenas tardes")
  ) {
    return (
      "¡Hola! Soy el asistente virtual del Tec. ¿En qué puedo ayudarte hoy? Puedo brindarte información sobre:\n\n" +
      "- Servicios escolares y trámites\n" +
      "- Rutas y requisitos de titulación\n" +
      "- Dudas frecuentes de estudiantes"
    )
  }

  // Respuesta por defecto si no se identifica la intención
  return (
    "No tengo información específica sobre esa consulta. Puedo ayudarte con información sobre:\n\n" +
    "- Las diferentes formas de titulación y sus requisitos\n" +
    "- El proceso de titulación\n" +
    "- Servicios escolares y trámites disponibles\n" +
    "- Dudas frecuentes de estudiantes\n\n" +
    "¿Podrías reformular tu pregunta o indicarme específicamente qué información necesitas?"
  )
}

// Función para buscar en preguntas frecuentes
const buscarPreguntaFrecuente = async (mensaje) => {
  // Buscar preguntas que contengan palabras clave del mensaje
  const palabras = mensaje
    .split(" ")
    .filter((palabra) => palabra.length > 3) // Filtrar palabras cortas
    .map((palabra) => palabra.toLowerCase().trim())

  if (palabras.length === 0) return null

  // Buscar preguntas que coincidan con las palabras clave
  const preguntas = await PreguntaFrecuente.find({
    palabrasClave: { $in: palabras },
  }).sort({ contador: -1 }) // Ordenar por las más frecuentes

  if (preguntas.length > 0) {
    return preguntas[0] // Devolver la pregunta más frecuente que coincida
  }

  return null
}

// Función para obtener información sobre titulación
const obtenerInformacionTitulacion = async (mensaje) => {
  try {
    // Buscar si se menciona alguna ruta específica
    const rutasTitulacion = await RutaTitulacion.find()

    // Verificar si se menciona una ruta específica
    for (const ruta of rutasTitulacion) {
      if (
        mensaje.includes(ruta.nombre.toLowerCase()) ||
        (ruta.id === 1 && mensaje.includes("residencia")) ||
        (ruta.id === 2 && mensaje.includes("innovación")) ||
        (ruta.id === 3 && mensaje.includes("investigación")) ||
        (ruta.id === 4 && mensaje.includes("estancia")) ||
        (ruta.id === 5 && mensaje.includes("tesis") && !mensaje.includes("tesina")) ||
        (ruta.id === 6 && mensaje.includes("tesina"))
      ) {
        // Si se menciona requisitos, enfocarse en eso
        if (mensaje.includes("requisito") || mensaje.includes("documento")) {
          return (
            `${ruta.nombre}: ${ruta.descripcion}\n\n` +
            "Requisitos:\n" +
            ruta.requisitos.map((req) => `- ${req}`).join("\n") +
            "\n\nDocumentos necesarios:\n" +
            ruta.documentos.map((doc) => `- ${doc}`).join("\n")
          )
        }

        // Respuesta general sobre la ruta
        return (
          `${ruta.nombre}: ${ruta.descripcion}\n\n` +
          "Para más información sobre requisitos y documentos necesarios, puedes preguntar específicamente por ellos."
        )
      }
    }

    // Si no se menciona una ruta específica, mostrar todas
    return (
      "Las formas de titulación disponibles en el Tec son:\n\n" +
      rutasTitulacion.map((ruta) => `${ruta.id}. ${ruta.nombre}: ${ruta.descripcion}`).join("\n\n")
    )
  } catch (error) {
    console.error("Error al obtener información de titulación:", error)
    return "Lo siento, no pude obtener la información sobre titulación en este momento. Por favor, intenta más tarde."
  }
}

// Función para obtener información sobre servicios escolares
const obtenerInformacionServicios = async (mensaje) => {
  try {
    const servicios = await ServicioEscolar.findOne({ nombre: "Servicios Escolares" })

    if (!servicios) {
      return "Lo siento, no tengo información sobre servicios escolares en este momento."
    }

    // Si se menciona un trámite específico
    for (const tramite of servicios.tramites) {
      if (mensaje.includes(tramite.toLowerCase())) {
        return (
          `Información sobre ${tramite}:\n\n` +
          `Este trámite se realiza en ${servicios.ubicacion} durante el horario ${servicios.horario}.\n` +
          `Contacto: ${servicios.contacto}\n\n` +
          "Requisitos generales:\n" +
          servicios.requisitosGenerales.map((req) => `- ${req}`).join("\n")
        )
      }
    }

    // Información general sobre servicios escolares
    return (
      `Información sobre Servicios Escolares:\n\n` +
      `Ubicación: ${servicios.ubicacion}\n` +
      `Horario: ${servicios.horario}\n` +
      `Contacto: ${servicios.contacto}\n\n` +
      `Trámites disponibles:\n` +
      servicios.tramites.map((tramite) => `- ${tramite}`).join("\n") +
      `\n\nRequisitos generales para trámites:\n` +
      servicios.requisitosGenerales.map((req) => `- ${req}`).join("\n")
    )
  } catch (error) {
    console.error("Error al obtener información de servicios escolares:", error)
    return "Lo siento, no pude obtener la información sobre servicios escolares en este momento. Por favor, intenta más tarde."
  }
}

// Controlador para obtener todas las rutas de titulación
exports.obtenerRutasTitulacion = async (req, res) => {
  try {
    const rutas = await RutaTitulacion.find().sort({ id: 1 })
    res.json(rutas)
  } catch (error) {
    console.error("Error al obtener rutas de titulación:", error)
    res.status(500).json({ error: "Error al obtener rutas de titulación" })
  }
}

// Controlador para obtener todas las preguntas frecuentes
exports.obtenerPreguntasFrecuentes = async (req, res) => {
  try {
    const preguntas = await PreguntaFrecuente.find().sort({ contador: -1 }).limit(10)
    res.json(preguntas)
  } catch (error) {
    console.error("Error al obtener preguntas frecuentes:", error)
    res.status(500).json({ error: "Error al obtener preguntas frecuentes" })
  }
}
