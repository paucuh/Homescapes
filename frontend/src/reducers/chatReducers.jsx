import {
    USER_CHAT_LIST_REQUEST,
    USER_CHAT_LIST_SUCCESS,
    USER_CHAT_LIST_FAIL,
    CHAT_HISTORY_SUCCESS,
    CHAT_HISTORY_FAIL,
    CHAT_MESSAGE_RECEIVED,
    CHAT_MESSAGE_SENT,
  } from '../constants/chatConstants';
  
export const chatReducer = (state = { messages: [] }, action) => {
    switch (action.type) {
      case CHAT_HISTORY_SUCCESS:
        return { ...state, messages: action.payload };
  
      case CHAT_HISTORY_FAIL:
        return { ...state, error: action.payload };
  
      case CHAT_MESSAGE_RECEIVED:
      case CHAT_MESSAGE_SENT:
        return { ...state, messages: [...state.messages, action.payload] };
  
      default:
        return state;
    }
  };

export const chatListReducer = (state = { chats: [] }, action) => {
    switch (action.type) {
      case USER_CHAT_LIST_REQUEST:
        return { loading: true, chats: [] };
      case USER_CHAT_LIST_SUCCESS:
        return { loading: false, chats: action.payload };
      case USER_CHAT_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };