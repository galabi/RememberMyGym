import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Popular exercises organized by muscle group
const POPULAR_EXERCISES = {
    'Chest': ['Bench Press', 'Chest Press', 'Incline Press', 'Decline Press', 'Flye', 'Push-ups'],
    'Legs': ['Leg Press', 'Squat', 'Leg Extension', 'Leg Curl', 'Bulgarian Split Squat', 'Lunges'],
    'Glutes': ['Hip Thrust', 'Leg Press', 'Smith Machine Squat', 'Step-ups', 'Glute Bridge', 'Cable Pull-through'],
    'Back/Arms': ['Lat Pulldown', 'Bicep Curl', 'Tricep Extension', 'Deadlift', 'Shoulder Press', 'Rows', 'Pull-ups', 'Dips']
};

export default function ExerciseSelector({ userId, onExercisesUpdated }) {
    const [userExercises, setUserExercises] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('Chest');

    const fetchUserExercises = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/exercises/user/${userId}`);
            setUserExercises(response.data);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    };

    // Fetch user's exercises on mount
    useEffect(() => {
        fetchUserExercises();
    }, [userId, fetchUserExercises]);

    const handleAddExercise = async (exerciseName) => {
        try {
            await axios.post(`${API_BASE_URL}/api/exercises/add`, {
                user_id: userId,
                exercise_name: exerciseName,
                muscle_group: selectedMuscleGroup
            });
            await fetchUserExercises();
            if (onExercisesUpdated) onExercisesUpdated();
        } catch (error) {
            console.error('Error adding exercise:', error);
            alert('Exercise already added or error occurred');
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
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            width: '100%',
            maxWidth: '500px'
        },
        modalHeader: {
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '20px',
            color: '#1c1c1e'
        },
        muscleGroupTabs: {
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
            overflowX: 'auto',
            paddingBottom: '8px'
        },
        tab: {
            padding: '10px 16px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: '#f2f2f7',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s'
        },
        activeTab: {
            backgroundColor: '#007aff',
            color: 'white'
        },
        exerciseList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '16px'
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
            color: '#1c1c1e'
        },
        addExerciseBtn: {
            backgroundColor: '#34C759',
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
            <button 
                style={styles.addButton}
                onClick={() => setShowModal(true)}
                title="Add Exercise"
            >
                +
            </button>

            {showModal && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>Add Exercise</div>

                        <div style={styles.muscleGroupTabs}>
                            {Object.keys(POPULAR_EXERCISES).map(group => (
                                <button
                                    key={group}
                                    onClick={() => setSelectedMuscleGroup(group)}
                                    style={{
                                        ...styles.tab,
                                        ...(selectedMuscleGroup === group ? styles.activeTab : {})
                                    }}
                                >
                                    {group}
                                </button>
                            ))}
                        </div>

                        <div style={styles.exerciseList}>
                            {POPULAR_EXERCISES[selectedMuscleGroup].map(exercise => {
                                const isAdded = userExercises.some(ex => ex.name === exercise);
                                return (
                                    <div key={exercise} style={styles.exerciseItem}>
                                        <span style={styles.exerciseName}>{exercise}</span>
                                        {isAdded ? (
                                            <button 
                                                onClick={() => handleRemoveExercise(exercise)}
                                                style={{
                                                    ...styles.addExerciseBtn,
                                                    backgroundColor: '#ff3b30'
                                                }}
                                            >
                                                Remove
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleAddExercise(exercise)}
                                                style={styles.addExerciseBtn}
                                            >
                                                Add
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <button 
                            onClick={() => setShowModal(false)}
                            style={styles.closeButton}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
