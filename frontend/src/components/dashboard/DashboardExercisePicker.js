import React, { useState, useMemo, useEffect } from 'react';
import muscleGroupIcons from '../workout/WorkoutTypes';

const DashboardExercisePicker = ({ userExercises, lastRecords, onStart, onClose }) => {
  const [selectedNames, setSelectedNames] = useState(new Set());
  const [exerciseParams, setExerciseParams] = useState({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const grouped = useMemo(() => {
    const groups = {};
    userExercises.forEach(ex => {
      if (!groups[ex.muscleGroup]) groups[ex.muscleGroup] = [];
      groups[ex.muscleGroup].push(ex);
    });
    return groups;
  }, [userExercises]);

  const toggleExercise = (name, muscleGroup) => {
    setSelectedNames(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
        if (!exerciseParams[name]) {
          const lastRecord = lastRecords?.find(r => r._id === name)?.lastRecord;
          setExerciseParams(p => ({
            ...p,
            [name]: {
              sets: lastRecord?.sets || 3,
              reps: lastRecord?.reps || 10
            }
          }));
        }
      }
      return next;
    });
  };

  const updateParam = (name, field, value) => {
    const parsed = parseInt(value, 10);
    setExerciseParams(prev => ({
      ...prev,
      [name]: { ...prev[name], [field]: parsed > 0 ? parsed : 1 }
    }));
  };

  const handleStart = () => {
    const exercises = [...selectedNames].map(name => {
      const ex = userExercises.find(e => e.name === name);
      const params = exerciseParams[name] || { sets: 3, reps: 10 };
      return {
        exercise_name: name,
        body_part: ex.muscleGroup,
        totalSets: params.sets,
        targetReps: params.reps,
        completedSets: []
      };
    });
    onStart(exercises);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.sheet} onClick={e => e.stopPropagation()}>
        <div style={styles.handle} />
        <div style={styles.sheetHeader}>
          <h2 style={styles.sheetTitle}>Choose Exercises</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.exerciseList}>
          {Object.entries(grouped).map(([group, exercises]) => (
            <div key={group} style={styles.groupSection}>
              <div style={styles.groupLabel}>
                {muscleGroupIcons[group] && (
                  <img
                    src={muscleGroupIcons[group]}
                    alt=""
                    style={{ width: '16px', height: '16px', objectFit: 'contain' }}
                  />
                )}
                <span>{group}</span>
              </div>
              {exercises.map(ex => (
                <div key={ex.name}>
                  <div
                    style={styles.exerciseRow}
                    onClick={() => toggleExercise(ex.name, ex.muscleGroup)}
                  >
                    <div style={styles.exerciseRowLeft}>
                      <div style={{
                        ...styles.checkbox,
                        backgroundColor: selectedNames.has(ex.name) ? '#007aff' : 'transparent',
                        borderColor: selectedNames.has(ex.name) ? '#007aff' : '#c7c7cc',
                      }}>
                        {selectedNames.has(ex.name) && (
                          <span style={{ color: '#fff', fontSize: '11px', fontWeight: '700' }}>✓</span>
                        )}
                      </div>
                      <span style={styles.exerciseName}>{ex.name}</span>
                    </div>
                  </div>
                  {selectedNames.has(ex.name) && (
                    <div style={styles.paramsRow} onClick={e => e.stopPropagation()}>
                      <div style={styles.paramInput}>
                        <input
                          type="number"
                          value={exerciseParams[ex.name]?.sets ?? 3}
                          onChange={e => updateParam(ex.name, 'sets', e.target.value)}
                          style={styles.paramField}
                          min="1"
                          max="10"
                        />
                        <span style={styles.paramLabel}>sets</span>
                      </div>
                      <div style={styles.paramInput}>
                        <input
                          type="number"
                          value={exerciseParams[ex.name]?.reps ?? 10}
                          onChange={e => updateParam(ex.name, 'reps', e.target.value)}
                          style={styles.paramField}
                          min="1"
                          max="100"
                        />
                        <span style={styles.paramLabel}>reps</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={styles.footer}>
          <button
            style={{
              ...styles.startBtn,
              opacity: selectedNames.size === 0 ? 0.4 : 1,
            }}
            onClick={handleStart}
            disabled={selectedNames.size === 0}
          >
            Start Session
            {selectedNames.size > 0 ? ` (${selectedNames.size})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    zIndex: 2500,
    touchAction: 'none',
  },
  sheet: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '430px',
    borderTopLeftRadius: '30px',
    borderTopRightRadius: '30px',
    paddingTop: '12px',
    paddingBottom: 'max(30px, env(safe-area-inset-bottom))',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  handle: {
    width: '36px',
    height: '4px',
    backgroundColor: '#e5e5ea',
    borderRadius: '2px',
    margin: '0 auto 12px',
    flexShrink: 0,
  },
  sheetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px 16px',
    borderBottom: '1px solid #f2f2f7',
    flexShrink: 0,
  },
  sheetTitle: {
    fontSize: '20px',
    fontWeight: '800',
    margin: 0,
    color: '#1c1c1e',
  },
  closeBtn: {
    background: '#f2f2f7',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseList: {
    overflowY: 'auto',
    flex: 1,
    padding: '12px 20px',
    overscrollBehavior: 'contain',
  },
  groupSection: {
    marginBottom: '16px',
  },
  groupLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#8e8e93',
    letterSpacing: '0.5px',
    marginBottom: '8px',
    textTransform: 'uppercase',
  },
  exerciseRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0',
    cursor: 'pointer',
    borderBottom: '1px solid #f2f2f7',
  },
  exerciseRowLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  checkbox: {
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.15s',
  },
  exerciseName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1c1c1e',
  },
  paramsRow: {
    display: 'flex',
    gap: '12px',
    padding: '8px 0 12px 34px',
  },
  paramInput: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  paramField: {
    width: '52px',
    padding: '6px 8px',
    borderRadius: '8px',
    border: '1.5px solid #e5e5ea',
    fontSize: '15px',
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: '#f9f9fb',
    outline: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'textfield',
  },
  paramLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#8e8e93',
  },
  footer: {
    padding: '12px 20px 0',
    flexShrink: 0,
    borderTop: '1px solid #f2f2f7',
  },
  startBtn: {
    backgroundColor: '#34c759',
    color: '#fff',
    border: 'none',
    borderRadius: '16px',
    padding: '16px',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
  },
};

export default DashboardExercisePicker;
