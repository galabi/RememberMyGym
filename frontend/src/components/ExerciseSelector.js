import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CATEGORY_ICONS = {
    'Chest': '💪',
    'Back': '🔙',
    'Arms': '🦾',
    'Legs': '🦵',
    'Glutes': '🍑',
    'Core': '🫀'
};

const PREDEFINED_CATEGORIES = [
    'Chest', 
    'Back', 
    'Arms', 
    'Legs', 
    'Glutes', 
    'Core'
];

export default function ExerciseSelector({ userId, onExercisesUpdated }) {
    const [userExercises, setUserExercises] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const [customCategory, setCustomCategory] = useState('');
    const [customExercise, setCustomExercise] = useState('');

    const fetchUserExercises = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/exercises/user/${userId}`);
            setUserExercises(response.data);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    }, [userId]);

    useEffect(() => {
        fetchUserExercises();
    }, [fetchUserExercises]);

    const handleAddExercise = async () => {
        if (!customCategory.trim() || !customExercise.trim()) {
            alert('Please select a category and enter an exercise name');
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/api/exercises/add`, {
                user_id: userId,
                exercise_name: customExercise,
                muscle_group: customCategory
            });
            
            setCustomCategory('');
            setCustomExercise('');
            
            await fetchUserExercises();
            if (onExercisesUpdated) onExercisesUpdated();
        } catch (error) {
            console.error('Error adding exercise:', error);
            alert('Exercise already exists or an error occurred');
        }
    };

    const handleRemoveExercise = async (exerciseName) => {
        try {
            await axios.post(`${API_BASE_URL}/api/exercises/remove`, {
                user_id: userId,
                exercise_name: exerciseName
            });
            await fetchUserExercises();
            if (onExercisesUpdated) onExercisesUpdated();
        } catch (error) {
            console.error('Error removing exercise:', error);
        }
    };

const styles = {
    addButton: {
        backgroundColor: '#007aff',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        fontSize: '24px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)'
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '20px',
        maxHeight: 'calc(100svh - 100px)',
        overflowY: 'auto',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        width: '90%',
        marginBottom: '80px',
        maxWidth: '500px',
        position: 'relative'
    },
    modalHeader: {
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '20px',
        color: '#1c1c1e'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '20px'
    },
    input: {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #e5e5ea',
        fontSize: '16px',
        backgroundColor: '#f9f9fb',
        outline: 'none',
        textAlign: 'left'
    },
    submitBtn: {
        backgroundColor: '#34C759',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '5px'
    },
    exerciseList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginTop: '20px',
        borderTop: '1px solid #e5e5ea',
        paddingTop: '15px',
        textAlign: 'left'
    },
    exerciseItem: {
        padding: '12px',
        backgroundColor: '#f9f9fb',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #e5e5ea'
    },
    exerciseName: {
        fontWeight: '600',
        color: '#1c1c1e',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left'
    },
    exerciseCategory: {
        fontSize: '12px',
        color: '#8e8e93',
        marginTop: '4px'
    },
    removeBtn: {
        backgroundColor: '#ff3b30',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '6px 12px',
        fontSize: '12px',
        cursor: 'pointer'
    },
    closeButton: {
        backgroundColor: '#f2f2f7',
        color: '#333',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '16px',
        width: '100%'
    }
};

    return (
        <>
            <button style={styles.addButton} onClick={() => setShowModal(true)} title="Add Exercise">
                +
            </button>

            {showModal && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>Add New Exercise</div>

                        <div style={styles.inputGroup}>
                            
                            <div style={{ position: 'relative', width: '100%' }}>
                                <div 
                                    style={{ ...styles.input, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <span style={{ color: customCategory ? '#1c1c1e' : '#8e8e93' }}>
                                        {customCategory ? `${CATEGORY_ICONS[customCategory]} ${customCategory}` : 'Select Category...'}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#007aff' }}>{isDropdownOpen ? '▲' : '▼'}</span>
                                </div>

                                {isDropdownOpen && (
                                    <div style={{
                                        position: 'absolute', top: '100%', left: 0, right: 0, 
                                        backgroundColor: '#fff', border: '1px solid #e5e5ea', borderRadius: '8px',
                                        marginTop: '4px', zIndex: 3000, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        maxHeight: '200px', overflowY: 'auto'
                                    }}>
                                        {PREDEFINED_CATEGORIES.map(category => (
                                            <div 
                                                key={category}
                                                onClick={() => {
                                                    setCustomCategory(category);
                                                    setIsDropdownOpen(false);
                                                }}
                                                style={{
                                                    padding: '12px', cursor: 'pointer', fontSize: '16px',
                                                    borderBottom: '1px solid #f2f2f7', textAlign: 'left',
                                                    backgroundColor: customCategory === category ? '#f2f2f7' : 'transparent'
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#f2f2f7'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = customCategory === category ? '#f2f2f7' : 'transparent'}
                                            >
                                                <span>{CATEGORY_ICONS[category]} {category}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <input 
                                style={styles.input}
                                type="text"
                                placeholder="Exercise Name"
                                value={customExercise}
                                onChange={(e) => setCustomExercise(e.target.value)}
                            />
                            <button style={styles.submitBtn} onClick={handleAddExercise}>
                                Add to List
                            </button>
                        </div>

                        {userExercises.length > 0 && (
                            <div style={styles.exerciseList}>
                                <div style={{fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#8e8e93'}}>
                                    My Exercises:
                                </div>
                                {userExercises.map(ex => (
                                    <div key={ex.name} style={styles.exerciseItem}>
                                        <div style={styles.exerciseName}>
                                            <span>{CATEGORY_ICONS[ex.muscleGroup]} {ex.name}</span>
                                            <span style={styles.exerciseCategory}>{ex.muscleGroup}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleRemoveExercise(ex.name)}
                                            style={styles.removeBtn}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button onClick={() => setShowModal(false)} style={styles.closeButton}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}