const mongoose = require("mongoose")

const ServicioEscolarSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  ubicacion: {
    type: String,
    required: true,
  },
  horario: {
    type: String,
    required: true,
  },
  contacto: {
    type: String,
  },
  tramites: [
    {
      type: String,
    },
  ],
  requisitosGenerales: [
    {
      type: String,
    },
  ],
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
ServicioEscolarSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model("ServicioEscolar", ServicioEscolarSchema)
