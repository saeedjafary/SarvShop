import React, { Component } from 'react';
import { StyleSheet ,ScrollView,SafeAreaView,Platform,TouchableOpacity } from 'react-native'; 
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
      <Button ><Text >{title}</Text></Button>
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
        
   this.Server.send("https://marketapi.sarvapps.ir/MainApi/checktoken",{token:value},SCallBack,ECallBack) 

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

    if( this.props.navigation.state.params  && this.props.navigation.state.params.p=="LoginTrue")
     {
      this.findUser(); 
     } 
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
 ConvertNumToFarsi(text){
  var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  if(!text)
    return text;
  return text.toString().replace(/[0-9]/g, function(w){
   return id[+w]
  });
}
 
  render() { 
    const {navigate} = this.props.navigation;    

           
    return (  
     
     <Header style={{backgroundColor:'#fff'}}  >
      {this.props.goBack &&    
          <Left >
            <Button transparent onPress={() => {try         {this.props.navigation.state.params.onGoBack()}catch(e){}
 ; this.props.navigation.goBack()}}>
              <Icon name='arrow-back' style={{color:'#333'}} />
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
              <View  ><Text style={{fontFamily:'IRANSansMobile',color:'#1abc9c',marginTop:7}}><Icon type="Ionicons" name="cart" style={{fontSize: 30, color: '#1abc9c'}}/> ({this.ConvertNumToFarsi(this.state.CartNumber)}) </Text></View>
            </TouchableOpacity>
         
         }
         </Col>  
          <Col >
         {this.state.username &&
   <TouchableOpacity onPress={() => {  navigate('User')}} style={Platform.OS==='android' ? {padding:0,flex:1,flexDirection:'row',justifyContent:'space-between',backgroundColor:'#333',padding:5,borderRadius:5,margin:8} : {padding:0,flex:1,flexDirection:'row',justifyContent:'space-between',backgroundColor:'#333',padding:5,borderRadius:5,margin:5}}   >
  
  <View >
  <Text style={{fontFamily:'IRANSansMobile',paddingTop:4,color:'#fff',paddingLeft:5,fontSize:13}}> محیط کاربری</Text>  

  </View>
  <View  >
     <Icon name='settings' style={Platform.OS==='android' ? {paddingTop:6,color:'#ccc',fontSize:20} : {color:'#ccc'}} />          
  </View>
 </TouchableOpacity> 

          }
         
         </Col>
     <Col style={{width:120}}>         
{!this.state.username &&   
     
 <TouchableOpacity onPress={() => {  navigate('Login')}} style={Platform.OS==='android' ? {flex:1,flexDirection:'row',backgroundColor:'rgb(0, 179, 134)',padding:5,borderRadius:5,margin:10,justifyContent:'space-between'} : {flex:1,flexDirection:'row',backgroundColor:'rgb(0, 179, 134)',padding:5,borderRadius:5,margin:5,justifyContent:'space-between'}}   >
  
  <View >
  <Text style={{fontFamily:'IRANSansMobile',paddingTop:4,paddingLeft:5,color:'#fff',fontSize:13}}> ورود / ثبت نام </Text>     

  </View>
  
 </TouchableOpacity>   


}{this.state.username &&
<TouchableOpacity onPress={this.logout} style={Platform.OS==='android' ? {flex:1,flexDirection:'row',justifyContent:'space-between',backgroundColor:'red',padding:5,borderRadius:5,margin:8} : {flex:1,flexDirection:'row',justifyContent:'space-between',backgroundColor:'red',padding:5,borderRadius:5,margin:5}}   >
  
   <View style={{flexBasis:60}}>
   <Text style={{fontFamily:'IRANSansMobile',paddingTop:4,color:'#fff',paddingLeft:5,fontSize:13}}> خروج</Text>

   </View>
   <View>
      <Icon name='exit' style={Platform.OS==='android' ? {paddingTop:7,color:'#ccc',fontSize:20} : {color:'#ccc'}}  />
   </View>
  </TouchableOpacity>   

}  
          </Col> 
          </Row>   
         
          </Grid>
        
  }
  {this.props.goBack &&             
  <View style={{width:'100%'}}><Text style={{fontFamily:'IRANSansMobile',texAlign:'right'}}>{this.props.title}</Text></View>
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
              <View  ><Text style={{fontFamily:'IRANSansMobile',color:'#1abc9c'}}><Icon type="Ionicons" name="cart" style={{fontSize: 30, color: '#1abc9c'}} /> ({this.ConvertNumToFarsi(this.state.CartNumber)}) </Text></View>
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

