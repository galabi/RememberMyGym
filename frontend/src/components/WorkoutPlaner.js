import React, { useState } from 'react';
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const WorkoutPlanner = () => {
    // State for the three selection parameters
    const [duration, setDuration] = useState(45);
    const [targetArea, setTargetArea] = useState('Full Body');
    const [environment, setEnvironment] = useState('Gym');
    const [isGenerating, setIsGenerating] = useState(false);

    // Selection options constants
    const bodySegments = ['Upper Body', 'Lower Body', 'Full Body'];
    const locationOptions = ['Home', 'Gym'];
    
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        // Add your API logic here later
        setTimeout(() => {
            setIsGenerating(false);
            alert(`Generating ${duration} min ${targetArea} workout at ${environment}`);
        }, 1000);

        getWorkoutPlan();
    };

    const getWorkoutPlan = async () => {
        try {
            const userid = getCookie('user_id');
            const user = await axios.get(`${API_BASE_URL}/api/users/id/${userid}`, );
            const birth_date = user.data.birth_date;
            const gender = user.data.gender;
            const age = Math.floor((new Date() - new Date(birth_date)) / (365.25 * 24 * 60 * 60 * 1000));

            const response = await axios.post(`${API_BASE_URL}/api/planer/generate`, {
                age,
                gender,
                duration,
                targetArea,
                environment
            });
            console.log('Generated Workout Plan:', response.data);
        } catch (error) {
            console.error('Error fetching workout plan:', error);
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
                        type="range"
                        min="10"
                        max="90"
                        step="5"
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
                    {isGenerating ? 'Generating...' : 'Generate Workout'}
                </button>
            </div>
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
        marginBottom: '25px',
    },
    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        letterSpacing: '-1px',
        margin: 0,
        color: '#000',
    },
    subtitle: {
        color: '#8e8e93',
        fontSize: '16px',
        marginTop: '4px',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '20px', 
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    sectionLabel: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#8e8e93',
        letterSpacing: '0.5px',
        marginBottom: '15px',
        display: 'block',
    },
    labelRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    valueHighlight: {
        fontSize: '18px',
        fontWeight: '800',
        color: '#007aff',
    },
    slider: {
        width: '100%',
        height: '6px',
        borderRadius: '5px',
        backgroundColor: '#f2f2f7',
        outline: 'none',
        WebkitAppearance: 'none',
    },
    sliderLabels: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '8px',
        fontSize: '12px',
        color: '#c7c7cc',
    },
    segmentedControl: {
        display: 'flex',
        backgroundColor: '#f2f2f7',
        padding: '4px',
        borderRadius: '12px',
        gap: '4px',
    },
    segmentButton: {
        flex: 1,
        border: 'none',
        padding: '10px 5px',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    locationContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
    },
    locationButton: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
        borderRadius: '16px',
        border: '2px solid',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
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
    generateButton: {
        backgroundColor: '#34c759', 
        color: '#fff',
        border: 'none',
        borderRadius: '16px',
        padding: '18px',
        fontWeight: '700',
        fontSize: '18px',
        cursor: 'pointer',
        marginTop: '10px',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 15px rgba(52, 199, 89, 0.3)',
    }
};


export default WorkoutPlanner;