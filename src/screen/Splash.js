import React, {Component} from 'react'
import {View, AsyncStorage, StyleSheet, Image, SafeAreaView} from 'react-native'
import {Text, Spinner}from 'native-base'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import * as actionRooms from '../redux/actions/actionRooms'
import * as actionCustomer from '../redux/actions/actionCustomer'
import * as actionCheckin from '../redux/actions/actionCheckin'



class Loading extends Component{
  componentDidMount(){
    setTimeout( async () => {
      const token = await AsyncStorage.getItem('token')
      if (token == null) {
        this.props.navigation.navigate('Login')
      } else {
        await this.props.handleGetRooms()
        // await this.props.handleGetCustomer(token)
        // await this.props.handleGetCheckin(token)
        this.props.navigation.navigate('Room')
      }
    }, 3000);   
  }

    render(){
        return(
            <SafeAreaView style={styles.container}>
              <LinearGradient colors={['#f18c8e','#305f72']} style={styles.gradient}>
              <Image source={require('../img/skyroom.png')} style={styles.logo} />
              <Spinner color='#f18c8e' />
              </LinearGradient>                
            </SafeAreaView>
        )
    }
}
  
  const mapStateToProps = state => {
    return {
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      handleGetRooms: () => dispatch(actionRooms.handleGetRooms()),
      // handleGetCustomer: (token) => dispatch(actionCustomer.handleGetCustomer(token)),
      // handleGetCheckin: (token) => dispatch(actionCheckin.handleGetCheckin(token)), 
    }
  }
  
  const styles = StyleSheet.create({
    logo:{
      width: 300,
      height:300,
      alignSelf:'center',
      
    },
    container:{
      flex:1
    },
    gradient:{
      flex:1,
      justifyContent:'center'
    }
  })
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Loading);