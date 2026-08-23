
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// 1. Cargar variables de entorno
dotenv.config();

// 2. Conectar a la base de datos
connectDB();

// 3. Inicializar Express
const app = express();

// 4. Middlewares globales
app.use(cors()); // Permite peticiones desde el frontend (React)
app.use(express.json()); // Permite leer datos en formato JSON (req.body)

// 5. Rutas de la API
app.use('/api/subjects', require('./routes/subjectRoutes')); // Rutas para las materias
app.use('/api/ai', require('./routes/aiRoutes'));           // Rutas para la Inteligencia Artificial

// 6. Ruta de prueba básica
app.get('/', (req, res) => {
    res.send('API de StudyIA funcionando perfectamente ');
});

// 7. Arrancar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});