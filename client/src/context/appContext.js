import React, { useReducer, useContext } from 'react';
import axios from 'axios';
import reducer from './reducer';
import { DISPLAY_ALERT, CLEAR_ALERT, SETUP_USER_BEGIN, SETUP_USER_SUCCESS, SETUP_USER_ERROR } from './action';

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: null,
  token: null,
  userLocation: '',
};
const AppContext = React.createContext();
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({
        type: CLEAR_ALERT,
      });
    }, 3000);
  };

  const registerUser = async currentUser => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const { data } = await axios.post('/api/v1/auth/register', currentUser);
      const { user, token } = data;
      dispatch({ type: SETUP_USER_SUCCESS, payload: { user, token } });
    } catch ({ response }) {
      dispatch({ type: SETUP_USER_ERROR, payload: { message: response.data.message } });
      clearAlert();
    }
  };

  return (
    <AppContext.Provider value={{ ...state, displayAlert, registerUser }}>{children}</AppContext.Provider>
  );
};

// make sure use
const useAppConsumer = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppConsumer };
