import React, { Component } from 'react';
import { StyleSheet ,ScrollView,ListView,SafeAreaView,FlatList } from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Image } from 'react-native';
import moment from 'moment-jalaali'; 
import { Container,Content, Header,Form,Item, View,Button, Toast, Card, CardItem, Thumbnail, Text, Left,Right, Body, Icon,Label,Input,Title } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {AsyncStorage} from 'react-native';
import HeaderBox from './HeaderBox.js'

class Login extends React.Component {   
  constructor(props){   
    super(props);    
    this.state = {
      username:"",
      password:"",
      Autenticated:false,
      visibleLoader:false
    }
    this.Login = this.Login.bind(this);
    this.Server = new Server();

    
   

  }  
  componentDidMount() {
 
  
  }
  
 
  componentWillUnmount() {
 
 
  }
  getCartNumber(id){
    let that=this;
    
    let param={
          UId : id
    };

    let SCallBack = function(response){
            var CartNumber=0;
            response.data.result.map((res,index) =>{
                CartNumber+=parseInt(res.number);
            })     
            AsyncStorage.setItem('CartNumber',CartNumber.toString());
             that.props.dispatch({
                type: 'LoginTrueUser',    
                CartNumber:CartNumber
              })
                 

     };
     let ECallBack = function(error){
            alert(error)
    }
    this.Server.send("https://marketapi.sarvapps.ir/MainApi/getCartPerId",param,SCallBack,ECallBack)
  }
  Login() {
    let that = this;
    let SCallBack = function(response){
          that.setState({
            visibleLoader:false
          })
           if(!response.data.token){
              Toast.show({
                text: response.data.result[0],
                textStyle: { fontFamily:'IRANSansMobile',textAlign:'right' },
                type: "danger"
              })
              return;       
           }
           that.getCartNumber(response.data.result[0]._id)   
           AsyncStorage.setItem('api_token', response.data.token);
           that.setState({
              Autenticated:true
           }) 
           console.warn(response.data.CartNumber)
           




           
           that.props.dispatch({
            type: 'LoginTrueUser',    
            CartNumber:response.data.CartNumber
          })
          that.props.navigation.navigate('Home',{p:'LoginTrue'}) 
          
           //AsyncStorage.getItem('api_token').then((value) => alert(value))

                 
    } 
    let ECallBack = function(error){
      that.setState({
        visibleLoader:false
       })
     alert(error)   
    }  
     this.setState({
      visibleLoader:true
     })   
     this.Server.send("https://marketapi.sarvapps.ir/MainApi/getuser",{username:this.state.username,password:this.state.password},SCallBack,ECallBack) 
  
  }
 
  render() {
   const {navigate} = this.props.navigation;
                
    return (   
    <Container>
        <HeaderBox navigation={this.props.navigation} title={'ورود به سامانه'} goBack={true} />

        
        <Content>
        <ScrollView>
          <Text style={{textAlign:'center',marginTop:25,fontFamily:'IRANSansMobile',fontSize:25,color:'#333'}}>ورود به محیط کاربری</Text>
          <Form style={{marginTop:35}}>
            <Item inlineLabel>
              <Input value={this.state.username} keyboardType="number-pad" name="username"                        onChangeText={(text) => this.setState({username:text})  }  />
              <Label style={{fontFamily:'IRANSansMobile'}}>نام کاربری</Label>

            </Item>
            <Item inlineLabel >
               <Input value={this.state.password} secureTextEntry={true} keyboardType="number-pad" name="password"   onChangeText={(text) => this.setState({password:text})  }  />
               <Label style={{fontFamily:'IRANSansMobile'}}>رمز عبور</Label>
            </Item>
            <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:25,marginTop:45}}>
                <Button iconLeft success onPress={this.Login} >
                      <Icon name='arrow-back' />
                      <Text style={{fontFamily:'IRANSansMobile',textAlign:'center'}}>ورود</Text>
                    </Button>
            </View>  
            
            <View style={{flex:1,flexDirection:'row',marginTop:60,justifyContent:'flex-start'}}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:25,marginTop:15}}>
                <Button iconLeft dark onPress={() => navigate('Register')}>
                      <Icon name='arrow-back' />
                      <Text style={{fontFamily:'IRANSansMobile',textAlign:'center'}}>ثبت نام</Text>
                    </Button>
            </View> 
            <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:25,marginTop:15}}>
                <Button iconLeft dark onPress={() => navigate('Register',{type:'changePass'})}>
                      <Icon name='arrow-back' />
                      <Text style={{fontFamily:'IRANSansMobile',textAlign:'center'}}>بازیابی رمز عبور</Text>
                    </Button>
            </View> 
              </View> 
           
           
          </Form>
          {this.state.visibleLoader &&
              <View style={{position:'absolute',left:'50%',bottom:100}}>
              <Image style={{width:50,height:50,justifyContent: 'center',
                alignItems: 'center'}}
                              source={require('../assets/loading.gif')}
                            />
                          </View>
              }
         </ScrollView> 
         </Content> 
     </Container>   
           
    );
  }
}


function mapStateToProps(state) {        
  return{
    CartNumber : state.CartNumber,
  }
}
export default connect(mapStateToProps)(Login)  

