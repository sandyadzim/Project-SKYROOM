import * as types from '../types'
import axios from 'axios'
import {API} from '../../host'

export const handleGetCheckin = (token) => ({
    type: types.GET_CHECKIN,
    payload: axios({
        method: 'GET',
        url: `${API}/checkins`,
        headers:{
            Authorization: `${token}`
        }
    })
})

export const handleAddCheckin = (room_id, customer_id, duration, order_end_time, is_done, is_booked, token) => ({
    type: types.ADD_CHECKIN,
    payload: axios({
        method: 'POST',
        url: `${API}/checkin`,
        data: {
            room_id,
            customer_id,
            duration,
            order_end_time,
            is_done,
            is_booked
        },
        headers:{
            Authorization: `${token}`
        }
    })
})


export const handleCheckout = (order_id, token) => ({
    type: types.CHECKOUT,
    payload: axios({
        method: 'DELETE',
        url: `${API}/checkin/${order_id}`,
        headers:{
            Authorization: `${token}`
        }
    })
})