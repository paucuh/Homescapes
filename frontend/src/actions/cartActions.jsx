import axios from "axios";
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/cartConstants.jsx";

export const addToCart = (id, qty) => async (dispatch, getState) => {
    const { data } = await axios.get(`https://homescapes-backend-feb38c088c8f.herokuapp.com/api/house/${id}`);
    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            name: data.name,
            image: data.image,
            price: data.price,
            house: data._id,
        },
    });
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id,
    });
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
}
export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: data });
    localStorage.setItem("paymentMethod", JSON.stringify(data));
}