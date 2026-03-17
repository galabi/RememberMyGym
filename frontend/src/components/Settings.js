
const globalStyles = `
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type="number"] {
        -moz-appearance: textfield;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .group-header {
        background-color: transparent;
        transition: background-color 0.2s ease;
    }
`;

const Settings = ({ user, onLogout }) => {


    return (
        <div style={styles.container}>
            <style>{globalStyles}</style>
            <div style={{padding: '20px'}}>
                <h2>Settings (soon)</h2>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={onLogout} style={styles.logoutButton}>Logout</button>
                 </div>      
            </div>
        </div>
    );
};

const styles = {
    logoutButton: {
        backgroundColor: '#ff3b30',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '8px',
        width: '100%',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    container: {
        padding: '20px',
        paddingTop: 'max(20px, env(safe-area-inset-top))',  
        paddingBottom: '20px',
        backgroundColor: '#f9f9fb',
        minHeight: '100dvh', 
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        maxWidth: '430px',
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
    },};
export default Settings;