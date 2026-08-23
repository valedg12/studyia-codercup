const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Conecta usando la variable de entorno
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error de conexión a MongoDB: ${error.message}`);
        // Detiene el servidor si la base de datos falla
        process.exit(1); 
    }
};

module.exports = connectDB;