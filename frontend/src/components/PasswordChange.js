import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function PasswordChange({ userId }) {
    const [showModal, setShowModal] = useState(false);
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        document.body.style.overflow = showModal ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [showModal]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleOpen = () => {
        setErrorMsg('');
        setSuccessMsg('');
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setShowModal(true);
    };

    const handleUpdatePassword = async () => {
        const { oldPassword, newPassword, confirmPassword } = passwords;
        setErrorMsg('');
        setSuccessMsg('');

        if (!oldPassword || !newPassword || !confirmPassword) {
            setErrorMsg('Please fill in all fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMsg('New passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setErrorMsg('New password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            await axios.patch(`${API_BASE_URL}/api/users/update/password/`, {
                userId,
                oldPassword,
                newPassword
            });
            setSuccessMsg('Password updated successfully!');
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setShowModal(false), 1200);
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Row button inside the group card */}
            <button style={styles.row} onClick={handleOpen}>
                <div style={styles.rowLeft}>
                    <div style={styles.rowIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0110 0v4"/>
                        </svg>
                    </div>
                    <span style={styles.rowLabel}>Change Password</span>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c7c7cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </button>

            {showModal && (
                <div style={styles.overlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>Change Password</h2>
                            <button style={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <p style={styles.modalSub}>Choose a strong password to keep your account secure.</p>

                        {errorMsg && <div style={styles.errorBanner}>{errorMsg}</div>}
                        {successMsg && <div style={styles.successBanner}>{successMsg}</div>}

                        <div style={styles.inputGroup}>
                            <div style={styles.field}>
                                <label style={styles.label}>Current Password</label>
                                <input
                                    style={styles.input}
                                    type="password"
                                    name="oldPassword"
                                    placeholder="••••••••"
                                    value={passwords.oldPassword}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>New Password</label>
                                <input
                                    style={styles.input}
                                    type="password"
                                    name="newPassword"
                                    placeholder="••••••••"
                                    value={passwords.newPassword}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Confirm New Password</label>
                                <input
                                    style={{
                                        ...styles.input,
                                        borderColor: passwords.confirmPassword && passwords.confirmPassword !== passwords.newPassword ? '#ff3b30' : '#e5e5ea',
                                    }}
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={passwords.confirmPassword}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <button
                            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
                            onClick={handleUpdatePassword}
                            disabled={loading}
                        >
                            {loading ? 'Updating…' : 'Update Password'}
                        </button>
                        <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const styles = {
    row: {
        width: '100%',
        background: 'none',
        border: 'none',
        borderTop: '1px solid #f2f2f7',
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        fontFamily: font,
        boxSizing: 'border-box',
    },
    rowLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
    },
    rowIcon: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        backgroundColor: '#e8f4ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowLabel: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1c1c1e',
    },
    overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        zIndex: 2000,
        touchAction: 'none',
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: '24px',
        padding: '24px',
        width: '100%',
        maxWidth: '380px',
        maxHeight: '90vh',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        fontFamily: font,
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px',
    },
    modalTitle: {
        fontSize: '22px',
        fontWeight: '800',
        color: '#1c1c1e',
        margin: 0,
        letterSpacing: '-0.5px',
    },
    closeBtn: {
        background: '#f2f2f7',
        border: 'none',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        cursor: 'pointer',
        fontSize: '13px',
        color: '#8e8e93',
        fontWeight: '700',
    },
    modalSub: {
        fontSize: '14px',
        color: '#8e8e93',
        margin: '0 0 18px',
        lineHeight: '1.4',
    },
    errorBanner: {
        backgroundColor: '#fff2f2',
        border: '1px solid #ffcdd2',
        color: '#d32f2f',
        borderRadius: '12px',
        padding: '10px 14px',
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '14px',
    },
    successBanner: {
        backgroundColor: '#f0fff4',
        border: '1px solid #b2dfdb',
        color: '#1b8a4a',
        borderRadius: '12px',
        padding: '10px 14px',
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '14px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '20px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    label: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#3a3a3c',
        letterSpacing: '0.2px',
    },
    input: {
        padding: '13px 16px',
        borderRadius: '12px',
        border: '1.5px solid #e5e5ea',
        fontSize: '16px',
        backgroundColor: '#f9f9fb',
        outline: 'none',
        color: '#1c1c1e',
        width: '100%',
        boxSizing: 'border-box',
    },
    submitBtn: {
        width: '100%',
        padding: '15px',
        borderRadius: '14px',
        border: 'none',
        backgroundColor: '#007aff',
        color: '#fff',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(0,122,255,0.3)',
        marginBottom: '8px',
    },
    cancelBtn: {
        width: '100%',
        background: 'none',
        border: 'none',
        color: '#ff3b30',
        fontSize: '15px',
        fontWeight: '600',
        padding: '10px',
        cursor: 'pointer',
    },
};
