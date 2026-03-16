import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GraphModal = ({ isOpen, exercise, allWorkouts, onClose }) => {
    if (!isOpen) return null;

    // Filter and prepare data for the selected exercise
    const exerciseHistory = allWorkouts
        .filter(w => w.exercise_name === exercise)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .slice(-10);

    const data = exerciseHistory.map((record, index) => ({
        index: index + 1,
        weight: record.weight,
        date: new Date(record.createdAt).toLocaleDateString('he-IL'),
    }));

    return (
            <div style={modalStyles.modalOverlay} onClick={onClose}>
                <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
                    <div style={modalStyles.modalHeader}>
                        <h2 style={modalStyles.modalTitle}>Progress: {exercise}</h2>
                        <button onClick={onClose} style={modalStyles.closeButton} disabled={false}>✕</button>
                    </div>
                    
                    <div style={{ width: '100%', height: 250, marginTop: '20px' }}>
                        <ResponsiveContainer>
                            <LineChart data={data} margin={{ top: 10, right: 10, left: -35, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="index" stroke="#8e8e93" fontSize={12} />
                                <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#8e8e93" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="weight" 
                                    stroke="#007aff" 
                                    strokeWidth={3} 
                                    dot={{ r: 6, fill: '#007aff', strokeWidth: 2, stroke: '#fff' }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={modalStyles.historyList}>
                        <h3 style={modalStyles.historyTitle}>Recent Logs</h3>
                        {[...exerciseHistory].reverse().map((record, i) => (
                            <div key={i} style={modalStyles.historyRow}>
                                <span style={{color: '#8e8e93'}}>{new Date(record.createdAt).toLocaleDateString('he-IL')}</span>
                                <span style={{fontWeight: '700'}}>{record.weight} kg</span>
                                <span>{record.sets}x{record.reps}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

const modalStyles = {
    modalOverlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
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
        maxWidth: '450px',
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
        margin: 0 
    },
    closeButton: { 
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer', 
        color: '#8e8e93' 
    },
    historyList: { 
        marginTop: '20px', 
        borderTop: '1px solid #e5e5ea', 
        paddingTop: '15px' 
    },
    historyTitle: { 
        fontSize: '16px', 
        fontWeight: '700', 
        marginBottom: '10px' 
    },
    historyRow: {
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '8px 0',
        borderBottom: '1px solid #f2f2f7', 
        fontSize: '14px'
    }   
};

export default GraphModal;