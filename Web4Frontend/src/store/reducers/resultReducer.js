import {
  CHECK_POINT_REQUEST,
  CHECK_POINT_SUCCESS,
  CHECK_POINT_FAILURE,
  FETCH_RESULTS_REQUEST,
  FETCH_RESULTS_SUCCESS,
  FETCH_RESULTS_FAILURE,
  CLEAR_RESULTS_REQUEST,
  CLEAR_RESULTS_SUCCESS,
  CLEAR_RESULTS_FAILURE
} from '../actions/resultActions';

const initialState = {
  results: [],
  loading: false,
  error: null
};

const resultReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_POINT_REQUEST:
    case FETCH_RESULTS_REQUEST:
    case CLEAR_RESULTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case CHECK_POINT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };
    case FETCH_RESULTS_SUCCESS:
      return {
        ...state,
        results: action.payload,
        loading: false,
        error: null
      };
    case CLEAR_RESULTS_SUCCESS:
      return {
        ...state,
        results: [],
        loading: false,
        error: null
      };
    case CHECK_POINT_FAILURE:
    case FETCH_RESULTS_FAILURE:
    case CLEAR_RESULTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default resultReducer;

