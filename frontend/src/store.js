import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk'
import { houseListReducer, houseDetailReducer } from './reducers/houseReducers'
import { userLoginReducer } from './reducers/userReducers'

const reducer = combineReducers({
    houseList: houseListReducer,
    houseDetail: houseDetailReducer,
    userLogin: userLoginReducer
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