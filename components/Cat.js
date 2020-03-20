import React, { Component } from 'react';
import { StyleSheet ,ScrollView,ListView,SafeAreaView,FlatList,TouchableOpacity } from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Image } from 'react-native';
import moment, { relativeTimeThreshold } from 'moment-jalaali'; 
import { Container,Content, Header, View,Button, DeckSwiper, Card, CardItem, Thumbnail, Text, Left,Right, Body, Title,Input } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Col, Row, Grid } from 'react-native-easy-grid';
import {AsyncStorage} from 'react-native';
import HeaderBox from './HeaderBox.js'
class Cat extends React.Component {   
  constructor(props){   
    super(props);    
    this.Server = new Server();
    this.state = {    
        id:this.props.navigation.state.params.id,   
        GridData:[],
        GridDataFirstId:"",
        LastGridDataFirstId:"-",
        PageCount:0,
        CurentPage:0,
        GridDataPerPage:[],
        limit:6,
        skip:0,
        ServerBusy:false,
        inLoad:true,
        visibleLoader:false
    }

    
   

  }  
  componentDidMount() { 
     
     this.getProducts()
   
        
  }
  getProducts(){
    let that = this;

    if(this.state.ServerBusy)
      return;   
    
    if(this.state.LastGridDataFirstId==this.state.GridDataFirstId) 
        return;
    this.setState({
       ServerBusy:true,
       visibleLoader:true
    })     
    setTimeout(() => {
      let SCallBack = function(response){              
        that.setState({
          GridDataFirstId:response.data.result[0]._id,
          LastGridDataFirstId:that.state.GridData[0] ? that.state.GridData[0]._id : "-",
          GridData:response.data.result,
          PageCount:response.data.result.length,      
        })   
          that.setState({
            ServerBusy:false,
            visibleLoader:false
          })  
      
      }
      let ECallBack = function(error){  
       that.setState({
        ServerBusy:false,
        visibleLoader:false
       }) 
       alert(error)   
      }  
      
     this.Server.send("https://marketapi.sarvapps.ir/MainApi/GetProductsPerCat",{
              id : this.state.id,
              limit:this.state.limit,
              skip:this.state.skip,   
              token:  AsyncStorage.getItem('api_token').then((value) => {    
                  return value
  
              })
          },SCallBack,ECallBack)
    },1500)
    
  }
  
  ConvertNumToFarsi(text){
    var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return text.toString().replace(/[0-9]/g, function(w){
     return id[+w]
    });
  }
  componentWillUnmount() {
 
       
  }
  _handleLoadMore = () => {
    if(this.state.inLoad){
      this.setState({
        inLoad:false
      })
      return;

    }
    this.setState({
      limit:this.state.limit+5/*,
      skip:this.state.skip+1  */
    },this.getProducts())
    
  };  
  _renderItem = ({item}) => (
    <TouchableOpacity style={{borderBottomColor:'#eee',borderBottomWidth:1,padding:15}} onPress={() => this.props.navigation.navigate('Products', {id: item._id})}>
        <View style={{marginBottom:15}}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'space-evenly'}}>
                <View style={{flexBasis:250}}>
                    <Text  style={{fontFamily:'IRANSansMobile',textAlign:'center',fontSize:18,color:'gray'}}> {item.title} </Text>
                    {item.subTitle != '-' &&
                      <Text  style={{fontFamily:'IRANSansMobile',textAlign:'center',marginTop:15,fontSize:12,color:'gray'}}> {item.subTitle} </Text>
                    }
                    {item.off != '0' &&
                        <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',marginTop:15,fontSize:14,color:'#752f2f',textDecorationLine:'line-through'}}>{this.ConvertNumToFarsi(item.price)} تومان</Text>

                      }
                    <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',marginTop:15,fontSize:16,color:'#752f2f'}}> {this.ConvertNumToFarsi(item.price - ((item.price * item.off)/100))} تومان </Text>
               </View>
                <View   >
                <Image source={{uri:'https://marketapi.sarvapps.ir/' + item.fileUploaded.split("public")[1]}} style={{height: 80, width: 80}}/>

                </View>
                </View>
                </View>
      </TouchableOpacity>
  );
  render() {
    
                                 
    return (   
    <Container >
            <HeaderBox navigation={this.props.navigation} title={this.props.navigation.state.params.name} goBack={true} />

              <FlatList
                    data={this.state.GridData}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}  
                    onEndReachedThreshold ={0.5}
                    renderItem={this._renderItem}    
                    onEndReached={this._handleLoadMore}
                    
              />
              {this.state.visibleLoader &&
              <View style={{position:'absolute',bottom:0,left:'50%'}}>
              <Image style={{width:50,height:50,justifyContent: 'center',
    alignItems: 'center'}}
                  source={require('../assets/loading.gif')}
                />
              </View>
  }
              
                
              
              
          





          
     </Container>             
    
           
    );
  }
}


function mapStateToProps(state) {        
  return {
    CartNumber : state.CartNumber
  }
}
export default connect(mapStateToProps)(Cat)  





















