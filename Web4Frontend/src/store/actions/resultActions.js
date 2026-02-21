import axios from 'axios';

const API_URL = 'http://localhost:8080/web4/api';

export const CHECK_POINT_REQUEST = 'CHECK_POINT_REQUEST';
export const CHECK_POINT_SUCCESS = 'CHECK_POINT_SUCCESS';
export const CHECK_POINT_FAILURE = 'CHECK_POINT_FAILURE';
export const FETCH_RESULTS_REQUEST = 'FETCH_RESULTS_REQUEST';
export const FETCH_RESULTS_SUCCESS = 'FETCH_RESULTS_SUCCESS';
export const FETCH_RESULTS_FAILURE = 'FETCH_RESULTS_FAILURE';
export const CLEAR_RESULTS_REQUEST = 'CLEAR_RESULTS_REQUEST';
export const CLEAR_RESULTS_SUCCESS = 'CLEAR_RESULTS_SUCCESS';
export const CLEAR_RESULTS_FAILURE = 'CLEAR_RESULTS_FAILURE';

export const checkPoint = (x, y, r, userId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: CHECK_POINT_REQUEST });
      const response = await axios.post(`${API_URL}/results/check?userId=${userId}`, {
        x,
        y,
        r
      });
      dispatch({
        type: CHECK_POINT_SUCCESS,
        payload: response.data
      });
      dispatch(fetchResults(userId));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.entity || 
                          error.response?.data?.error || 
                          error.message || 
                          'Ошибка проверки точки';
      dispatch({
        type: CHECK_POINT_FAILURE,
        payload: errorMessage
      });
      throw error;
    }
  };
};

export const fetchResults = (userId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_RESULTS_REQUEST });
      const response = await axios.get(`${API_URL}/results?userId=${userId}`);
      dispatch({
        type: FETCH_RESULTS_SUCCESS,
        payload: response.data
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.entity || 
                          error.response?.data?.error || 
                          error.message || 
                          'Ошибка загрузки результатов';
      dispatch({
        type: FETCH_RESULTS_FAILURE,
        payload: errorMessage
      });
    }
  };
};

export const clearResults = (userId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: CLEAR_RESULTS_REQUEST });
      await axios.delete(`${API_URL}/results?userId=${userId}`);
      dispatch({ type: CLEAR_RESULTS_SUCCESS });
      dispatch(fetchResults(userId));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.entity || 
                          error.response?.data?.error || 
                          error.message || 
                          'Ошибка очистки результатов';
      dispatch({
        type: CLEAR_RESULTS_FAILURE,
        payload: errorMessage
      });
      throw error;
    }
  };
};

