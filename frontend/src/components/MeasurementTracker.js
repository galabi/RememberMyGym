import React, { useState, useEffect, useCallback } from 'react'; // הוספת useCallback
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const expandStyles = `
    @keyframes expandIn {
        from {
            opacity: 0;
            transform: scaleY(0.95);
        }
        to {
            opacity: 1;
            transform: scaleY(1);
        }
    }
`;

export default function MeasurementTracker() {
    const [measurements, setMeasurements] = useState({
        weight: null,
        height: null,
        bodyFatPercentage: null
    });
    
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState('');
    
    const [loading, setLoading] = useState(true);
    const userId = Cookies.get('user_id');
    
    // 1. עטיפת הפונקציה ב-useCallback כדי למנוע יצירה מחדש בכל רינדור
    const fetchLatestMeasurements = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/measurements/latest/${userId}`);
            setMeasurements(response.data);
        } catch (error) {
            console.error('Error fetching measurements:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]); // הפונקציה תשתנה רק אם ה-userId ישתנה

    // 2. העברת ה-useEffect לכאן (אחרי שהפונקציה מוגדרת)
    useEffect(() => {
        fetchLatestMeasurements();
    }, [fetchLatestMeasurements]); // עכשיו זה בטוח להוסיף את זה כאן
    
    const handleInputChange = (e) => {
        setEditValue(e.target.value);
    };
    
    const handleSaveMeasurement = async (field) => {
        try {
            if (!editValue) {
                setEditingField(null);
                return;
            }
            const payload = {
                user_id: userId,
                weight: field === 'weight' ? parseFloat(editValue) : (measurements.weight || 0),
                height: field === 'height' ? parseFloat(editValue) : (measurements.height || 0),
                bodyFatPercentage: field === 'bodyFatPercentage' ? parseFloat(editValue) : (measurements.bodyFatPercentage || 0)
            };
            
            if (!payload.user_id) {
                alert('User ID not found');
                return;
            }
            
            if (!payload.weight || payload.weight === 0) {
                alert('Weight is required');
                return;
            }
            
            await axios.post(`${API_BASE_URL}/api/measurements/log`, payload);
            await fetchLatestMeasurements();
            setEditingField(null);
            setEditValue('');
        } catch (error) {
            console.error('Error saving measurement:', error);
            alert('Error saving measurement: ' + error.message);
        }
    };
    
    // ... שאר הסטיילים וה-JSX ללא שינוי ...
    const styles = {
        container: {
            backgroundColor: '#f8f8f8',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            userSelect: 'none'
        },
        title: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '12px',
            marginTop: '0px'
        },
        metricsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '12px'
        },
        metricBox: {
            backgroundColor: '#fff',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #e0e0e0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            userSelect: 'none'
        },
        metricLabel: {
            fontSize: '12px',
            color: '#666',
            fontWeight: '500',
            marginBottom: '4px'
        },
        metricValue: {
            fontSize: '20px',
            fontWeight: '700',
            color: '#007aff',
            marginBottom: '2px'
        },
        metricUnit: {
            fontSize: '12px',
            color: '#999'
        },
        editForm: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        editLabel: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#1c1c1e'
        },
        editInput: {
            padding: '8px',
            border: '1px solid #007aff',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none'
        },
        expandedEditBox: {
            backgroundColor: '#fff',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            animation: 'expandIn 0.3s ease',
            boxSizing: 'border-box',
            width: '100%'
        },
        expandedEditInput: {
            width: '100%',
            padding: '12px',
            border: '1px solid #007aff',
            borderRadius: '8px',
            fontSize: '16px',
            fontFamily: 'inherit',
            outline: 'none',
            marginBottom: '12px',
            boxSizing: 'border-box',
            WebkitAppearance: 'none',
            MozAppearance: 'textfield'
        },
        editButtons: {
            display: 'flex',
            gap: '10px'
        },
        editSaveBtn: {
            flex: 1,
            padding: '12px',
            backgroundColor: '#34C759',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
        },
        editCancelBtn: {
            flex: 1,
            padding: '12px',
            backgroundColor: '#ff3b30',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
        },
    };

    if (loading) {
        return <div style={styles.container}><p>טוען מדידות...</p></div>;
    }

    return (
        <>
            <style>{expandStyles}</style>
            <div style={styles.container}>
                <h2 style={styles.title}>My Measurements</h2>
                {editingField ? (
                    <div style={styles.expandedEditBox}>
                        <div style={styles.editForm}>
                            <label style={styles.editLabel}>
                                {editingField === 'weight' && 'Weight (kg)'}
                                {editingField === 'height' && 'Height (cm)'}
                                {editingField === 'bodyFatPercentage' && 'Body Fat (%)'}
                            </label>
                            <input
                                type="number"
                                step={editingField === 'height' ? '1' : '0.1'}
                                value={editValue}
                                onChange={handleInputChange}
                                placeholder={
                                    editingField === 'weight' ? 'Weight' :
                                    editingField === 'height' ? 'Height' :
                                    'Body Fat'
                                }
                                style={styles.expandedEditInput}
                                autoFocus
                            />
                            <div style={styles.editButtons}>
                                <button onClick={() => handleSaveMeasurement(editingField)} style={styles.editSaveBtn}>✓ Save</button>
                                <button onClick={() => { setEditingField(null); setEditValue(''); }} style={styles.editCancelBtn}>✕ Cancel</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={styles.metricsGrid}>
                        <div style={styles.metricBox} onClick={() => { setEditingField('weight'); setEditValue(measurements.weight || ''); }}>
                            <div style={styles.metricLabel}>Weight</div>
                            <div style={styles.metricValue}>{measurements.weight || '—'}</div>
                            <div style={styles.metricUnit}>kg</div>
                        </div>
                        <div style={styles.metricBox} onClick={() => { setEditingField('height'); setEditValue(measurements.height || ''); }}>
                            <div style={styles.metricLabel}>Height</div>
                            <div style={styles.metricValue}>{measurements.height || '—'}</div>
                            <div style={styles.metricUnit}>cm</div>
                        </div>
                        <div style={styles.metricBox} onClick={() => { setEditingField('bodyFatPercentage'); setEditValue(measurements.bodyFatPercentage || ''); }}>
                            <div style={styles.metricLabel}>Body Fat</div>
                            <div style={styles.metricValue}>{measurements.bodyFatPercentage || '—'}</div>
                            <div style={styles.metricUnit}>%</div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}