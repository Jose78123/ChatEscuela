"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

// Tipos para los mensajes
type MessageRole = "user" | "assistant"
type Message = {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
}

// Información sobre rutas de titulación
const rutasTitulacion = [
  {
    id: 1,
    nombre: "Informe Técnico de Residencia Profesional",
    descripcion: "Consiste en un informe final que describe el proyecto realizado durante la residencia profesional.",
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

// Preguntas frecuentes predefinidas
const preguntasFrecuentes = [
  "¿Cuáles son las formas de titulación?",
  "¿Cómo inicio mi proceso de titulación?",
  "¿Dónde encuentro los servicios escolares?",
  "¿Cuál es la diferencia entre tesis y tesina?",
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "¡Hola! Soy el asistente virtual del Tec. Puedo ayudarte con información sobre servicios escolares, dudas frecuentes y rutas de titulación. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Función para procesar la respuesta del chatbot
  const processResponse = (userMessage: string) => {
    setIsTyping(true)

    // Simulamos un tiempo de respuesta
    setTimeout(() => {
      let respuesta = ""

      // Lógica simple para determinar respuestas
      const mensajeLowerCase = userMessage.toLowerCase()

      if (
        mensajeLowerCase.includes("titulación") ||
        mensajeLowerCase.includes("titularse") ||
        mensajeLowerCase.includes("titular")
      ) {
        respuesta =
          "Las formas de titulación disponibles en el Tec son:\n\n" +
          rutasTitulacion.map((ruta) => `${ruta.id}. ${ruta.nombre}: ${ruta.descripcion}`).join("\n\n")
      } else if (mensajeLowerCase.includes("residencia") || mensajeLowerCase.includes("informe técnico")) {
        const ruta = rutasTitulacion.find((r) => r.id === 1)
        respuesta = `${ruta?.nombre}: ${ruta?.descripcion}\n\nEste método requiere haber completado satisfactoriamente tu residencia profesional y presentar un informe detallado sobre el proyecto realizado.`
      } else if (mensajeLowerCase.includes("innovación") || mensajeLowerCase.includes("tecnológica")) {
        const ruta = rutasTitulacion.find((r) => r.id === 2)
        respuesta = `${ruta?.nombre}: ${ruta?.descripcion}\n\nEste método implica desarrollar un proyecto que demuestre innovación en el campo tecnológico, con potencial aplicación práctica.`
      } else if (mensajeLowerCase.includes("investigación")) {
        const ruta = rutasTitulacion.find((r) => r.id === 3)
        respuesta = `${ruta?.nombre}: ${ruta?.descripcion}\n\nEste método requiere realizar una investigación formal bajo la supervisión de un asesor académico.`
      } else if (mensajeLowerCase.includes("estancia")) {
        const ruta = rutasTitulacion.find((r) => r.id === 4)
        respuesta = `${ruta?.nombre}: ${ruta?.descripcion}\n\nEste método requiere haber completado una estancia profesional y presentar un informe detallado sobre las actividades realizadas.`
      } else if (mensajeLowerCase.includes("tesis")) {
        const ruta = rutasTitulacion.find((r) => r.id === 5)
        respuesta = `${ruta?.nombre}: ${ruta?.descripcion}\n\nLa tesis es un trabajo de investigación extenso que debe aportar nuevos conocimientos en tu área de estudio.`
      } else if (mensajeLowerCase.includes("tesina")) {
        const ruta = rutasTitulacion.find((r) => r.id === 6)
        respuesta = `${ruta?.nombre}: ${ruta?.descripcion}\n\nLa tesina es un trabajo de investigación menos extenso que una tesis, pero debe mantener el rigor académico.`
      } else if (mensajeLowerCase.includes("diferencia entre tesis y tesina")) {
        respuesta =
          "La principal diferencia entre tesis y tesina es la extensión y profundidad:\n\n" +
          "- Tesis: Es un trabajo de investigación extenso que aporta nuevos conocimientos en un área específica. Requiere una investigación profunda y original.\n\n" +
          "- Tesina: Es un trabajo de investigación menos extenso que una tesis, pero con rigor académico. Puede enfocarse en la aplicación de conocimientos existentes a un problema específico."
      } else if (mensajeLowerCase.includes("servicios escolares")) {
        respuesta =
          "Los servicios escolares se encuentran en el edificio administrativo, planta baja. El horario de atención es de lunes a viernes de 8:00 a 16:00 horas. Puedes realizar trámites como:\n\n" +
          "- Constancias de estudio\n" +
          "- Historial académico\n" +
          "- Trámites de titulación\n" +
          "- Credenciales\n" +
          "- Inscripciones y reinscripciones"
      } else if (
        mensajeLowerCase.includes("proceso de titulación") ||
        mensajeLowerCase.includes("iniciar titulación")
      ) {
        respuesta =
          "Para iniciar tu proceso de titulación debes seguir estos pasos:\n\n" +
          "1. Verificar que has cumplido con todos los créditos de tu plan de estudios\n" +
          "2. Acudir a servicios escolares para solicitar tu revisión de expediente\n" +
          "3. Elegir tu modalidad de titulación\n" +
          "4. Asignar un asesor académico (dependiendo de la modalidad)\n" +
          "5. Desarrollar tu proyecto de titulación\n" +
          "6. Presentar tu examen profesional o protocolo según corresponda"
      } else if (mensajeLowerCase.includes("hola") || mensajeLowerCase.includes("saludos")) {
        respuesta =
          "¡Hola! Soy el asistente virtual del Tec. ¿En qué puedo ayudarte hoy? Puedo brindarte información sobre servicios escolares, dudas frecuentes y rutas de titulación."
      } else {
        respuesta =
          "No tengo información específica sobre esa consulta. Puedo ayudarte con información sobre:\n\n" +
          "- Las diferentes formas de titulación\n" +
          "- El proceso de titulación\n" +
          "- Servicios escolares\n" +
          "- Dudas frecuentes de estudiantes"
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: respuesta,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, newMessage])
      setIsTyping(false)
    }, 1000)
  }

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (input.trim() === "") return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    processResponse(input)
    setInput("")
  }

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Función para seleccionar una pregunta frecuente
  const selectPreguntaFrecuente = (pregunta: string) => {
    setInput(pregunta)
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar con información */}
      <div id="sidebar" className="w-full md:w-1/4 bg-white p-4 border-r border-gray-200">
        <div className="flex items-center space-x-2 mb-6">
          <div className="h-6 w-6 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold">Asistente del Tec</h2>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-5 w-5 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-lg">Rutas de Titulación</h3>
          </div>
          <ul id="rutas-titulacion-list" className="space-y-1 ml-7 text-sm">
            {/* Las rutas de titulación se cargarán con JavaScript */}
          </ul>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-5 w-5 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-lg">Preguntas Frecuentes</h3>
          </div>
          <ul id="preguntas-frecuentes-list" className="space-y-2 ml-7 text-sm">
            {/* Las preguntas frecuentes se cargarán con JavaScript */}
          </ul>
        </div>
      </div>

      {/* Chat principal */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col m-4 shadow-lg bg-white rounded-lg border border-gray-200">
          <div className="border-b p-4">
            <div className="flex items-center">
              <div className="mr-2 h-5 w-5 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 8V4H8"></path>
                  <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                  <path d="M2 14h2"></path>
                  <path d="M20 14h2"></path>
                  <path d="M15 13v2"></path>
                  <path d="M9 13v2"></path>
                </svg>
              </div>
              <h2 className="text-lg font-bold">Chatbot de Orientación Estudiantil</h2>
            </div>
          </div>

          <div id="chat-messages" className="flex-1 overflow-y-auto p-4">
            {/* Los mensajes se cargarán con JavaScript */}
          </div>

          <div className="border-t p-4">
            <form id="chat-form" className="flex w-full space-x-2">
              <input
                id="chat-input"
                type="text"
                placeholder="Escribe tu pregunta aquí..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4Z"></path>
                  <path d="M22 2 11 13"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
