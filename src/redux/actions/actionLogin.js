import * as types from '../types'
import axios from 'axios'
import {API} from '../../host'

export const handleLogin = (email, password) => ({
    type: types.LOGIN,
    payload: axios({
        method: 'POST',
        url: `${API}/login`,
        data:{
            email: email,
            password: password
        }
    }),
})