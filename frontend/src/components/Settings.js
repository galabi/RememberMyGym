import PasswordChange from './PasswordChange';

const Settings = ({ user, onLogout }) => {
    const initials = user?.full_name
        ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <div style={styles.container}>
            <h1 style={styles.pageTitle}>Settings</h1>

            {/* Profile card */}
            <div style={styles.profileCard}>
                <div style={styles.avatar}>{initials}</div>
                <div>
                    <div style={styles.profileName}>{user?.full_name || 'User'}</div>
                    <div style={styles.profileSub}>Personal Account</div>
                </div>
            </div>

            {/* Account section */}
            <div style={styles.sectionLabel}>ACCOUNT</div>
            <div style={styles.group}>
                <PasswordChange userId={user?._id || user?.id} />
            </div>

            {/* Sign out */}
            <div style={styles.sectionLabel}>SESSION</div>
            <div style={styles.group}>
                <button style={styles.signOutRow} onClick={onLogout}>
                    <div style={styles.rowLeft}>
                        <div style={{ ...styles.rowIcon, backgroundColor: '#fff0f0' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                        </div>
                        <span style={styles.signOutLabel}>Sign Out</span>
                    </div>
                </button>
            </div>

            <p style={styles.version}>RememberMyGym · v1.0</p>
        </div>
    );
};

const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const styles = {
    container: {
        padding: '0 20px 40px',
        paddingTop: 'max(20px, env(safe-area-inset-top))',
        backgroundColor: '#f2f2f7',
        minHeight: '100dvh',
        fontFamily: font,
        maxWidth: '430px',
        margin: '0 auto',
        boxSizing: 'border-box',
    },
    pageTitle: {
        fontSize: '32px',
        fontWeight: '800',
        letterSpacing: '-1px',
        color: '#1c1c1e',
        margin: '0 0 24px',
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: '18px',
        padding: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '28px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    },
    avatar: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#007aff',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: '700',
        flexShrink: 0,
    },
    profileName: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#1c1c1e',
    },
    profileSub: {
        fontSize: '13px',
        color: '#8e8e93',
        marginTop: '2px',
    },
    sectionLabel: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#8e8e93',
        letterSpacing: '0.5px',
        marginBottom: '8px',
        paddingLeft: '4px',
    },
    group: {
        backgroundColor: '#fff',
        borderRadius: '18px',
        overflow: 'hidden',
        marginBottom: '28px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    },
    signOutRow: {
        width: '100%',
        background: 'none',
        border: 'none',
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    signOutLabel: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#ff3b30',
    },
    version: {
        textAlign: 'center',
        fontSize: '13px',
        color: '#c7c7cc',
        marginTop: '8px',
    },
};

export default Settings;
