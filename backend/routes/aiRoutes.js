// Archivo: backend/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const { generateStudyPlan } = require('../controllers/aiController');

// Ruta para pedirle el plan a la IA: POST /api/ai/generate-plan
router.post('/generate-plan', generateStudyPlan);

module.exports = router;