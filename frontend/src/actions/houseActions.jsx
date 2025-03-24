import {
    HOUSE_LIST_REQUEST,
    HOUSE_LIST_SUCCESS,
    HOUSE_LIST_FAIL,
    HOUSE_DETAILS_REQUEST,
    HOUSE_DETAILS_SUCCESS,
    HOUSE_DETAILS_FAIL,
    CREATE_HOUSE_SUCCESS,
    CREATE_HOUSE_FAIL,
    USER_HOUSES_REQUEST,
    USER_HOUSES_SUCCESS,
    USER_HOUSES_FAIL,
    HOUSE_UPDATE_REQUEST,
    HOUSE_UPDATE_SUCCESS,
    HOUSE_UPDATE_FAIL,
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

export const createHouse = (houseData) => async (dispatch, getState) => {
    try {
        const { userLogin: { userInfo } } = getState();
  
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
  
        const { data } = await axios.post('/api/houses/create/', houseData, config);
  
        dispatch({ type: CREATE_HOUSE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: CREATE_HOUSE_FAIL,
            payload: error.response?.data?.detail || error.message,
        });
    }
};

export const searchHouses = (address) => async (dispatch) => {
    try {
        dispatch({ type: HOUSE_LIST_REQUEST });

        const { data } = await axios.get(`/api/houses/search/?address=${address}`);  // Use the new API endpoint

        dispatch({
            type: HOUSE_LIST_SUCCESS,
            payload: data,
        });
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

export const listUserHouses = () => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_HOUSES_REQUEST });

        const { userLogin } = getState();
        const { userInfo } = userLogin;

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,  // Add token for authentication
            },
        };

        const { data } = await axios.get('/api/user/houses/', config);  // Make API call to get houses listed by the user

        dispatch({ type: USER_HOUSES_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_HOUSES_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const updateHouse = (id, houseData) => async (dispatch, getState) => {
    try {
        dispatch({ type: HOUSE_UPDATE_REQUEST });

        const { userLogin: { userInfo } } = getState();
        
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(`/api/house/${id}/`, houseData, config);  // Update the house

        dispatch({
            type: HOUSE_UPDATE_SUCCESS,
            payload: data,
        });
        
        // No need to trigger another API call here
    } catch (error) {
        dispatch({
            type: HOUSE_UPDATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const deleteHouse = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'HOUSE_DELETE_REQUEST' });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        await axios.delete(`/api/houses/delete/${id}/`, config);

        dispatch({ type: 'HOUSE_DELETE_SUCCESS' });
    } catch (error) {
        dispatch({
            type: 'HOUSE_DELETE_FAIL',
            payload: error.response?.data?.detail || error.message,
        });
    }
};