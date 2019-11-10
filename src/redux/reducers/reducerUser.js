import * as types from './../types'

const initialState = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    user: [],
    editUser: []
}

export default function reducerUser(state = initialState, action){
    switch (action.type){
        case `${types.USER}_PENDING`:
        return {
            ...state,
            isLoading:true
        }
        case `${types.USER}_FULFILLED`:
        return {
            ...state,
            isLoading:false,
            isSuccess:true,
            user: action.payload.data
        }
        case `${types.USER}_REJECTED`:
        return {
            ...state,
            isLoading:false,
            isError:true
        }
        
        //Update User

        case `${types.UPDATE_USER}_PENDING`:
        return {
            ...state,
            isLoading: true
        }
        case `${types.UPDATE_USER}_FULFILLED`:
        return {
            ...state,
            isLoading: false,
            isSuccess: true,
            editUser: action.payload.data
        }
        case `${types.UPDATE_USER}_REJECTED`:
        return {
            ...state,
            isLoading: false,
            isError: true
        }
        
        default:
        return state;
    }
}