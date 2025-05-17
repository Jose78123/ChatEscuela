const openai = require('../config/openai');
const { scrapeInfo } = require('./scraperService');

const respuestasPredefinidas = {
  "examen de admisión": `REQUISITOS PARA EL EXAMEN DE ADMISIÓN:

1. Documentos necesarios:
   - CURP
   - Acta de nacimiento
   - Certificado de bachillerato
   - Identificación oficial
   - Comprobante de domicilio
   - 2 fotografías tamaño infantil

2. Proceso:
   - Realizar el pago del examen
   - Presentar los documentos en control escolar
   - Asistir el día del examen con 30 minutos de anticipación
   - Llevar lápiz, pluma y calculadora

3. Fechas importantes:
   - El examen se realiza en junio y enero
   - Las inscripciones son un mes antes
   - Los resultados se publican 15 días después

Para más información, visita la página web del instituto o acude a control escolar.`,

  "inscripción": `PROCESO DE INSCRIPCIÓN:

1. Requisitos:
   - Haber aprobado el examen de admisión
   - CURP
   - Acta de nacimiento
   - Certificado de bachillerato
   - Identificación oficial
   - Comprobante de domicilio
   - 6 fotografías tamaño infantil
   - Formato universal de pago

2. Pasos:
   - Realizar el pago de inscripción
   - Presentar documentos en control escolar
   - Asistir a la ceremonia de bienvenida
   - Tomar la foto para credencial

3. Fechas:
   - Julio para el semestre de agosto
   - Enero para el semestre de febrero

Para más detalles, visita control escolar.`,

  "carreras": `CARRERAS DISPONIBLES:

1. Ingeniería en Sistemas Computacionales
   - Duración: 8 semestres
   - Modalidad: Escolarizada
   - Turno: Matutino

2. Ingeniería en Gestión Empresarial
   - Duración: 8 semestres
   - Modalidad: Escolarizada
   - Turno: Matutino

3. Ingeniería en Industrias Alimentarias
   - Duración: 8 semestres
   - Modalidad: Escolarizada
   - Turno: Matutino

4. Ingeniería en Desarrollo Comunitario
   - Duración: 8 semestres
   - Modalidad: Escolarizada
   - Turno: Matutino

Para más información sobre cada carrera, visita la página web del instituto.`
};

const generateResponse = async (pregunta) => {
  try {
    console.log('🔄 Iniciando generación de respuesta para:', pregunta);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Eres un asistente virtual especializado del Tecnológico de Estudios Superiores de San Felipe del Progreso. 
            Tu función es proporcionar información precisa y útil sobre:
            - Trámites y requisitos de inscripción
            - Oferta educativa y carreras
            - Procesos de admisión
            - Servicios estudiantiles
            - Calendario escolar
            - Becas y apoyos
            
            Instrucciones específicas:
            1. Mantén un tono profesional pero amigable
            2. Si no estás seguro de una respuesta, indícalo claramente
            3. Proporciona información detallada y estructurada
            4. Incluye fechas y requisitos específicos cuando sea relevante
            5. Si la pregunta es muy general, pide más detalles
            6. Siempre menciona que la información puede estar sujeta a cambios
            
            Formato de respuesta:
            - Usa títulos en mayúsculas para secciones importantes
            - Enumera los requisitos y pasos cuando sea apropiado
            - Destaca información importante en negrita
            - Proporciona ejemplos cuando sea útil`
          },
          {
            role: "user",
            content: pregunta
          }
        ],
        temperature: 0.5,
        max_tokens: 800,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      });

      console.log('✅ Respuesta generada exitosamente con OpenAI');
      return completion.choices[0].message.content;
    } catch (openaiError) {
      console.error('❌ Error con OpenAI:', openaiError);
      
      // Verificar si es un error de límite excedido
      if (openaiError.message.includes('quota') || openaiError.message.includes('rate limit')) {
        console.log('⚠️ Límite de OpenAI excedido, usando scraping como respaldo');
        const respuestaScraping = await scrapeInfo(pregunta);
        return `${respuestaScraping}\n\n[Nota: Esta información fue obtenida directamente del sitio web del instituto debido a que se excedió el límite de la API de OpenAI. Para información más detallada, visita la página web del instituto.]`;
      }
      
      throw openaiError;
    }
  } catch (error) {
    console.error('❌ Error detallado:', {
      message: error.message,
      code: error.code,
      type: error.type,
      status: error.status
    });

    return "Lo siento, ha ocurrido un error al procesar tu pregunta. Por favor, intenta de nuevo o contacta a soporte técnico.";
  }
};

module.exports = {
  generateResponse
}; 