import * as types from './../types'

const initialState = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    customer: [],
    addCustomer: [],
    editCustomer:[],
    deleteCustomer:[]
}

export default function reducerCustomer(state = initialState, action){
    switch (action.type){
        case `${types.GET_CUSTOMER}_PENDING`:
        return {
            ...state,
            isLoading:true
        }
        case `${types.GET_CUSTOMER}_FULFILLED`:
        return {
            ...state,
            isLoading:false,
            isSuccess:true,
            customer: action.payload.data
        }
        case `${types.GET_CUSTOMER}_REJECTED`:
        return {
            ...state,
            isLoading:false,
            isError:true
        }
        //ADD CUSTOMER
        case `${types.ADD_CUSTOMER}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.ADD_CUSTOMER}_FULFILLED`:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                addCustomer: action.payload.data
            }
        case `${types.ADD_CUSTOMER}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }

        // UPDATE CUSTOMER
        case `${types.UPDATE_CUSTOMER}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.UPDATE_CUSTOMER}_FULFILLED`:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                editCustomer: action.payload.data
            }
        case `${types.UPDATE_CUSTOMER}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }

        // DELETE CUSTOMER
        case `${types.DELETE_CUSTOMER}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.DELETE_CUSTOMER}_FULFILLED`:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                deleteCustomer: action.payload.data
            }
        case `${types.DELETE_CUSTOMER}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        
        default:
        return state;
    }
}