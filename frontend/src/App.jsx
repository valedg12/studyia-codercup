// Archivo: frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Dashboard from './pages/Dashboard';
import NewSubject from './pages/NewSubject';
import SubjectDetail from './pages/SubjectDetail'; 
import EditSubject from './pages/EditSubject';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#4f46e5' },
        secondary: { main: '#ec4899' },
        background: { default: '#f3f4f6' },
    },
    typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> 
            <Router>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/new" element={<NewSubject />} />
                    <Route path="/subject/:id" element={<SubjectDetail />} />
                    <Route path="/edit/:id" element={<EditSubject />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;