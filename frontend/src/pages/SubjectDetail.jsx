// Archivo: frontend/src/pages/SubjectDetail.jsx
import { useEffect, useState, useRef } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox, Divider, LinearProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';       // <-- Plugin para leer matemáticas
import rehypeKatex from 'rehype-katex';     // <-- Plugin para renderizar matemáticas
import 'katex/dist/katex.min.css';          // <-- Estilos CSS para las fórmulas
import { useReactToPrint } from 'react-to-print';
import { getSubjectById, toggleTopicStatus } from '../services/api';

const SubjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState(null);
    const [loading, setLoading] = useState(true);

    const printRef = useRef();

    useEffect(() => {
        getSubjectById(id).then(data => {
            setSubject(data);
            setLoading(false);
        });
    }, [id]);

    const handleToggle = async (topicId) => {
        const updatedSubject = await toggleTopicStatus(id, topicId);
        if (updatedSubject) {
            setSubject(updatedSubject);
        }
    };

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: subject ? `Plan de Estudio - ${subject.name}` : 'Plan de Estudio',
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!subject) {
        return (
            <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center' }}>
                <Typography variant="h5" color="error">No se encontró la materia.</Typography>
                <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/')}>Volver al Dashboard</Button>
            </Container>
        );
    }

    const totalTopics = subject.topics?.length || 0;
    const completedTopics = subject.topics?.filter(t => t.completed)?.length || 0;
    const progressPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 5, px: { xs: 2, sm: 3 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                <Button variant="outlined" onClick={() => navigate('/')}>
                    ← Volver
                </Button>
                <Box display="flex" gap={1}>
                    <Button variant="outlined" color="primary" onClick={() => navigate(`/edit/${id}`)}>
                        ✏️ Editar Materia
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handlePrint}>
                        🖨️ Imprimir / Guardar PDF
                    </Button>
                </Box>
            </Box>
            
            <div ref={printRef}>
                <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, mb: 4 }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' } }}>
                        {subject.name}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        Fecha del Examen: {new Date(subject.examDate).toLocaleDateString()}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1" gutterBottom>
                        Disponibilidad: {subject.hoursPerDay} horas diarias
                    </Typography>

                    <Box sx={{ mt: 3, mb: 2 }}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" fontWeight="bold" color="textSecondary">
                                Progreso de estudio
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                                {progressPercentage}% completado
                            </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={progressPercentage} sx={{ height: 10, borderRadius: 5 }} />
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" fontWeight="bold">Temas principales:</Typography>
                        <List dense>
                            {subject.topics?.map((topic) => (
                                <ListItem key={topic._id} disablePadding>
                                    <ListItemButton onClick={() => handleToggle(topic._id)}>
                                        <ListItemIcon>
                                            <Checkbox edge="start" checked={topic.completed} tabIndex={-1} disableRipple />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={topic.name} 
                                            sx={{ textDecoration: topic.completed ? 'line-through' : 'none', color: topic.completed ? 'text.secondary' : 'text.primary' }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Paper>

                <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, bgcolor: '#faf5ff' }}>
                    <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                        Plan de Estudio de la IA 🤖
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    {subject.studyPlan ? (
                        <Box sx={{ 
                            lineHeight: 1.7, 
                            '& h1, & h2, & h3, & h4': { mt: 3, mb: 1, fontWeight: 'bold', color: '#374151' }, 
                            '& ul, & ol': { pl: 3, mb: 2 },
                            '& p': { mb: 2 } 
                        }}>
                            <ReactMarkdown 
                                remarkPlugins={[remarkMath]} 
                                rehypePlugins={[rehypeKatex]}
                            >
                                {subject.studyPlan}
                            </ReactMarkdown>
                        </Box>
                    ) : (
                        <Typography color="textSecondary">
                            Aún no se ha generado un plan de estudio para esta materia.
                        </Typography>
                    )}
                </Paper>
            </div>
        </Container>
    );
};

export default SubjectDetail;