import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextInput, Button } from './BelleComponents';
import { login, register } from '../store/actions/authActions';

const LoginPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      dispatch(register(username, password));
    } else {
      dispatch(login(username, password));
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <div className="header">
          <h1>Павлов Эдгар P3216 88744</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Имя пользователя:</label>
            <TextInput
              value={username}
              onUpdate={(value) => setUsername(value)}
              placeholder="Введите имя пользователя"
              required
              style={{ width: '100%' }}
            />
          </div>
          
          <div className="input-group">
            <label>Пароль:</label>
            <TextInput
              type="password"
              value={password}
              onUpdate={(value) => setPassword(value)}
              placeholder="Введите пароль"
              required
              style={{ width: '100%' }}
            />
          </div>
          
          {error && (
            <div className="error-message">{error}</div>
          )}
          
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <Button
              type="submit"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Загрузка...' : (isRegister ? 'Зарегистрироваться' : 'Войти')}
            </Button>
            
            <Button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              style={{ width: '100%', backgroundColor: '#6c757d' }}
            >
              {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

