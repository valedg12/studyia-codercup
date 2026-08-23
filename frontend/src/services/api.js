
const API_URL = 'http://localhost:5000/api';

export const getSubjects = async () => {
    try {
        const response = await fetch(`${API_URL}/subjects`);
        if (!response.ok) throw new Error('Error al obtener materias');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const createSubject = async (subjectData) => {
    try {
        const response = await fetch(`${API_URL}/subjects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subjectData)
        });
        if (!response.ok) throw new Error('Error al crear materia');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Obtener una materia por su ID
export const getSubjectById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/subjects/${id}`);
        if (!response.ok) throw new Error('Error al obtener la materia');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteSubject = async (id) => {
    try {
        const response = await fetch(`${API_URL}/subjects/${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const toggleTopicStatus = async (subjectId, topicId) => {
    try {
        const response = await fetch(`${API_URL}/subjects/${subjectId}/topics/${topicId}`, {
            method: 'PATCH',
        });
        if (!response.ok) throw new Error('Error al actualizar el tema');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Actualizar una materia existente
export const updateSubject = async (id, updatedData) => {
    try {
        const response = await fetch(`${API_URL}/subjects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) throw new Error('Error al actualizar la materia');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};