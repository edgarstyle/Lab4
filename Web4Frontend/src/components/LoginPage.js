import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, register } from '../store/actions/authActions';
import { TextInput, Button } from './BelleComponents';
import { showNotification } from './Notification';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showNotification('Заполните все поля', 'error');
      return;
    }

    try {
      if (isRegister) {
        await dispatch(register(username, password));
        showNotification('Регистрация успешна', 'success');
      } else {
        await dispatch(login(username, password));
        showNotification('Вход выполнен', 'success');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.entity || 
                          error.response?.data?.error || 
                          'Произошла ошибка';
      showNotification(errorMessage, 'error');
    }
  };

  return (
    <div className="login-page">
      <h1>Павлов Эдгар P3216 88744</h1>
      <div className="login-container">
        <h2>{isRegister ? 'Регистрация' : 'Вход'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Имя пользователя:</label>
            <TextInput
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите имя пользователя"
            />
          </div>
          <div className="form-group">
            <label>Пароль:</label>
            <TextInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
            />
          </div>
          <Button type="submit" primary>
            {isRegister ? 'Зарегистрироваться' : 'Войти'}
          </Button>
          <Button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            style={{ marginTop: '10px' }}
          >
            {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

