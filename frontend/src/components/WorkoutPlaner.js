import React, { useState,useEffect } from 'react';
import axios from 'axios';
import workoutIcons from './WorkoutTypes.js';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const WorkoutPlanner = () => {
    // State for the three selection parameters
    const [duration, setDuration] = useState(45);
    const [targetArea, setTargetArea] = useState('Full Body');
    const [environment, setEnvironment] = useState('Gym');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [workoutResult, setWorkoutResult] = useState(null);
    
    // Selection options constants
    const bodySegments = ['Upper Body', 'Lower Body', 'Full Body'];
    const locationOptions = ['Home', 'Gym'];
    
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setWorkoutResult(null);
        await getWorkoutPlan();
    };
    
    const handleSaveWorkout = async () => {
        if (!workoutResult || !workoutResult.exercises) return;

        setIsSaving(true);
        try {
            const userid = getCookie('user_id');
            
            await axios.post(`${API_BASE_URL}/api/planer/save`, {
                user_id: userid,
                exercises: workoutResult.exercises
            });

            setShowModal(false); 
            
        } catch (error) {
            console.error('Error saving workout:', error);
            alert('Failed to save workout. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

    const getWorkoutPlan = async () => {
        try {
            const userid = getCookie('user_id');

            const response = await axios.post(`${API_BASE_URL}/api/planer/generate`, {
                userid,
                duration,
                targetArea,
                environment
            });
            setWorkoutResult(response.data);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching workout plan:', error);
        }finally {
            setIsGenerating(false);
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Workout Setup</h1>
                <p style={styles.subtitle}>Configure your session parameters</p>
            </header>

            <div style={styles.content}>
                
                {/* 1. Time Barometer */}
                <section style={styles.card}>
                    <div style={styles.labelRow}>
                        <span style={styles.sectionLabel}>DURATION</span>
                        <span style={styles.valueHighlight}>{duration} min</span>
                    </div>
                    <input 
                        type="range" min="10" max="90" step="5"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        style={styles.slider}
                    />
                    <div style={styles.sliderLabels}>
                        <span>10m</span>
                        <span>1.5h</span>
                    </div>
                </section>

                {/* 2. Body Part Barometer*/}
                <section style={styles.card}>
                    <span style={styles.sectionLabel}>TARGET AREA</span>
                    <div style={styles.segmentedControl}>
                        {bodySegments.map((segment) => (
                            <button
                                key={segment}
                                onClick={() => setTargetArea(segment)}
                                style={{
                                    ...styles.segmentButton,
                                    backgroundColor: targetArea === segment ? '#007aff' : '#f2f2f7',
                                    color: targetArea === segment ? '#fff' : '#1c1c1e',
                                }}
                            >
                                {segment}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 3. Environment Barometer - Location toggle */}
                <section style={styles.card}>
                    <span style={styles.sectionLabel}>ENVIRONMENT</span>
                    <div style={styles.locationContainer}>
                        {locationOptions.map((loc) => (
                            <button
                                key={loc}
                                onClick={() => setEnvironment(loc)}
                                style={{
                                    ...styles.locationButton,
                                    borderColor: environment === loc ? '#007aff' : '#e5e5ea',
                                    backgroundColor: environment === loc ? '#e8f4ff' : '#fff',
                                    color: environment === loc ? '#007aff' : '#8e8e93',
                                }}
                            >
                                <span style={{fontSize: '24px', marginBottom: '4px'}}>
                                    {loc === 'Home' ? '🏠' : '🏋️‍♂️'}
                                </span>
                                {loc}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Summary Box*/}
                <div style={styles.summaryBox}>
                    <p style={styles.summaryText}>
                        Ready for a <strong>{duration} min</strong> session focusing on <strong>{targetArea}</strong> at the <strong>{environment}</strong>.
                    </p>
                </div>
                <button 
                    style={{
                        ...styles.generateButton,
                        opacity: isGenerating ? 0.7 : 1,
                        transform: isGenerating ? 'scale(0.98)' : 'scale(1)'
                    }} 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <div style={styles.spinnerContainer}>
                            <div style={styles.spinner}></div>
                            <span>Generating...</span>
                        </div>
                    ) : 'Generate Workout'}
                </button>
            </div>

            {showModal && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>Your AI Plan</h2>
                            <button style={styles.closeIcon} onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        
                        <div style={styles.exercisesList}>
                            {workoutResult && Array.isArray(workoutResult.exercises) && workoutResult.exercises.map((ex, index) => (
                                <div key={index} style={styles.exerciseItem}>
                                    <div style={styles.exerciseLeft}>
                                        <span style={styles.iconCircle}>
                                            {workoutIcons[ex.bodyPart] ? (
                                                <img 
                                                    src={workoutIcons[ex.bodyPart]} 
                                                    alt="" 
                                                    style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
                                                />
                                            ) : (
                                                '⚡' // Fallback icon if no specific icon is found for the muscle group
                                            )}
                                        </span>
                                        <div>
                                            <div style={styles.exName}>{ex.name}</div>
                                            <div style={styles.exTarget}>{ex.bodyPart}</div>
                                        </div>
                                    </div>
                                    <div style={styles.exStats}>
                                        <div style={styles.statLine}><strong>{ex.sets}</strong> sets</div>
                                        <div style={styles.statLine}><strong>{ex.reps}</strong> reps</div>                                    
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button style={{...styles.closeButton, 
                            opacity: isSaving ? 0.7 : 1,
                            cursor: isSaving ? 'default' : 'pointer'
                            }} 
                            onClick={handleSaveWorkout}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Workout'}
                        </button>
                    </div>
                </div>
            )}
            
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        paddingTop: 'max(20px, env(safe-area-inset-top))',
        backgroundColor: '#f9f9fb',
        minHeight: '100dvh',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        maxWidth: '430px',
        margin: '0 auto',
        boxSizing: 'border-box',
    },
    header: { 
        marginBottom: '25px' 
    },
    title: { 
        fontSize: '32px', 
        fontWeight: 'bold', 
        letterSpacing: '-1px', 
        margin: 0 
    },
    subtitle: { 
        color: '#8e8e93', 
        fontSize: '16px', 
        marginTop: '4px' 
    },
    content: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px' 
    },
    card: { 
        backgroundColor: '#fff', 
        borderRadius: '20px', 
        padding: '20px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
    },
    sectionLabel: { 
        fontSize: '12px', 
        fontWeight: '700', 
        color: '#8e8e93', 
        marginBottom: '15px', 
        display: 'block' 
    },
    labelRow: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '10px' 
    },
    valueHighlight: { 
        fontSize: '18px', 
        fontWeight: '800', 
        color: '#007aff' 
    },
    slider: { 
        width: '100%', 
        height: '6px', 
        borderRadius: '5px', 
        backgroundColor: '#f2f2f7', 
        outline: 'none', 
        WebkitAppearance: 'none' 
    },
    segmentedControl: { 
        display: 'flex', 
        backgroundColor: '#f2f2f7', 
        padding: '4px', 
        borderRadius: '12px', 
        gap: '4px' 
    },
    segmentButton: { 
        flex: 1, 
        border: 'none', 
        padding: '10px 5px', 
        borderRadius: '10px', 
        fontSize: '13px', 
        fontWeight: '600', 
        cursor: 'pointer' 
    },
    locationContainer: { 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '12px' 
    },
    locationButton: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '16px', 
        borderRadius: '16px', 
        border: '2px solid', 
        fontSize: '15px', 
        fontWeight: '700' 
    },
    generateButton: { 
        backgroundColor: '#34c759', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '16px', 
        padding: '18px', 
        fontWeight: '700', 
        fontSize: '18px', 
        cursor: 'pointer', 
        marginTop: '10px' 
    },
    spinnerContainer: { 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '10px' 
    },
    spinner: { 
        width: '20px', 
        height: '20px', 
        border: '3px solid rgba(255,255,255,0.3)', 
        borderTop: '3px solid #fff', 
        borderRadius: '50%', 
        animation: 'spin 0.8s linear infinite' 
    },
    modalOverlay: { 
        position: 'fixed', 
        top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.4)', 
        backdropFilter: 'blur(8px)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-end', 
        zIndex: 2000,
        touchAction: 'none'
    },
    modalContent: { 
        backgroundColor: '#fff', 
        width: '100%', 
        maxWidth: '430px', 
        borderTopLeftRadius: '30px', 
        borderTopRightRadius: '30px', 
        padding: '30px 20px 70px 20px',
        boxSizing: 'border-box', 
        maxHeight: '85vh', 
        overflowY: 'auto',
        overscrollBehavior: 'contain'
    },
    modalHeader: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '25px' 
    },
    modalTitle: { 
        fontSize: '24px', 
        fontWeight: 'bold' 
    },
    summaryBox: {
        backgroundColor: '#e8f4ff', 
        borderRadius: '16px',
        padding: '18px',
        marginTop: '10px',
        border: '1px solid #d0e7ff',
        },
    summaryText: {
        margin: 0,
        fontSize: '15px',
        color: '#007aff',
        textAlign: 'center',
        lineHeight: '1.4',
    },
    closeIcon: { 
        background: '#f2f2f7', 
        border: 'none', 
        borderRadius: '50%', 
        width: '32px', 
        height: '32px', 
        cursor: 'pointer' 
    },
    exercisesList: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        marginBottom: '30px' 
    },
    sliderLabels: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '8px',
        fontSize: '12px',
        color: '#c7c7cc',
    },
    exerciseItem: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        padding: '16px', 
        borderRadius: '18px', 
        border: '1px solid #f2f2f7', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)' 
    },
    exerciseLeft: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px' 
    },
    iconCircle: { 
        width: '44px', 
        height: '44px', 
        backgroundColor: '#f2f2f7', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '20px' 
    },
    exName: { 
        fontSize: '16px', 
        fontWeight: '700', 
        color: '#1c1c1e' 
    },
    exTarget: { 
        fontSize: '12px', 
        color: '#8e8e93', 
        fontWeight: '600' 
    },
    exStats: { 
        textAlign: 'right' 
    },
    statLine: { 
        fontSize: '13px', 
        color: '#3a3a3c' 
    },
    closeButton: { 
        backgroundColor: '#007aff', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '16px', 
        padding: '18px', 
        width: '100%', 
        fontSize: '17px', 
        fontWeight: '700', 
        cursor: 'pointer' 
    }
};


export default WorkoutPlanner;