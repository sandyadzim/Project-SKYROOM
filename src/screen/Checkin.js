import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground,AsyncStorage, TextInput, TouchableOpacity, Picker, SafeAreaView} from 'react-native';
import {FlatGrid} from 'react-native-super-grid';
// import {Dropdown} from 'react-native-material-dropdown';
import { Button, Header, Spinner } from 'native-base';
import { connect } from 'react-redux'
import * as actionCheckin from '../redux/actions/actionCheckin'
import * as actionRooms from '../redux/actions/actionRooms'
import * as actionCustomer from '../redux/actions/actionCustomer'
import Modal from 'react-native-modal'
import moment from 'moment'

class Checkin extends Component {
    constructor(props){
        super(props)
        this.state = {
            isModalVisible: false,
            isModalVisible2: false,
            customer:'',
            idCustomer: '',
            room: '',
            idCheckin: '',
            order_id: '',
            duration:'',
            order_end_time: ''

        };

        this.interval = setInterval(() => {
            this.refreshData()
        }, 30000)

    }
    toggleModalCheckout = (id, name, customer_name, order_id) => {
        this.setState({ isModalVisible: !this.state.isModalVisible });        
        this.setState({idCheckin: id})
        this.setState({room: name})
        this.setState({customer: customer_name })
        this.setState({ order_id: order_id})

    };
    toggleModalCheckin = (id, name) => {
        this.setState({ isModalVisible2: !this.state.isModalVisible2 });        
        this.setState({idCheckin: id})
        this.setState({room: name} )
    };


    componentDidMount = async () => {
        const token = await AsyncStorage.getItem('token')
        // await this.props.handleGetCustomer(token)
        await this.props.handleGetCheckin(token)
        // console.log(token)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    addCheckin = async () =>
    {
        // const token = this.props.loginLocal.login.token;
        const token = await AsyncStorage.getItem('token')
        const customer_id = this.state.idCustomer;
        const room_id = this.state.idCheckin;
        const duration = this.state.duration;
        const order_end_time = moment().add(Number(duration), 'm');
        const is_done = false;
        const is_booked = true;
        // alert(room_id)
        
        if (duration !== '') {
            await this.props.handleAddCheckin(room_id, customer_id, duration, order_end_time, is_done, is_booked, token);
            await this.setState({isModalVisible2: false})
            await this.props.handleGetCheckin(token)
            await this.props.handleGetCustomer(token)
            await this.setState({ room: ''})
            await this.setState({ idCheckin: ''})
            await this.setState({ duration: ''})
        } else {
            alert('Please Input Duration!')
        }
    };

    checkout = async () => {
        // const token = this.props.loginLocal.login.token;
        const token = await AsyncStorage.getItem('token')
        const order_id = this.state.order_id;

        await this.props.handleCheckout(order_id, token);
        await this.setState({isModalVisible: false})
        await this.props.handleGetCustomer(token)
        await this.props.handleGetCheckin(token)

    }

    async refreshData() {
        const token = await AsyncStorage.getItem('token');
        
        console.log(token)
        const data = this.props.checkinLocal.checkin
        await this.props.handleGetCheckin(token)
        // console.log('data:', data[0].orders[0].id)
        // console.log(data.length)
    
        for (let i = 0; i < data.length; i++) {
          if (data[i].orders[0] !== undefined ) {
            if (moment(data[i].orders[0].order_end_time).diff(moment(), 'm') <= 0) {
              await this.props.handleCheckout(data[i].orders[0].id, token)
            }
          }
        }
    
    }


    render() {
        console.disableYellowBox = true;
        // if(this.props.checkinLocal.isLoading == true){
        //     return (
        //         <View style={{flex:1, alignSelf: 'center', justifyContent: 'center'}}>
        //             <Spinner color= '#f18c8e' />
        //         </View>
        //     )
        // }
        return (
            <SafeAreaView>                
                <View>
                    <Header style={styles.bar}>
                        <ImageBackground source={require('../img/bar.png')} style={styles.imageHeader}>
                            <Text style={styles.header}>CHECKIN</Text>
                        </ImageBackground>
                    </Header>
                </View>
                <ImageBackground source={require('../img/skyroom.png')} style={styles.background}>
                <FlatGrid
                itemDimension={130}
                style={styles.grid}
                items={this.props.checkinLocal.checkin}
                renderItem={({ item }) => (
                    <View>
                        {
                            item.orders == false ?
                            <TouchableOpacity onPress={() => {this.toggleModalCheckin(item.id, item.name)}} >
                                <View style={styles.viewGridFalse}>
                                    <Text style={styles.txtGrid}>{item.name}</Text>                      
                                </View>
                                
                            </TouchableOpacity>
                        :
                            <TouchableOpacity onPress={() => {this.toggleModalCheckout( item.id, item.name, item.orders[0].customers.name, item.orders[0].id)}} >
                                <View style={styles.viewGridTrue}>
                                    {/* <Text style={styles.txtGrid}>{item.name}</Text> */}
                                    <Text style={styles.txtGridOut}>{`${item.name}\n ${moment(item.orders[0].order_end_time).diff(moment(), 'm')} Min`}</Text>                      
                                </View>
                                {/* {console.log(item.orders[0].id)} */}
                            </TouchableOpacity>
                        }
                    </View>                 
                )}
                keyExtractor={item => item.id}
                />
                </ImageBackground>
                {/* Modal Checkin */}
                <Modal isVisible={this.state.isModalVisible2} animationIn='slideInUp' animationOut='zoomOut'>
                    <View style={styles.modalView}>
                        <View style={styles.modalContent}>
                            <Text style={styles.txtHeaderAdd}>Checkin</Text>
                                <View>
                                    <Text style={styles.labelAdd}>Room Name</Text>
                                    <TextInput
                                        editable={false} selectTextOnFocus={false}
                                        style={styles.inputBoxRoom}
                                        value={this.state.room}
                                    />
                                    <Text style={styles.labelUser}>Customer</Text>
                                        <View style={styles.pickerStyle}>
                                            <Picker
                                            selectedValue={this.state.idCustomer}
                                            onValueChange={(itemValue) => this.setState({idCustomer  : itemValue})}
                                            >
                                                <Picker.Item label={'Select Customer'} />
                                            {this.props.customerLocal.customer.map((item, index) =>                                              
                                                
                                                <Picker.Item key={item.id} label={`${item.name} - ${item.phone_number}`} value={item.id} />   
                                            )}
                                                                    
                                            </Picker>
                                        </View>
                                        
                                    <Text style={styles.labelAdd}>Duration</Text>
                                    <TextInput
                                        style={styles.inputBox}
                                        value={this.state.duration}
                                        onChangeText={(text) => this.setState({ duration: text})}
                                    />
                                </View>
                        </View>  
                        <View style={styles.modalContent2}>
                            <View style={styles.btnRow}>
                                <Button block style={styles.btnCancel} onPress={this.toggleModalCheckin}>
                                    <Text style={styles.txtbtnAdd}>Cancel</Text>
                                </Button>
                                <Button block style={styles.btnSave} onPress={() =>{this.addCheckin();}} >
                                    <Text style={styles.txtbtnAdd}>Save</Text>
                                </Button>
                            </View>          
                        </View>                              
                    </View>
                </Modal>
                {/* END Modal Checkin */}

                {/* Modal Checkout */}
                <Modal isVisible={this.state.isModalVisible} animationIn='slideInUp' animationOut='zoomOut'>
                    <View style={styles.modalView}>
                        <View style={styles.modalContent}>
                            <Text style={styles.txtHeaderAdd}>CheckOut</Text>
                                <View>
                                    <Text style={styles.labelAdd}>Room Name</Text>
                                    <TextInput 
                                        style={styles.inputBoxRoom}
                                        value={this.state.room}
                                        editable={false}
                                    />
                                    <Text style={styles.labelUser}>Customer</Text>
                                        <View style={styles.pickerStyle}>                                            
                                            <TextInput 
                                                style={styles.inputBoxRoom}
                                                value={this.state.customer}
                                                editable={false}
                                            />
                                        </View>                                   
                                </View>
                        </View>  
                        <View style={styles.modalContent2}>
                            <View style={styles.btnRow}>
                                <Button block style={styles.btnCancel} onPress={this.toggleModalCheckout}>
                                    <Text style={styles.txtbtnAdd}>Cancel</Text>
                                </Button>
                                <Button block style={styles.btnSave} onPress={() =>{this.checkout()}}>
                                    <Text style={styles.txtbtnAdd}>CheckOut</Text>
                                </Button>
                            </View>                                    
                        </View>                              
                    </View>
                </Modal>
                {/* END Modal Checkout */}
          </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
      loginLocal: state.login,
      checkinLocal: state.checkin,
      roomsLocal: state.rooms,
      customerLocal: state.customer
    }
}
const mapDispatchToProps = dispatch => {
    return {   
      handleGetCheckin: (token) => dispatch(actionCheckin.handleGetCheckin(token)),
      handleGetRooms: () => dispatch(actionRooms.handleGetRooms()),
      handleGetCustomer: (token) => dispatch(actionCustomer.handleGetCustomer(token)),
      handleAddCheckin: (room_id, customer_id, duration, order_end_time, is_done, is_booked, token) => dispatch(actionCheckin.handleAddCheckin(room_id, customer_id, duration, order_end_time, is_done, is_booked, token)),
      handleCheckout: (order_id, token) => dispatch(actionCheckin.handleCheckout(order_id, token))
    }
}
const styles = StyleSheet.create({
    header:{
        marginTop:10,
        alignSelf:'center',
        color:'#fff',
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
        backgroundColor:'#305f72'
    },
    pickerStyle:{
        backgroundColor:'white',
        width:250,
        alignSelf:'center',
        borderRadius:5
    },
    txtHeader:{
        color:'white',
        textAlign: 'center',
        justifyContent:'center',
        alignSelf:'center',
        fontSize:24
    },
    viewGridTrue:{
        backgroundColor:'#3c4d5b',
    },
    viewGridFalse:{
        backgroundColor:'#70416d'
        
    },
    txtGrid:{
        marginVertical:30,
        fontSize:24,
        fontWeight:'bold',
        textAlign:'center',
        color:'white'
    },
    txtGridOut:{
        marginVertical:17.9,
        fontSize:24,
        fontWeight:'bold',
        textAlign:'center',
        color:'white'
    },
    background:{
        width:'100%',
        height:'90%',
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
    inputBox: {  
        width:250,
        height:40,
        backgroundColor:'white',
        fontSize:18,
        color:'#000',
        borderColor:'white',
        borderWidth:2,
        borderRadius:5,
        alignSelf:'center'
    },
    inputBoxRoom: {  
        width:250,
        height:40,
        backgroundColor:'#3c4d5b',
        fontSize:18,
        color:'#000',
        borderColor:'white',
        borderWidth:2,
        borderRadius:5,
        alignSelf:'center'
    },
    dropdownItem:{
        // backgroundColor:'tomato',
        // height:40
        // marginTop:-50
    },
    labelAdd:{
        fontSize:20,
        marginLeft:35,
        color:'white'
    },
    labelUser:{
        fontSize:20,
        marginLeft:35,
        color:'white',
        // marginTop:20
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
        alignSelf:'center'
    },
    txtbtnAdd:{
        // marginLeft:30,
        color:'white'
    }
  
}); 

// export default Checkin;
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Checkin);