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
            alert('please fill in all password fields');
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
            const response = await axios.patch(`${API_BASE_URL}/api/users/update/password/`, payload);

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
        actionButton: { backgroundColor: '#f2f2f7', color: '#007aff', border: 'none', borderRadius: '12px', padding: '12px 20px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', width: '100%', marginBottom: '10px' },
        modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
        modal: { backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', width: '90%', maxWidth: '400px', textAlign: 'right', direction: 'rtl' },
        modalHeader: { fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#1c1c1e' },
        modalSubHeader: { fontSize: '14px', color: '#8e8e93', marginBottom: '20px' },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' },
        input: { padding: '14px', borderRadius: '12px', border: '1px solid #e5e5ea', fontSize: '16px', backgroundColor: '#f9f9fb', outline: 'none', textAlign: 'right' },
        submitBtn: { backgroundColor: loading ? '#8e8e93' : '#007aff', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'default' : 'pointer', transition: 'background 0.2s' },
        cancelBtn: { backgroundColor: 'transparent', color: '#ff3b30', border: 'none', padding: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '10px' }
    };

    return (
        <>
            <button style={styles.actionButton} onClick={() => setShowModal(true)}>
                <span>🔒</span> change password
            </button>

            {showModal && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>Update Password</div>
                        <div style={styles.modalSubHeader}>Enter your current password and the new password</div>

                        <div style={styles.inputGroup}>
                            <input 
                                style={styles.input}
                                type="password"
                                name="oldPassword"
                                placeholder="Current password"
                                value={passwords.oldPassword}
                                onChange={handleInputChange}
                            />
                            
                            <div style={{ height: '1px', backgroundColor: '#e5e5ea', margin: '4px 0' }} />

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

                            <button 
                                style={styles.submitBtn} 
                                onClick={handleUpdatePassword}
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                            
                            <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}