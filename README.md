# 📚 StudyIA - Gestor de Estudio Inteligente

 
StudyIA es una aplicación Full Stack que utiliza Inteligencia Artificial para ayudar a los estudiantes a organizar su tiempo y optimizar su aprendizaje.

##  Características Principales

*   **Generación de Planes con IA:** Se integra con la API de Google Gemini (`gemini-3.6-flash`) para redactar un plan de estudio diario y estructurado, basándose en la fecha del examen, las horas disponibles por día y los temas a cubrir.
*   **Soporte Avanzado de Texto:** Renderiza respuestas en Markdown e interpreta ecuaciones matemáticas y fórmulas químicas complejas usando LaTeX (`remark-math` y `rehype-katex`).
*   **Gestión de Progreso:** Permite marcar temas como completados visualizando el avance en una barra de progreso en tiempo real.
*   **Edición Dinámica:** Al actualizar fechas, horas o temas, la aplicación le solicita automáticamente a la IA que regenere y actualice el plan de estudio.
*   **Exportación:** Posibilidad de imprimir o exportar el cronograma a PDF (`react-to-print`) manteniendo los estilos intactos.

## 💻 Tecnologías Utilizadas

**Frontend:**
*   React (con Vite)
*   Material UI (MUI) para el diseño
*   React Router DOM
*   React Markdown + Katex

**Backend:**
*   Node.js con Express
*   MongoDB (Mongoose)
*   Google Gen AI SDK (`@google/genai`)

## ⚙️ Instalación y Uso Local

1. Clonar el repositorio:
   \`\`\`bash
   git clone https://github.com/tu-usuario/studyia-codercup.git
   \`\`\`

2. **Configuración del Backend:**
   * Navegar a la carpeta `backend`: `cd backend`
   * Instalar dependencias: `npm install`
   * Crear un archivo `.env` en la raíz del backend con las siguientes variables:
     \`\`\`env
     PORT=5000
     MONGO_URI=tu_string_de_conexion_a_mongodb
     GEMINI_API_KEY=tu_api_key_de_google
     \`\`\`
   * Iniciar el servidor: `npm run dev`

3. **Configuración del Frontend:**
   * En otra terminal, navegar a la carpeta `frontend`: `cd frontend`
   * Instalar dependencias: `npm install`
   * Iniciar la aplicación: `npm run dev`

---
