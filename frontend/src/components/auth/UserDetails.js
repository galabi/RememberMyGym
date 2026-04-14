import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const genderOptions = [
    { value: 'male',   label: 'Male',   icon: '♂' },
    { value: 'female', label: 'Female', icon: '♀' },
    { value: 'other',  label: 'Other',  icon: '⚧' },
];

const UserDetails = ({ mappedUser, onSignUpSuccess }) => {
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!mappedUser?._id) {
            setErrorMsg('Session error. Please try signing up again.');
            return;
        }
        if (!gender) {
            setErrorMsg('Please select your gender.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.patch(
                `${API_BASE_URL}/api/users/complete-registration/${mappedUser._id}`,
                { birth_date: birthDate, gender }
            );
            if (response.status === 200) {
                onSignUpSuccess({ ...mappedUser, birthday: birthDate, gender });
            }
        } catch (error) {
            setErrorMsg('Failed to save details. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.screen}>

                {/* Brand */}
                <div style={styles.brand}>
                    <img src="/logo196.png" alt="RememberMyGym" style={styles.logoImg} />
                    <span style={styles.logoName}>RememberMyGym</span>
                </div>

                {/* Step indicator */}
                <div style={styles.stepRow}>
                    <div style={{ ...styles.stepDot, backgroundColor: '#34c759' }} />
                    <div style={{ ...styles.stepLine, backgroundColor: '#007aff' }} />
                    <div style={{ ...styles.stepDot, backgroundColor: '#007aff' }} />
                </div>

                <div style={styles.heading}>
                    <h1 style={styles.title}>Almost there!</h1>
                    <p style={styles.subtitle}>Step 2 of 2 — Personalize your plan</p>
                </div>

                {errorMsg && <div style={styles.errorBanner}>{errorMsg}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>

                    <div style={styles.field}>
                        <label style={styles.label}>Date of Birth</label>
                        <input
                            type="date"
                            style={styles.input}
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Gender</label>
                        <div style={styles.genderGrid}>
                            {genderOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setGender(opt.value)}
                                    style={{
                                        ...styles.genderCard,
                                        borderColor: gender === opt.value ? '#007aff' : '#e5e5ea',
                                        backgroundColor: gender === opt.value ? '#e8f4ff' : '#f9f9fb',
                                        boxShadow: gender === opt.value ? '0 0 0 2px rgba(0,122,255,0.2)' : 'none',
                                    }}
                                >
                                    <span style={styles.genderIcon}>{opt.icon}</span>
                                    <span style={{
                                        ...styles.genderLabel,
                                        color: gender === opt.value ? '#007aff' : '#3a3a3c',
                                    }}>{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{ ...styles.primaryBtn, opacity: isLoading ? 0.7 : 1, marginTop: '8px' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving…' : 'Complete Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const styles = {
    page: {
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100dvh',
        backgroundColor: '#f2f2f7',
    },
    screen: {
        width: '100%',
        maxWidth: '430px',
        minHeight: '100dvh',
        backgroundColor: '#fff',
        paddingTop: 'max(40px, env(safe-area-inset-top))',
        paddingBottom: '40px',
        paddingLeft: '24px',
        paddingRight: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        fontFamily: font,
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '28px',
    },
    logoImg: {
        width: '42px',
        height: '42px',
        borderRadius: '12px',
        objectFit: 'contain',
        border: '1.5px solid #e5e5ea',
    },
    logoName: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#1c1c1e',
        letterSpacing: '-0.3px',
    },
    stepRow: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '24px',
    },
    stepDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        flexShrink: 0,
    },
    stepLine: {
        flex: 1,
        height: '2px',
        margin: '0 6px',
    },
    heading: {
        marginBottom: '28px',
    },
    title: {
        fontSize: '32px',
        fontWeight: '800',
        letterSpacing: '-1px',
        color: '#1c1c1e',
        margin: 0,
    },
    subtitle: {
        fontSize: '15px',
        color: '#8e8e93',
        margin: '6px 0 0',
    },
    errorBanner: {
        backgroundColor: '#fff2f2',
        border: '1px solid #ffcdd2',
        color: '#d32f2f',
        borderRadius: '12px',
        padding: '12px 14px',
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '16px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#3a3a3c',
        letterSpacing: '0.2px',
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '1.5px solid #e5e5ea',
        backgroundColor: '#f9f9fb',
        fontSize: '16px',
        outline: 'none',
        boxSizing: 'border-box',
        color: '#1c1c1e',
    },
    genderGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '10px',
    },
    genderCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '18px 8px',
        borderRadius: '14px',
        border: '1.5px solid',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
    },
    genderIcon: {
        fontSize: '24px',
        lineHeight: 1,
    },
    genderLabel: {
        fontSize: '13px',
        fontWeight: '600',
    },
    primaryBtn: {
        width: '100%',
        padding: '16px',
        borderRadius: '14px',
        border: 'none',
        backgroundColor: '#007aff',
        color: '#fff',
        fontSize: '17px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(0,122,255,0.35)',
        letterSpacing: '-0.2px',
    },
};

export default UserDetails;
