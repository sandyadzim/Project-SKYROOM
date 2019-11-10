import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';


import Customer from '../screen/Customer';
import Setting from '../screen/Setting'
import Checkin from '../screen/Checkin'
import Room from '../screen/Room'

const BottomTabNavigator = createMaterialBottomTabNavigator({
    Checkin: {
        screen: Checkin,
        navigationOptions: {
            tabBarLabel: 'CheckIn',
            tabBarIcon : ({tintColor}) => (
                <Icon name='check-circle' size={20} color={(tintColor)} />
            )
        }
    },
    Room: {
        screen: Room,
        navigationOptions: {
            tabBarLabel: 'Room',
            tabBarIcon: ({tintColor}) => (
                <Icon name='bed' size={20} color={(tintColor)} />
            )
        }
    },
    Customer:{
        screen: Customer,
        navigationOptions: {
            tabBarLabel: 'Customer',
            tabBarIcon: ({tintColor}) => (
                <Icon name="address-card" size={20} color={(tintColor)} />
            )
        }
    },
    Setting:{
        screen: Setting,
        navigationOptions: {
            tabBarLabel: 'Settings',
            tabBarIcon: ({tintColor}) => (
                <Icon name="cogs" size={20} color={(tintColor)} />
            )
        }
    },
},

{    
    initialRouteName: 'Room',
    tabBarOptions:{
        activeTintColor:'#fff',
        // inactiveTintColor:'red',
        // style:{backgroundColor:'red'}
    },
    barStyle:{backgroundColor:'#305f72'}
    // activeTintColor: '#fff',  
    // inactiveTintColor: '#000',  
    // barStyle: { backgroundColor: '#4287f5' },  
  }, 
)


export default createAppContainer(BottomTabNavigator);