import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import workoutIcons from './WorkoutTypes';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

const LiveWorkoutSession = ({ session, user, onEnd }) => {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [currentSetNumber, setCurrentSetNumber] = useState(1);
  const [allSets, setAllSets] = useState({});
  const [weightInput, setWeightInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  const [isResting, setIsResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(90);
  const [phase, setPhase] = useState('active');
  const [lastRecords, setLastRecords] = useState({});
  const [saveError, setSaveError] = useState(null);
  const sessionStartTime = useRef(Date.now());

  const currentExercise = session.exercises[exerciseIndex];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  useEffect(() => {
    const fetchLastRecords = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/workouts/last/${user._id}`);
        const map = {};
        res.data.forEach(item => { map[item._id] = item.lastRecord; });
        setLastRecords(map);
      } catch (_) {}
    };
    fetchLastRecords();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isResting) return;
    const timerId = setInterval(() => {
      setRestSecondsLeft(prev => {
        if (prev <= 1) {
          setIsResting(false);
          return 90;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [isResting]);

  const handleDoneSet = () => {
    const weight = parseFloat(weightInput);
    const reps = parseInt(repsInput, 10);
    if (!weightInput || isNaN(weight) || weight <= 0) {
      alert('Please enter a valid weight');
      return;
    }
    if (!repsInput || isNaN(reps) || reps <= 0) {
      alert('Please enter valid reps');
      return;
    }

    const newSet = { weight, reps, setNumber: currentSetNumber };
    setAllSets(prev => ({
      ...prev,
      [exerciseIndex]: [...(prev[exerciseIndex] || []), newSet]
    }));

    const isLastSet = currentSetNumber === currentExercise.totalSets;
    const isLastExercise = exerciseIndex === session.exercises.length - 1;

    setWeightInput('');
    setRepsInput('');

    if (isLastSet && isLastExercise) {
      setPhase('summary');
    } else if (isLastSet) {
      setExerciseIndex(i => i + 1);
      setCurrentSetNumber(1);
      setIsResting(true);
    } else {
      setCurrentSetNumber(n => n + 1);
      setIsResting(true);
    }
  };

  const handleSaveSession = async () => {
    setPhase('saving');
    setSaveError(null);
    try {
      const savePromises = session.exercises
        .map((ex, idx) => {
          const sets = allSets[idx] || [];
          if (sets.length === 0) return null;
          const lastSet = sets[sets.length - 1];
          return axios.post(`${API_BASE_URL}/api/workouts/log`, {
            user_id: user._id,
            exercise_name: ex.exercise_name,
            weight: lastSet.weight,
            reps: lastSet.reps,
            sets: sets.length
          });
        })
        .filter(Boolean);
      await Promise.all(savePromises);
      setPhase('done');
      setTimeout(onEnd, 1500);
    } catch (_) {
      setPhase('summary');
      setSaveError('Failed to save. Please try again.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('Cancel this session? No data will be saved.')) {
      onEnd();
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestSecondsLeft(90);
  };

  if (phase === 'summary' || phase === 'saving' || phase === 'done') {
    const elapsedMinutes = Math.round((Date.now() - sessionStartTime.current) / 60000);
    return (
      <div style={styles.overlay}>
        <div style={styles.summaryScroll}>
          {phase === 'done' ? (
            <div style={styles.doneContainer}>
              <div style={{ fontSize: '60px' }}>✅</div>
              <h2 style={styles.summaryTitle}>Saved!</h2>
            </div>
          ) : (
            <>
              <div style={styles.summaryHeader}>
                <h2 style={styles.summaryTitle}>Workout Complete!</h2>
                <p style={styles.summarySubtitle}>
                  {session.sessionName} · {elapsedMinutes || 1} min
                </p>
              </div>

              <div style={styles.summaryList}>
                {session.exercises.map((ex, idx) => {
                  const sets = allSets[idx] || [];
                  if (sets.length === 0) return null;
                  return (
                    <div key={idx} style={styles.summaryExercise}>
                      <div style={styles.summaryExHeader}>
                        <span style={styles.summaryExName}>{ex.exercise_name}</span>
                        <span style={styles.summaryExSets}>{sets.length} sets</span>
                      </div>
                      {sets.map((s, i) => (
                        <div key={i} style={styles.summarySetRow}>
                          Set {s.setNumber}: {s.weight}kg × {s.reps} reps
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>

              {saveError && <div style={styles.saveError}>{saveError}</div>}

              <button
                style={{ ...styles.saveBtn, opacity: phase === 'saving' ? 0.7 : 1 }}
                onClick={handleSaveSession}
                disabled={phase === 'saving'}
              >
                {phase === 'saving' ? 'Saving...' : 'Save & Finish'}
              </button>
              <button style={styles.discardBtn} onClick={onEnd} disabled={phase === 'saving'}>
                Discard
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const lastRecord = lastRecords[currentExercise.exercise_name];

  return (
    <div style={styles.overlay}>
      {isResting && (
        <div style={styles.restOverlay}>
          <p style={styles.restLabel}>REST</p>
          <p style={styles.restTimer}>{formatTime(restSecondsLeft)}</p>
          <button style={styles.skipBtn} onClick={skipRest}>Skip Rest</button>
        </div>
      )}

      <div style={styles.sessionHeader}>
        <button style={styles.cancelBtn} onClick={handleCancel}>✕</button>
        <span style={styles.sessionName} numberOfLines={1}>{session.sessionName}</span>
        <div style={{ width: '32px' }} />
      </div>

      <div style={styles.exerciseCard}>
        <div style={styles.iconWrapper}>
          {workoutIcons[currentExercise.body_part] ? (
            <img
              src={workoutIcons[currentExercise.body_part]}
              alt=""
              style={{ width: '56px', height: '56px', objectFit: 'contain' }}
            />
          ) : <span style={{ fontSize: '40px' }}>⚡</span>}
        </div>
        <h2 style={styles.exerciseName}>{currentExercise.exercise_name}</h2>
        <div style={styles.setInfoRow}>
          <span style={styles.setCounter}>Set {currentSetNumber} / {currentExercise.totalSets}</span>
          <span style={styles.bodyPartBadge}>{currentExercise.body_part}</span>
        </div>
        {lastRecord && (
          <div style={styles.lastRecordBadge}>
            <span style={styles.lastRecordText}>
              Last: {lastRecord.weight}kg
              {lastRecord.reps ? ` × ${lastRecord.reps} reps` : ''}
              {lastRecord.sets ? ` · ${lastRecord.sets} sets` : ''}
            </span>
          </div>
        )}
      </div>

      <div style={styles.inputsRow}>
        <div style={styles.inputGroup}>
          <label style={styles.inputLabel}>Weight (kg)</label>
          <input
            style={styles.numInput}
            type="number"
            step="0.5"
            inputMode="decimal"
            placeholder="0"
            value={weightInput}
            onChange={e => setWeightInput(e.target.value)}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.inputLabel}>Reps</label>
          <input
            style={styles.numInput}
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={repsInput}
            onChange={e => setRepsInput(e.target.value)}
          />
        </div>
      </div>

      <button style={styles.doneSetBtn} onClick={handleDoneSet}>
        Done Set ✓
      </button>

      <div style={styles.progressDots}>
        {session.exercises.map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.dot,
              backgroundColor:
                i < exerciseIndex ? '#34c759' : i === exerciseIndex ? '#007aff' : '#e5e5ea'
            }}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#f9f9fb',
    zIndex: 3000,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    paddingTop: 'max(16px, env(safe-area-inset-top))',
    paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
    paddingLeft: '20px',
    paddingRight: '20px',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  sessionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  cancelBtn: {
    background: '#e5e5ea',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1c1c1e',
    flex: 1,
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    margin: '0 8px',
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '28px 20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
  },
  iconWrapper: {
    width: '80px',
    height: '80px',
    backgroundColor: '#f2f2f7',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
  },
  exerciseName: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#1c1c1e',
    margin: 0,
    textAlign: 'center',
    letterSpacing: '-0.5px',
  },
  setInfoRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginTop: '4px',
  },
  setCounter: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#007aff',
  },
  bodyPartBadge: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#8e8e93',
    backgroundColor: '#f2f2f7',
    padding: '3px 10px',
    borderRadius: '20px',
  },
  lastRecordBadge: {
    backgroundColor: '#e8f4ff',
    borderRadius: '12px',
    padding: '8px 16px',
    marginTop: '4px',
  },
  lastRecordText: {
    fontSize: '14px',
    color: '#007aff',
    fontWeight: '600',
  },
  inputsRow: {
    display: 'flex',
    gap: '14px',
    marginBottom: '16px',
  },
  inputGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  inputLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#8e8e93',
    letterSpacing: '0.3px',
  },
  numInput: {
    width: '100%',
    padding: '16px',
    borderRadius: '16px',
    border: '2px solid #e5e5ea',
    fontSize: '22px',
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    outline: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'textfield',
  },
  doneSetBtn: {
    backgroundColor: '#34c759',
    color: '#fff',
    border: 'none',
    borderRadius: '18px',
    padding: '18px',
    fontSize: '18px',
    fontWeight: '800',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '20px',
  },
  progressDots: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transition: 'background-color 0.3s',
  },
  restOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.78)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3100,
    gap: '16px',
  },
  restLabel: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: '4px',
    margin: 0,
  },
  restTimer: {
    fontSize: '80px',
    fontWeight: '800',
    color: '#fff',
    margin: 0,
    letterSpacing: '-2px',
    fontVariantNumeric: 'tabular-nums',
  },
  skipBtn: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '24px',
    padding: '14px 32px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '10px',
  },
  summaryScroll: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '430px',
    width: '100%',
    margin: '0 auto',
  },
  doneContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  summaryHeader: {
    paddingTop: '10px',
    marginBottom: '4px',
  },
  summaryTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1c1c1e',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  summarySubtitle: {
    fontSize: '15px',
    color: '#8e8e93',
    margin: '6px 0 0 0',
  },
  summaryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
  },
  summaryExercise: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  summaryExHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  summaryExName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1c1c1e',
  },
  summaryExSets: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#007aff',
    backgroundColor: '#e8f4ff',
    padding: '2px 10px',
    borderRadius: '20px',
  },
  summarySetRow: {
    fontSize: '14px',
    color: '#3a3a3c',
    padding: '3px 0',
    borderTop: '1px solid #f2f2f7',
    paddingTop: '6px',
    marginTop: '4px',
  },
  saveError: {
    color: '#ff3b30',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: '#007aff',
    color: '#fff',
    border: 'none',
    borderRadius: '18px',
    padding: '18px',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
  },
  discardBtn: {
    background: 'none',
    border: 'none',
    color: '#ff3b30',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '10px',
    textAlign: 'center',
    width: '100%',
  },
};

export default LiveWorkoutSession;
