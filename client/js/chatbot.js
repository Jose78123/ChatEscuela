document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const chatForm = document.getElementById("chat-form")
  const chatInput = document.getElementById("chat-input")
  const chatMessages = document.getElementById("chat-messages")
  const rutasTitulacionList = document.getElementById("rutas-titulacion-list")
  const preguntasFrecuentesList = document.getElementById("preguntas-frecuentes-list")

  // URL de la API del backend
  const API_URL = "/api/chatbot"
  const API_BASE_URL = "/api"

  // Identificador de sesión para mantener el contexto de la conversación
  let sessionId = localStorage.getItem("chatSessionId") || generateSessionId()
  localStorage.setItem("chatSessionId", sessionId)

  // Inicializar mensajes
  const messages = [
    {
      id: "1",
      role: "assistant",
      content:
        "¡Hola! Soy el asistente virtual del TESSFP. Puedo ayudarte con información sobre servicios escolares, dudas frecuentes y rutas de titulación. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ]

  // Cargar datos iniciales desde la API
  cargarDatosIniciales()

  // Renderizar mensajes iniciales
  renderMessages()

  // Manejar envío del formulario
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const userInput = chatInput.value.trim()
    if (userInput === "") return

    // Añadir mensaje del usuario
    addMessage("user", userInput)

    // Limpiar input
    chatInput.value = ""

    // Procesar respuesta
    showTypingIndicator()
    processResponse(userInput)
  })

  // Función para generar un ID de sesión único
  function generateSessionId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  // Función para cargar datos iniciales desde la API
  async function cargarDatosIniciales() {
    try {
      // Cargar rutas de titulación
      const rutasResponse = await fetch(`${API_BASE_URL}/rutas-titulacion`)
      if (rutasResponse.ok) {
        const rutasTitulacion = await rutasResponse.json()
        cargarRutasTitulacion(rutasTitulacion)
      }

      // Cargar preguntas frecuentes
      const preguntasResponse = await fetch(`${API_BASE_URL}/preguntas-frecuentes`)
      if (preguntasResponse.ok) {
        const preguntasFrecuentes = await preguntasResponse.json()
        cargarPreguntasFrecuentes(preguntasFrecuentes)
      }
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error)
      // Cargar datos de respaldo si falla la API
      cargarDatosRespaldo()
    }
  }

  // Función para cargar datos de respaldo si falla la API
  function cargarDatosRespaldo() {
    // Rutas de titulación de respaldo
    const rutasTitulacion = [
      {
        id: 1,
        nombre: "Informe Técnico de Residencia Profesional",
        descripcion:
          "Consiste en un informe final que describe el proyecto realizado durante la residencia profesional.",
      },
      {
        id: 2,
        nombre: "Proyecto de Innovación Tecnológica",
        descripcion: "Desarrollo de un proyecto que demuestre innovación en el campo tecnológico.",
      },
      {
        id: 3,
        nombre: "Proyecto de Investigación",
        descripcion: "Desarrollo de una investigación científica o tecnológica bajo la supervisión de un asesor.",
      },
      {
        id: 4,
        nombre: "Informe de Estancia",
        descripcion: "Documento que describe las actividades realizadas durante una estancia profesional.",
      },
      {
        id: 5,
        nombre: "Tesis",
        descripcion: "Trabajo de investigación extenso que aporta nuevos conocimientos en un área específica.",
      },
      {
        id: 6,
        nombre: "Tesina",
        descripcion: "Trabajo de investigación menos extenso que una tesis, pero con rigor académico.",
      },
    ]

    // Preguntas frecuentes de respaldo
    const preguntasFrecuentes = [
      "¿Cuáles son las formas de titulación?",
      "¿Cómo inicio mi proceso de titulación?",
      "¿Dónde encuentro los servicios escolares?",
      "¿Cuál es la diferencia entre tesis y tesina?",
    ]

    cargarRutasTitulacion(rutasTitulacion)
    cargarPreguntasFrecuentesRespaldo(preguntasFrecuentes)
  }

  // Función para cargar rutas de titulación en el sidebar
  function cargarRutasTitulacion(rutas) {
    rutasTitulacionList.innerHTML = ""
    rutas.forEach((ruta) => {
      const li = document.createElement("li")
      li.textContent = ruta.nombre
      li.className = "hover:text-blue-600 cursor-pointer"
      li.addEventListener("click", () => {
        chatInput.value = `Información sobre ${ruta.nombre}`
      })
      rutasTitulacionList.appendChild(li)
    })
  }

  // Función para cargar preguntas frecuentes en el sidebar
  function cargarPreguntasFrecuentes(preguntas) {
    preguntasFrecuentesList.innerHTML = ""
    preguntas.forEach((pregunta) => {
      const li = document.createElement("li")
      li.textContent = pregunta.pregunta
      li.className = "hover:text-blue-600 cursor-pointer"
      li.addEventListener("click", () => {
        chatInput.value = pregunta.pregunta
      })
      preguntasFrecuentesList.appendChild(li)
    })
  }

  // Función para cargar preguntas frecuentes de respaldo
  function cargarPreguntasFrecuentesRespaldo(preguntas) {
    preguntasFrecuentesList.innerHTML = ""
    preguntas.forEach((pregunta) => {
      const li = document.createElement("li")
      li.textContent = pregunta
      li.className = "hover:text-blue-600 cursor-pointer"
      li.addEventListener("click", () => {
        chatInput.value = pregunta
      })
      preguntasFrecuentesList.appendChild(li)
    })
  }

  // Función para añadir un mensaje al chat
  function addMessage(role, content) {
    const message = {
      id: Date.now().toString(),
      role: role,
      content: content,
      timestamp: new Date(),
    }

    messages.push(message)
    renderMessages()
  }

  // Función para mostrar indicador de escritura
  function showTypingIndicator() {
    const typingDiv = document.createElement("div")
    typingDiv.id = "typing-indicator"
    typingDiv.className = "flex justify-start"
    typingDiv.innerHTML = `
      <div class="flex items-start max-w-[80%]">
        <div class="mr-2 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600">
            <path d="M12 8V4H8"></path>
            <rect width="16" height="12" x="4" y="8" rx="2"></rect>
            <path d="M2 14h2"></path>
            <path d="M20 14h2"></path>
            <path d="M15 13v2"></path>
            <path d="M9 13v2"></path>
          </svg>
        </div>
        <div class="bg-gray-100 text-gray-800 rounded-lg p-3">
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
          </div>
        </div>
      </div>
    `

    chatMessages.appendChild(typingDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  // Función para eliminar indicador de escritura
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator")
    if (typingIndicator) {
      typingIndicator.remove()
    }
  }

  // Función para procesar la respuesta del chatbot
  async function processResponse(userMessage) {
    try {
      let response;
      // Si la pregunta es sobre requisitos de titulación, usar el query param
      if (userMessage.toLowerCase().includes('requisito') && userMessage.toLowerCase().includes('titul')) {
        response = await fetch(`${API_BASE_URL}/scraping?q=${encodeURIComponent(userMessage)}`);
      } else {
        response = await fetch(`${API_BASE_URL}/scraping`);
      }
      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          if (Array.isArray(data.result)) {
            addMessage('assistant', data.result.join('\n\n'));
          } else {
            addMessage('assistant', data.result);
          }
        } else {
          addMessage('assistant', `Título: ${data.title}\nContenido: ${data.content}`);
        }
      } else {
        addMessage('assistant', 'Lo siento, no pude obtener la información solicitada.');
      }
    } catch (error) {
      console.error('Error al procesar la respuesta:', error);
      addMessage('assistant', 'Lo siento, ha ocurrido un error al procesar tu consulta.');
    }
  }

  // Función para renderizar todos los mensajes
  function renderMessages() {
    chatMessages.innerHTML = ""

    messages.forEach((message) => {
      const messageDiv = document.createElement("div")
      messageDiv.className = `flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`

      // Mensaje colapsable si es muy largo
      const isLong = message.content.length > 400;
      const shortContent = isLong ? message.content.slice(0, 400) + '...' : message.content;
      const expanded = false;
      messageDiv.innerHTML = `
        <div class="flex items-start max-w-[80%]">
          ${
            message.role === "assistant"
              ? `<div class="mr-2 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600">
                <path d="M12 8V4H8"></path>
                <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                <path d="M2 14h2"></path>
                <path d="M20 14h2"></path>
                <path d="M15 13v2"></path>
                <path d="M9 13v2"></path>
              </svg>
                </div>`
              : ""
          }
          <div class="${message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"} rounded-lg p-3">
            <div class="message-content${isLong ? '' : ' expanded'}">${shortContent}</div>
            ${isLong ? '<span class="show-more">Ver más</span>' : ''}
            <div class="${message.role === "user" ? "text-blue-100" : "text-gray-500"} text-xs mt-1">
              ${message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
          ${
            message.role === "user"
              ? `<div class="ml-2 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
                </div>`
              : ""
          }
        </div>
      `
      chatMessages.appendChild(messageDiv)

      // Agregar funcionalidad Ver más/Ver menos
      if (isLong) {
        const msgContent = messageDiv.querySelector('.message-content');
        const showMore = messageDiv.querySelector('.show-more');
        let expanded = false;
        showMore.addEventListener('click', () => {
          expanded = !expanded;
          if (expanded) {
            msgContent.textContent = message.content;
            msgContent.classList.add('expanded');
            showMore.textContent = 'Ver menos';
          } else {
            msgContent.textContent = shortContent;
            msgContent.classList.remove('expanded');
            showMore.textContent = 'Ver más';
          }
        });
      }
    })

    // Scroll al final
    chatMessages.scrollTop = chatMessages.scrollHeight
  }
})
