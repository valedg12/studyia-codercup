import { useEffect, useState, useRef } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox, Divider, LinearProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
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
        if (updatedSubject) setSubject(updatedSubject);
    };

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: subject ? `Plan - ${subject.name}` : 'Plan de Estudio',
    });

    if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box>;
    if (!subject) return <Container sx={{ mt: 5, textAlign: 'center' }}><Typography color="error">Materia no encontrada.</Typography></Container>;

    const totalTopics = subject.topics?.length || 0;
    const completedTopics = subject.topics?.filter(t => t.completed)?.length || 0;
    const progressPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 5, px: { xs: 2, sm: 3 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                <Button variant="outlined" onClick={() => navigate('/')}>← Volver</Button>
                <Box display="flex" gap={1}>
                    <Button variant="outlined" color="primary" onClick={() => navigate(`/edit/${id}`)}>✏️ Editar</Button>
                    <Button variant="contained" color="secondary" onClick={handlePrint}>🖨️ PDF</Button>
                </Box>
            </Box>
            
            <div ref={printRef}>
                <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, mb: 4 }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>{subject.name}</Typography>
                    <Typography color="textSecondary">Examen: {new Date(subject.examDate).toLocaleDateString()}</Typography>
                    <Typography color="textSecondary" gutterBottom>Disponibilidad: {subject.hoursPerDay} hs/día</Typography>

                    <Box sx={{ mt: 3, mb: 2 }}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" fontWeight="bold" color="textSecondary">Progreso</Typography>
                            <Typography variant="body2" fontWeight="bold" color="primary">{progressPercentage}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={progressPercentage} sx={{ height: 10, borderRadius: 5 }} />
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" fontWeight="bold">Temas:</Typography>
                        <List dense>
                            {subject.topics?.map((topic) => (
                                <ListItem key={topic._id} disablePadding>
                                    <ListItemButton onClick={() => handleToggle(topic._id)}>
                                        <ListItemIcon><Checkbox checked={topic.completed} disableRipple /></ListItemIcon>
                                        <ListItemText primary={topic.name} sx={{ textDecoration: topic.completed ? 'line-through' : 'none' }}/>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Paper>

                <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, bgcolor: '#faf5ff' }}>
                    <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>Plan IA 🤖</Typography>
                    <Divider sx={{ mb: 3 }} />
                    {subject.studyPlan ? (
                        <Box sx={{ lineHeight: 1.7 }}>
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {subject.studyPlan}
                            </ReactMarkdown>
                        </Box>
                    ) : (
                        <Typography color="textSecondary">Aún no se generó el plan.</Typography>
                    )}
                </Paper>
            </div>
        </Container>
    );
};

export default SubjectDetail;