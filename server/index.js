const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const apiRoutes = require("./routes/api")
const infoRoutes = require("./routes/infoRoutes")
const path = require('path');

// Cargar variables de entorno
dotenv.config()

// Conectar a la base de datos
connectDB()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Rutas
app.use("/api", apiRoutes)
app.use("/info", infoRoutes)

//Usa la ruta correcta a tu frontend
app.use(express.static(path.join(__dirname, 'client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API del Chatbot de Orientación Estudiantil funcionando correctamente")
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`)
})
