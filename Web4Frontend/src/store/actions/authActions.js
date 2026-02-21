import axios from 'axios';

const API_URL = '/web4/api';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export const login = (username, password) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });
      if (response.data.success) {
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('username', response.data.username);
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {
            userId: response.data.userId,
            username: response.data.username
          }
        });
      } else {
        dispatch({
          type: LOGIN_FAILURE,
          payload: response.data.message || 'Ошибка входа'
        });
      }
    } catch (error) {
      dispatch({
        type: LOGIN_FAILURE,
        payload: error.response?.data?.message || 'Ошибка подключения к серверу'
      });
    }
  };
};

export const register = (username, password) => {
  return async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        password
      });
      if (response.data.success) {
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('username', response.data.username);
        dispatch({
          type: REGISTER_SUCCESS,
          payload: {
            userId: response.data.userId,
            username: response.data.username
          }
        });
      } else {
        dispatch({
          type: REGISTER_FAILURE,
          payload: response.data.message || 'Ошибка регистрации'
        });
      }
    } catch (error) {
      dispatch({
        type: REGISTER_FAILURE,
        payload: error.response?.data?.message || 'Ошибка подключения к серверу'
      });
    }
  };
};

export const logout = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  return { type: LOGOUT };
};

export const checkAuth = () => {
  return (dispatch) => {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    if (userId && username) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { userId: parseInt(userId), username }
      });
    }
  };
};


