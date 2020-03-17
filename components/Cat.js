import React, { Component } from 'react';
import { StyleSheet ,ScrollView,ListView,SafeAreaView,FlatList,TouchableOpacity } from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Image } from 'react-native';
import moment from 'moment-jalaali'; 
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
        PageCount:0,
        CurentPage:0,
        GridDataPerPage:[]
    }

    
   

  }  
  componentDidMount() {   
     
   let that = this;
   
    let SCallBack = function(response){
      that.setState({
        GridData:response.data.result,
        PageCount:response.data.result.length,
        GridDataPerPage:response.data.result.slice(0, 3)
      })

    }
    let ECallBack = function(error){  
     alert(error)   
    }     
   this.Server.send("https://marketapi.sarvapps.ir/MainApi/GetProductsPerCat",{
            id : this.state.id,
            token:  AsyncStorage.getItem('api_token').then((value) => {
                return value

            })
        },SCallBack,ECallBack)
    
  }
  
 
  componentWillUnmount() {
 
 
  }
  render() {
        const {navigate} = this.props.navigation;    
    
                            
    return (   
    <Container>
            <HeaderBox navigation={this.props.navigation} title={'دسته بندی محصولات'} goBack={true} />

        <Content>
        <ScrollView>    
  {   
           this.state.GridDataPerPage.map((item, index) => (
  
                <Grid  onPress={() => navigate('Products', {id: item._id})}  style={{backgroundColor:Number.isInteger(index/2) ? '#eee' : '#ccc'}}>   
                  <Row style={{borderWidth: 1,borderColor: '#d6d7da'}}>
                    <Col  style={{verticalAlign:'middle',borderRightWidth: 1,borderColor: '#d6d7da'}}>
                    <Text style={{fontFamily:'IRANSansMobile',textAlign:'center'}}> {item.price - (item.price * item.off)/100} تومان </Text>
                  </Col>
                  <Col>
                    <Text  style={{fontFamily:'IRANSansMobile',textAlign:'center'}}> {item.title} </Text>
                    <View>
                      <Text  style={{fontFamily:'IRANSansMobile',textAlign:'center'}}> {item.subTitle} </Text>
                    </View>
                  </Col>
                
                  </Row>
                  <Row style={{height:200,borderWidth: 1,borderColor: '#d6d7da'}}>
                  <Col>
 
                       <Image source={{uri:'https://marketapi.sarvapps.ir/' + item.fileUploaded.split("public")[1]}} style={{height: 200, width: null, flex: 1}}/>

                  </Col>
                 
                  <Col>
                    <Text  style={{fontFamily:'IRANSansMobile',textAlign:'center',padding:5}}> {item.desc} </Text>
                  </Col>
                  
                  </Row>

                </Grid>
             ))     
  }
  <View>
  <Grid>
  <Row>
  {

  (this.state.CurentPage*3)+3 < this.state.PageCount &&
  <Col>
    <TouchableOpacity  onPress={() =>{ 
      var NewCurrentPage = this.state.CurentPage+1
      this.setState({
      CurentPage:NewCurrentPage,
      GridDataPerPage:this.state.GridData.slice((NewCurrentPage)*3,((NewCurrentPage)*3)+3)
    }
    )
    }
    }><Text><Icon name="backward" size={30} color="#900" /></Text></TouchableOpacity>
  </Col> 
  }  
  {

  this.state.CurentPage != 0 &&     
  <Col>
   <TouchableOpacity  onPress={() => {
   var NewCurrentPage = this.state.CurentPage-1
  
   this.setState({
      CurentPage:NewCurrentPage,
      GridDataPerPage:this.state.GridData.slice((NewCurrentPage)*3,((NewCurrentPage)*3)+3)
    })
    }    
    
    }><Text><Icon name="forward" size={30} color="#900" /></Text></TouchableOpacity>
  </Col>
  }
  </Row>
  </Grid>      

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
export default connect(mapStateToProps)(Cat)  

