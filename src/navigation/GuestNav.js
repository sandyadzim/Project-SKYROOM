import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Login from '../screen/Login';
import Register from '../screen/Register';

const GuestNav = createStackNavigator({
    Login : {
        screen: Login,
        navigationOptions: {
            header : null
        }
    },
    Register : {
        screen: Register,
        navigationOptions:{
            header: null
        }
    },
},
{
    initialRouteName: 'Login'
})

export default createAppContainer(GuestNav);