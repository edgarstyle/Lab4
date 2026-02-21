import axios from 'axios';

const API_URL = 'http://localhost:8080/web4/api';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOGIN_REQUEST });
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          userId: response.data.userId,
          username: response.data.username
        }
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.entity || 
                          error.response?.data?.error || 
                          error.message || 
                          'Ошибка входа';
      dispatch({
        type: LOGIN_FAILURE,
        payload: errorMessage
      });
      throw error;
    }
  };
};

export const register = (username, password) => {
  return async (dispatch) => {
    try {
      dispatch({ type: REGISTER_REQUEST });
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        password
      });
      dispatch({
        type: REGISTER_SUCCESS,
        payload: {
          userId: response.data.userId,
          username: response.data.username
        }
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.entity || 
                          error.response?.data?.error || 
                          error.message || 
                          'Ошибка регистрации';
      dispatch({
        type: REGISTER_FAILURE,
        payload: errorMessage
      });
      throw error;
    }
  };
};

export const logout = () => {
  return {
    type: LOGOUT
  };
};

