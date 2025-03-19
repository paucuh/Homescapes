import {
    HOUSE_LIST_REQUEST,
    HOUSE_LIST_SUCCESS,
    HOUSE_LIST_FAIL,
    HOUSE_DETAILS_REQUEST,
    HOUSE_DETAILS_SUCCESS,
    HOUSE_DETAILS_FAIL,
} from "../constants/houseConstants";
import axios from "axios";

export const listHouses = () => async (dispatch) => {
    try {
        dispatch({ type: HOUSE_LIST_REQUEST });
        const { data } = await axios.get(`/api/houses/`);
        dispatch({ type: HOUSE_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: HOUSE_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const listHouseDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: HOUSE_DETAILS_REQUEST });
        const { data } = await axios.get(`/api/house/${id}/`);
        dispatch({ type: HOUSE_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: HOUSE_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};