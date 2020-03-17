import React, { Component } from 'react';
import { StyleSheet ,ScrollView,ListView,SafeAreaView,FlatList } from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Image } from 'react-native';
import moment from 'moment-jalaali'; 
import { Container,Content, Header,Form,Item, View,Button, DeckSwiper, Card, CardItem, Thumbnail, Text, Left,Right, Body, Icon,Label,Input,Title } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {AsyncStorage} from 'react-native';

class Login extends React.Component {   
  constructor(props){   
    super(props);    
    this.state = {
      username:"",
      password:"",
      Autenticated:false
    }
    this.Login = this.Login.bind(this);
    this.Server = new Server();

    
   

  }  
  componentDidMount() {
 
  
  }
  
 
  componentWillUnmount() {
 
 
  }
  Login() {
 let that = this;
    let SCallBack = function(response){
           AsyncStorage.setItem('api_token', response.data.token);
           that.setState({
              Autenticated:true
           }) 
           that.props.dispatch({
            type: 'LoginTrueUser',    
            CartNumber:response.data.CartNumber
          })
          that.props.navigation.navigate('Home',{p:'LoginTrue'}) 

           //AsyncStorage.getItem('api_token').then((value) => alert(value))

                 
    } 
    let ECallBack = function(error){
     alert(error)   
    }  
        
   this.Server.send("https://marketapi.sarvapps.ir/MainApi/getuser",       {username:this.state.username,password:this.state.password},SCallBack,ECallBack) 
  
  }
 
  render() {
   const {navigate} = this.props.navigation;
                
    return (   
    <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body> 
          </Body>
          <Right>
           
          </Right>
        </Header>
        
        <Content>
        <ScrollView>
          <Text style={{textAlign:'center',marginTop:10}}>ورود به محیط کاربری</Text>
          <Form>
            <Item inlineLabel>
              <Input value={this.state.username} keyboardType="number-pad" name="username"                        onChangeText={(text) => this.setState({username:text})  }  />
              <Label>نام کاربری</Label>

            </Item>
            <Item inlineLabel >
               <Input value={this.state.password} secureTextEntry={true} keyboardType="number-pad" name="password"   onChangeText={(text) => this.setState({password:text})  }  />
               <Label>رمز عبور</Label>
            </Item>
              
              <Button iconLeft info style={{marginTop:20}} onPress ={this.Login}>
            <Icon name='arrow-back' />
            <Text>ورود</Text>
          </Button>
           <Button iconLeft primary style={{marginTop:20}} onPress={() => navigate('Register')}>
            <Icon name='arrow-back' />
            <Text>ثبت نام</Text>
          </Button>
          <Button iconLeft primary style={{marginTop:20}} onPress={() => navigate('Register',{type:'changePass'})           }>
            <Icon name='arrow-back' />
            <Text>بازیابی رمز عبور</Text>
          </Button>
          </Form>

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

