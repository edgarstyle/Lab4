import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE
} from '../actions/authActions';

const initialState = {
  isAuthenticated: false,
  userId: null,
  username: null,
  loading: false,
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        userId: action.payload.userId,
        username: action.payload.username,
        loading: false,
        error: null
      };
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        userId: null,
        username: null,
        loading: false,
        error: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        userId: null,
        username: null,
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

export default authReducer;

