const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    // Usar directamente la URL de conexión de MongoDB Atlas que copiaste
    const mongoURI = "mongodb+srv://josecaballerodiaz92:6CuyhvVGUsHmWkd1@cluster0.iqsosyj.mongodb.net/?retryWrites=true&w=majority&appName=chatbot_database"
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`MongoDB conectado: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error al conectar a MongoDB: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB