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
    console.warn("aaa")   

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
     console.warn(this.props.navigation.state.params)

    if( this.props.navigation.state.params  && this.props.navigation.state.params.p=="LoginTrue")
     {
      alert(1)
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
              <View  ><Text style={{fontFamily:'IRANSansMobile',color:'#1abc9c'}}><Icon type="Ionicons" name="cart" style={{fontSize: 30, color: '#1abc9c'}}/> ({this.state.CartNumber}) </Text></View>
            </TouchableOpacity>
         
         }
         </Col>  
          <Col >
         {this.state.username &&
   <TouchableOpacity onPress={() => {  navigate('Login')}} style={{flex:1,flexDirection:'row',justifyContent:'space-between',backgroundColor:'#333',padding:5,borderRadius:5,margin:5}}   >
  
  <View >
  <Text style={{fontFamily:'IRANSansMobile',paddingTop:4,color:'#fff',paddingLeft:5}}> محیط کاربری</Text>  

  </View>
  <View  >
     <Icon name='settings' style={{paddingTop:-5,color:'#ccc'}} />          
  </View>
 </TouchableOpacity> 

          }
         
         </Col>
     <Col style={{width:120}}>      
{!this.state.username &&   
     
 <TouchableOpacity onPress={() => {  navigate('Login')}} style={{flex:1,flexDirection:'row',backgroundColor:'rgb(0, 179, 134)',padding:5,borderRadius:5,margin:5,justifyContent:'space-between'}}   >
  
  <View >
  <Text style={{fontFamily:'IRANSansMobile',paddingTop:4,paddingLeft:5,color:'#fff'}}> ورود / ثبت نام </Text>     

  </View>
  
 </TouchableOpacity>   


}{this.state.username &&
<TouchableOpacity onPress={this.logout} style={{flex:1,flexDirection:'row',backgroundColor:'red',padding:5,borderRadius:5,margin:5}}   >
  
   <View style={{flexBasis:60}}>
   <Text style={{fontFamily:'IRANSansMobile',paddingTop:4,color:'#fff',paddingLeft:5}}> خروج</Text>

   </View>
   <View>
      <Icon name='exit' style={{paddingTop:0,color:'#ccc'}} />
   </View>
  </TouchableOpacity>   

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

