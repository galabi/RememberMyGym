import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const UserDetails = ({ mappedUser, onSignUpSuccess }) => {
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!mappedUser || !mappedUser._id) {
        console.error("User ID is missing!");
        alert("Session error. Please try signing up again.");
        return;
        }

        if (!gender) {
            alert("Please select your gender");
            return;
        }

        try {
            const response = await axios.patch(`${API_BASE_URL}/api/users/complete-registration/${mappedUser._id}`, {
                birth_date: birthDate,
                gender: gender
            });

            if (response.status === 200) {
                onSignUpSuccess({ ...mappedUser, birthday: birthDate, gender: gender });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to save details. Please try again.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.iphoneScreen}>
                <div style={styles.header}>
                    <h1 style={styles.title}>A Bit More...</h1>
                    <p style={styles.subtitle}>Help us personalize your experience</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <label style={styles.label}>Birthday</label>
                    <div style={styles.inputContainer}>
                        <input type="date" style={styles.input} value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
                    </div>
                    <label style={styles.label}>Gender</label>
                    <div style={styles.genderContainer}>
                        {['male', 'female', 'other'].map((option) => (
                            <button key={option} type="button" onClick={() => setGender(option)}
                                style={{
                                    ...styles.genderButton,
                                    backgroundColor: gender === option ? '#007aff' : '#f2f2f7',
                                    color: gender === option ? '#fff' : '#000',
                                }}>{option}</button>
                        ))}
                    </div>
                    <button type="submit" style={styles.continueButton}>Complete Profile</button>
                </form>
            </div>
        </div>
    );
};

// Styles following your iOS theme
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100dvh',
        backgroundColor: '#f9f9fb',
    },
    iphoneScreen: {
        width: '100%',
        maxWidth: '430px', 
        minHeight: '100dvh', 
        backgroundColor: '#ffffff',
        paddingTop: 'max(40px, env(safe-area-inset-top))',
        paddingLeft: '20px',
        paddingRight: '20px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    header: {
        marginBottom: '40px',
        textAlign: 'center',
    },
    title: {
        fontSize: '34px',
        fontWeight: 'bold',
        letterSpacing: '-1px',
    },
    subtitle: {
        color: '#8e8e93',
        fontSize: '17px',
    },
    label: {
        display: 'block',
        fontSize: '15px',
        fontWeight: '600',
        color: '#8e8e93',
        marginBottom: '8px',
        marginLeft: '4px',
        textTransform: 'uppercase',
    },
    inputContainer: {
        backgroundColor: '#f2f2f7',
        borderRadius: '12px',
        padding: '0 15px',
        marginBottom: '25px',
    },
    input: {
        width: '100%',
        padding: '15px 0',
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '17px',
        outline: 'none',
        color: '#000',
    },
    genderContainer: {
        display: 'flex',
        gap: '10px',
        marginBottom: '40px',
    },
    genderButton: {
        flex: 1,
        padding: '12px',
        borderRadius: '12px',
        border: 'none',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    continueButton: {
        width: '100%',
        padding: '15px',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: '#007aff',
        color: '#fff',
        fontSize: '17px',
        fontWeight: '600',
        cursor: 'pointer',
    }
};

export default UserDetails;