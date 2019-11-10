import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity,AsyncStorage,TextInput, ImageBackground, SafeAreaView} from 'react-native';
import {FlatGrid} from 'react-native-super-grid';
import { Icon, Header, Body, Left, Button, Spinner } from 'native-base';
import Icon2 from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import * as actionRooms from '../redux/actions/actionRooms'

class Room extends Component {
    constructor(props){
        super(props)
        this.state = {
            isModalVisible: false,
            isModalVisibleEdit: false,
            isModalVisibleDelete: false,
            name: '',
            idRoom:''
            // token: ''
        };
    }
   
    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
        this.setState({name: ''})
    };

    toggleModalEdit = (id, name) => {
        this.setState({ isModalVisibleEdit: !this.state.isModalVisibleEdit })
        this.setState({name: name} )
        this.setState({idRoom: id})
    }

    toggleModalDelete = (id) => {
        this.setState({ isModalVisibleDelete: !this.state.isModalVisibleDelete})
        this.setState({ idRoom: id})
        console.log(id)
    }

    componentDidMount = async () => {
        AsyncStorage.getItem('token')
        await this.props.handleGetRooms()
    }

    handleAddRoom = async () =>
    {
        const token = await AsyncStorage.getItem('token')
        const name = this.state.name;
        if (name !== '') {
            await this.props.handleAddRoom(name, token);
            await this.setState({isModalVisible: false})
            await this.props.handleGetRooms()
            await this.setState({name: ''})
        } else {
            Alert.alert('Warning','Field Name is Required')
        }
    }

    handleEditRoom =  async () => {
        const name = this.state.name
        const id = this.state.idRoom
        const token = await AsyncStorage.getItem('token')

        await this.props.handleUpdateRoom(id, name, token)
        await this.setState({isModalVisibleEdit: false})
        await this.props.handleGetRooms()
        await this.setState({name: ''})
        await this.setState({idRoom: ''})
    }

    deleteRoom = async () => {
        const token = await AsyncStorage.getItem('token')
        const id = this.state.idRoom;

        await this.props.handleDeleteRoom(id, token);
        await this.setState({isModalVisibleDelete: false, isModalVisibleEdit: false})
        await this.setState({name: ''})        
        await this.props.handleGetRooms()
    }
        
    render() {
        // console.log(this.props.roomsLocal)
        if(this.props.roomsLocal.isLoading == true){
            return (
                <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
                    <Spinner color= '#f18c8e' />
                </View>
            )
        }
        return (

            <SafeAreaView style={styles.flexAll}>
                <Header style={styles.bar}>
                    <ImageBackground source={require('../img/bar.png')} style={styles.imageHeader}>
                        <Text style={styles.header}>ROOM</Text>
                    </ImageBackground>
                </Header>
                {/* <View style={{flex:7000 }} >
                    <Spinner size='large' color='#f18c8e' style={{marginVertical:200}} />
                </SafeAreaView> */}

                <View style={styles.flexOne}>
                        <FlatGrid
                        itemDimension={120}
                        style={styles.grid}
                        scrollEnabled
                        items={this.props.roomsLocal.rooms}
                        renderItem={({ item, index }) => (
                            <View>
                                <TouchableOpacity onPress={() => {this.toggleModalEdit(item.id, item.name)}}>
                                    <View style={styles.viewGrid}>
                                        <Text style={styles.txtGrid}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                
                        />
                </View>
                
                {/* Modal */}

                <View style={styles.flexIcon}>
                    <View style={styles.iconView}>
                        <Icon name='add' onPress={this.toggleModal} style={styles.iconAdd} />
                        <Modal isVisible={this.state.isModalVisible} animationIn='slideInUp' animationOut='zoomOut' >
                            <View style={styles.modalView}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.txtHeaderAdd}>Add Room</Text>
                                    <View>
                                        <Text style={styles.labelAdd}>Room Name</Text>
                                        <TextInput 
                                            style={styles.inputBox}
                                            value={this.state.name}
                                            onChangeText={(text) => this.setState({ name: text})}
                                        />
                                    </View>
                                </View>  
                                <View style={styles.modalContent2}>
                                    <View style={styles.btnRow}>
                                        <Button block style={styles.btnCancel} onPress={this.toggleModal}>
                                            <Text style={styles.txtbtnAdd}>Cancel</Text>
                                        </Button>
                                        <Button block style={styles.btnSave} onPress={() =>{this.handleAddRoom();}}>
                                            <Text style={styles.txtbtnAdd}>Add</Text>
                                        </Button>
                                    </View>                                    
                                </View>                              
                            </View>
                        </Modal>
                    </View>
                </View>
               {/* END MODAL */}

               {/* Modal Edit */}
               <Modal isVisible={this.state.isModalVisibleEdit} animationIn='slideInUp' animationOut='zoomOut'>
                    <View style={styles.modalView}>
                        <View style={styles.modalContent}>
                            <View style={{flexDirection:'row'}}>
                                <Text style={styles.txtHeaderEdit}>Edit Room</Text>
                                <Icon2 name='trash' onPress={() => {this.toggleModalDelete(this.state.idRoom)}} style={styles.iconTrash} />
                            </View>                            
                            <View>
                                <Text style={styles.labelAdd}>Room Name</Text>
                                <TextInput 
                                    style={styles.inputBox}
                                    value={this.state.name}
                                    onChangeText={(text) => this.setState({ name: text})}
                                />
                            </View>
                        </View>  
                        <View style={styles.modalContent2}>
                            <View style={styles.btnRow}>
                                <Button block style={styles.btnCancel} onPress={this.toggleModalEdit}>
                                    <Text style={styles.txtbtnAdd}>Cancel</Text>
                                </Button>
                                <Button block style={styles.btnSave} onPress={() =>{this.handleEditRoom();}}>
                                    <Text style={styles.txtbtnAdd}>Save</Text>
                                </Button>
                            </View>                                    
                        </View>                              
                    </View>
                </Modal>
                {/* END Modal Edit */}

                {/* Modal Delete */}
                <Modal isVisible={this.state.isModalVisibleDelete} animationIn='slideInUp' animationOut='zoomOut'>
                    <View style={styles.modalView}>
                        <View style={styles.modalContent}>
                            <View>
                                <Icon2 name='exclamation-triangle' style={styles.iconDanger} />
                                <Text style={styles.labelDelete2}>Are you sure want to delete</Text>
                                <Text style={styles.labelDelete}>{this.state.name}?</Text>
                            </View>
                        </View>                         
                        <View style={styles.btnRow}>
                            <Button block style={styles.btnCancel} onPress={this.toggleModalDelete}>
                                <Text style={styles.txtbtnAdd}>Cancel</Text>
                            </Button>
                            <Button block style={styles.btnSave} onPress={() =>{this.deleteRoom();}}>
                                <Text style={styles.txtbtnAdd}>Delete</Text>
                            </Button>
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
        roomsLocal: state.rooms
    }
}
const mapDispatchToProps = dispatch => {
    return {   
      handleGetRooms: () => dispatch(actionRooms.handleGetRooms()),
      handleAddRoom: (name, token) => dispatch(actionRooms.handleAddRoom(name, token)),
      handleUpdateRoom: (id, name, token) => dispatch(actionRooms.handleUpdateRoom(id, name, token)),
      handleDeleteRoom: (id, token) => dispatch(actionRooms.handleDeleteRoom(id, token))
    }
}
const styles = StyleSheet.create({
    flexAll:{
        flex:1,
    },
    flexOne:{
        flex:9
    },
    bar:{
        backgroundColor:'#305f72'
    },
    header:{
        textAlign: 'center',
        color:'#fff',
        marginTop:10,
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
    txtHeader:{
        color:'white',
        textAlign: 'center',
        justifyContent:'center',
        alignSelf:'center',
        fontSize:24,
    },
    viewGrid:{
        backgroundColor:'#70416d',
    },
    txtGrid:{
        marginVertical:30,
        fontSize:24,
        fontWeight:'bold',
        textAlign:'center',
        color:'white'
    },
    flexIcon:{
        flex: 2
    },
    iconAdd:{
        backgroundColor: '#484c7f',
        width:100,
        alignSelf:'center',
        textAlign:'center',
        fontWeight:'bold',
        fontSize:80,
        color:'white',
        marginTop:10
    },
    modalView:{
        backgroundColor:'#305f72',
        borderWidth:2,
        borderColor:'white',
        borderRadius:10
        // height:400,
    },
    modalContent:{
        margin:15,
        // flex: 1,
        height:null,
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
    txtHeaderEdit:{
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
    inputBox: {  
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
    labelAdd:{
        fontSize:20,
        marginLeft:20,
        color:'white',
        
    },
    modalContent2:{
        marginBottom:15

    },
    btnCancel:{
        width:100,
        backgroundColor:'#70416d',
    },
    btnSave:{
        width:100,
        marginLeft:10,
    },
    btnRow:{
        flexDirection:'row',
        alignSelf:'center',
        marginBottom:10
    },
    txtbtnAdd:{
        // marginLeft:30,
        color:'white'
    },
    label:{
        fontSize:20,
        marginLeft:35,
        color:'white',
    },
    labelDelete:{
        textAlign:'center',
        fontSize:20,
        color:'white',
        marginBottom:10,
        fontWeight:'bold'
    },
    labelDelete2:{
      textAlign:'center',
      fontSize:20,
      color:'white'  
    },
    iconDanger:{
        fontSize:52,
        textAlign:'center',
        color:'#c23b22'
    },
    
  
});  

// export default Checkin;
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Room);