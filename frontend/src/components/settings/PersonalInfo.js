import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const genderOptions = [
    { value: 'male', label: 'Male', icon: '♂' },
    { value: 'female', label: 'Female', icon: '♀' },
    { value: 'other', label: 'Other', icon: '⚧' },
];

export default function PersonalInfo({ userId, currentBirthDate, currentGender, onUpdated }) {
    const [showModal, setShowModal] = useState(false);
    const [birthDate, setBirthDate] = useState(currentBirthDate || '');
    const [gender, setGender] = useState(currentGender || '');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        document.body.style.overflow = showModal ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [showModal]);

    const handleOpen = () => {
        setBirthDate(currentBirthDate || '');
        setGender(currentGender || '');
        setErrorMsg('');
        setSuccessMsg('');
        setShowModal(true);
    };

    const handleUpdate = async () => {
        setErrorMsg('');
        setSuccessMsg('');
        if (!gender) { setErrorMsg('Please select a gender.'); return; }

        setLoading(true);
        try {
            await axios.patch(`${API_BASE_URL}/api/users/complete-registration/${userId}`, { birth_date: birthDate, gender });
            setSuccessMsg('Personal info updated!');
            onUpdated({ birth_date: birthDate, gender });
            setTimeout(() => setShowModal(false), 1200);
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Failed to update info.');
        } finally {
            setLoading(false);
        }
    };

    const displayValue = () => {
        const parts = [];
        if (currentGender) parts.push(currentGender.charAt(0).toUpperCase() + currentGender.slice(1));
        if (currentBirthDate) {
            const date = new Date(currentBirthDate);
            if (!isNaN(date)) parts.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
        }
        return parts.length ? parts.join(' · ') : 'Not set';
    };

    return (
        <>
            <button style={styles.row} onClick={handleOpen}>
                <div style={styles.rowLeft}>
                    <div style={styles.rowIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                    </div>
                    <span style={styles.rowLabel}>Personal Info</span>
                </div>
                <div style={styles.rowRight}>
                    <span style={styles.rowValue}>{displayValue()}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c7c7cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </div>
            </button>

            {showModal && (
                <div style={styles.overlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>Personal Info</h2>
                            <button style={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <p style={styles.modalSub}>Used to personalize your AI workout plans.</p>

                        {errorMsg && <div style={styles.errorBanner}>{errorMsg}</div>}
                        {successMsg && <div style={styles.successBanner}>{successMsg}</div>}

                        <div style={styles.field}>
                            <label style={styles.label}>Date of Birth</label>
                            <input
                                type="date"
                                style={styles.input}
                                value={birthDate}
                                onChange={e => setBirthDate(e.target.value)}
                            />
                        </div>

                        <div style={{ ...styles.field, marginTop: '16px' }}>
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
                                        <span style={{ ...styles.genderLabel, color: gender === opt.value ? '#007aff' : '#3a3a3c' }}>{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1, marginTop: '24px' }} onClick={handleUpdate} disabled={loading}>
                            {loading ? 'Saving…' : 'Save Changes'}
                        </button>
                        <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </>
    );
}

const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const styles = {
    row: { width: '100%', background: 'none', border: 'none', borderTop: '1px solid #f2f2f7', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontFamily: font, boxSizing: 'border-box' },
    rowLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
    rowIcon: { width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#e8f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    rowLabel: { fontSize: '16px', fontWeight: '600', color: '#1c1c1e' },
    rowRight: { display: 'flex', alignItems: 'center', gap: '6px' },
    rowValue: { fontSize: '14px', color: '#8e8e93', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', zIndex: 2000, touchAction: 'none' },
    modal: { backgroundColor: '#fff', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '380px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', fontFamily: font, display: 'flex', flexDirection: 'column' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
    modalTitle: { fontSize: '22px', fontWeight: '800', color: '#1c1c1e', margin: 0, letterSpacing: '-0.5px' },
    closeBtn: { background: '#f2f2f7', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontSize: '13px', color: '#8e8e93', fontWeight: '700' },
    modalSub: { fontSize: '14px', color: '#8e8e93', margin: '0 0 18px', lineHeight: '1.4' },
    errorBanner: { backgroundColor: '#fff2f2', border: '1px solid #ffcdd2', color: '#d32f2f', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', fontWeight: '500', marginBottom: '14px' },
    successBanner: { backgroundColor: '#f0fff4', border: '1px solid #b2dfdb', color: '#1b8a4a', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', fontWeight: '500', marginBottom: '14px' },
    field: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '12px', fontWeight: '600', color: '#3a3a3c', letterSpacing: '0.2px' },
    input: { padding: '13px 16px', borderRadius: '12px', border: '1.5px solid #e5e5ea', fontSize: '16px', backgroundColor: '#f9f9fb', outline: 'none', color: '#1c1c1e', width: '100%', boxSizing: 'border-box' },
    genderGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' },
    genderCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '16px 8px', borderRadius: '14px', border: '1.5px solid', cursor: 'pointer' },
    genderIcon: { fontSize: '22px', lineHeight: 1 },
    genderLabel: { fontSize: '13px', fontWeight: '600' },
    submitBtn: { width: '100%', padding: '15px', borderRadius: '14px', border: 'none', backgroundColor: '#007aff', color: '#fff', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,122,255,0.3)', marginBottom: '8px' },
    cancelBtn: { width: '100%', background: 'none', border: 'none', color: '#ff3b30', fontSize: '15px', fontWeight: '600', padding: '10px', cursor: 'pointer' },
};
