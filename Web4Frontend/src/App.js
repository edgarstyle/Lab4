import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from './store/actions/authActions';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="App">
      {isAuthenticated ? <MainPage /> : <LoginPage />}
    </div>
  );
}

export default App;

