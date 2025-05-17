'use client';
import { useState } from 'react';

export default function Chat() {
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [loading, setLoading] = useState(false);

  const preguntasSugeridas = [
    "¿Cuándo me puedo preinscribir?",
    "¿Qué necesito para el examen de admisión?",
    "¿Cómo me inscribo?",
    "¿Cómo me reinscribo?",
    "¿Dónde saco mi constancia?",
    "¿Cómo pido mi certificado parcial o total?",
    "¿Dónde consigo la carta de pasante?",
    "¿Qué modalidades de titulación hay?",
    "¿Qué necesito para titularme?",
    "¿Cómo pido mi título?",
    "¿Cuál es el proceso de residencia profesional?"
  ];

  const documentosComunes = [
    'INE',
    'CURP',
    'ACTA DE NACIMIENTO',
    'IDENTIFICACIÓN OFICIAL',
    'COMPROBANTE DE DOMICILIO',
    'CERTIFICADO DE ESTUDIOS',
    'CONSTANCIA DE ESTUDIOS',
    'FORMATO UNIVERSAL DE PAGO',
    'FOTOGRAFÍAS'
  ];

  const procesarTexto = (texto) => {
    // Primero, arreglamos los URLs que se han cortado
    texto = texto.replace(/https?:\/\/[^\s]+/g, url => {
      // Eliminar espacios después de puntos en el dominio
      return url.replace(/\.\s+/g, '.')
               // Asegurar que no haya espacios en el dominio
               .replace(/(https?:\/\/[^\/]+)/g, domain => domain.replace(/\s+/g, ''))
               // Asegurar que no haya espacios en la ruta
               .replace(/(\/[^\s]*)/g, path => path.replace(/\s+/g, ''));
    });

    // Detectar y formatear listas de documentos
    texto = texto.replace(/documentos:([^.]*)/gi, (match, docs) => {
      const documentos = docs.split(',').map(doc => doc.trim());
      return `documentos:\n${documentos.map(doc => `- ${doc}`).join('\n')}`;
    });

    // Dividir el texto en secciones principales
    let secciones = texto.split(/(?=[A-Z][A-Z\s]+:)/);
    
    // Procesar cada sección
    secciones = secciones.map(seccion => {
      // Limpiar espacios al inicio y final
      seccion = seccion.trim();
      
      // Si la sección está vacía, la ignoramos
      if (!seccion) return '';

      // Si es un título en mayúsculas y no es un documento común
      if (seccion === seccion.toUpperCase() && 
          seccion.length < 100 && 
          !documentosComunes.some(doc => seccion.includes(doc))) {
        return `\n\n${seccion}\n\n`;
      }

      // Si termina en dos puntos, es un subtítulo
      if (seccion.endsWith(':')) {
        return `\n${seccion}\n`;
      }

      // Procesar listas
      if (seccion.includes('\n')) {
        const lineas = seccion.split('\n');
        return lineas.map(linea => {
          if (/^\d+\.|^-/.test(linea.trim())) {
            return `\n${linea}`;
          }
          return linea;
        }).join('\n');
      }

      return seccion;
    }).join('');

    // Primero, reemplazamos temporalmente los URLs con un marcador
    const urlPlaceholders = [];
    secciones = secciones.replace(/https?:\/\/[^\s]+/g, (url) => {
      urlPlaceholders.push(url);
      return `__URL_${urlPlaceholders.length - 1}__`;
    });

    // Ahora agregamos los saltos de línea después de los puntos
    secciones = secciones.replace(/\.(?!\d)(?!\s*$)/g, '.\n');

    // Restauramos los URLs
    secciones = secciones.replace(/__URL_(\d+)__/g, (_, index) => urlPlaceholders[index]);
    
    // Limpiar espacios múltiples
    secciones = secciones.replace(/\n{3,}/g, '\n\n');
    
    return secciones.trim();
  };

  const formatearTexto = (texto) => {
    // Primero procesamos el texto
    const textoProcesado = procesarTexto(texto);
    
    // Dividir el texto en líneas
    const lineas = textoProcesado.split('\n');
    
    return lineas.map((linea, index) => {
      // Si la línea está en mayúsculas y es corta, es un título
      if (linea === linea.toUpperCase() && 
          linea.length < 100 && 
          linea.trim() && 
          !documentosComunes.some(doc => linea.includes(doc))) {
        return (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">{linea}</h2>
            <div className="h-6"></div>
          </div>
        );
      }

      // Si la línea es un documento común, ponerla en negrita
      if (documentosComunes.some(doc => linea.toUpperCase().includes(doc))) {
        return (
          <p key={index} className="my-4 text-gray-700 leading-relaxed">
            <strong>{linea}</strong>
          </p>
        );
      }

      // Si la línea termina en dos puntos, es un subtítulo
      if (linea.trim().endsWith(':')) {
        return (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">{linea}</h3>
            <div className="h-4"></div>
          </div>
        );
      }

      // Si la línea comienza con un número o guión, es parte de una lista
      if (/^\d+\.|^-/.test(linea.trim())) {
        return (
          <ul key={index} className="list-disc pl-8 space-y-3 my-4">
            <li className="text-gray-700 leading-relaxed">
              {linea.replace(/^\d+\.\s*|^-\s*/, '')}
            </li>
          </ul>
        );
      }

      // Si la línea contiene una URL
      if (linea.includes('http')) {
        const partes = linea.split(/(https?:\/\/[^\s]+)/);
        return (
          <p key={index} className="my-4 text-gray-700 leading-relaxed">
            {partes.map((parte, i) => {
              if (parte.match(/https?:\/\/[^\s]+/)) {
                const url = parte.trim();
                return (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline whitespace-nowrap inline-block"
                  >
                    {url}
                  </a>
                );
              }
              return parte;
            })}
          </p>
        );
      }

      // Si la línea no está vacía, es un párrafo normal
      if (linea.trim()) {
        return (
          <p key={index} className="my-4 text-gray-700 leading-relaxed">
            {linea}
          </p>
        );
      }

      // Si la línea está vacía, agregamos un espacio
      return <div key={index} className="h-4"></div>;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/preguntar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pregunta }),
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setRespuesta(data.respuesta);
    } catch (error) {
      console.error('Error:', error);
      setRespuesta('Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Chatbot de Orientación</h1>
        
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
              placeholder="Escribe tu pregunta aquí..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'Enviando...' : 'Preguntar'}
            </button>
          </div>
        </form>

        {respuesta && (
          <div className="mt-4 p-6 bg-gray-50 rounded-lg">
            <h2 className="font-semibold mb-6 text-xl text-gray-800">Respuesta:</h2>
            <div className="prose max-w-none">
              {formatearTexto(respuesta)}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Preguntas sugeridas:</h3>
          <ul className="space-y-2">
            {preguntasSugeridas.map((pregunta, index) => (
              <li key={index}>
                <button
                  onClick={() => setPregunta(pregunta)}
                  className="text-blue-500 hover:underline text-left w-full"
                >
                  {pregunta}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 