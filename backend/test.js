// Archivo: backend/test.js

const probarIA = async () => {
    console.log("⏳ Enviando datos a la IA... (esto puede tardar unos segundos)");

    try {
        const respuesta = await fetch("http://localhost:5000/api/ai/generate-plan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subjectName: "Javascript y Backend",
                examDate: "2026-09-05", // Fecha en el futuro
                hoursPerDay: 2,
                topics: [
                    { name: "Variables y Funciones" },
                    { name: "Creación de servidores con Express" },
                    { name: "Bases de datos MongoDB" }
                ]
            })
        });

        const datos = await respuesta.json();
        
        console.log("\n========================================");
        console.log("✅ PLAN DE ESTUDIO GENERADO POR GEMINI:");
        console.log("========================================\n");
        console.log(datos.plan);

    } catch (error) {
        console.error("❌ Error en la prueba:", error);
    }
};

probarIA();