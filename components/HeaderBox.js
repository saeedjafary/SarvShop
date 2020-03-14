import React, { Component } from 'react';
import { StyleSheet ,ScrollView,SafeAreaView,FlatList,TouchableOpacity } from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Image } from 'react-native';
import moment from 'moment-jalaali'; 
import { Container,Content, Header, View,Button, DeckSwiper, Card, CardItem, Thumbnail, Text, Left,Right, Body, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {AsyncStorage} from 'react-native';
import { Drawer } from 'native-base';
import SideBar from './SideBar.js'

     
let cards = [];      
function Item({ title }) {      
  return (
    <View style={{margin:5}}>
      <Button ><Text>{title}</Text></Button>
    </View>
  );
}     
class HeaderBox extends React.Component {   
  constructor(props){   
    super(props);    

        this.Server = new Server();
    this.state = {
            MaxObj:[],
            HsrajDate:moment(),
            GotoLogin:false,
            GotoCart:false,
            day:0,
            hours:0,
            minutes:0,
            seconds:0,
            Products:[],
            Products4:[],
            username:null,
            userId:null,
            name:"",
            CartNumber:0
    } 
    this.findUser = this.findUser.bind(this);
    this.logout = this.logout.bind(this);
    this.refresh = this.refresh.bind(this);
           
  }  

  findUser(){
    let that = this;
      AsyncStorage.getItem('CartNumber').then((value) => {
                        console.log(value) 
              that.setState({   
                CartNumber:value      
              })
           })
    AsyncStorage.getItem('api_token').then((value) => {    
       let SCallBack = function(response){

         

           that.setState({
             username:response.data.authData.username,
             userId : response.data.authData.userId,
				     name : response.data.authData.name
           })                 
    } 
    let ECallBack = function(error){
     //alert(error)   
    }  
        
   this.Server.send("https://marketapi.sarvapps.ir/MainApi/checktoken",           {token:value},SCallBack,ECallBack) 

    } )
  }   
  componentWillReceiveProps(){
    if(this.props.NewCartNumber)
    this.setState({
      CartNumber:this.props.NewCartNumber  
    })
  }
  componentDidUpdate(){
     let that = this;
        
    if(this.props.navigatin && this.props.navigation.state  && this.props.navigation.state.params && this.props.navigation.state.params.p && !this.state.username)
      this.findUser(); 
  }
  componentDidMount() { 
    this.findUser(); 
  }
   logout(){    
    AsyncStorage.setItem('api_token',"");
    this.setState({
      username:null  
    })
  }
 refresh(){
   this.setState({
     CartNumber:this.props.CartNumber
   })
 }

 
  render() { 
    const {navigate} = this.props.navigation;    

           
    return (  
     
     <Header style={{backgroundColor:'#fff'}}  >
      {this.props.goBack &&    
          <Left >
            <Button transparent onPress={() => {try         {this.props.navigation.state.params.onGoBack()}catch(e){}
 ; this.props.navigation.goBack()}}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
      }
        <Body>
      
  {!this.props.goBack && 
 <Grid style={{width:'100%'}}>
        <Row>
       
      
         
        <Col  style={{width:80}} onPress={() => { navigate('Cart', {
            onGoBack: () => this.refresh(),
         })}} >
         {this.state.username &&
          <TouchableOpacity onPress={() => { navigate('Cart', {
            onGoBack: () => this.refresh(),
         })}}>
              <View  ><Text style={{fontFamily:'IRANSansMobile'}}><Icon type="Ionicons" name="cart" style={{fontSize: 30, color: 'red'}}/> ({this.state.CartNumber}) </Text></View>
            </TouchableOpacity>
         
         }
         </Col>  
          <Col >
         {!this.props.title && this.state.username &&
         <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}><Text style={{fontFamily:'IRANSansMobile'}}>{this.state.name  ?  this.state.name : 'خوش آمدید'}</Text></View>
         }
         {
           this.props.title && 
           <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}><Text style={{fontFamily:'IRANSansMobile'}}>{this.props.title}</Text></View>
         }
         </Col>
     <Col style={{width:100}}>   
{!this.state.username &&   
         <View>
           <Button  onPress={() => {  navigate('Login')}} iconLeft  info>
                       <Icon name='person' />

            <Text style={{fontFamily:'IRANSansMobile'}}> ورود</Text>
           </Button>
           
          </View>
}{this.state.username &&
<View>
  

  <Button  onPress={this.logout} iconLeft  info >
            <Icon name='exit' />
            <Text style={{fontFamily:'IRANSansMobile'}}> خروج</Text>
           </Button>
          </View>

}  
          </Col> 
          </Row>   
         
          </Grid>
        
  }
  {this.props.goBack &&             
  <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}><Text style={{fontFamily:'IRANSansMobile'}}>{this.props.title}</Text></View>
   }   
      </Body>

    {this.props.goBack &&  
    <Right  style={{width:50}} onPress={() => { navigate('Cart', {
              onGoBack: () => this.refresh(),
          })}} >
          {this.state.username &&
          <TouchableOpacity onPress={() => { navigate('Cart', {
              onGoBack: () => this.refresh(),
          })}}>
              <View  ><Text style={{fontFamily:'IRANSansMobile'}}><Icon type="Ionicons" name="cart" style={{fontSize: 30, color: 'red'}}/> ({this.state.CartNumber}) </Text></View>
            </TouchableOpacity>
          }
    </Right>  
}        
 
 
          
        </Header> 
          
       
         
          
    );  
  }
}


function mapStateToProps(state) {        
  return {
    CartNumber : state.CartNumber
  }
}
export default connect(mapStateToProps)(HeaderBox)  

