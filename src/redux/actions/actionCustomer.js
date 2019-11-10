import * as types from '../types'
import axios from 'axios'
import {API} from '../../host'

export const handleGetCustomer = (token) => ({
    type: types.GET_CUSTOMER,
    payload: axios({
        method: 'GET',
        url: `${API}/customers`,
        headers: {
            Authorization: `${token}`
        }
    })
})

export const handleAddCustomer = (name, identity_number, phone_number, image, token) => ({
    type: types.ADD_CUSTOMER,
    payload: axios({
        method: 'post',
        url: `${API}/customer`,
        data: {
            name,
            identity_number,
            phone_number,
            image
        },
        headers: {
            Authorization: `${token}`
        }
    })
});

export const handleUpdateCustomer = (id, name, identity_number, phone_number, image, token) => ({
    type: types.UPDATE_CUSTOMER,
    payload: axios({
        method: 'put',
        url: `${API}/customer/${id}`,
        data:{
            name,
            identity_number,
            phone_number,
            image
        },
        headers: {
            Authorization: `${token}`
        }
    })
})

export const handleDeleteCustomer = (id, token) => ({
    type: types.DELETE_CUSTOMER,
    payload: axios({
        method:'DELETE',
        url: `${API}/customer/${id}`,
        headers:{
            Authorization: `${token}`
        }
    })
})