
const Subject = require('../models/Subject');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI();

const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSubject = async (req, res) => {
    try {
        const { name, examDate, hoursPerDay, topics } = req.body;
        
        const topicsList = topics && topics.length > 0 ? topics.map(t => t.name).join(', ') : 'Temas generales';
        const prompt = `Actúa como un tutor académico experto. Crea un plan de estudio detallado día por día para la materia "${name}".
        - Fecha del examen: ${examDate}
        - Disponibilidad: ${hoursPerDay} horas por día
        - Temas a cubrir: ${topicsList}
        Organiza el contenido lógicamente.`;

        let studyPlanText = "No se pudo generar el plan de estudio automáticamente.";

        try {
            console.log("Intentando conectar con Gemini...");
            const response = await ai.models.generateContent({
                model: 'gemini-3.6-flash', 
                contents: prompt,
            });
            studyPlanText = response.text;
            console.log("¡Plan generado con éxito!");
        } catch (aiError) {
            console.error("❌ ERROR DETALLADO DE GEMINI:", aiError);
        }

        const newSubject = await Subject.create({
            name,
            examDate,
            hoursPerDay,
            topics,
            studyPlan: studyPlanText
        });

        res.status(201).json(newSubject);
    } catch (error) {
        console.error("❌ Error en el servidor al crear materia:", error);
        res.status(400).json({ message: error.message });
    }
};

const getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una materia
const deleteSubject = async (req, res) => {
    try {
        const deleted = await Subject.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }
        res.status(200).json({ message: 'Materia eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cambiar estado de un tema (completado/pendiente)
const toggleTopic = async (req, res) => {
    try {
        const { subjectId, topicId } = req.params;
        const subject = await Subject.findById(subjectId);
        if (!subject) return res.status(404).json({ message: 'Materia no encontrada' });

        const topic = subject.topics.id(topicId);
        if (!topic) return res.status(404).json({ message: 'Tema no encontrado' });

        topic.completed = !topic.completed; 
        await subject.save();
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSubject = async (req, res) => {
    try {
        const { name, examDate, hoursPerDay, topics } = req.body;
        
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }

        // 1. Actualizamos los datos básicos
        subject.name = name || subject.name;
        subject.examDate = examDate || subject.examDate;
        subject.hoursPerDay = hoursPerDay || subject.hoursPerDay;
        
        if (topics) {
            subject.topics = topics;
        }

        // 2. Volvemos a pedirle a Gemini que genere el plan con los nuevos datos
        const topicsList = subject.topics && subject.topics.length > 0 
            ? subject.topics.map(t => t.name).join(', ') 
            : 'Temas generales';
            
        const prompt = `Actúa como un tutor académico experto. Crea un plan de estudio detallado día por día para la materia "${subject.name}".
        - Fecha del examen: ${subject.examDate}
        - Disponibilidad: ${subject.hoursPerDay} horas por día
        - Temas a cubrir: ${topicsList}
        Organiza el contenido lógicamente.`;

        try {
            console.log("Regenerando plan con Gemini tras edición...");
            const response = await ai.models.generateContent({
                model: 'gemini-3.6-flash',
                contents: prompt,
            });
            subject.studyPlan = response.text;
            console.log("¡Plan actualizado con éxito!");
        } catch (aiError) {
            console.error("❌ ERROR AL REGENERAR EL PLAN:", aiError);
        }

        // 3. Guardamos los cambios
        await subject.save();
        res.status(200).json(subject);
    } catch (error) {
        console.error("❌ Error en el servidor al actualizar materia:", error);
        res.status(400).json({ message: error.message });
    }
};
module.exports = {
    getSubjects,
    createSubject,
    getSubjectById,
    deleteSubject,
    toggleTopic,
    updateSubject 
};