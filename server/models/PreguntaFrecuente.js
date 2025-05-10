const mongoose = require("mongoose")

const PreguntaFrecuenteSchema = new mongoose.Schema({
  pregunta: {
    type: String,
    required: true,
    trim: true,
  },
  respuesta: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
    enum: ["titulacion", "servicios", "tramites", "general"],
  },
  palabrasClave: [
    {
      type: String,
      lowercase: true,
      trim: true,
    },
  ],
  contador: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Middleware para actualizar la fecha de modificación
PreguntaFrecuenteSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model("PreguntaFrecuente", PreguntaFrecuenteSchema)
