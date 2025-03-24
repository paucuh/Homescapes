import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk'
import { houseListReducer, houseDetailReducer, houseCreateReducer, houseSearchReducer, userHousesReducer, houseUpdateReducer } from './reducers/houseReducers'
import { userLoginReducer, userProfileReducer, userRegisterReducer } from './reducers/userReducers'
import { chatListReducer, chatReducer } from './reducers/chatReducers'

const reducer = combineReducers({
    houseList: houseListReducer,
    houseDetail: houseDetailReducer,
    userLogin: userLoginReducer,
    userProfile: userProfileReducer,
    houseCreate: houseCreateReducer,
    userRegister: userRegisterReducer,
    houseSearch: houseSearchReducer,
    userHouses: userHousesReducer,
    houseUpdate: houseUpdateReducer,
    chat: chatReducer,
    chatList: chatListReducer
})

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null

const InitialState = { 
    userLogin: {userInfo: userInfoFromStorage},
}

const store = configureStore({
    reducer,
    preloadedState:InitialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})

export default store;