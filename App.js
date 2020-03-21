import React, { Component } from 'react';
import Login from './components/Login'
import Products from './components/Products'
import Home from './components/Home'
import Cart from './components/Cart'
import Cat from './components/Cat'
import Register from './components/Register'
import User from './components/User'
import Server from './components/Server'
import { Provider } from "react-redux"
import { createStore } from "redux"
import reducer from './components/reducer.js'
import { connect } from "react-redux"
import {createStackNavigator} from 'react-navigation-stack';
import * as Font from 'expo-font';
import {View,Text} from 'react-native'             
import { Root } from "native-base";
     
import {                          
  createAppContainer
} from 'react-navigation';       
  
const AppStackNavigator = createStackNavigator({
  Home: {                                
    screen: Home,
    mode: 'screen',
    headerMode: 'none',
    navigationOptions: {
        header:null,
        headerVisible: false,
    }      
  
  },
  Login: {                                                   
    screen: Login ,                            
    mode: 'screen',       
    headerMode: 'none',
    navigationOptions: {                    
        header:null,           
        headerVisible: false,
    }
  }, 
  Products: {                                                   
    screen: Products ,                            
    mode: 'screen',       
    headerMode: 'none',
    navigationOptions: {                    
        header:null,           
        headerVisible: false,
    }
  },
  Cart: {                                                   
    screen: Cart ,                            
    mode: 'screen',       
    headerMode: 'none',
    navigationOptions: {                    
        header:null,           
        headerVisible: false,
    }
  },
  Server: {                                
    screen: Server,
    mode: 'screen'  
  }
 ,
  Cat: {                                
    screen: Cat,
    mode: 'screen',       
    headerMode: 'none',
    navigationOptions: {                    
        header:null,           
        headerVisible: false,
    }  
  }
,
  Register: {                                
    screen: Register,
    mode: 'screen',       
    headerMode: 'none',
    navigationOptions: {                    
        header:null,           
        headerVisible: false,
    }  
  },
  User: {                                
    screen: User,
    mode: 'screen',       
    headerMode: 'none',
    navigationOptions: {                    
        header:null,           
        headerVisible: false,
    }  
  }
 },
  {
    initialRouteName: 'Home',
  }
 
 );
const Navigator = createAppContainer(AppStackNavigator);
const store = createStore(reducer)

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {           
      loading: true,
      fontLoaded:false

    }
  }    
  async componentDidMount() {
  await Font.loadAsync({
    'IRANSansMobile': require('./assets/fonts/IRANSansMobile.ttf'),
  });
  this.setState({ fontLoaded: true });

}
    
  async componentWillMount() { 
  
  }
  render() {
    if(this.state.fontLoaded){
    return (    
      
      <Provider store={store}>
        <Root>
          <Navigator color={1}/>
          </Root>
        </Provider>  
      );
      
    }else{
      return (  
        <View style={{marginTop:100}}>
            <Text>Please Wait ...</Text>
        </View>
      );

    }
  } 
}

