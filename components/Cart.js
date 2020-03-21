import React, { Component } from 'react';
import { StyleSheet ,ScrollView,ListView,SafeAreaView,FlatList,TouchableOpacity,Linking  } from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Image } from 'react-native';
import moment from 'moment-jalaali'; 
import { Container,Content, Header, View,Button, DeckSwiper, Card, CardItem, Thumbnail, Text, Left,Right, Body, Icon,Title,Input } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {AsyncStorage} from 'react-native';
import HeaderBox from './HeaderBox.js'

class Cart extends React.Component {   
  constructor(props){   
    super(props);    
    this.Server = new Server();
    this.state = {
            UserId:null,
            api_token:null,
            lastPrice:"0",
            GridData:null,
            CartNumber:null,
            ItemCount:[]


    }
    this.Payment = this.Payment.bind(this);


    
   

  }
  Payment(){
         let that = this;
        let products_id=[];
        for(let i=0;i<this.state.GridData.length;i++){
            products_id.push({_id:this.state.GridData[i].product_id,number:this.state.GridData[i].number,title:this.state.GridData[i].products[0].title,subTitle:this.state.GridData[i].products[0].subTitle,desc:this.state.GridData[i].products[0].desc});
        }
        let param={    
              Amount: this.state.lastPrice,
              userId:this.state.UserId,
              products_id:products_id
        };   
        let SCallBack = function(response){                      
               console.log(response.data.result) 
               let res =response.data.result;
               Linking.openURL(res)                               

             //  window.location = res;
         };
         let ECallBack = function(error){
                alert(error)
        }
        this.Server.send("https://marketapi.sarvapps.ir/MainApi/payment",param,SCallBack,ECallBack)


   

  }  
 
  componentDidMount() {

      let that = this;
      AsyncStorage.getItem('api_token').then((value) => {
      this.setState({
        api_token : value
      })
      that.Server.send("https://marketapi.sarvapps.ir/MainApi/checktoken",{
          token:that.state.api_token
        },function(response){
          that.setState({
            UserId : response.data.authData.userId
          })

          that.getCartItems();

        },function(error){
            alert(error)
        })
      })
   
    
  }
  
 
  componentWillUnmount() {
 
 
  }
  ChangeCount(C,I,product_id){
      if(C==-1 && this.state.ItemCount[I] <= 1  )
          return;
      let ItemCount = this.state.ItemCount;
      ItemCount[I] = parseInt(ItemCount[I])+parseInt(C)+"";
      console.warn(ItemCount[I])
      /*this.setState({
        ItemCount : ItemCount
      })*/
      let that = this;
      let param={  
              product_id :  product_id,
              user_id : this.state.UserId,
              number:C=="0" ? C : ItemCount[I]
        };

        let SCallBack = function(response){
                that.getCartItems();
         };
         let ECallBack = function(error){
                alert(error)
        }
        this.Server.send("https://marketapi.sarvapps.ir/MainApi/changeCart",param,SCallBack,ECallBack)

  }
  ConvertNumToFarsi(text){
    var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return text.toString().replace(/[0-9]/g, function(w){
     return id[+w]
    });
  }
  getCartItems(){
        let that=this;
        this.setState({
            lastPrice : 0
        })         
        let param={
              UId : this.state.UserId
        };

        let SCallBack = function(response){
                let lastPrice=0, 
                    CartNumber=0,
                    ItemCount=[];
                response.data.result.map((res,index) =>{
                    lastPrice+=res.number*res.price;
                    CartNumber+=parseInt(res.number);
                    ItemCount[index] = res.number+""

                })     
                AsyncStorage.setItem('CartNumber',CartNumber.toString());
                that.setState({
                    lastPrice:lastPrice,
                    GridData:response.data.result,
                    CartNumber:CartNumber,
                    ItemCount:ItemCount
                })
                 that.props.dispatch({
                    type: 'LoginTrueUser',    
                    CartNumber:that.state.CartNumber
                  })
                
    
         };
         let ECallBack = function(error){
                alert(error)
        }
        this.Server.send("https://marketapi.sarvapps.ir/MainApi/getCartPerId",param,SCallBack,ECallBack)
    }
  render() {
        const {navigate} = this.props.navigation;
        
                       
    return (   
    <Container>
<HeaderBox navigation={this.props.navigation} title={'سبد خرید'} goBack={true} NewCartNumber={this.state.CartNumber} />
        
        <Content>
        <ScrollView>
        {this.state.lastPrice !="0" &&
          <View>
          
              <View style={{marginTop:25}}>
              <Text   style={{fontFamily:"IRANSansMobile",textAlign:'center',marginTop:10,marginBottom:10}}>
                  مبلغ قابل پرداخت  
                  &nbsp;&nbsp;<Text style={{fontFamily:"IRANSansMobile",fontSize:25,color:'red'}}>{this.ConvertNumToFarsi(this.state.lastPrice)}</Text> &nbsp;&nbsp; 
                  تومان
              </Text>
              </View>
            
              <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:25,marginTop:15}}>
                <Button iconLeft success onPress={this.Payment}>
                  <Icon name='cart' />
                  <Text style={{fontFamily:'IRANSansMobile',textAlign:'center'}}>پرداخت</Text>
                </Button>
            </View>
        
        </View>
          }
          {this.state.lastPrice =="0" && this.state.CartNumber == 0 &&
          <View style={{marginTop:100}}>
     
          <Text   style={{fontFamily:"IRANSansMobile",textAlign:'center',marginTop:10,marginBottom:10}}>
                        سبد خرید خالی است
                        </Text>
            </View>

        }
         <Grid style={{border:'1px solid red'}}>
{
        this.state.GridData && this.state.GridData.map((item, index) => (
          
          <Row style={{borderWidth: 1,borderColor: '#d6d7da'}}>
    <Col style={{verticalAlign:'middle',borderRightWidth: 1,borderColor: '#d6d7da',paddingTop:70}}>
    <TouchableOpacity  onPress={() => this.ChangeCount("0",index,item.products[0]._id)}><Icon name='close' style={{fontSize:30,textAlign:'center',color:'red'}}  /></TouchableOpacity>
      
    </Col>      
   <Col style={{borderRightWidth: 0.5,borderColor: '#eee'}}>
  <Grid style={{marginBottom:10,marginTop:20}}>
    <Row>
      <Col>
          <TouchableOpacity onPress={() => this.ChangeCount(+1,index,item.products[0]._id)} ><Text style={{fontFamily:"IRANSansMobile",fontSize:30,textAlign:'center'}}>+</Text></TouchableOpacity>
      </Col> 
      </Row>
      <Row style={{marginTop:15}}> 
      <Col>
          <View>
            <Text style={{fontFamily:"IRANSansMobile",fontSize:30,textAlign:'center',color:'#333'}}>
              {this.ConvertNumToFarsi(this.state.ItemCount[index])}
            </Text>
          </View>
      </Col>
      </Row>
      <Row>
      <Col>
          <TouchableOpacity  onPress={() => this.ChangeCount(-1,index,item.products[0]._id)}><Text style={{fontFamily:"IRANSansMobile",fontSize:50,textAlign:'center'}}>-</Text></TouchableOpacity>
      </Col>
    </Row>
  </Grid>
  
  </Col>       
  <Col style={{width:'60%'}}>
      <View style={{padding:15}}>
        <Text style={{fontFamily:"IRANSansMobile",textAlign:"center",fontSize:20,color:'#333'}}>
          {item.products[0].title}
        </Text>
      </View>
      {item.products[0].subTitle !="-" &&
      <View style={{padding:15}}>
        <Text style={{fontFamily:"IRANSansMobile",textAlign:"center",fontSize:13}}>
          {item.products[0].subTitle}
        </Text>
      </View>
      }
      {item.products[0].desc !="-" &&
      <View style={{padding:15}}>
        <Text style={{fontFamily:"IRANSansMobile",textAlign:"center",color:'gray',fontSize:11,lineHeight:20}}>
          {item.products[0].desc}
        </Text>
      </View>
      }
      
  </Col>
</Row>
               
         )) 
      }  

        </Grid>
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
export default connect(mapStateToProps)(Cart)  

