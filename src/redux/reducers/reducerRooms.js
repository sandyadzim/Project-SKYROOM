import * as types from './../types'

const initialState = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    rooms: [],
    addRoom:[],
    deleteRoom:[]
};

export default function reducerRoom(state = initialState, action) {
    switch (action.type) {
        // GET Rooms
        case `${types.GET_ROOM}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.GET_ROOM}_FULFILLED`:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                rooms: action.payload.data
            }
        case `${types.GET_ROOM}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        
        // Add Room
        case `${types.ADD_ROOM}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.ADD_ROOM}_FULFILLED`:
            // state.rooms.push(action.payload.data)
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                addRoom: action.payload.data
            }
        case `${types.ADD_ROOM}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }

        // Update Room
        case `${types.UPDATE_ROOM}_PENDING`:
            return {
                ...state,
                isLoading: true
            }
        case `${types.UPDATE_ROOM}_FULFILLED`:
            let index = state.rooms.findIndex( x => x.id == action.payload.data.id);
            state.rooms[index] = action.payload.data;
            return {
                ...state,
                isLoading: false,
                isSuccess: true
            }
        case `${types.UPDATE_ROOM}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }

        // Delete Room
        case `${types.DELETE_ROOM}_PENDING`:
            return {
                ...state,
                isLoading:true
            }
        case `${types.DELETE_ROOM}_FULFILLED`:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                deleteRoom: action.payload.data
            }
        case `${types.DELETE_ROOM}_REJECTED`:
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        default:
            return state
    }
}