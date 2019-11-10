import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, AsyncStorage, SafeAreaView} from 'react-native';
import { Icon, Button } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import * as actionRegister from '../redux/actions/actionRegister';


class Register extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name:'',
      email: '',
      password: '',
      submitDisabled : true,
      securePass: true,
      regEmail: false,
      regPass: false,
    }
  }

  onHandleEmail = (text) => {
    this.setState({email: text})
  }
  onHandledPassword = (text) => {
    this.setState({password: text})
  }
  onHandleName = (text) => {
      this.setState({name: text})
  }

  onLoginBtn = () =>{
    this.props.navigation.navigate("Login");
  }

  showHideIcon = () => {
    this.setState({
      securePass: !this.state.securePass
    });
  }

  regexLogin(inputForm) {
    if (inputForm == 'email') {
        let correct = this.state.email.match(/(^[a-zA-Z]+|^[0-9]+|^[a-zA-Z0-9\.]+)@([a-zA-Z0-9]+)\.([a-zA-Z]+)/g)
        if (correct != null) {
            this.state.regEmail = true
        } else {
            this.state.regEmail = false
        }
    } else if (inputForm == 'password') {
        if (this.state.password !== '') {
            this.state.regPass = true
        } else {
            this.state.regPass = false
        }
    }
    
    if (this.state.regEmail == true && this.state.regPass == true) {
        this.setState({submitDisabled: false})
    } else {
        this.setState({submitDisabled: true})
    }
  }

  register= async() =>{
    const name = String(this.state.name)
    const email = String(this.state.email).toLowerCase()      
    const password = String(this.state.password)
    await this.props.handleRegister(name, email, password)
      if(this.props.registerLocal.register.token){
        const data = this.props.registerLocal.register.token
        await AsyncStorage.setItem('token', data)
        console.log(data)
        this.props.navigation.navigate('Login')
      }else{
        alert('Email sudah digunakan')
      }
      
    }
  

  render() {
    return (

      <SafeAreaView style={styles.container}>
          <LinearGradient colors={['#f18c8e','#305f72']} style={styles.gradient} >
          
            <View style={styles.title}>
              {/* <Image source={require('../img/skyroom.png')} style={styles.logo} /> */}
              <Text style={{fontSize:52, fontFamily: 'Breeze Personal Use', color:'white'}}>Register</Text>
            </View>
          
            <View style={styles.form}>
              <Text style={styles.labelEmail}>Name</Text>
              <TextInput style={styles.inputBox}
                onChangeText={(text) => this.onHandleName(text)}
                value={this.state.name} />

              <Text style={styles.labelEmail}>Email</Text>

              <TextInput style={styles.inputBox}
                keyboardType="email-address"
                onChangeText={(text) => this.onHandleEmail(text)}
                autoCapitalize='none'
                onKeyPress={() => this.regexLogin('email')}
                value={this.state.email} />            
              <Text style={styles.labelPass}>Password</Text>
        
              <View style={styles.inputBoxPass}>
                <TextInput style={styles.inputPass}
                secureTextEntry={this.state.securePass}
                autoCapitalize='none'
                onChangeText={(text) => this.onHandledPassword(text)}
                onKeyPress={() => this.regexLogin('password')}

                value={this.state.password} />
                <Button onPress={this.showHideIcon} transparent>
                  <Icon type="FontAwesome" name={this.state.securePass ? "eye-slash":"eye"} />
                </Button>
                
              </View>
            
              <TouchableOpacity style={styles.buttonReg} onPress= {() => this.register()}
              // disabled={this.state.submitDisabled} 
              >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={styles.buttonSign} onPress={() => this.props.navigation.navigate('Login')} >
                <Text style={styles.buttonTextReg}>Back to Login</Text>
              </TouchableOpacity>
            </View>
  
          </LinearGradient>
        </SafeAreaView>

    );
  }
}

const mapStateToProps = state => {
  return {
    registerLocal: state.register
  }
}
const mapDispatchToProps = dispatch => {
  return {
    handleRegister: (name, email, password) => dispatch(actionRegister.handleRegister(name, email, password))
  }
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
  },
  gradient:{
    flex:1
  },
  logo:{
    width:150,
    height:200,
    marginTop:20
  },
  title:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  titleLogin:{
    fontSize:48,
    marginTop:20,
  },
  titleTxt:{
    marginTop:30,
    fontSize:18,
  },
  form:{
    flex:3,
    marginTop:20,
    alignItems:'center',
  },
  labelEmail:{
    fontSize:20,
    marginRight:250,
    fontFamily:'SonderSans-Black'
  },
  inputPass:{
    flex:8,
    fontSize:18,
    paddingHorizontal:16,
    
  },
  labelPass:{
    fontSize:20,
    marginRight:200,
    fontFamily:'SonderSans-Black'
  },
  inputBox: {  
    width:300,
    backgroundColor:'white',
    paddingHorizontal:16,
    fontSize:18,
    color:'#000',
    marginVertical: 10,
    borderColor:'black',
    borderWidth:2,
    borderRadius:15
    },
  inputBoxPass:{
    width:300,
    backgroundColor:'white',
    flexDirection:'row',
    borderColor:'black',
    borderWidth:2,
    borderRadius:15
  }, 
  eye:{
    fontSize:24,
    paddingRight:12,
    paddingTop:12,
  },
  buttonSign: { 
    width:300,
    backgroundColor:'#142d4c',
    marginTop: 10,
    paddingVertical: 13,
    borderRadius:15
    },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#000',
    textAlign:'center',
    fontFamily:'SonderSans-Black'
    },
  buttonTextReg:{
    fontSize:16,
    fontWeight:'500',
    color:'#fff',
    textAlign:'center',
    fontFamily:'SonderSans-Black'
  },
  buttonReg:{
    width:300,
    backgroundColor:'#df7599',
    marginTop: 40,
    paddingVertical: 13,
    borderRadius:15
  }
})

// export default Register;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);