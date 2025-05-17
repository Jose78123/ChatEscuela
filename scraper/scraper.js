const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const pages = {
  preinscripcion: "https://tessfp.edomex.gob.mx/preinscripcion",
  examenAdmision: "https://tessfp.edomex.gob.mx/examen-admision",
  inscripcion: "https://tessfp.edomex.gob.mx/inscripcion",
  reinscripcion: "https://tessfp.edomex.gob.mx/reinscripcion",
  constancia: "https://tessfp.edomex.gob.mx/constanciao-historial-academico",
  certificado: "https://tessfp.edomex.gob.mx/certificado-total-parcial-alumnos",
  cartaPasante: "https://tessfp.edomex.gob.mx/carta-de-pasante",
  modalidadesTitulacion: "https://tessfp.edomex.gob.mx/modalidades-de-titulacion",
  titulacion: "https://tessfp.edomex.gob.mx/titulacion",
  titulo: "https://tessfp.edomex.gob.mx/expedicion-titulo",
  residencia: "https://tessfp.edomex.gob.mx/proceso-de_residencia_profesional"
};

async function scrapePage(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const text = $("main").text().replace(/\s+/g, " ").trim();
  return text;
}

async function runScraper() {
  const result = {};
  for (const key in pages) {
    console.log(`🔍 Scrapeando: ${key}`);
    result[key] = await scrapePage(pages[key]);
  }
  const outputPath = path.join(__dirname, "data.json");
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log("✅ Scraping completo.");
}

runScraper();
