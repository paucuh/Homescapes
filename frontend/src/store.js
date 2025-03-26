import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk'
import { houseListReducer, houseDetailReducer, houseCreateReducer, houseSearchReducer, userHousesReducer, houseUpdateReducer } from './reducers/houseReducers'
import { userLoginReducer, userProfileReducer, userRegisterReducer, userUpdateProfileReducer } from './reducers/userReducers'
import { chatListReducer, chatReducer } from './reducers/chatReducers'
import { cartReducer } from './reducers/cartReducers'
import { orderCreateReducer, orderDetailsReducer, orderListMyReducer, orderPayReducer } from './reducers/orderReducers'

const reducer = combineReducers({
    houseList: houseListReducer,
    houseDetail: houseDetailReducer,
    userLogin: userLoginReducer,
    userProfile: userProfileReducer,
    userUpdateProfile: userUpdateProfileReducer,
    houseCreate: houseCreateReducer,
    userRegister: userRegisterReducer,
    houseSearch: houseSearchReducer,
    userHouses: userHousesReducer,
    houseUpdate: houseUpdateReducer,
    chat: chatReducer,
    chatList: chatListReducer,
    cart: cartReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderListMy: orderListMyReducer,
    orderPay: orderPayReducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
const paymentMethodFromStorage = localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')) : '';

const InitialState = { 
    userLogin: {userInfo: userInfoFromStorage},
    cart: {
        cartItems: cartItemsFromStorage,
        paymentMethod: paymentMethodFromStorage
    }
}

const store = configureStore({
    reducer,
    preloadedState:InitialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})

export default store;