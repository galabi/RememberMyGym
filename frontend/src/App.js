import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Cookies from 'js-cookie';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check for existing session on component mount
  useEffect(() => {
    const userId = Cookies.get('user_id');
    const fullName = Cookies.get('full_name');
    const isLogged = Cookies.get('isLoggedIn');

    if (isLogged === 'true' && userId && fullName) {
      // Restore user session from cookies
      setUser({
        _id: userId,
        full_name: fullName
      });
      setIsLoggedIn(true);
    }
  }, []);

  // This function is triggered after successful login
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard user={user} />
      )}
    </div>
  );
}

export default App;