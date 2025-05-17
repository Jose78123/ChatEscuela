const { getSheets, SPREADSHEET_ID } = require('../config/google-sheets');

class SheetsService {
  async getSheetData(range) {
    try {
      const sheets = await getSheets();
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
      });

      return response.data.values;
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      throw error;
    }
  }

  async getCarreras() {
    const range = 'Carreras!A2:D'; // Ajusta según tu hoja de cálculo
    const data = await this.getSheetData(range);
    return data.map(row => ({
      nombre: row[0],
      descripcion: row[1],
      duracion: row[2],
      modalidad: row[3]
    }));
  }

  async getNoticias() {
    const range = 'Noticias!A2:C'; // Ajusta según tu hoja de cálculo
    const data = await this.getSheetData(range);
    return data.map(row => ({
      titulo: row[0],
      contenido: row[1],
      fecha: row[2]
    }));
  }

  async getEventos() {
    const range = 'Eventos!A2:D'; // Ajusta según tu hoja de cálculo
    const data = await this.getSheetData(range);
    return data.map(row => ({
      titulo: row[0],
      descripcion: row[1],
      fecha: row[2],
      lugar: row[3]
    }));
  }
}

module.exports = new SheetsService(); 