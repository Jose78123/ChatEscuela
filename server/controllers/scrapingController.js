const axios = require('axios');
const cheerio = require('cheerio');

exports.scrapeWebsite = async (req, res) => {
  try {
    const userQuery = req.query.q || '';
    const query = userQuery.toLowerCase();

    // Modalidades/Formas/Rutas de titulación
    if (
      query.includes('formas de titul') ||
      query.includes('rutas de titul') ||
      query.includes('opciones de titul') ||
      query.includes('modalidades de titul')
    ) {
      const response = await axios.get('https://tessfp.edomex.gob.mx/modalidades-de-titulacion');
      const $ = cheerio.load(response.data);
      let modalidades = [];
      // Ajusta el selector según el HTML real de la página de modalidades
      $('h2, h3, li, p').each((i, el) => {
        const text = $(el).text();
        if (
          (text.toLowerCase().includes('titulación') || text.toLowerCase().includes('titulacion') || text.toLowerCase().includes('modalidad')) &&
          text.length < 400
        ) {
          modalidades.push(text.trim());
        }
      });
      if (modalidades.length === 0) {
        modalidades.push('No se encontraron modalidades de titulación en el sitio oficial.');
      }
      return res.json({ result: modalidades });
    }

    // Requisitos de titulación (puedes agregar aquí la URL específica si existe)
    if (query.includes('requisito') && query.includes('titul')) {
      const response = await axios.get('https://tessfp.edomex.gob.mx/modalidades-de-titulacion');
      const $ = cheerio.load(response.data);
      let requisitos = [];
      $('li, p').each((i, el) => {
        const text = $(el).text();
        if (text.toLowerCase().includes('requisito') && text.length < 500) {
          requisitos.push(text.trim());
        }
      });
      if (requisitos.length === 0) {
        return res.json({ result: 'No se encontraron requisitos de titulación en el sitio oficial.' });
      }
      return res.json({ result: requisitos });
    }

    // Servicios escolares
    if (query.includes('servicios escolares') || query.includes('trámite') || query.includes('tramite')) {
      let servicios = [];
      $('section, div, p, li').each((i, el) => {
        const text = $(el).text();
        if ((text.toLowerCase().includes('servicio escolar') || text.toLowerCase().includes('trámite') || text.toLowerCase().includes('tramite')) && text.length < 400) {
          servicios.push(text.trim());
        }
      });
      if (servicios.length === 0) {
        return res.json({ result: 'No se encontró información sobre servicios escolares en el sitio oficial.' });
      }
      return res.json({ result: servicios });
    }

    // Diferencia entre tesis y tesina
    if (query.includes('diferencia') && query.includes('tesis') && query.includes('tesina')) {
      let diferencia = [];
      $('li, p').each((i, el) => {
        const text = $(el).text();
        if ((text.toLowerCase().includes('tesis') && text.toLowerCase().includes('tesina')) || text.toLowerCase().includes('diferencia')) {
          diferencia.push(text.trim());
        }
      });
      if (diferencia.length === 0) {
        diferencia.push('Tesis: Trabajo de investigación extenso que aporta nuevos conocimientos en un área específica. Tesina: Trabajo de investigación menos extenso que una tesis, pero con rigor académico.');
      }
      return res.json({ result: diferencia });
    }

    // Proceso de titulación
    if (query.includes('proceso de titul') || query.includes('iniciar titulación')) {
      const response = await axios.get('https://tessfp.edomex.gob.mx/titulacion');
      const $ = cheerio.load(response.data);
      let proceso = [];
      // Extraer filas de la tabla con la clase MsoTableGrid
      $('table.MsoTableGrid tr').each((i, row) => {
        let rowData = [];
        $(row).find('td').each((j, cell) => {
          rowData.push($(cell).text().replace(/\s+/g, ' ').trim());
        });
        if (rowData.length > 0) {
          proceso.push(rowData.join(' | '));
        }
      });
      if (proceso.length === 0) {
        proceso.push('No se encontró información sobre el proceso de titulación en el sitio oficial.');
      }
      return res.json({ result: proceso });
    }

    // Respuesta por defecto (home)
    const response = await axios.get('https://tessfp.edomex.gob.mx/');
    const $ = cheerio.load(response.data);
    const title = $('title').text();
    const content = $('body').text();
    res.json({ title, content });
  } catch (error) {
    console.error('Error al realizar el scraping:', error);
    res.status(500).json({ error: 'Error al realizar el scraping' });
  }
}; 