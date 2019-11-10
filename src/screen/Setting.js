import React, { Component } from 'react';
import { View, Text, AsyncStorage, StyleSheet, Image, ImageBackground, SafeAreaView } from 'react-native';
import {Button, Header} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome'
import ImagePicker from 'react-native-image-picker'
import * as actionUser from '../redux/actions/actionUser'
import {connect} from 'react-redux'

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar:'',
      idUser:'',
      name:''
    };
  }

  async componentDidMount(){
    const name = await AsyncStorage.getItem('name')
    this.setState({name})
    console.log(name)
  }
  signOut = () => {
      AsyncStorage
      .clear()
      .then(() => {
          this.props.navigation.navigate('Login');
      })
      .catch(e => {
          console.log(e);
          alert('Error: Cannot Sign Out');
      })
  }

  imagePickerHandler() {
    const options = {
      title: 'Select Avatar',
      customButton: [{
        name: 'fb',
        title: 'Choose Photo From Facebook'
        }],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
   }

  ImagePicker.showImagePicker(options, (response) => {
    console.log('Response =', response);
    
    if (response.didCancel) {
      console.log('User Cancelled image picker')
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error)
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton)
    } else {
      const source = { uri: response.uri }
            
      this.setState({
        avatar: source,
      })
    }
  })
}

  render() {
    const users = this.props.loginLocal.login
    console.log(users.email)
    return (

      <SafeAreaView style={styles.container}>
        <Header style={styles.bar}>
          <ImageBackground source={require('../img/bar.png')} style={styles.imageHeader}>
            <Text style={styles.header2}>SETTINGS</Text>
          </ImageBackground>
        </Header>
        
        <View style={styles.container2}>
          <View>
            <Image
              style={styles.image}
              source={require('../img/admin.png')}
            />
            {/* <Icon name='camera' style={styles.iconCam} onPress={()=> this.imagePickerHandler()}  /> */}
          </View>
          <View>
            <Text style={styles.txtName}>{this.state.name}</Text>
            <Text style={styles.txtEmail}>Admin</Text>
            
          </View>
          <Button onPress={() => this.signOut()} style={styles.btnLogout} block>
            <View style={styles.logRow}>              
              <Text style={styles.txtOut}>Sign Out</Text>
              <Icon name='sign-out' style={styles.iconOut} />
            </View>            
          </Button>
        </View>

      </SafeAreaView>

    );
  }
}

const mapStateToProps = state => {
  return {
      loginLocal: state.login,
      // roomsLocal: state.rooms
  }
}
const mapDispatchToProps = dispatch => {
  return {
    handleUpdateUser: (id, avatar) => dispatch(actionUser.handleUpdateUser(id, avatar)),
  }
}

const styles = StyleSheet.create({
  header2:{
    fontFamily: 'Rakoon_PersonalUse',
    textAlign: 'center',
    marginTop:10,
    color:'#fff',
    // alignSelf:'center',
    fontSize:28,
    // fontWeight:'bold',
    textShadowColor: 'rgba(72,76,127, 100)',
    textShadowOffset: {width: -1, height: 5},
    textShadowRadius: 2,
  },
  imageHeader:{
    width:250,
    height:60
  },
  bar:{
    backgroundColor:'#305f72',
  },
  container:{
    flex:1
  },
  container2:{
    flex:1,
  },
  container3:{
    flex:1,
    backgroundColor:'#765ead'
  },
  btnLogout:{
    width:200,
    marginTop:20,
    backgroundColor:'#484c7f',
    borderRadius:10,
    alignSelf:'center',
  },
  txtOut:{
    color:'#fff',
    fontSize:21,
    fontFamily:'SonderSans-Black',
    paddingRight:20,
    marginTop:7
  },
  image:{
    width:200,
    height:200,
    borderRadius:200/2,
    alignSelf:'center',
    marginTop:50,
    marginBottom:10,
    // borderWidth:2,
    // borderColor:'#484c7f',
  },
  txtName:{
    fontSize:32,
    // fontWeight:'bold',
    textAlign:'center',
    fontFamily:'SonderSans-Black',
    // color:'#484c7f'
  },
  txtEmail:{
    fontSize:24,
    fontStyle:'italic',
    textAlign:'center'
  },
  logRow:{
    flexDirection:'row'
  },
  iconOut:{
    fontSize:32,
    color:'white'
  },
  iconCam:{
    textAlign: 'center',
    fontSize: 32,
    marginBottom: 5
  }
})

// export default Settings;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);