
const express = require('express');
const router = express.Router();
const { 
    getSubjects, 
    createSubject, 
    getSubjectById, 
    deleteSubject, 
    toggleTopic,
    updateSubject
} = require('../controllers/subjectController');

router.get('/', getSubjects);
router.post('/', createSubject);
router.get('/:id', getSubjectById);
router.delete('/:id', deleteSubject); 
router.patch('/:subjectId/topics/:topicId', toggleTopic);
router.put('/:id', updateSubject); 

module.exports = router;