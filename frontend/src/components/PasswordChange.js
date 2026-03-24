import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function PasswordChange({ userId }) {
    const [showModal, setShowModal] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdatePassword = async () => {
        const { oldPassword, newPassword, confirmPassword } = passwords;

        if (!oldPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all password fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('The new password and confirmation password do not match');
            return;
        }

        const payload = {
            userId: userId,
            oldPassword: oldPassword,
            newPassword: newPassword
        };
        setLoading(true);
        try {
            await axios.patch(`${API_BASE_URL}/api/users/update/password/`, payload);

            alert('Password updated successfully!');
            setShowModal(false);
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error updating password';
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        actionButton: {
            backgroundColor: '#ffffff',
            color: '#1c1c1e',
            border: '1px solid #e5e5ea',
            borderRadius: '16px',
            padding: '16px 20px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            zIndex: 2000
        },
        modal: {
            backgroundColor: '#fff',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            width: '100%',
            maxWidth: '380px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'slideUp 0.3s ease-out'
        },
        modalHeader: {
            fontSize: '22px',
            fontWeight: '700',
            color: '#1c1c1e',
            letterSpacing: '-0.5px'
        },
        modalSubHeader: {
            fontSize: '15px',
            color: '#8e8e93',
            marginBottom: '16px',
            lineHeight: '1.4'
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        },
        input: {
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid #e5e5ea',
            fontSize: '16px',
            backgroundColor: '#f2f2f7', // Matching Dashboard inputs
            outline: 'none',
            color: '#1c1c1e',
            width: '100%',
            boxSizing: 'border-box'
        },
        buttonContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '12px'
        },
        submitBtn: {
            backgroundColor: loading ? '#c7c7cc' : '#007aff',
            color: 'white',
            border: 'none',
            borderRadius: '14px',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: loading ? 'default' : 'pointer',
            transition: 'all 0.2s ease'
        },
        cancelBtn: {
            backgroundColor: 'transparent',
            color: '#ff3b30',
            border: 'none',
            padding: '12px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer'
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '430px', margin: '0 auto' }}>
            <button style={styles.actionButton} onClick={() => setShowModal(true)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>🔒</span>
                    <span>Security Settings</span>
                </div>
                <span style={{ color: '#007aff', fontSize: '14px' }}>Change</span>
            </button>

            {showModal && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.modalHeader}>Change Password</h2>
                        <p style={styles.modalSubHeader}>
                            Keep your account secure by choosing a strong password.
                        </p>

                        <div style={styles.inputGroup}>
                            <input 
                                style={styles.input}
                                type="password"
                                name="oldPassword"
                                placeholder="Current password"
                                value={passwords.oldPassword}
                                onChange={handleInputChange}
                            />
                            
                            <div style={{ height: '1px', backgroundColor: '#e5e5ea', margin: '8px 0' }} />

                            <input 
                                style={styles.input}
                                type="password"
                                name="newPassword"
                                placeholder="New password"
                                value={passwords.newPassword}
                                onChange={handleInputChange}
                            />
                            <input 
                                style={styles.input}
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm new password"
                                value={passwords.confirmPassword}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div style={styles.buttonContainer}>
                            <button 
                                style={styles.submitBtn} 
                                onClick={handleUpdatePassword}
                                disabled={loading}
                            >
                                {loading ? 'Updating Security...' : 'Update Password'}
                            </button>
                            
                            <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}