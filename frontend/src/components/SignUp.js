import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SignUp = ({ onNextStep, onLoginClick }) => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/users/register`, {
                full_name: fullName,
                username,
                email,
                password
            });

            if (response.status === 201 && response.data && response.data.user) {
                const userFromServer = response.data.user;

                const mappedUser = {
                    _id: userFromServer.id,
                    full_name: userFromServer.name 
    };

                Cookies.set('user_id', mappedUser._id, { expires: 7 });
                Cookies.set('full_name', mappedUser.full_name, { expires: 7 });
                Cookies.set('isLoggedIn', 'true', { expires: 7 });

                onNextStep(mappedUser);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.iphoneScreen}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Create Account</h1>
                    <p style={styles.subtitle}>Join RememberMyGym today</p>
                </div>
                <form onSubmit={handleSignUp}>
                    <div style={styles.inputContainer}>
                        <input type="text" placeholder="Full Name" style={styles.input} onChange={(e) => setFullName(e.target.value)} required />
                        <div style={styles.divider}></div>
                        <input type="text" placeholder="Username" style={styles.input} onChange={(e) => setUsername(e.target.value)} required />
                        <div style={styles.divider}></div>
                        <input type="email" placeholder="Email" style={styles.input} onChange={(e) => setEmail(e.target.value)} required />
                        <div style={styles.divider}></div>
                        <input type="password" placeholder="Password" style={styles.input} onChange={(e) => setPassword(e.target.value)} required />
                        <div style={styles.divider}></div>
                        <input type="password" placeholder="Confirm Password" style={styles.input} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <button type="submit" style={styles.signUpButton}>Sign Up</button>
                </form>
                <p style={styles.footerText}>Already have an account?</p>
                <button onClick={onLoginClick} style={{...styles.signUpButton, backgroundColor: '#34c759'}}>Log In</button>
            </div>
        </div>
    );
};

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
        paddingTop: 'max(20px, env(safe-area-inset-top))',
        paddingLeft: '20px',
        paddingRight: '20px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    header: {
        marginTop: '20px',
        marginBottom: '40px',
        textAlign: 'center',
    },
    title: {
        fontSize: '34px',
        fontWeight: 'bold',
        letterSpacing: '-1px',
        color: '#000',
    },
    subtitle: {
        color: '#8e8e93',
        fontSize: '17px',
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
    },
    divider: {
        height: '1px',
        backgroundColor: '#d1d1d6',
    },
    signUpButton: {
        width: '100%',
        padding: '15px',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: '#007aff', // iOS Blue
        color: '#fff',
        fontSize: '17px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    footerText: {
        textAlign: 'center',
        color: '#8e8e93',
        marginTop: '20px',
        fontSize: '15px',
    },
    linkText: {
        color: '#007aff',
        fontWeight: '600',
        cursor: 'pointer',
    }
};

export default SignUp;