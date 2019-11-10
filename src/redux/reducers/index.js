import { combineReducers } from 'redux'
import { createNavigationReducer } from 'react-navigation-redux-helpers'

import SwitchNav from '../../navigation/SwitchNav'
import reducerLogin from './../reducers/reducerLogin'
import reducerRegister from './../reducers/reducerRegister'
import reducerRooms from './../reducers/reducerRooms'
import reducerCheckin from './../reducers/reducerCheckin'
import reducerCustomer from './../reducers/reducerCustomer'
import reducerUser from './../reducers/reducerUser'


const reduceRouter = createNavigationReducer(SwitchNav)

const appReducer = combineReducers({
    router: reduceRouter,
    login: reducerLogin,
    register: reducerRegister,
    user: reducerUser,
    rooms: reducerRooms,
    checkin: reducerCheckin,
    customer: reducerCustomer
})

export default appReducer