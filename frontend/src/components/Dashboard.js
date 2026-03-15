import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import MeasurementTracker from './MeasurementTracker';
import ExerciseSelector from './ExerciseSelector';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// הוצאנו את הסטייל החוצה כדי למנוע רינדור מחדש של התגית בכל פעם
const globalStyles = `
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type="number"] {
        -moz-appearance: textfield;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* מחליף את מניפולציית ה-DOM הישירה שהייתה קודם */
    .group-header {
        background-color: transparent;
        transition: background-color 0.2s ease;
    }
    .group-header:hover {
        background-color: #f2f2f7 !important;
    }
`;

const ExerciseModal = ({ isOpen, exercise, lastRecord, onClose, onSave }) => {
    const [formData, setFormData] = useState({ weight: '', reps: '', sets: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFormData({
                weight: lastRecord?.weight || '',
                reps: lastRecord?.reps || '',
                sets: lastRecord?.sets || ''
            });
            setErrorMsg(''); // איפוס שגיאות בפתיחה מחדש
        }
    }, [isOpen, lastRecord]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        // ולידציה בסיסית לפני שליחה לשרת
        if (!formData.weight || isNaN(formData.weight)) {
            setErrorMsg('Please enter a valid weight');
            return;
        }

        setIsSaving(true);
        try {
            await onSave(exercise, formData);
            onClose(); // סגירה רק אם השמירה הצליחה
        } catch (err) {
            setErrorMsg('Failed to save. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <h2 style={styles.modalTitle}>{exercise}</h2>
                    <button onClick={onClose} style={styles.closeButton} disabled={isSaving}>✕</button>
                </div>

                {lastRecord && (
                    <div style={styles.lastRecordBox}>
                        <h3 style={styles.lastRecordTitle}>Last Record</h3>
                        <div style={styles.lastRecordContent}>
                            <div style={styles.recordItem}>
                                <span style={styles.recordLabel}>{lastRecord.weight}</span>
                                <span style={styles.recordUnit}>kg</span>
                            </div>
                            {lastRecord.reps && (
                                <div style={styles.recordItem}>
                                    <span style={styles.recordLabel}>{lastRecord.reps}</span>
                                    <span style={styles.recordUnit}>reps</span>
                                </div>
                            )}
                            {lastRecord.sets && (
                                <div style={styles.recordItem}>
                                    <span style={styles.recordLabel}>{lastRecord.sets}</span>
                                    <span style={styles.recordUnit}>sets</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <h3 style={styles.newRecordTitle}>New Record</h3>

                    {errorMsg && <div style={styles.errorMessage}>{errorMsg}</div>}

                    <div style={styles.rowContainer}>
                        <div style={styles.inputWrapper}>
                            <input 
                                style={styles.input} 
                                type="number" 
                                placeholder="0" 
                                value={formData.reps}
                                onChange={(e) => setFormData({...formData, reps: e.target.value})}
                                disabled={isSaving}
                            />
                            <span style={styles.unitLabel}>reps</span>
                        </div>
                        <div style={styles.inputWrapper}>
                            <input 
                                style={styles.input} 
                                type="number" 
                                placeholder="0" 
                                value={formData.sets}
                                onChange={(e) => setFormData({...formData, sets: e.target.value})}
                                disabled={isSaving}
                            />
                            <span style={styles.unitLabel}>sets</span>
                        </div>
                    </div>

                    <div style={styles.inputWrapper}>
                        <input 
                            style={styles.input} 
                            type="number" 
                            step="0.1"
                            placeholder="0" 
                            value={formData.weight}
                            onChange={(e) => setFormData({...formData, weight: e.target.value})}
                            required
                            disabled={isSaving}
                        />
                        <span style={styles.unitLabel}>kg</span>
                    </div>

                    <button type="submit" style={styles.saveButton} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Record'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const Dashboard = ({ user }) => {
    const [workouts, setWorkouts] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedGroup, setExpandedGroup] = useState(null);
    const [userExercises, setUserExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const muscleGroupIcons = {
        'Chest': '🏋️',
        'Legs': '🦵',
        'Glutes': '🍑',
        'Back/Arms': '💪'
    };

    const handleLogout = () => {
        ['user_id', 'full_name', 'isLoggedIn'].forEach(c => Cookies.remove(c));
        window.location.href = '/'; // עדיף ניתוב נקי יותר מ-reload אם אין לך React Router
    };

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [exercisesRes, workoutsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/exercises/user/${user._id}`),
                axios.get(`${API_BASE_URL}/api/workouts/${user._id}`)
            ]);
            setUserExercises(exercisesRes.data);
            setWorkouts(workoutsRes.data);
        } catch (err) {
            console.error("Error fetching data:", err);
            // אפשר להוסיף כאן התראת שגיאה למשתמש
        } finally {
            setIsLoading(false);
        }
    }, [user._id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getLastRecord = (exerciseName) => {
        // הפיכת המערך כדי למצוא את האימון האחרון שנוסף (במידה והשרת לא ממיין)
        return workouts.slice().reverse().find(w => w.exercise_name === exerciseName) || null;
    };

    const handleExerciseClick = (exercise) => {
        setSelectedExercise(exercise);
        setIsModalOpen(true);
    };

    const handleSaveRecord = async (exerciseName, formData) => {
        await axios.post(`${API_BASE_URL}/api/workouts/log`, {
            user_id: user._id,
            exercise_name: exerciseName,
            weight: Number(formData.weight),
            reps: formData.reps ? Number(formData.reps) : null,
            sets: formData.sets ? Number(formData.sets) : null
        });
        
        // רענון הרשומות לאחר שמירה מוצלחת
        const workoutsRes = await axios.get(`${API_BASE_URL}/api/workouts/${user._id}`);
        setWorkouts(workoutsRes.data);
    };

    return (
        <div style={styles.container}>
            <style>{globalStyles}</style>
            
            <header style={styles.header}>
                <div style={{ flex: 1 }}>
                    <h1 style={styles.title}>My Gym</h1>
                    <p style={styles.subtitle}>Track your workouts</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
                    <div style={styles.profileCircle}>{user.full_name ? user.full_name[0].toUpperCase() : 'U'}</div>
                </div>
            </header>

            <MeasurementTracker />

            <div style={{...styles.muscleGroupsContainer, position: 'relative', paddingBottom: '60px'}}>
                {isLoading ? (
                    <div style={{textAlign: 'center', padding: '40px', color: '#8e8e93'}}>
                        Loading your data...
                    </div>
                ) : userExercises.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '40px 20px', color: '#8e8e93'}}>
                        <p style={{fontSize: '16px', fontWeight: '600'}}>No exercises added yet</p>
                        <p style={{fontSize: '14px'}}>Click the + button to add exercises</p>
                    </div>
                ) : (
                    Object.keys(muscleGroupIcons).map(group => {
                        const groupExercises = userExercises.filter(ex => ex.muscleGroup === group);
                        if (groupExercises.length === 0) return null;
                        
                        return (
                            <div key={group} style={styles.groupCard}>
                                <button
                                    className="group-header"
                                    onClick={() => setExpandedGroup(expandedGroup === group ? null : group)}
                                    style={{
                                        ...styles.groupHeader,
                                        backgroundColor: expandedGroup === group ? '#f2f2f7' : ''
                                    }}
                                >
                                    <div style={styles.groupTitleContainer}>
                                        <span style={styles.groupIcon}>{muscleGroupIcons[group]}</span>
                                        <h2 style={styles.groupTitle}>{group}</h2>
                                    </div>
                                    <span style={{
                                        fontSize: '20px',
                                        color: '#007aff',
                                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        transform: expandedGroup === group ? 'rotate(180deg)' : 'rotate(0deg)'
                                    }}>▼</span>
                                </button>
                                
                                {expandedGroup === group && (
                                    <div style={styles.exercisesGrid}>
                                        {groupExercises.map(exercise => {
                                            const lastRecord = getLastRecord(exercise.name);
                                            return (
                                                <button
                                                    key={exercise.name}
                                                    onClick={() => handleExerciseClick(exercise.name)}
                                                    style={styles.exerciseButton}
                                                >
                                                    <span style={styles.exerciseName}>{exercise.name}</span>
                                                    {lastRecord && (
                                                        <span style={styles.exerciseWeight}>{lastRecord.weight} kg</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}

                <div style={{position: 'fixed', bottom: '30px', right: '30px', zIndex: 100}}>
                    <ExerciseSelector 
                        userId={user._id} 
                        onExercisesUpdated={fetchData}
                    />
                </div>
            </div>

            <ExerciseModal
                isOpen={isModalOpen}
                exercise={selectedExercise}
                lastRecord={selectedExercise ? getLastRecord(selectedExercise) : null}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveRecord}
            />
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f9f9fb',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        maxWidth: '430px',
        margin: '0 auto',
        boxSizing: 'border-box'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        marginTop: '10px'
    },
    title: {
        fontSize: '28px',
        fontWeight: '800',
        margin: 0,
        color: '#1c1c1e'
    },
    subtitle: {
        color: '#8e8e93',
        fontSize: '15px',
        marginTop: '2px'
    },
    logoutButton: {
        backgroundColor: '#ff3b30',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    profileCircle: {
        width: '40px',
        height: '40px',
        backgroundColor: '#007aff',
        borderRadius: '50%',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold'
    },
    muscleGroupsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    groupCard: {
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        marginBottom: '12px',
        overflow: 'hidden',
    },
    groupHeader: {
        border: 'none',
        width: '100%',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        borderRadius: '0',
        fontSize: '16px',
        fontWeight: '700',
        color: '#1c1c1e',
        userSelect: 'none'
    },
    groupTitle: {
        fontSize: '18px',
        fontWeight: '700',
        margin: 0,
        color: '#1c1c1e'
    },
    groupTitleContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    groupIcon: {
        fontSize: '24px',
        display: 'flex',
        alignItems: 'center'
    },
    exercisesGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '12px 20px 20px 20px',
        borderTop: '2px solid #e5e5ea',
        animation: 'slideDown 0.3s ease'
    },
    exerciseButton: {
        backgroundColor: '#f2f2f7',
        border: '1px solid #e5e5ea',
        borderRadius: '12px',
        padding: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        color: '#1c1c1e',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    exerciseName: {
        flex: 1,
        textAlign: 'left'
    },
    exerciseWeight: {
        fontSize: '14px',
        color: '#007aff',
        fontWeight: '700'
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
        zIndex: 1000
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '20px',
        width: '90%',
        maxWidth: '400px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '1px solid #e5e5ea'
    },
    modalTitle: {
        fontSize: '24px',
        fontWeight: '700',
        margin: 0,
        color: '#1c1c1e'
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#8e8e93'
    },
    lastRecordBox: {
        backgroundColor: '#e8f4ff',
        borderRadius: '12px',
        padding: '15px',
        marginBottom: '20px'
    },
    lastRecordTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#007aff',
        margin: '0 0 10px 0'
    },
    lastRecordContent: {
        display: 'flex',
        gap: '15px'
    },
    recordItem: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '4px'
    },
    recordLabel: {
        fontSize: '18px',
        fontWeight: '800',
        color: '#007aff'
    },
    recordUnit: {
        fontSize: '12px',
        color: '#007aff',
        fontWeight: '600'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    newRecordTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1c1c1e',
        margin: '0 0 10px 0'
    },
    rowContainer: {
        display: 'flex',
        gap: '12px'
    },
    inputWrapper: {
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        flex: 1
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid #e5e5ea',
        fontSize: '16px',
        backgroundColor: '#f2f2f7',
        boxSizing: 'border-box',
        outline: 'none',
    },
    unitLabel: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#8e8e93',
        fontWeight: '600',
        fontSize: '12px'
    },
    saveButton: {
        backgroundColor: '#34c759',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        padding: '14px',
        fontWeight: '700',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '10px'
    },
    errorMessage: {
        color: '#ff3b30',
        fontSize: '13px',
        fontWeight: '500',
        marginBottom: '5px'
    }
};

export default Dashboard;