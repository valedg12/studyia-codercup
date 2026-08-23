
import { useEffect, useState } from 'react';
import { Container, Typography, Button, Card, CardContent, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getSubjects, deleteSubject } from '../services/api';

const Dashboard = () => {
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = () => {
        getSubjects().then(data => setSubjects(data));
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Evita que al hacer clic en borrar se abra la tarjeta
        if (window.confirm('¿Estás seguro de eliminar esta materia?')) {
            const success = await deleteSubject(id);
            if (success) {
                loadSubjects();
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 5, px: { xs: 2, sm: 3 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
                <Typography variant="h3" fontWeight="bold" sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}>
                    Mis Materias
                </Typography>
                <Button variant="contained" color="primary" size="large" onClick={() => navigate('/new')}>
                    + Nueva Materia
                </Button>
            </Box>

            <Grid container spacing={3}>
                {subjects.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography variant="h6" color="textSecondary" textAlign="center" sx={{ mt: 5 }}>
                            No tienes materias guardadas. ¡Empieza creando tu primer plan de estudio!
                        </Typography>
                    </Grid>
                ) : (
                    subjects.map((subject) => (
                        <Grid item xs={12} sm={6} md={4} key={subject._id}>
                            <Card 
                                elevation={3} 
                                onClick={() => navigate(`/subject/${subject._id}`)}
                                sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: '0.2s',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                        <Typography variant="h5">
                                            {subject.name}
                                        </Typography>
                                        <Button 
                                            variant="outlined" 
                                            color="error" 
                                            size="small" 
                                            onClick={(e) => handleDelete(e, subject._id)}
                                            sx={{ minWidth: 'auto', px: 1, py: 0.5, fontSize: '0.75rem' }}
                                        >
                                            Eliminar
                                        </Button>
                                    </Box>
                                    <Typography color="textSecondary">
                                        Examen: {new Date(subject.examDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Disponibilidad: {subject.hoursPerDay} hs/día
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
};

export default Dashboard;