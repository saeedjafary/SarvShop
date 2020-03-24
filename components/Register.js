import React, { Component } from 'react';
import { StyleSheet ,ScrollView,ListView,SafeAreaView,FlatList,TouchableOpacity } from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Image } from 'react-native';
import moment from 'moment-jalaali'; 
import { Container,Content, Header,Form,Item, View,Button, DeckSwiper, Card, CardItem, Toast, Text, Left,Right, Body, Label,Input,Title,Icon } from 'native-base';

import { Col, Row, Grid } from 'react-native-easy-grid';
import {AsyncStorage} from 'react-native';
import HeaderBox from './HeaderBox.js'
class Register extends React.Component {   
  constructor(props){   
    super(props);    
    this.Server = new Server();
    this.state = {
        type:(this.props.navigation.state && this.props.navigation.state.params) ? this.props.navigation.state.params.type : '',
        username:null,
        password:null,
        password2:null,
        name:null,
        SecurityCode : '',
        AfterFirstStep : false,
        AfterFinalStep : false,
        SmsToken : null,   
        Waiting:false
    }
    this.Register=this.Register.bind(this);
    this.GetNewPassword=this.GetNewPassword.bind(this);


    
   

  }  
  componentDidMount() {   
     
  
    
  }
  
 
  componentWillUnmount() {
 
 
  }
  GetNewPassword(){
    let that = this;
    this.setState({
      Waiting:true,
      HasError:null
    })
     let SCallBack = function(response){
           
           var text = response.data.result; 

          if(isNaN(text)){
            
          that.setState({
            HasError:text,
             Waiting:false
          })
          return;
        }
         
                  
            that.Server.send('https://marketapi.sarvapps.ir/MainApi/GetSmsToken',{
              "UserApiKey":"b684bd5c7cc186e5c870c19b",
              "SecretKey":"sj@907@4286"
            },function(response){
                    that.setState({
                    SmsToken:response.data.result.TokenKey
                  })
            that.Server.send("https://marketapi.sarvapps.ir/MainApi/sendsms",{
                    token: response.data.result.TokenKey,
                    text: "رمز عبور جدید شما در سامانه ی فروشگاهی سرو : \n"+text+"\n در اولین فرصت رمز عبور خود را تغییر دهید",
                    mobileNo : that.state.username
                  },function(response){
                    that.setState({
                      Waiting:false,
                      HasError:'رمز عبور جدید به شماره تلفن همراه شما ارسال شد'
                    })     

                
                    console.log(response)



                  },function(error){
                      that.setState({
                      Waiting:false
                    })
                      alert(error)   
            })

            },function(error){
              that.setState({
                      Waiting:false
                    })
                      alert(error)   
            })

                 
          }
          let ECallBack = function(error){   
              alert(error)      
          }  
        
   that.Server.send("https://marketapi.sarvapps.ir/MainApi/GetNewPass",{
        username: that.state.username
      },SCallBack,ECallBack)

  }
  Register() {
 
      let that = this;

    if(!that.state.AfterFirstStep){

      if(that.state.password != that.state.password2){
       
        Toast.show({
          text: "رمز عبور و تکرار آن متفاوت است",
          textStyle: { fontFamily:'IRANSansMobile',textAlign:'center' },
          type: "danger"
        })
        return;
      }
    let SCallBack = function(response){
          if(response.data.result[0] && response.data.result[0].status=="1"){
              Toast.show({
                text: response.data.msg,
                textStyle: { fontFamily:'IRANSansMobile',textAlign:'center' },
                type: "danger"
              })
              return;
        }
        that.setState({
          AfterFirstStep : true
        })  
            var SecCode = response.data.SecurityCode;
         
                  
            that.Server.send('https://marketapi.sarvapps.ir/MainApi/GetSmsToken',{
              "UserApiKey":"b684bd5c7cc186e5c870c19b",
              "SecretKey":"sj@907@4286"
            },function(response){
                    console.log(response.data);
                    that.setState({
                    SmsToken:response.data.result.TokenKey
                  })
                  Toast.show({
                    text: "کد امنیتی به "+that.state.username+" پیامک شد ",
                    textStyle: { fontFamily:'IRANSansMobile',textAlign:'right' },
                    type: "info"
                  })
            that.Server.send("https://marketapi.sarvapps.ir/MainApi/sendsms",{
                    token: response.data.result.TokenKey,
                    text: "کد امنیتی ثبت نام در فروشگاه اینترنتی سرو : \n"+SecCode,
                    mobileNo : that.state.username
                  },function(response){



                  },function(error){
                      alert(error)   
            })

            },function(error){
                      alert(error)   
            })

                 
          }
          let ECallBack = function(error){      
              alert(error)   
          }     
        console.warn(that.state.password)
   that.Server.send("https://marketapi.sarvapps.ir/MainApi/Register",{
        username: that.state.username,
        password: that.state.password,
        Step: "1"
      },SCallBack,ECallBack)
     
    }
if(this.state.AfterFirstStep){
      if(this.state.SecurityCode == "" ){
        Toast.show({
          text:"کد امنیتی پیامک شده را وارد کنید",
          textStyle: { fontFamily:'IRANSansMobile',textAlign:'center' },
          type: "danger"
        })

        return;

      }
let SCallBack = function(response){
              if(response.data.msg){
                Toast.show({
                  text: response.data.msg,
                  textStyle: { fontFamily:'IRANSansMobile',textAlign:'center' },
                  type: "danger"
                })
            
              return;
            }

          that.Server.send("https://marketapi.sarvapps.ir/MainApi/Register",{
            username: that.state.username,
            password: that.state.password,
            Step: "3"
          },function(response){
           // localStorage.setItem("api_token",response.data.token);
           Toast.show({
              text: "ثبت نام شما با موفقیت انجام شد",
              textStyle: { fontFamily:'IRANSansMobile',textAlign:'right' },
              type: "success"
            })
            that.setState({
              AfterFinalStep : true
            })    
            that.props.navigation.navigate('Login') 

            },function(error){
               alert(error)   
            })
            
       }  

      let ECallBack = function(error){
              alert(error)   
          }  
        
   that.Server.send("https://marketapi.sarvapps.ir/MainApi/Register",{
        username: that.state.username,
        password: that.state.password,
        SecurityCode: that.state.SecurityCode,
        Step: "2"
      },SCallBack,ECallBack)
      
     

    }





 
  }
  render() {
        const {navigate} = this.props.navigation;    
    
                            
    return (   
    <Container>
              <HeaderBox navigation={this.props.navigation} title={'ثبت نام'} goBack={true} />

        <Content>
        <ScrollView>   
         {this.state.type=='' &&
 
  <View>
   <Text style={{textAlign:'center',marginTop:25,fontFamily:'IRANSansMobile',fontSize:25,color:'#333'}}>ثبت نام</Text>
          <Form style={{marginTop:35}}>
           
            <Item inlineLabel>
              <Input value={this.state.username} keyboardType="number-pad" name="username"                        onChangeText={(text) => this.setState({username:text})  }  />
              <Label style={{fontFamily:'IRANSansMobile'}}>موبایل</Label>

            </Item>
            <Item inlineLabel >
               <Input value={this.state.password} secureTextEntry={true} keyboardType="number-pad" name="password"   onChangeText={(text) => this.setState({password:text})  }  />
               <Label style={{fontFamily:'IRANSansMobile'}}>رمز عبور</Label>
            </Item>
            <Item inlineLabel >
               <Input value={this.state.password2} secureTextEntry={true} keyboardType="number-pad" name="password2"   onChangeText={(text) => this.setState({password2:text})  }  />
               <Label style={{fontFamily:'IRANSansMobile'}}>تکرار رمز عبور</Label>
            </Item>  
            {this.state.AfterFirstStep &&
            <Item inlineLabel >
            <Input value={this.state.SecurityCode} secureTextEntry={true} keyboardType="number-pad" name="SecurityCode"   onChangeText={(text) => this.setState({SecurityCode:text})  }  />
             
            <Label style={{fontFamily:'IRANSansMobile'}}>کد امنیتی</Label>
					  </Item>
            } 
            <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:25,marginTop:45}}>
                <Button iconLeft success onPress ={this.Register}>
                      <Icon name='arrow-back' />
                      <Text style={{fontFamily:'IRANSansMobile',textAlign:'center'}}>ثبت نام</Text>
                    </Button>
            </View> 
           
         
          </Form>   
 
  </View>
 }{this.state.type=='changePass' &&

 <View>
   <Text style={{textAlign:'center',marginTop:25,fontFamily:'IRANSansMobile',fontSize:25,color:'#333'}}>بازیابی رمز عبور</Text>
    
 
  <Form style={{marginTop:35}}>
           
            <Item inlineLabel>
              <Input value={this.state.username} keyboardType="number-pad" name="username"                        onChangeText={(text) => this.setState({username:text})  }  />
              <Label style={{fontFamily:'IRANSansMobile'}}>موبایل</Label>

            </Item>
             
     

          <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:25,marginTop:45}}>
                <Button iconLeft success onPress ={this.GetNewPassword}>
                      <Icon name='arrow-back' />
                      <Text style={{fontFamily:'IRANSansMobile',textAlign:'center'}}>دریافت رمز عبور</Text>
                    </Button>
            </View>
          {this.state.Waiting &&
          <View style={{marginTop:15}}>
              <Label style={{textAlign:'center',padding:10}}>لطفا صبر کنید</Label>
              </View>
          }
          <View style={{marginTop:15}}>
          <Label style={{textAlign:'center',fontFamily:'IRANSansMobile'}}>{this.state.HasError}</Label>
          </View>
         
          </Form>   
 </View>
 
 
 }


          
         </ScrollView> 
         </Content> 
     </Container>             
    
           
    );
  }
}


function mapStateToProps(state) {        
  return {
    CartNumber : state.CartNumber
  }
}
export default connect(mapStateToProps)(Register)  

