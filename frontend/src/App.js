import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Cookies from 'js-cookie';
import BottomNav from './components/Toolbar';
import WorkoutPlaner from './components/WorkoutPlaner';
import SignUp from './components/SignUpMeneger';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(Cookies.get('isLoggedIn') === 'true');
    const [activeTab, setActiveTab] = useState('dashboard'); // default to dashboard tab
    const [user, setUser] = useState({
        _id: Cookies.get('user_id'),
        full_name: Cookies.get('full_name')
    });
    const [signUpScreen, setSignUpScreen] = useState(false);

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

    if (!isLoggedIn && !signUpScreen) {
        return (
            <Login 
                onLoginSuccess={(userData) => {
                    setUser(userData);
                    setIsLoggedIn(true);
                    setActiveTab('dashboard');
                }} 
                onSignUpClick={() => setSignUpScreen(true)} 
            />
        );
    }else if (!isLoggedIn && signUpScreen) {
        return (
            <SignUp 
                onSignUpSuccess={(userData) => {
                    setUser(userData);
                    setIsLoggedIn(true);
                    setActiveTab('dashboard');
                }} 
                onLoginClick={() => setSignUpScreen(false)}
            />
        );
    }

return (
    <div style={styles.appContainer}> 
      <main style={styles.mainContent}>
        {renderContent()}
      </main>

      {/* bottom navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

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
};

export default App;