import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Added onLoginSuccess as a prop to communicate with App.js
const Login = ({ onLoginSuccess, onSignUpClick }) => {
    const [credential, setCredential] = useState(''); // Can be email or username
    const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, { credential, password });
        
      if (response.status === 200 && response.data && response.data.user) {
          const userFromServer = response.data.user;
            
          const mappedUser = {
              _id: userFromServer.id, 
              full_name: userFromServer.name 
          };

            // 1. save to cookies for session persistence
            Cookies.set('user_id', mappedUser._id, { expires: 7 });
            Cookies.set('full_name', mappedUser.full_name, { expires: 7 });
            Cookies.set('isLoggedIn', 'true', { expires: 7 });

            // 2. update state in App component
            onLoginSuccess(mappedUser);
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert('Login failed. Please check your credentials.');
    }
};

    return (
        <div style={styles.container}>
            <div style={styles.iphoneScreen}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Welcome Back</h1>
                    <p style={styles.subtitle}>Login to your gym account</p>
                </div>

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputContainer}>
                        <input 
                            type="text" 
                            placeholder="Email or Username" 
                            style={styles.input} 
                            onChange={(e) => setCredential(e.target.value)}
                            required 
                        />
                        <div style={styles.divider}></div>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            style={styles.input} 
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" style={styles.loginButton}>
                        Sign In
                    </button>
                </form>

                <button style={{...styles.loginButton, backgroundColor: '#34c759', marginTop: '15px'}} onClick={onSignUpClick}>
                    Create Account
                </button>
                <p style={styles.forgotPassword}>Forgot password?</p>
            </div>
        </div>
    );
};

// iOS Inspired Styles
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
        marginTop: '0px',
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
    loginButton: {
        width: '100%',
        padding: '15px',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: '#007aff',
        color: '#fff',
        fontSize: '17px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    forgotPassword: {
        textAlign: 'center',
        color: '#007aff',
        marginTop: '20px',
        fontSize: '15px',
    }
};

export default Login;