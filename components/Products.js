import React, { Component } from 'react';
import { StyleSheet ,ScrollView,ListView,SafeAreaView,FlatList,TouchableOpacity } from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Image } from 'react-native';
import moment from 'moment-jalaali'; 
import { Container,Content, Header, View,Button, DeckSwiper, Card, CardItem, Toast, Text, Left,Right, Body, Icon,Title,Input } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {AsyncStorage} from 'react-native';
import HeaderBox from './HeaderBox.js'

class Products extends React.Component {   
  constructor(props){   
    super(props);    
    this.Server = new Server();
    this.state = {
            Products:[],
            id:this.props.navigation.state.params.id,
            img1:null,
            img2:null,
            img3:null,
            img4:null,
            img5:null,
            originalImage:null,
            Count:"1",
            price:null,
            off:null,
            api_token:null

    }
    this.changeImage = this.changeImage.bind(this)

    
   

  }  
  componentDidMount() {
   // alert(this.props.navigation.state.params.id)
   AsyncStorage.getItem('api_token').then((value) => this.setState({
    api_token : value
   }))
   this.getProduct();
  }
  
 
  componentWillUnmount() {
 
 
  }
  ChangeCount(p){
      if(p==-1 && this.state.Count <= 1  )
        return;
      this.setState({
        Count:parseInt(this.state.Count)+p+""
      })
  }
  changeImage(p){
    let img = null;
    if(p=="1")
      img = this.state.img1;
    if(p=="2")
      img = this.state.img2;
    if(p=="3")
      img = this.state.img3;
    if(p=="4")
      img = this.state.img4;
    if(p=="5")
      img = this.state.img5;
    this.setState({
      originalImage : img
    })
    
  }
  SendToCart(){
    let that = this;
    this.Server.send("https://marketapi.sarvapps.ir/MainApi/checktoken",{
      token:this.state.api_token   
    },function(response){
      console.warn(response)
      let SCallBack = function(response){
             that.props.navigation.navigate('Cart',{p:'a'}) 
    } 
    let ECallBack = function(error){
     alert(error)   
    }  
    let param={
       PId : that.state.id,
       Number : that.state.Count,
       UId :  response.data.authData.userId,
       Price : that.state.Products[0].price - ((that.state.Products[0].price * that.state.Products[0].off)/100),
       Status:"0",
       Type:"insert",
       token: that.state.api_token
   }  
   that.Server.send("https://marketapi.sarvapps.ir/MainApi/ManageCart",param,SCallBack,ECallBack) 

    },function(error){
        Toast.show({
          text: "جهت اضافه کردن محصول در سبد خرید در سامانه وارد شوید",
          textStyle: { fontFamily:'IRANSansMobile',textAlign:'right',fontSize:14 },
          type: "light"
        })
    }) 
        

    }
    ConvertNumToFarsi(text){
        var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
        return text.replace(/[0-9]/g, function(w){
         return id[+w]
        });
    }
    ConvertNumToLatin(text){
      return text;
      return text.replace(/[\u0660-\u0669]/g, function (c) {
            return c.charCodeAt(0) - 0x0660;
        }).replace(/[\u06f0-\u06f9]/g, function (c) {
          return c.charCodeAt(0) - 0x06f0;   
      });
  }
  getProduct(){
    let that = this;
   
    let SCallBack = function(response){
                    var resp = response.data.result[0];
                    that.setState({
                        Products:response.data.result,
                img1:resp.fileUploaded != "" ? resp.fileUploaded.split("public")[1] : 'nophoto.png',
                img2:resp.fileUploaded1 != "" ? resp.fileUploaded1.split("public")[1] : 'nophoto.png',
                img3:resp.fileUploaded2 != "" ? resp.fileUploaded2.split("public")[1] : 'nophoto.png',
                img4:resp.fileUploaded3 != "" ? resp.fileUploaded3.split("public")[1] : 'nophoto.png',
                img5:resp.fileUploaded4 != "" ? resp.fileUploaded4.split("public")[1] : 'nophoto.png',
                originalImage:resp.fileUploaded != "" ? resp.fileUploaded.split("public")[1] : 'nophoto.png'
                    })  
                 //   alert(that.state.Products.length)  
    } 
    let ECallBack = function(error){
     alert(error)   
    }  
    let param={
        id : this.state.id,
        token: this.state.api_token
        };    
   this.Server.send("https://marketapi.sarvapps.ir/MainApi/getProducts",param,SCallBack,ECallBack) 
  }
  ConvertNumToFarsi(text){
    var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return text.toString().replace(/[0-9]/g, function(w){
     return id[+w]
    });
  }
  render() {
        const {navigate} = this.props.navigation;
        
                       
    return (   
    <Container >
       <TouchableOpacity onPress={() => navigate('Cart')} style={{position:'absolute',bottom:0,zIndex:3,backgroundColor:'#ba6dc7',padding:10,width:'100%'}} >
        <View >
           <Text style={{textAlign:'center',fontFamily:'IRANSansMobile',color:'#fff'}}>
            مشاهده سبد خرید ({this.ConvertNumToFarsi(this.props.CartNumber)}) 
           </Text>    
         </View> 
         </TouchableOpacity> 
        <HeaderBox navigation={this.props.navigation} title={'محصولات'} goBack={true} />
        
        <Content>
        
        <ScrollView>
        {this.state.Products.length>0 &&
        <View >
          <Grid>
             <Row>  
             <Col >  
                <View >
                  <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',paddingRight:10,fontSize:25,marginTop:20}}>{this.state.Products[0].title}</Text>
                </View>
                <View >
                  <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',paddingRight:10,marginTop:20,color:'#333'}}>{this.state.Products[0].subTitle}</Text>
                </View>
                
                <View  style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                  <Text style={{padding:5,borderRadius:5,margin:5,fontFamily:'IRANSansMobile',textAlign:'center',padding:10,textDecorationLine:'line-through'}}>{this.state.Products[0].off ? this.ConvertNumToFarsi(this.state.Products[0].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) + "تومان" : "" } </Text>
                </View>
                {
                 this.state.Products[0].off !="0" &&
                  <View  style={{flex:1,flexDirection:'row',justifyContent:'center',position:'relative',top:-48,right:60}}>
                    <View style={{borderRadius:30,backgroundColor:'red',padding:1}}>
                    <Text style={{padding:5,fontFamily:'IRANSansMobile',textAlign:'center',color:'#fff',fontSize:10}}>%{this.ConvertNumToFarsi(this.state.Products[0].off)} </Text>

                    </View>
                  </View>
                }
                <View  style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:5}}>
                <View style={{borderRadius:5}}>
                  <Text style={{backgroundColor:'#333',padding:5,fontFamily:'IRANSansMobile',textAlign:'center',paddingTop:10,paddingBottom:10,paddingRight:20,paddingLeft:20,color:'#fff',fontSize:25,marginTop:20,marginBottom:10}}>{this.ConvertNumToFarsi((this.state.Products[0].price - ((this.state.Products[0].price * this.state.Products[0].off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</Text>
                </View>
                </View>
                {this.state.Products[0].desc !="-" &&
                <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginTop:15,marginBottom:15,borderWidth: 0.5,borderColor: '#d6d7da',backgroundColor:'rgba(132, 127, 127, 0.05)'}}>
                 <View style={{width:'100%'}}>
                 <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',paddingRight:10,paddingTop:5,color:'gray',fontSize:10}}>جزئیات</Text>
                 <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',lineHeight:25,padding:10}}>{this.state.Products[0].desc}</Text>

                  </View> 
                </View>
                }
             </Col>
             
             </Row>
        </Grid>
          <Grid >
          <Row >
                   <Col style={{width:'80%',paddingRight:5}}>
                  <Row>  
                    <Col>  
                        <Image source={{uri:'https://marketapi.sarvapps.ir/' + this.state.originalImage}}  style={{height: 300}} />
                    </Col>
                  </Row>
                  </Col>
                   <Col >
                      <Row>
                        <Col style={{paddingBottom:2,opacity:0.5}}>
                        {this.state.img1 !="nophoto.png" &&
                    
                          <TouchableOpacity onPress={() => this.changeImage(1)} ><Image source={{uri:'https://marketapi.sarvapps.ir/' + this.state.img1 }} style={{border:1,height: 60, width: 100}}/></TouchableOpacity>
                          
                          }
                        </Col>
                        </Row><Row>
                        <Col style={{paddingBottom:2,opacity:0.5}}>
                        {this.state.img2 !="nophoto.png" &&
                    
                          <TouchableOpacity onPress={() => this.changeImage(2)} ><Image source={{uri:'https://marketapi.sarvapps.ir/' + this.state.img2 }} style={{border:1,height: 60, width: 100}}/></TouchableOpacity>
                          
                          }
                        </Col>
                        </Row><Row>
                        <Col style={{paddingBottom:2,opacity:0.5}}>
                        {this.state.img3 !="nophoto.png" &&
                    
                          <TouchableOpacity onPress={() => this.changeImage(3)} ><Image source={{uri:'https://marketapi.sarvapps.ir/' + this.state.img3 }} style={{border:1,height: 60, width: 100}}/></TouchableOpacity>
                          
                          }
                        </Col>
                        </Row><Row>
                        <Col style={{paddingBottom:2,opacity:0.5}}>
                        {this.state.img4 !="nophoto.png" &&
                    
                          <TouchableOpacity onPress={() => this.changeImage(4)} ><Image source={{uri:'https://marketapi.sarvapps.ir/' + this.state.img4 }} style={{border:1,height: 60, width: 100}}/></TouchableOpacity>
                          
                          }
                        </Col>
                        </Row><Row>
                        <Col style={{paddingBottom:2,opacity:0.5}}>
                        {this.state.img5 !="nophoto.png" &&
                    
                          <TouchableOpacity onPress={() => this.changeImage(5)} ><Image source={{uri:'https://marketapi.sarvapps.ir/' + this.state.img5 }} style={{border:1,height: 60, width: 100}}/></TouchableOpacity>
                          
                          }
                        </Col>
          
                      </Row>
                    
                    </Col>
                
                   
                  </Row>
          
                  </Grid>
                  </View>
      
      }   
  <View style={{flex:1,flexDirection:'row',justifyContent:'center',margin:15}}>
      <View  style={{width:'20%'}}>
          <TouchableOpacity onPress={() => this.ChangeCount(1)}><Text style={{fontFamily:'IRANSansMobile',fontSize:40,textAlign:'center'}}>+</Text></TouchableOpacity>
      </View>
      <View style={{width:'60%'}}>
          <Input value={this.ConvertNumToFarsi(this.state.Count)} keyboardType="number-pad" name="username"   onChangeText={(text) => this.setState({Count:this.ConvertNumToLatin(text)})  } style={{border:1,textAlign:'center',fontSize:40,fontFamily:'IRANSansMobile'}}  />
      </View>
      <View style={{width:'20%'}}>
          <TouchableOpacity  onPress={() => this.ChangeCount(-1)}><Text style={{fontFamily:'IRANSansMobile',fontSize:40,textAlign:'center'}}>-</Text></TouchableOpacity>
      </View>
  </View>
  <View style={{flex:1,flexDirection:'row',justifyContent:'center',margin:15,marginBottom:50}}>
      <Button iconLeft success onPress={() => this.SendToCart()}>
            <Icon name='cart' />
            <Text style={{fontFamily:'IRANSansMobile',textAlign:'center'}}>انتقال به سبد خرید</Text>
          </Button>
  </View>
 
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
export default connect(mapStateToProps)(Products)  


