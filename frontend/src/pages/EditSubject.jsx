
import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectById, updateSubject } from '../services/api';

const EditSubject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [examDate, setExamDate] = useState('');
    const [hoursPerDay, setHoursPerDay] = useState('');
    
    // Estados para manejar los temas
    const [topics, setTopics] = useState([]);
    const [topicInput, setTopicInput] = useState('');
    
    // Estado para saber si estamos esperando a la IA
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        getSubjectById(id).then(data => {
            if (data) {
                setName(data.name);
                setExamDate(data.examDate ? data.examDate.split('T')[0] : '');
                setHoursPerDay(data.hoursPerDay);
                setTopics(data.topics || []);
            }
        });
    }, [id]);

    const handleAddTopic = () => {
        if (topicInput.trim() !== '') {
            // Agregamos el tema conservando la estructura original
            setTopics([...topics, { name: topicInput, completed: false }]);
            setTopicInput('');
        }
    };

    const handleRemoveTopic = (indexToRemove) => {
        // Filtramos para eliminar el tema seleccionado
        setTopics(topics.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true); // Desactivamos el botón mientras Gemini piensa
        
        const updatedData = { name, examDate, hoursPerDay: Number(hoursPerDay), topics };
        const result = await updateSubject(id, updatedData);
        
        setIsSaving(false);
        if (result) {
            navigate(`/subject/${id}`);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: { xs: 2, sm: 5 }, px: { xs: 2, sm: 3 }, mb: 5 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Editar Materia
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
                    <TextField 
                        label="Nombre de la Materia" 
                        variant="outlined" 
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required 
                    />
                    
                    <Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1, ml: 1 }}>
                            Fecha del Examen *
                        </Typography>
                        <TextField 
                            type="date" 
                            variant="outlined"
                            fullWidth
                            value={examDate}
                            onChange={(e) => setExamDate(e.target.value)}
                            required 
                        />
                    </Box>
                    
                    <TextField 
                        label="Horas de estudio por día" 
                        type="number" 
                        variant="outlined"
                        fullWidth
                        InputProps={{ inputProps: { min: 1, max: 24 } }}
                        value={hoursPerDay}
                        onChange={(e) => setHoursPerDay(e.target.value)}
                        required 
                    />

                    {/* SECCIÓN DE TEMAS */}
                    <Box sx={{ border: '1px solid #c4c4c4', p: 2, borderRadius: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="textSecondary">
                            Temas a estudiar
                        </Typography>
                        <Box display="flex" gap={1} flexWrap={{ xs: 'wrap', sm: 'nowrap' }}>
                            <TextField 
                                size="small"
                                fullWidth
                                variant="outlined"
                                placeholder="Ej: Nueva unidad..."
                                value={topicInput}
                                onChange={(e) => setTopicInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTopic())}
                            />
                            <Button variant="contained" color="secondary" onClick={handleAddTopic} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                                Agregar
                            </Button>
                        </Box>
                        
                        <List dense>
                            {topics.map((topic, index) => (
                                <ListItem 
                                    key={index} 
                                    sx={{ bgcolor: '#f5f5f5', mt: 1, borderRadius: 1 }}
                                    secondaryAction={
                                        <Button 
                                            color="error" 
                                            onClick={() => handleRemoveTopic(index)}
                                            sx={{ minWidth: 'auto', p: 1, fontSize: '1rem' }}
                                        >
                                            ❌
                                        </Button>
                                    }
                                >
                                    <ListItemText primary={topic.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    <Box display="flex" gap={2} mt={2}>
                        <Button 
                            variant="outlined" 
                            color="inherit" 
                            fullWidth 
                            onClick={() => navigate(`/subject/${id}`)}
                            disabled={isSaving}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            fullWidth
                            disabled={isSaving}
                        >
                            {isSaving ? 'Regenerando plan...' : 'Guardar Cambios'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default EditSubject;