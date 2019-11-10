import React, { Component } from 'react';
import { View, Text, FlatList, TextInput, Image, StyleSheet, TouchableOpacity, AsyncStorage, ImageBackground, SafeAreaView } from 'react-native'
import { Header, Left, Button, Icon, Body, Fab, Card, Spinner } from 'native-base';
import { connect } from 'react-redux';
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Modal from 'react-native-modal';
import * as actionCustomer from '../redux/actions/actionCustomer';
import ImagePicker from 'react-native-image-picker'
import firebase from 'firebase'
import moment from 'moment'

var firebaseConfig = {
    apiKey: "AIzaSyATXrJMLMNVC5r3TdYhRYa_ivO12sVu8OE",
    authDomain: "skyroom-ef2a9.firebaseapp.com",
    databaseURL: "https://skyroom-ef2a9.firebaseio.com",
    projectId: "skyroom-ef2a9",
    storageBucket: "skyroom-ef2a9.appspot.com",
    messagingSenderId: "641192916421",
    appId: "1:641192916421:web:c2d08d2edca1ec435047ac",
    measurementId: "G-MQ5LYN71DR"
  };
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

class Customer extends Component {

    constructor(props){
        super(props);
        this.state = {
            active: false,
            isModalVisible: false,
            isModalVisibleEdit: false,
            isModalVisibleDelete: false,
            name:'',
            identity_number:'',
            phone_number:'',
            image:'',
            idCustomer:'',
            InputAvatar:null,
            Loading: false
        };
        
    }
    
    renderBottomComponent = () => {
        if(this.state.Loading){
            return (
                <View>
                    <Spinner color='#f18c8e' size='small' />
                </View>
            )
        }
    }

    async uploadImageAsync(uri) {
        // Why are we using XMLHttpRequest? See:
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function() {
            resolve(xhr.response);
          };
          xhr.onerror = function(e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', uri, true);
          xhr.send(null);
        });
        const ref = firebase
          .storage()
          .ref()
          .child(moment().toISOString());
        const snapshot = await ref.put(blob);
        // We're done with the blob, close and release it
        blob.close();
        console.log('link', await snapshot.ref.getDownloadURL());
        this.setState({image: await snapshot.ref.getDownloadURL()});
        console.log(this.state.image);
        return await snapshot.ref.getDownloadURL();
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
            const source = response.uri
            // const source = {
            //   uri: response.uri,
            //   type: response.type,
            //   name: response.fileName
            // }
    
            this.setState({
              image: source,
              
            })
            console.log(source)
          }
        })
      }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
        this.setState({ name: '', identity_number: '', phone_number: '', image: ''})
    };
    toggleModalDelete = (id) => {
        this.setState({ isModalVisibleDelete: !this.state.isModalVisibleDelete })
        this.setState({ idCustomer: id})
        console.log(id)
    }
    toggleModalEdit = (id, name, identity_number, phone_number, image) => {
        this.setState({ isModalVisibleEdit: !this.state.isModalVisibleEdit })
        this.setState({name: name} )
        this.setState({idCustomer: id})
        this.setState({identity_number: identity_number})
        this.setState({phone_number: phone_number})
        this.setState({image: image})

    }

    componentDidMount = async () => {
        const token = await AsyncStorage.getItem('token')
        await this.props.handleGetCustomer(token)
        await this.props.customerLocal.customer
    }

    handleAddCustomer = async () =>
    {
        this.setState({Loading:true})
        await this.uploadImageAsync(this.state.image)
        const token = await AsyncStorage.getItem('token')
        const {
            name,
            identity_number,
            phone_number,
        } = this.state
        const image = this.state.image
        if (name !== '' && identity_number !== '' && phone_number !== '') {
            this.props.handleAddCustomer(name, identity_number, phone_number, image, token);
            await this.setState({isModalVisible: false})
            await this.props.handleGetCustomer(token)
            await this.setState({name: ''})
            await this.setState({identity_number: ''})
            await this.setState({phone_number: ''})
            await this.setState({idCustomer: ''})
            await this.setState({image: ''})
            this.setState({Loading:false})
        } else {
            alert('Field is Required')
        }
    };

    handleEditCustomer =  async () => {
        this.setState({Loading:true})
        await this.uploadImageAsync(this.state.image)
        const name = this.state.name
        const identity_number = this.state.identity_number
        const phone_number = this.state.phone_number
        const id = this.state.idCustomer
        const image = this.state.image
        // const token = this.props.loginLocal.login.token
        const token = await AsyncStorage.getItem('token')

        await this.props.handleUpdateCustomer(id, name, identity_number, phone_number, image, token)
        await this.setState({isModalVisibleEdit: false})
        await this.props.handleGetCustomer(token)
        await this.setState({name: ''})
        await this.setState({identity_number: ''})
        await this.setState({phone_number: ''})
        await this.setState({idCustomer: ''})
        await this.setState({image: ''})
        this.setState({Loading:false})
    }

    deleteCustomer = async () => {
        const token = await AsyncStorage.getItem('token')
        const id = this.state.idCustomer;
        console.log(id)

        await this.props.handleDeleteCustomer(id, token);
        await this.setState({isModalVisibleDelete: false, isModalVisibleEdit: false})

        await this.setState({name: ''})
        await this.setState({identity_number:''})
        await this.setState({phone_number: ''})
        await this.setState({image:''})
        
        await this.props.handleGetCustomer(token)

    }

    render() {
        console.ignoredYellowBox = ['Setting a timer'];

        if(this.props.customerLocal.isLoading == true){
            return (
                <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
                    <Spinner color='#f18c8e' />
                </View>
            )
        }
        return (

            <SafeAreaView style={styles.container}>
                <Header style={styles.bar}>
                <ImageBackground source={require('../img/bar.png')} style={styles.imageHeader}>
                    <Text style={styles.header}>CUSTOMER</Text>
                </ImageBackground>
                </Header>

                <View style={styles.cont}>                  
                                       
                        <FlatList 
                        // data={this.state.myWebt}
                        data={this.props.customerLocal.customer}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item}) =>
                            <Card style={styles.paddImg}>
                                <TouchableOpacity onPress={() => {this.toggleModalEdit(item.id, item.name, item.identity_number, item.phone_number, item.image)}}>
                                    <Image source={{uri : item.image}} style={styles.imgList} />
                                </TouchableOpacity>
                                <View style={styles.titleImg}>
                                    <Icon2 name='user' style={styles.userIcon} />
                                    <Icon name='card' style={styles.identity} />
                                    <Icon2 name='phone' style={styles.phone} />
                                </View>
                                <View style={styles.titleImg}>
                                    <Text style={styles.txtTitle}>{item.name}</Text>
                                    <Text style={styles.txtNumber}>{item.identity_number}</Text>
                                    <Text style={styles.txtNumber}>{item.phone_number}</Text>
                                </View>
                            </Card>
                            }
                            keyExtractor={(item, index) => index.toString()
                            }
                            />       
                </View>
                <View style={styles.flx}>
                        <View>
                            {/* <Icon name='add' onPress={this.toggleModal} style={styles.iconAdd} /> */}
                            <Fab
                            active={this.state.active}
                            direction="up"
                            containerStyle={{ }}
                            style={{ backgroundColor: '#484c7f' }}
                            position="bottomRight"
                            onPress={() => this.setState({ active: !this.state.active })}>
                            <Icon name='add' onPress={this.toggleModal} />
                            </Fab>

                            {/* Modal Add */}
                            <Modal isVisible={this.state.isModalVisible} animationIn='slideInUp' animationOut='zoomOut'>
                                <View style={styles.modalView}>
                                    <View style={styles.modalContent}>
                                        <Text style={styles.txtHeaderAdd}>Add Customer</Text>
                                        <View>
                                            <Text style={styles.labelList}>Name</Text>
                                            <TextInput 
                                                style={styles.inputBoxx}
                                                value={this.state.name}
                                                onChangeText={(text) => this.setState({ name: text})}
                                            />

                                            <Text style={styles.labelList}>Identity Number</Text>
                                            <TextInput 
                                                style={styles.inputBoxx}
                                                keyboardType='number-pad'
                                                value={this.state.identity_number}
                                                onChangeText={(text) => this.setState({ identity_number: text})}
                                            />

                                            <Text style={styles.labelList}>Phone Number</Text>
                                            <TextInput 
                                                style={styles.inputBoxx}
                                                keyboardType='phone-pad'
                                                value={this.state.phone_number}
                                                onChangeText={(text) => this.setState({ phone_number: text})}
                                            />
                                            
                                            {this.state.image ? <Image source={{uri: this.state.image }} style={styles.photo}/>: <Text></Text>}
                                                <Icon name='camera' onPress={()=> this.imagePickerHandler()} style={styles.camera} />
                                                                                        
                                        </View>
                                        <View style={styles.btnRow}>
                                            <Button block style={styles.btnCncl} onPress={this.toggleModal}>
                                                <Text style={styles.btnTxt}>Cancel</Text>
                                            </Button>

                                            <Button block style={styles.btnSave} onPress={() =>{this.handleAddCustomer();}}>    
                                                <Text style={styles.btnTxt}>Add</Text>
                                            </Button>
                                        </View>
                                        {this.renderBottomComponent()}
                                    </View>  
                                    <View style={styles.modalContent2}>
                                                                           
                                    </View>                              
                                </View>
                            </Modal>
                            {/* End Modal Add */}
                        </View>
                    </View>

                    {/* Modal Edit Customer */}
                    <Modal isVisible={this.state.isModalVisibleEdit} animationIn='slideInUp' animationOut='zoomOut'>
                        <View style={styles.modalView}>
                            <View style={styles.modalContent}>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={styles.txtHeaderCustomer}>Edit Customer</Text>
                                    <Icon2 name='trash' onPress={() => {this.toggleModalDelete(this.state.idCustomer)}} style={styles.iconTrash} />
                                </View>
                                
                                <View>
                                    <Text style={styles.labelList}>Name</Text>
                                        <TextInput 
                                            style={styles.inputBoxx}
                                            value={this.state.name}
                                            onChangeText={(text) => this.setState({ name: text})}
                                        />

                                    <Text style={styles.labelList}>Identity Number</Text>
                                        <TextInput 
                                            style={styles.inputBoxx}
                                            keyboardType='number-pad'
                                            value={this.state.identity_number}
                                            onChangeText={(text) => this.setState({ identity_number: text})}
                                        />

                                    <Text style={styles.labelList}>Phone Number</Text>
                                        <TextInput 
                                            style={styles.inputBoxx}
                                            keyboardType='phone-pad'
                                            value={this.state.phone_number}
                                            onChangeText={(text) => this.setState({ phone_number: text})}
                                        />
                                    {this.state.image ? <Image source={{uri: this.state.image }} style={styles.photo}/>: <Text></Text>}                                              
                                    <Icon name='camera' onPress={()=> this.imagePickerHandler()} style={styles.camera} /> 
                                </View>
                                <View style={styles.btnRow}>
                                    <Button block style={styles.btnCncl} onPress={this.toggleModalEdit}>
                                        <Text style={styles.btnTxt}>Cancel</Text>
                                    </Button>
                                    <Button block style={styles.btnSave} onPress={() =>{this.handleEditCustomer();}}>
                                        <Text style={styles.btnTxt}>Save</Text>
                                    </Button>
                                </View> 
                                {this.renderBottomComponent()}
                            </View>                              
                        </View>
                    </Modal>
                    
                    {/* Modal Delete */}
                    <Modal isVisible={this.state.isModalVisibleDelete} animationIn='slideInUp' animationOut='zoomOut'>
                        <View style={styles.modalView}>
                            <View style={styles.modalContent}>
                                {/* <Text style={styles.txtHeaderCustomer}>Delete Customer</Text> */}
                                <View>
                                    <Icon2 name='exclamation-triangle' style={styles.iconDanger} />
                                    <Text style={styles.label}>Are you sure want to delete</Text>
                                    <Text style={styles.labelDelete}>{this.state.name}?</Text>                                 
                                </View>
                                <View style={styles.btnRow}>
                                    <Button block style={styles.btnCncl} onPress={this.toggleModalDelete}>
                                        <Text style={styles.btnTxt}>Cancel</Text>
                                    </Button>
                                    <Button block style={styles.btnSave} onPress={() =>{this.deleteCustomer();}}>
                                        <Text style={styles.btnTxt}>Delete</Text>
                                    </Button>
                                </View> 
                            </View>                              
                        </View>
                    </Modal>
                    {/* End Modal Delete */}
            </SafeAreaView>

        );
    }
}

const mapStateToProps = state => {
    return {
        loginLocal: state.login,
        customerLocal: state.customer
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
        handleGetCustomer: (token) => dispatch(actionCustomer.handleGetCustomer(token)),
        handleAddCustomer: (name, identity_number, phone_number, image, token) => 
            dispatch(actionCustomer.handleAddCustomer(name, identity_number, phone_number, image, token)),
        handleUpdateCustomer: (id, name, identity_number, phone_number, image, token) =>
            dispatch(actionCustomer.handleUpdateCustomer(id, name, identity_number, phone_number, image, token)),
        handleDeleteCustomer: (id, token) => dispatch(actionCustomer.handleDeleteCustomer(id, token))
    }
  }
const styles = StyleSheet.create({
    container:{
        flex:1
    },
    header:{
        marginTop:10,
        color:'#fff',
        alignSelf:'center',
        fontSize:28,
        textShadowColor: 'rgba(72,76,127, 100)',
        textShadowOffset: {width: -1, height: 5},
        textShadowRadius: 2,
        fontFamily: 'Rakoon_PersonalUse',
    },
    imageHeader:{
        width:250,
        height:60
    },
    bar:{
        backgroundColor : '#305f72'
    },
    photo:{
        width:70,
        height:70,
        borderRadius:70/2,
        alignSelf:'center',
        marginTop:5
    },
    userIcon:{
        color:'white',
        fontSize:23,
        marginLeft:10,
        // marginTop:15
    },
    identity:{
        color:'white',
        fontSize:23,
        marginTop:16,
        marginLeft:10
    },
    phone:{
        color:'white',
        fontSize:23,
        marginLeft:10
    },
    title:{
        color:'white',
        textAlign: 'center',
        justifyContent:'center',
        alignSelf:'center',
        fontSize:24
    },
    camera:{
        textAlign:'center',
        marginVertical:10,
        color:'white'
    },
    imgList:{
        width:100,
        height:100,
        borderColor:'white',
        borderWidth:2,
        borderRadius:200/2,
        marginVertical:10,
    },
    paddImg:{
        paddingHorizontal:20,
        flexDirection:'row',
        backgroundColor:'#70416d',
        borderRadius:10,
        width:'90%',
        alignSelf:'center'
    },
    titleImg:{
        paddingLeft:10,
        marginVertical:10
    },

    flx:{
        flex:0.5,
    },
    cont:{
        flex:9,
        marginBottom:10
    },
    modalContent:{
        margin:15,
        // flex: 1,
        height:null,
    },
    txtHeaderCustomer:{
        fontSize:24,
        fontWeight:'bold',
        alignSelf:'center',
        marginBottom: 20,
        color:'white',
        borderColor:'white',
        borderBottomWidth:2,
        flex:7,
        textAlign:'center'
    },
    iconTrash:{
        textAlign:'right',
        color:'#c23b22',
        fontSize:32,
        backgroundColor:'white',
        marginBottom: 20,
        borderRadius:5,
        marginLeft:5        
    },
    iconDanger:{
        fontSize:52,
        textAlign:'center',
        color:'#c23b22'
    },
    inputBoxx: {  
        width:250,
        height:50,
        backgroundColor:'white',
        fontSize:18,
        color:'#000',
        borderColor:'white',
        borderWidth:2,
        borderRadius:5,
        alignSelf:'center'
    },
    label:{
        fontSize:20,
        // marginLeft:35,
        textAlign:'center',
        color:'white',
    },
    labelList:{
        fontSize:20,
        color:'white',
        marginLeft:20,
    },
    labelDelete:{
        textAlign:'center',
        fontSize:20,
        color:'white',
        marginBottom:15,
        fontWeight:'bold'
    },
    btnCncl:{
        width:100,
        backgroundColor:'#70416d'
    },
    btnSave:{
        width:100,
        marginLeft:10,
    },
    btnRow:{
        flexDirection:'row',
        alignSelf:'center'
    },
    btnTxt:{
        // marginLeft:30,

        color:'white'
    },
    iconAdd:{
        backgroundColor: '#142d4c',
        width:80,
        alignSelf:'center',
        textAlign:'center',
        fontWeight:'bold',
        fontSize:80,
        color:'white',
        borderRadius:80/2
    },
    modalView:{
        backgroundColor:'#305f72',
        borderWidth:2,
        borderColor:'white',
        borderRadius:10
    },
    txtHeaderAdd:{
        fontSize:24,
        fontWeight:'bold',
        alignSelf:'center',
        marginBottom: 20,
        color:'white',
        borderColor:'white',
        borderBottomWidth:2
    },
    inputBox: {  
        width:250,
        backgroundColor:'white',
        fontSize:32,
        color:'#000',
        borderColor:'black',
        borderWidth:2,
        borderRadius:5,
        alignSelf:'center'
    },
    labelAdd:{
        fontSize:20,
        marginLeft:35
    },
    modalContent2:{
        marginBottom:15
    },
    btnCancel:{
        width:100,
        backgroundColor:'#ef6c57'
    },
    btnSave:{
        width:100,
        marginLeft:10,
    },
    btnRow:{
        flexDirection:'row',
        alignSelf:'center'
    },
    txtbtnAdd:{
        marginLeft:30
    },
    txtTitle:{
        color:'white',
        fontSize:24,
        fontWeight:'bold',
        marginBottom:8
    },
    txtNumber:{
        fontStyle:'italic',
        fontSize:16,
        color:'white',
        marginTop:5
    }
})

// export default MyToon;
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Customer);