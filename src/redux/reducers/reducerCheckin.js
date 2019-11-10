import * as types from './../types'

const initialState = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    checkin: [],
    addCheckin: [],
    checkout: []
}

export default function reducerCheckin(state = initialState, action){
    switch (action.type){
        case `${types.GET_CHECKIN}_PENDING`:
        return {
            ...state,
            isLoading:true
        }
        case `${types.GET_CHECKIN}_FULFILLED`:
        return {
            ...state,
            isLoading:false,
            isSuccess:true,
            checkin: action.payload.data
        }
        case `${types.GET_CHECKIN}_REJECTED`:
        return {
            ...state,
            isLoading:false,
            isError:true
        }

        // Add Checkin
        case `${types.ADD_CHECKIN}_PENDING`:
        return {
            ...state,
            isLoading: true
        }
        case `${types.ADD_CHECKIN}_FULFILLED`:
        return {
            ...state,
            isLoading: false,
            isSuccess: true,
            addCheckin: action.payload.data
        }
        case `${types.ADD_CHECKIN}_REJECTED`:
        return {
            ...state,
            isLoading: false,
            isError: true
        }

        //Checkout
        case `${types.CHECKOUT}_PENDING`:
        return {
            ...state,
            isLoading: true
        }
        case `${types.CHECKOUT}_FULFILLED`:
        return {
            ...state,
            isLoading: false,
            isSuccess: true,
            checkout: action.payload.data
        }
        case `${types.CHECKOUT}_REJECTED`:
        return {
            ...state,
            isLoading: false,
            isError: true
        }
        
        default:
        return state;
    }
}