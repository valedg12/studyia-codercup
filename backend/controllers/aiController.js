// Archivo: backend/controllers/aiController.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializamos el SDK con la clave secreta de tu .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateStudyPlan = async (req, res) => {
    try {
        const { subjectName, examDate, hoursPerDay, topics } = req.body;

        // Calculamos cuántos días faltan para el examen
        const daysUntilExam = Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24));

        // Extraemos solo los nombres de los temas para pasárselos a la IA
        const topicNames = topics.map(t => t.name).join(', ');

        // Armamos el "Prompt" (las instrucciones para la IA)
        const prompt = `
        Actúa como un profesor y planificador de estudios experto. 
        Tengo un examen de la materia "${subjectName}" en ${daysUntilExam} días. 
        Puedo dedicarle ${hoursPerDay} horas por día.
        Los temas que debo estudiar son: ${topicNames}.
        
        Por favor, genera un plan de estudio estructurado día por día.
        Distribuye los temas lógicamente. Si sobran días, incluye días de repaso general.
        Devuelve el plan con un formato claro utilizando viñetas y negritas.
        `;

        // Llamamos al modelo de IA
        const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Le enviamos la respuesta de la IA al Frontend
        res.status(200).json({ plan: text });

    } catch (error) {
        console.error("Error con la IA:", error);
        res.status(500).json({ message: 'Error al generar el plan de estudio' });
    }
};

module.exports = {
    generateStudyPlan
};