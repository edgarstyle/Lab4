import React from 'react';
import { useSelector } from 'react-redux';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import NotificationContainer from './components/Notification';

function App() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <div className="app">
      <NotificationContainer />
      {isAuthenticated ? <MainPage /> : <LoginPage />}
    </div>
  );
}

export default App;

