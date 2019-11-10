import * as types from '../types'
import {API} from '../../host'
import axios from 'axios'

export const handleGetRooms = () => ({
    type: types.GET_ROOM,
    payload: axios({
        method: 'get',
        url: `${API}/rooms`,
        // headers: {
        //     Authorization: `${token}`
        // }
    })
});

export const handleAddRoom = (name, token) => ({
    type: types.ADD_ROOM,
    payload: axios({
        method: 'post',
        url: `${API}/room`,
        data: {
            name: name
        },
        headers: {
            Authorization: `${token}`
        }
    })
    // payload: axios.post(`${API}/room`, data, {
    //     headers: {"Authorization": `${token}`}
    // })
});

export const handleUpdateRoom = (id, name, token) => ({
    type: types.UPDATE_ROOM,
    payload: axios({
        method: 'put',
        url: `${API}/room/${id}`,
        data: {
            name: name
        },
        headers: {
            Authorization: `${token}`
        }
    })
})

export const handleDeleteRoom = (id, token) => ({
    type: types.DELETE_ROOM,
    payload: axios({
        method:'DELETE',
        url: `${API}/room/${id}`,
        headers:{
            Authorization: `${token}`
        }
    })
})