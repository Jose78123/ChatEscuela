import type React from "react"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <title>Chatbot de Orientación Estudiantil</title>
        <meta
          name="description"
          content="Chatbot para orientación de estudiantes sobre servicios escolares y rutas de titulación"
        />
      </head>
      <body>
        {children}
        <script src="/js/chatbot.js"></script>
      </body>
    </html>
  )
}
