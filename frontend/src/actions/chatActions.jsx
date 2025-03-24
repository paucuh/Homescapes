import axios from 'axios';
import {
  CHAT_MESSAGE_RECEIVED,
  CHAT_MESSAGE_SENT,
  USER_CHAT_LIST_REQUEST,
  USER_CHAT_LIST_SUCCESS,
  USER_CHAT_LIST_FAIL,
  CHAT_HISTORY_REQUEST,
  CHAT_HISTORY_SUCCESS,
  CHAT_HISTORY_FAIL,
} from '../constants/chatConstants';

export const fetchUserChatRooms = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_CHAT_LIST_REQUEST });

    const { userLogin: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    // ✅ This hits user_chat_rooms view
    const { data } = await axios.get(`/api/chats/`, config);

    dispatch({ type: USER_CHAT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_CHAT_LIST_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

export const receiveMessage = (message) => (dispatch) => {
  dispatch({ type: CHAT_MESSAGE_RECEIVED, payload: message });
};

export const sendMessage = (message) => (dispatch) => {
  dispatch({ type: CHAT_MESSAGE_SENT, payload: message });
};

export const fetchChatMessages = (roomId) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHAT_HISTORY_REQUEST });

    const { userLogin: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    // ✅ This hits get_chat_messages view
    const { data } = await axios.get(`/api/chat/${roomId}/`, config);

    dispatch({ type: CHAT_HISTORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CHAT_HISTORY_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};