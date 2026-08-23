// Archivo: frontend/src/pages/NewSubject.jsx
import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createSubject } from '../services/api';

const NewSubject = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [examDate, setExamDate] = useState('');
    const [hoursPerDay, setHoursPerDay] = useState('');
    const [topicInput, setTopicInput] = useState('');
    const [topics, setTopics] = useState([]);

    const handleAddTopic = () => {
        if (topicInput.trim() !== '') {
            setTopics([...topics, { name: topicInput }]);
            setTopicInput('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newSubject = { name, examDate, hoursPerDay: Number(hoursPerDay), topics };
        const result = await createSubject(newSubject);
        if (result) {
            navigate('/'); 
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: { xs: 2, sm: 5 }, px: { xs: 2, sm: 3 } }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                    Nueva Materia
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
                    <TextField 
                        label="Nombre de la Materia" 
                        placeholder="Ej: Desarrollo Backend"
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

                    <Box sx={{ border: '1px solid #c4c4c4', p: 2, borderRadius: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="textSecondary">
                            Temas a estudiar
                        </Typography>
                        <Box display="flex" gap={1} flexWrap={{ xs: 'wrap', sm: 'nowrap' }}>
                            <TextField 
                                size="small"
                                fullWidth
                                variant="outlined"
                                placeholder="Ej: Creación de servidores"
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
                                <ListItem key={index} sx={{ bgcolor: '#f5f5f5', mt: 1, borderRadius: 1 }}>
                                    <ListItemText primary={topic.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
                        Guardar y Generar Plan
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default NewSubject;