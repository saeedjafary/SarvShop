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
import MapboxGL from "@react-native-mapbox-gl/maps";
MapboxGL.setAccessToken("parsimap.accessToken");

class Shops extends React.Component {   
  constructor(props){   
    super(props);    
    this.Server = new Server();
    this.state = {
            Shops:[],
            api_token:null

    }

    
   

  }  
  componentDidMount() {
   // alert(this.props.navigation.state.params.id)
   AsyncStorage.getItem('api_token').then((value) => this.setState({
    api_token : value
   }))
   this.getShops();
  }
  
 
  componentWillUnmount() {
 
 
  }
 
  getShops(){
    let that = this;
   return;
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
      
        <HeaderBox navigation={this.props.navigation} title={'فروشگاه'} goBack={true} />
        
        <Content>
        
        <ScrollView>
        <View>
        <MapboxGL.MapView
        style={{ flex: 1 }}
        styleURL={"https://www.parsimap.com/styles/street.json"}
      >
        <MapboxGL.Camera
          centerCoordinate={[51.41, 35.7575]}
          zoomLevel={18}
        ></MapboxGL.Camera>
      </MapboxGL.MapView>
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
export default connect(mapStateToProps)(Shops)  


