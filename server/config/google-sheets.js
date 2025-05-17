const { google } = require('googleapis');
const path = require('path');

// Configuración de las credenciales
const CREDENTIALS_PATH = path.join(__dirname, '../../credentials.json');
const TOKEN_PATH = path.join(__dirname, '../../token.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

// ID de tu hoja de cálculo de Google Sheets
const SPREADSHEET_ID = 'TU_SPREADSHEET_ID'; // Reemplazar con tu ID de hoja de cálculo

async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
  });
  return auth;
}

async function getSheets() {
  const auth = await getAuthClient();
  return google.sheets({ version: 'v4', auth });
}

module.exports = {
  getSheets,
  SPREADSHEET_ID,
}; 