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
} from '../constants/houseConstants';

export const houseListReducer = (state = { houses: [] }, action) => {
    switch (action.type) {
        case HOUSE_LIST_REQUEST:
            return { loading: true, houses: [] }
        case HOUSE_LIST_SUCCESS:
            return { loading: false, houses: action.payload }
        case HOUSE_LIST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
};

export const houseDetailReducer = (state = { house: [] }, action) => {
    switch (action.type) {
        case HOUSE_DETAILS_REQUEST:
            return { loading: true, house: [] }
        case HOUSE_DETAILS_SUCCESS:
            return { loading: false, house: action.payload }
        case HOUSE_DETAILS_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
};

export const houseCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_HOUSE_SUCCESS:
            return { success: true, house: action.payload };
        case CREATE_HOUSE_FAIL:
            return { success: false, error: action.payload };
        default:
            return state;
    }
};

export const houseSearchReducer = (state = { houses: [] }, action) => {
    switch (action.type) {
        case HOUSE_LIST_REQUEST:
            return { loading: true, houses: [] };
        case HOUSE_LIST_SUCCESS:
            return { loading: false, houses: action.payload };
        case HOUSE_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const userHousesReducer = (state = { houses: [] }, action) => {
    switch (action.type) {
        case USER_HOUSES_REQUEST:
            return { loading: true };
        case USER_HOUSES_SUCCESS:
            return { loading: false, houses: action.payload };
        case USER_HOUSES_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const houseUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case HOUSE_UPDATE_REQUEST:
            return { loading: true };
        case HOUSE_UPDATE_SUCCESS:
            return { loading: false, success: true, house: action.payload };
        case HOUSE_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};