import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Cookies from 'js-cookie';
import BottomNav from './components/Toolbar';
import WorkoutPlaner from './components/WorkoutPlaner';
import SignUp from './components/SignUpMeneger';
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(Cookies.get('isLoggedIn') === 'true');
    const [activeTab, setActiveTab] = useState('dashboard'); // default to dashboard tab
    const [user, setUser] = useState({
        _id: Cookies.get('user_id'),
        full_name: Cookies.get('full_name')
    });
    const [signUpScreen, setSignUpScreen] = useState(false);
    const [serverError, setServerError] = useState(null); // null | 'server_down' | 'db_error'

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/health`);
                if (res.data.database !== 'connected') {
                    setServerError('db_error');
                } else {
                    setServerError(null);
                }
            } catch {
                setServerError('server_down');
            }
        };

        checkHealth();
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'workout':
        return <WorkoutPlaner />;
      case 'settings':
        return (<Settings user={user} onLogout={handleLogout}/>);
      default:
        return <Dashboard user={user} />;
    }
  };
  const handleLogout = () => {
    ['user_id', 'full_name', 'isLoggedIn'].forEach(c => Cookies.remove(c));
    setIsLoggedIn(false);
    setUser(null);
    setActiveTab('dashboard');
  };

    const errorBanner = serverError && (
        <div style={serverError === 'server_down' ? styles.bannerRed : styles.bannerOrange}>
            {serverError === 'server_down'
                ? 'Server is unreachable. Please check your connection.'
                : 'Database connection issue. Some features may not work.'}
        </div>
    );

    if (!isLoggedIn && !signUpScreen) {
        return (
            <>
                {errorBanner}
                <Login
                    onLoginSuccess={(userData) => {
                        setUser(userData);
                        setIsLoggedIn(true);
                        setActiveTab('dashboard');
                    }}
                    onSignUpClick={() => setSignUpScreen(true)}
                />
            </>
        );
    } else if (!isLoggedIn && signUpScreen) {
        return (
            <>
                {errorBanner}
                <SignUp
                    onSignUpSuccess={(userData) => {
                        setUser(userData);
                        setIsLoggedIn(true);
                        setActiveTab('dashboard');
                    }}
                    onLoginClick={() => setSignUpScreen(false)}
                />
            </>
        );
    }

return (
    <div style={styles.appContainer}>
      {errorBanner}
      <main style={styles.mainContent}>
        {renderContent()}
      </main>

      {/* bottom navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

const bannerBase = {
    width: '100%',
    padding: '10px 16px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    zIndex: 9999,
    boxSizing: 'border-box',
};

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh',
    width: '100vw',
    overflow: 'hidden'
  },
  mainContent: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    paddingBottom: '100px'
  },
  bannerRed: {
    ...bannerBase,
    backgroundColor: '#ff3b30',
    color: '#fff',
  },
  bannerOrange: {
    ...bannerBase,
    backgroundColor: '#ff9500',
    color: '#fff',
  },
};

export default App;