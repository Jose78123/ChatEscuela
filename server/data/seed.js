const mongoose = require("mongoose")
const dotenv = require("dotenv")
const RutaTitulacion = require("../models/RutaTitulacion")
const ServicioEscolar = require("../models/ServicioEscolar")
const PreguntaFrecuente = require("../models/PreguntaFrecuente")
const connectDB = require("../config/db")

// Cargar variables de entorno
dotenv.config()

// Conectar a la base de datos
connectDB()

// Datos de rutas de titulación
const rutasTitulacion = [
  {
    id: 1,
    nombre: "Informe Técnico de Residencia Profesional",
    descripcion: "Consiste en un informe final que describe el proyecto realizado durante la residencia profesional.",
    requisitos: [
      "Haber concluido la residencia profesional",
      "Contar con la carta de terminación de la empresa",
      "Tener el visto bueno del asesor académico",
      "Presentar el informe técnico siguiendo el formato institucional",
    ],
    documentos: [
      "Formato de solicitud de titulación",
      "Carta de terminación de residencia",
      "Informe técnico en formato digital e impreso",
      "Evaluación del asesor",
    ],
  },
  {
    id: 2,
    nombre: "Proyecto de Innovación Tecnológica",
    descripcion: "Desarrollo de un proyecto que demuestre innovación en el campo tecnológico.",
    requisitos: [
      "Propuesta de proyecto aprobada por el comité académico",
      "Desarrollo completo del prototipo o solución",
      "Documentación técnica del proyecto",
      "Demostración de la innovación aportada",
    ],
    documentos: [
      "Formato de solicitud de titulación",
      "Memoria técnica del proyecto",
      "Evidencia del prototipo o solución",
      "Dictamen del comité evaluador",
    ],
  },
  {
    id: 3,
    nombre: "Proyecto de Investigación",
    descripcion: "Desarrollo de una investigación científica o tecnológica bajo la supervisión de un asesor.",
    requisitos: [
      "Protocolo de investigación aprobado",
      "Desarrollo completo de la investigación",
      "Resultados y conclusiones documentados",
      "Aval del asesor de investigación",
    ],
    documentos: [
      "Formato de solicitud de titulación",
      "Reporte de investigación",
      "Carta de liberación del asesor",
      "Artículo científico (opcional)",
    ],
  },
  {
    id: 4,
    nombre: "Informe de Estancia",
    descripcion: "Documento que describe las actividades realizadas durante una estancia profesional.",
    requisitos: [
      "Haber concluido la estancia profesional",
      "Contar con la evaluación positiva de la empresa",
      "Informe detallado de actividades",
      "Aval del asesor académico",
    ],
    documentos: [
      "Formato de solicitud de titulación",
      "Carta de terminación de estancia",
      "Informe de actividades",
      "Evaluación de la empresa",
    ],
  },
  {
    id: 5,
    nombre: "Tesis",
    descripcion: "Trabajo de investigación extenso que aporta nuevos conocimientos en un área específica.",
    requisitos: [
      "Protocolo de tesis aprobado",
      "Desarrollo completo de la investigación",
      "Documento de tesis terminado",
      "Aprobación del director de tesis",
    ],
    documentos: [
      "Formato de solicitud de titulación",
      "Documento de tesis (digital e impreso)",
      "Carta de liberación del director de tesis",
      "Dictamen de los sinodales",
    ],
  },
  {
    id: 6,
    nombre: "Tesina",
    descripcion: "Trabajo de investigación menos extenso que una tesis, pero con rigor académico.",
    requisitos: [
      "Protocolo de tesina aprobado",
      "Desarrollo de la investigación",
      "Documento de tesina terminado",
      "Aprobación del asesor",
    ],
    documentos: [
      "Formato de solicitud de titulación",
      "Documento de tesina (digital e impreso)",
      "Carta de liberación del asesor",
      "Dictamen de los revisores",
    ],
  },
]

// Datos de servicios escolares
const serviciosEscolares = {
  nombre: "Servicios Escolares",
  ubicacion: "Edificio administrativo, planta baja",
  horario: "Lunes a viernes de 8:00 a 16:00 horas",
  contacto: "servicios.escolares@tec.edu.mx | Tel: (123) 456-7890",
  tramites: [
    "Constancias de estudio",
    "Historial académico",
    "Trámites de titulación",
    "Credenciales",
    "Inscripciones y reinscripciones",
    "Certificados parciales y totales",
    "Equivalencias y revalidaciones",
  ],
  requisitosGenerales: [
    "Identificación oficial vigente",
    "Comprobante de pago de derechos (cuando aplique)",
    "Estar al corriente en pagos de colegiatura",
    "No tener adeudos en biblioteca u otros departamentos",
  ],
}

// Datos de preguntas frecuentes
const preguntasFrecuentes = [
  {
    pregunta: "¿Cuáles son las formas de titulación?",
    respuesta:
      "Las formas de titulación disponibles en el Tec son: 1. Informe Técnico de Residencia Profesional, 2. Proyecto de Innovación Tecnológica, 3. Proyecto de Investigación, 4. Informe de Estancia, 5. Tesis, 6. Tesina.",
    categoria: "titulacion",
    palabrasClave: ["titulación", "formas", "opciones", "titularse", "titular"],
  },
  {
    pregunta: "¿Cómo inicio mi proceso de titulación?",
    respuesta:
      "Para iniciar tu proceso de titulación debes seguir estos pasos:\n\n1. Verificar que has cumplido con todos los créditos de tu plan de estudios\n2. Acudir a servicios escolares para solicitar tu revisión de expediente\n3. Elegir tu modalidad de titulación\n4. Asignar un asesor académico (dependiendo de la modalidad)\n5. Desarrollar tu proyecto de titulación\n6. Presentar tu examen profesional o protocolo según corresponda",
    categoria: "titulacion",
    palabrasClave: ["proceso", "iniciar", "comenzar", "titulación", "pasos"],
  },
  {
    pregunta: "¿Dónde encuentro los servicios escolares?",
    respuesta:
      "Los servicios escolares se encuentran en el edificio administrativo, planta baja. El horario de atención es de lunes a viernes de 8:00 a 16:00 horas.",
    categoria: "servicios",
    palabrasClave: ["servicios", "escolares", "ubicación", "dónde", "donde", "encuentro"],
  },
  {
    pregunta: "¿Cuál es la diferencia entre tesis y tesina?",
    respuesta:
      "La principal diferencia entre tesis y tesina es la extensión y profundidad:\n\n- Tesis: Es un trabajo de investigación extenso que aporta nuevos conocimientos en un área específica. Requiere una investigación profunda y original.\n\n- Tesina: Es un trabajo de investigación menos extenso que una tesis, pero con rigor académico. Puede enfocarse en la aplicación de conocimientos existentes a un problema específico.",
    categoria: "titulacion",
    palabrasClave: ["diferencia", "tesis", "tesina", "comparación"],
  },
  {
    pregunta: "¿Qué documentos necesito para tramitar mi credencial?",
    respuesta:
      "Para tramitar tu credencial necesitas:\n\n- Identificación oficial vigente (INE, pasaporte)\n- Comprobante de inscripción vigente\n- Fotografía reciente tamaño infantil\n- Comprobante de pago de derechos\n\nEl trámite se realiza en Servicios Escolares, edificio administrativo, planta baja.",
    categoria: "tramites",
    palabrasClave: ["credencial", "documentos", "tramitar", "requisitos"],
  },
  {
    pregunta: "¿Cuándo son las fechas de inscripción?",
    respuesta:
      "Las fechas de inscripción para el próximo semestre son del 6 al 10 de enero de 2026. Recuerda que debes estar al corriente en tus pagos y no tener adeudos para poder inscribirte.",
    categoria: "tramites",
    palabrasClave: ["inscripción", "fechas", "cuando", "cuándo", "inscribirme"],
  },
  {
    pregunta: "¿Cómo solicito una constancia de estudios?",
    respuesta:
      "Para solicitar una constancia de estudios debes:\n\n1. Acudir a Servicios Escolares\n2. Llenar el formato de solicitud\n3. Realizar el pago correspondiente en caja\n4. Presentar tu comprobante de pago\n5. La constancia estará lista en 2 días hábiles",
    categoria: "tramites",
    palabrasClave: ["constancia", "estudios", "solicitar", "cómo", "como"],
  },
  {
    pregunta: "¿Qué hago si perdí mi credencial?",
    respuesta:
      "Si perdiste tu credencial, debes:\n\n1. Reportar la pérdida en Servicios Escolares\n2. Solicitar una reposición llenando el formato correspondiente\n3. Realizar el pago por reposición en caja\n4. Presentar una fotografía reciente tamaño infantil\n5. La nueva credencial estará lista en aproximadamente 3 días hábiles",
    categoria: "tramites",
    palabrasClave: ["perdí", "perdi", "credencial", "reposición", "extravié"],
  },
  {
    pregunta: "¿Cuáles son los requisitos para la residencia profesional?",
    respuesta:
      "Los requisitos para la residencia profesional son:\n\n1. Tener acreditado el 80% de los créditos de tu plan de estudios\n2. No tener más de 2 asignaturas reprobadas\n3. Estar inscrito en el semestre correspondiente\n4. Contar con una empresa o institución que te acepte para realizar la residencia\n5. Presentar tu anteproyecto aprobado por el asesor académico",
    categoria: "titulacion",
    palabrasClave: ["residencia", "profesional", "requisitos", "empezar"],
  },
  {
    pregunta: "¿Cómo puedo solicitar mi historial académico?",
    respuesta:
      "Para solicitar tu historial académico:\n\n1. Acude a Servicios Escolares\n2. Llena el formato de solicitud\n3. Realiza el pago correspondiente\n4. Tu historial estará disponible en 3 días hábiles\n\nTambién puedes solicitarlo en línea a través del portal de estudiantes si tienes acceso.",
    categoria: "tramites",
    palabrasClave: ["historial", "académico", "kardex", "calificaciones", "solicitar"],
  },
]

// Función para sembrar datos
const seedData = async () => {
  try {
    // Limpiar datos existentes
    await RutaTitulacion.deleteMany()
    await ServicioEscolar.deleteMany()
    await PreguntaFrecuente.deleteMany()

    console.log("Datos anteriores eliminados")

    // Insertar nuevos datos
    await RutaTitulacion.insertMany(rutasTitulacion)
    await ServicioEscolar.create(serviciosEscolares)
    await PreguntaFrecuente.insertMany(preguntasFrecuentes)

    console.log("Datos sembrados correctamente")
    process.exit()
  } catch (error) {
    console.error(`Error al sembrar datos: ${error.message}`)
    process.exit(1)
  }
}

// Ejecutar la función
seedData()
