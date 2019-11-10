import * as types from '../types'
import axios from 'axios'
import {API} from '../../host'

export const handleGetUser = () => ({
    type: types.USER,
    payload: axios({
        method: 'GET',
        url: `${API}/users`,
        // headers:{
        //     Authorization: params.token
        // }
    })
})

export const handleUpdateUser = (id, avatar) => ({
    type: types.UPDATE_USER,
    payload: axios({
        method: 'put',
        url: `${API}/user/${id}`,
        data: {
            avatar: avatar
        },
        // headers: {
        //     Authorization: `${token}`
        // }
    })
})