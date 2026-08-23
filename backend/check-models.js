require('dotenv').config();

const checkearModelos = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        console.log("❌ No se encontró la API Key en el archivo .env");
        return;
    }

    console.log("🔍 Consultando a Google los modelos habilitados para tu cuenta...\n");
    
    try {
        const respuesta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const datos = await respuesta.json();
        
        if (datos.error) {
            console.error(" Error de la API:", datos.error.message);
            return;
        }

        console.log(" MODELOS DISPONIBLES PARA GENERAR TEXTO:");
        console.log("===========================================");
        
        datos.models.forEach(modelo => {
            // Filtramos solo los que sirven para generar contenido
            if (modelo.supportedGenerationMethods.includes("generateContent")) {
                // Limpiamos el texto para que solo te muestre el nombre exacto que necesitamos
                console.log(`-> "${modelo.name.replace('models/', '')}"`);
            }
        });
        console.log("===========================================\n");

    } catch (error) {
        console.error(" Error de conexión:", error.message);
    }
};

checkearModelos();