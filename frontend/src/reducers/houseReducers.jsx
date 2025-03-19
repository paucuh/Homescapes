import {
    HOUSE_LIST_REQUEST,
    HOUSE_LIST_SUCCESS,
    HOUSE_LIST_FAIL,
    HOUSE_DETAILS_REQUEST,
    HOUSE_DETAILS_SUCCESS,
    HOUSE_DETAILS_FAIL,
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