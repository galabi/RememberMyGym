import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Login = ({ onLoginSuccess, onSignUpClick }) => {
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/users/login`, { credential, password });

            if (response.status === 200 && response.data?.user) {
                const userFromServer = response.data.user;
                const mappedUser = { _id: userFromServer.id, full_name: userFromServer.name };
                Cookies.set('user_id', mappedUser._id, { expires: 7 });
                Cookies.set('full_name', mappedUser.full_name, { expires: 7 });
                Cookies.set('isLoggedIn', 'true', { expires: 7 });
                Cookies.set('auth_token', response.data.token, { expires: 7 });
                onLoginSuccess(mappedUser);
            }
        } catch (error) {
            if (!error.response) {
                setErrorMsg('Cannot reach the server. Check your connection.');
            } else if (error.response.status === 401) {
                setErrorMsg('Invalid email/username or password.');
            } else {
                setErrorMsg('Something went wrong. Please try again.');
            }
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

                {/* Heading */}
                <div style={styles.heading}>
                    <h1 style={styles.title}>Welcome back</h1>
                    <p style={styles.subtitle}>Sign in to continue</p>
                </div>

                {errorMsg && <div style={styles.errorBanner}>{errorMsg}</div>}

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>Email or Username</label>
                        <input
                            type="text"
                            placeholder="you@example.com"
                            style={styles.input}
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <div style={styles.passwordWrap}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                style={{ ...styles.input, paddingRight: '50px' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                style={styles.eyeBtn}
                                onClick={() => setShowPassword(v => !v)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                                        <line x1="1" y1="1" x2="23" y2="23"/>
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" style={{ ...styles.primaryBtn, opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
                        {isLoading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                <div style={styles.dividerRow}>
                    <div style={styles.dividerLine} />
                    <span style={styles.dividerText}>or</span>
                    <div style={styles.dividerLine} />
                </div>

                <button style={styles.secondaryBtn} onClick={onSignUpClick}>
                    Create an Account
                </button>

                <p style={styles.forgotText}>Forgot password?</p>
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
        marginBottom: '40px',
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
        fontSize: '16px',
        color: '#8e8e93',
        marginTop: '6px',
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
        marginBottom: '18px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
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
        transition: 'border-color 0.2s',
    },
    passwordWrap: {
        position: 'relative',
    },
    eyeBtn: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
        padding: '4px',
        lineHeight: 1,
    },
    primaryBtn: {
        marginTop: '8px',
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
    dividerRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        margin: '24px 0',
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        backgroundColor: '#e5e5ea',
    },
    dividerText: {
        fontSize: '13px',
        color: '#aeaeb2',
        fontWeight: '500',
    },
    secondaryBtn: {
        width: '100%',
        padding: '16px',
        borderRadius: '14px',
        border: '1.5px solid #e5e5ea',
        backgroundColor: '#fff',
        color: '#007aff',
        fontSize: '17px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    forgotText: {
        textAlign: 'center',
        color: '#007aff',
        fontSize: '15px',
        fontWeight: '500',
        marginTop: '20px',
        cursor: 'pointer',
    },
};

export default Login;
