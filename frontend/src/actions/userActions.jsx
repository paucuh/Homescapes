import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
} from '../constants/userConstants';
import cookies from 'js-cookie';
import axios from 'axios';

export const login = (email, password) => async (dispatch) => {
  try{
      dispatch({
          type: USER_LOGIN_REQUEST,
      })
      const config = {
          headers: {
              'Content-Type': 'application/json'
          }
      }
      const {data} = await axios.post(
          'https://homescapes-backend-feb38c088c8f.herokuapp.com/api/users/login',
          {'email': email, 'password': password},
          config
          )
      dispatch({
          type: USER_LOGIN_SUCCESS,
          payload: data
      })

      localStorage.setItem('userInfo', JSON.stringify(data))


  } catch (error) {
      dispatch({
          type: USER_LOGIN_FAIL,
          payload:
              error.response && error.response.data.detail
                  ? error.response.data.detail
                  : error.message,
      });
  }
}

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  sessionStorage.clear();
  cookies.remove('token');

  dispatch({ type: USER_LOGOUT });

  window.location.href = '/login';
};

export const getUserProfile = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_PROFILE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo || !userInfo.token) {
      // Handle token missing or invalid case
      dispatch({
        type: USER_PROFILE_FAIL,
        payload: 'Token is missing or invalid',
      });
      return;
    }

    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    const { data } = await axios.get('https://homescapes-backend-feb38c088c8f.herokuapp.com/api/users/profile/', config);

    dispatch({
      type: USER_PROFILE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_PROFILE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_PROFILE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo || !userInfo.token) {
      dispatch({
        type: USER_PROFILE_FAIL,
        payload: 'Token is missing or invalid',
      });
      return;
    }

    const config = { headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo.token}`
      }
    };

    const { data } = await axios.put('https://homescapes-backend-feb38c088c8f.herokuapp.com/api/users/profile/update/', user, config);

    dispatch({
      type: USER_PROFILE_SUCCESS,
      payload: data,
    });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_PROFILE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
}



export const register = (username, email, password, role = 'Buyer', paypal_account_id) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const config = { headers: { 'Content-Type': 'application/json' } };

    const { data } = await axios.post('https://homescapes-backend-feb38c088c8f.herokuapp.com/api/users/register/', { username, email, password, role, paypal_account_id }, config);

    console.log('Registration successful, received data:', data); // Add this for debugging

    if (data.token) {
      dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
      
      // Automatically log the user in after registration
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

      // Store the data in localStorage to persist the session
      localStorage.setItem('userInfo', JSON.stringify(data));

      // Directly navigate to the profile or home page depending on the role
      if (data.role === 'Seller') {
        window.location.href = '/create-listing';  // Redirect Sellers to the listing creation page
      } else {
        window.location.href = '/';  // Buyers go to the homepage
      }
    } else {
      throw new Error('No token received after registration');
    }
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message,
    });
  }
};