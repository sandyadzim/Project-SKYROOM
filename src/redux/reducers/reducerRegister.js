import * as types from '../types'

const initialState = {
    register:[]
}

export default function reducerRegister(state = initialState, action){
    switch (action.type){
        case `${types.REGISTER}_PENDING`:
        return {
            ...state
        }
        case `${types.REGISTER}_FULFILLED`:
        return {
            ...state,
            register : action.payload.data
        }
        case `${types.REGISTER}_REJECTED`:
        return {
            ...state
        }
        default:
        return state;
    }
}