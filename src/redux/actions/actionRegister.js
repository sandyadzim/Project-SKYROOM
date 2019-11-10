import * as types from '../types'
import axios from 'axios'
import {API} from '../../host'

export const handleRegister = (name, email, password) => ({
    type: types.REGISTER,
    payload: axios({
        method: 'POST',
        url: `${API}/register`,
        data: {
            name:name,
            email:email,
            password:password
        }
    })
})