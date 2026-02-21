import axios from 'axios';

const API_URL = '/web4/api';

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
    dispatch({ type: CHECK_POINT_REQUEST });
    try {
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
      // Извлекаем сообщение об ошибке из ответа сервера
      let errorMessage = 'Ошибка проверки точки';
      if (error.response) {
        // JAX-RS возвращает ошибки как строку в response.data
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data && typeof error.response.data === 'object') {
          // Если объект, пытаемся извлечь сообщение
          errorMessage = error.response.data.message || 
                        error.response.data.entity || 
                        error.response.data.error ||
                        JSON.stringify(error.response.data);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      dispatch({
        type: CHECK_POINT_FAILURE,
        payload: errorMessage
      });
    }
  };
};

export const fetchResults = (userId) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_RESULTS_REQUEST });
    try {
      const response = await axios.get(`${API_URL}/results?userId=${userId}`);
      dispatch({
        type: FETCH_RESULTS_SUCCESS,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: FETCH_RESULTS_FAILURE,
        payload: error.response?.data || 'Ошибка загрузки результатов'
      });
    }
  };
};

export const clearResults = (userId) => {
  return async (dispatch) => {
    dispatch({ type: CLEAR_RESULTS_REQUEST });
    try {
      await axios.delete(`${API_URL}/results?userId=${userId}`);
      dispatch({ type: CLEAR_RESULTS_SUCCESS });
      dispatch(fetchResults(userId));
    } catch (error) {
      dispatch({
        type: CLEAR_RESULTS_FAILURE,
        payload: error.response?.data || 'Ошибка очистки результатов'
      });
    }
  };
};


