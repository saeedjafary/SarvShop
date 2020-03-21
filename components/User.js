import React, { Component } from 'react';
import { StyleSheet ,ScrollView,ListView,SafeAreaView,FlatList } from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Image } from 'react-native';
import moment from 'moment-jalaali'; 
import { Container,Content, Header,Form,Item, View,Button, DeckSwiper, Card, CardItem, Thumbnail, Text, Left,Right, Body, Icon,Label,Input,Toast,Segment } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {AsyncStorage} from 'react-native';
import HeaderBox from './HeaderBox.js'

class User extends React.Component {   
  constructor(props){   
    super(props);    
    this.state = {
      username : null,
      password :  null,
      password2 : null,
      name : null,
      address: null,
      status: null,
      selected:1,
      api_token:null,
      GridDataPayment:[],
      GridDataFactors:[]
    }
    this.Server = new Server();
    this.updateUserInformation = this.updateUserInformation.bind(this);
    this.GetFactors = this.GetFactors.bind(this);
    this.GetPayment = this.GetPayment.bind(this);

    
   

  }  
  componentDidMount() {
      let that = this;
      AsyncStorage.getItem('api_token').then((value) => {   
        that.setState({
            api_token : value
          })
          that.Server.send("https://marketapi.sarvapps.ir/MainApi/checktoken",{
              token:that.state.api_token
          },function(response){
              that.setState({
                UserId : response.data.authData.userId
              })
              that.Server.send("https://marketapi.sarvapps.ir/MainApi/getuserInformation",{
                user_id:that.state.UserId
              },function(response){
                  that.setState({
                    username :  response.data.result[0].username,
                    password :  response.data.result[0].password,
                    password2 : response.data.result[0].password,
                    name : response.data.result[0].name,
                    address: response.data.result[0].address,
                    status: response.data.result[0].status,

                  })
                  
                  that.GetFactors();      


              },function(error){
                  alert(error)   
              })
          },function(error){
              alert(error)   
          })
      })
  
  }
  updateUserInformation(){
          let that = this;
        if(this.state.password != this.state.password2 || this.state.password == ""){
            Toast.show({
              text: "رمز عبور و تکرار آن صحیح نیست",
              textStyle: { fontFamily:'IRANSansMobile',textAlign:'right' },
              type: "danger"
            })
            return;
          }   
        that.Server.send("https://marketapi.sarvapps.ir/AdminApi/ManageUsers",{
                level:"0",
                status:that.state.status,
                username:that.state.username,
                pass:that.state.password,
                name:that.state.name,
                address:that.state.address,      

              },function(response){
                Toast.show({
                  text: 'ویرایش اطلاعات انجام شد',
                  textStyle: { fontFamily:'IRANSansMobile',textAlign:'right' },
                  type: "success"
                })


              },function(error){
                  alert(error)   
              })
  }
  
 
  GetFactors(){   
    let that = this;
    let param={
      user_id:this.state.UserId
    };
    let SCallBack = function(response){

      response.data.result.map(function(v,i){
        v.radif=i+1;  
        if(v.status=="-2")
          v.statusDesc="درخواست لغو توسط خریدار"
        if(v.status=="-1")
          v.statusDesc="لغو شده"
        if(v.status=="0")
          v.statusDesc="پرداخت نشده"
        if(v.status=="1")
          v.statusDesc="پرداخت شده"  
        if(v.status=="2")
          v.statusDesc="آماده ارسال"  
        if(v.status=="3")
          v.statusDesc="ارسال شده"
        if(v.status=="4")
          v.statusDesc="پایان"  
      })
      that.setState({
        GridDataFactors : response.data.result
      })
      that.GetPayment();
    };
    let ECallBack = function(error){
      console.log(error)
    }
    this.Server.send("https://marketapi.sarvapps.ir/MainApi/getFactors",param,SCallBack,ECallBack)
  }
  GetPayment(){
    let that = this;
    let param={
      user_id:this.state.UserId
    };
    let SCallBack = function(response){
      response.data.result.map(function(v,i){
        v.radif=i+1;
      })
      that.setState({
        GridDataPayment : response.data.result
      })
    };
    let ECallBack = function(error){
      console.log(error)
    }
    this.Server.send("https://marketapi.sarvapps.ir/MainApi/getPayment",param,SCallBack,ECallBack)
  }
 
 
  render() {
   const {navigate} = this.props.navigation;
                    
    return (   
      <Container>
      <HeaderBox navigation={this.props.navigation} title={'محیط کاربری'} goBack={true} NewCartNumber={this.state.CartNumber} />

      <Segment>
        <Button first active={this.state.selected === 1}  onPress={() => this.setState({ selected: 1 })}>
          <Text style={{fontFamily:'IRANSansMobile'}} >تنظیمات</Text>
        </Button>
        <Button active={this.state.selected === 2}  onPress={() => this.setState({ selected: 2 })}>
          <Text style={{fontFamily:'IRANSansMobile'}} >سفارشات</Text>
        </Button>
        <Button last active={this.state.selected === 3}  onPress={() => this.setState({ selected: 3 })}>
          <Text style={{fontFamily:'IRANSansMobile'}} >صورت حساب ها</Text>
        </Button>
      </Segment>
      <Content padder>
      
      { this.state.selected==1 &&
        <View >
            <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',paddingRight:10,fontSize:25,marginTop:20}}>ویرایش اطلاعات شخصی</Text>
            <View style={{flex:1,justifyContent:'center',flexDirection:'row',marginTop:15,marginBottom:10}}>
              <View style={{backgroundColor:'#f7f7f7',width:'80%',paddingLeft:15,paddingRight:15,borderRadius:8}}>
              <Text  style={{fontFamily:"IRANSansMobile",textAlign:'right',marginTop:10,marginBottom:10}}>
                 نام کاربری :  {this.state.username} 
               </Text>
              </View>
              
       </View>
        <Form style={{marginTop:5}}>
         
          <Item floatingLabel >
          <Input value={this.state.name} name="name" style={{fontFamily:'IRANSansMobile',textAlign:'right'}}   onChangeText={(text) => this.setState({name:text})  }  />
          <Label style={{fontFamily:'IRANSansMobile',textAlign:'right'}}>نام و نام خانوادگی</Label>

        </Item>
        
        <Item floatingLabel  >
           <Input value={this.state.password} style={{fontFamily:'IRANSansMobile',textAlign:'right'}} secureTextEntry={true} keyboardType="number-pad" name="password"   onChangeText={(text) => this.setState({password:text})  }  />
           <Label style={{fontFamily:'IRANSansMobile',textAlign:'right'}}>رمز عبور</Label>
        </Item>
        <Item floatingLabel  >
           <Input value={this.state.password2}  style={{fontFamily:'IRANSansMobile',textAlign:'right'}} secureTextEntry={true} keyboardType="number-pad" name="password2"   onChangeText={(text) => this.setState({password2:text})  }  />
           <Label style={{fontFamily:'IRANSansMobile',textAlign:'right'}}>تکرار رمز عبور</Label>
        </Item>
        <Item floatingLabel >
          <Input value={this.state.address} style={{fontFamily:'IRANSansMobile',textAlign:'right'}}  name="address"    onChangeText={(text) => this.setState({address:text})  }  />
          <Label style={{fontFamily:'IRANSansMobile',textAlign:'right'}}>آدرس کامل پستی</Label>

        </Item>
        <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:25,marginTop:45}}>
            <Button iconLeft info onPress={this.updateUserInformation}>
                  <Icon name='arrow-back' />
                  <Text style={{fontFamily:'IRANSansMobile',textAlign:'center'}}>ثبت اطلاعات</Text>
                </Button>
        </View>  
        <View style={{flex:1,flexDirection:'row',marginTop:60,justifyContent:'flex-start'}}>
        
          </View> 
       
       
      </Form>
      </View>

          }
          { this.state.selected==2 &&
        <Text>Segment2</Text>

          }
          { this.state.selected==3 &&
        <Text>Segment3</Text>

          }
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
export default connect(mapStateToProps)(User)  

