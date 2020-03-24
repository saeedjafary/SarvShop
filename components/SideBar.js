import React, { Component } from 'react';
import { StyleSheet,Image,View,TouchableOpacity } from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Separator,Right,Left,Icon,Button } from 'native-base';
import { connect } from "react-redux"      
import { ScrollView,ListView,SafeAreaView,FlatList } from 'react-native'; 
import Server from './Server.js'

class SideBar extends React.Component { 
  constructor(props){
    super(props);
    this.Server = new Server();

    var date = new Date();
    var offsetInHours = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();   
    this.state={      
       Cat:[]
      
    }
    this.getCategory()
     

  }
 
getCategory(){
 let that = this;
   
    let SCallBack = function(response){
        that.setState({
          Cat:response.data.result
        })
        } 
    let ECallBack = function(error){
     alert(error)   
    } 
  this.Server.send("https://marketapi.sarvapps.ir/MainApi/GetCategory",{},SCallBack,ECallBack) 
 }
  render() {
      const {navigate} = this.props.navigation;    

    return (
      <Container>
          <SafeAreaView >
          <View style={{backgroundColor:'#ccc',marginTop:10}}>
            <Text style={{textAlign:'center',fontFamily:'IRANSansMobile',paddingRight:5}}>
                دسته بندی محصولات
            </Text>
          </View>
      <FlatList
        data={this.state.Cat}        
        horizontal={false}
        inverted={true}
        renderItem={({ item }) => (
          <View style={{margin:5,padding:5,flex: 1, flexDirection: 'row-reverse', justifyContent: 'space-between',width:'100%',backgroundColor:'#eee'}}>
          <TouchableOpacity onPress={() => navigate('Cat', {id: item._id,name:item.name})} ><Text style={{fontFamily:'IRANSansMobile',paddingRight:5}}>{item.name}</Text></TouchableOpacity>
            
          </View>
        
    )}
        keyExtractor={item => item._id}
      />  
    </SafeAreaView>
      </Container>   
    );      

  }
}
function mapStateToProps(state) {
  return {
    username : state.username,
    password : state.password,
    ip : state.ip,
    account:state.account,
    place:state.place,
    fullname : state.fullname,
    Address : state.Address,    
    placeName : state.placeName,
    Theme : state.Theme
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default connect(mapStateToProps)(SideBar)  
