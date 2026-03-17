import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Cookies from 'js-cookie';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(Cookies.get('isLoggedIn') === 'true');
    const [activeTab, setActiveTab] = useState('dashboard'); // default to dashboard tab
    const [user, setUser] = useState({
        _id: Cookies.get('user_id'),
        full_name: Cookies.get('full_name')
    });

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'workout':
        return <div style={{padding: '20px'}}><h2>Workout (soon)</h2></div>;
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

  if (!isLoggedIn) {
    return (
      <Login onLoginSuccess={(userData) => {
        setUser(userData);
        setIsLoggedIn(true);
        setActiveTab('dashboard');
        }} 
      />
    );
  }

  return (
    <div className="App" style={{ paddingBottom: '70px' }}> {/*space for bottom navigation*/}
      {renderContent()}

      {/* (Bottom Navigation) */}
        <nav style={styles.tabBar}>
          <button 
            onClick={() => setActiveTab('workout')} 
            style={{...styles.tabItem, color: activeTab === 'workout' ? '#007aff' : '#8e8e93'}}
          >
            <span style={{fontSize: '20px'}}>🏋️</span>
            <span style={{fontSize: '12px'}}>Workout</span>
          </button>
            
          <button 
            onClick={() => setActiveTab('dashboard')} 
            style={{...styles.tabItem, color: activeTab === 'dashboard' ? '#007aff' : '#8e8e93'}}
          >
            <span style={{fontSize: '20px'}}>🏠</span>
            <span style={{fontSize: '12px'}}>Dashboard</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')} 
            style={{...styles.tabItem, color: activeTab === 'settings' ? '#007aff' : '#8e8e93'}}
          >
            <span style={{fontSize: '20px'}}>⚙️</span>
            <span style={{fontSize: '12px'}}>Settings</span>
          </button>
      </nav>
  </div>
  );
}

const styles = {
  tabBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTop: '1px solid #e5e5ea',
    backdropFilter: 'blur(10px)',
    zIndex: 1000,
    paddingBottom: 'env(safe-area-inset-bottom)'
  },
  tabItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    gap: '4px',
    transition: 'color 0.2s ease'
  }
};

export default App;