import { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, Card, CardContent, CircularProgress, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getSubjects, deleteSubject } from '../services/api'; 

const Dashboard = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            const data = await getSubjects();
            setSubjects(data || []);
        } catch (error) {
            console.error("Error al cargar materias", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que querés eliminar esta materia?')) {
            await deleteSubject(id);
            setSubjects(subjects.filter(subject => subject._id !== id));
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
            <Box display="flex" flexDirection="column" alignItems="flex-start" mb={4}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Mis Materias
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => navigate('/new')}
                >
                    + NUEVA MATERIA
                </Button>
            </Box>

            {subjects.length === 0 ? (
                <Typography variant="h6" color="textSecondary">
                    No tenés materias cargadas. ¡Creá una para empezar a estudiar!
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {subjects.map((subject) => (
                        <Grid item xs={12} sm={6} md={4} key={subject._id}>
                            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        {subject.name}
                                    </Typography>
                                    <Typography color="textSecondary" gutterBottom>
                                        Examen: {subject.examDate ? new Date(subject.examDate).toLocaleDateString() : 'Sin fecha'}
                                    </Typography>
                                    <Typography color="textSecondary" mb={2}>
                                        Disponibilidad: {subject.hoursPerDay} hs/día
                                    </Typography>
                                    
                                    <Box display="flex" flexDirection="column" gap={1} mt={2}>
                                        {/* ¡ACÁ ESTÁ EL BOTÓN PARA VER EL PLAN DE IA! */}
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            fullWidth
                                            onClick={() => navigate(`/subject/${subject._id}`)}
                                        >
                                            VER PLAN 🚀
                                        </Button>
                                        <Button 
                                            variant="outlined" 
                                            color="error" 
                                            fullWidth
                                            onClick={() => handleDelete(subject._id)}
                                        >
                                            ELIMINAR
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default Dashboard;