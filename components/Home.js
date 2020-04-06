import React, { Component } from 'react';
import { StyleSheet ,ScrollView,SafeAreaView,FlatList,TouchableOpacity } from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Image } from 'react-native';
import moment from 'moment-jalaali'; 
import { Container,Content,Header,  View,Button, DeckSwiper, Card, CardItem, Thumbnail, Text, Left,Right, Body, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {AsyncStorage} from 'react-native';
import { Drawer } from 'native-base';
import SideBar from './SideBar.js'
import HeaderBox from './HeaderBox.js'
import Autocomplete from 'react-native-autocomplete-input';

//Drawer.defaultProps.styles.mainOverlay.elevation = 0;   
     
let cards = [];      
function Item({ title }) {
  return (
    <View style={{margin:5}}>
      <Button ><Text  style={styles.Text}>{title}</Text></Button>
    </View>
  );
}
class Home extends React.Component {   
   static renderFilm(film) {
    const { title, subTitle, desc } = film;

    return (
      <View style={{marginBottom:100}}> 
        
      </View>
    );
  }
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
            CartNumber:0,
            films: [],
            Cat:[],
            query: '',
            CatData2:null,
            CatData1:null,
            CatData4:null,
            CatData3:null,
            OffData:[],
            LoginTrue:false,
            BestShops:null
    }
    this.openDrawer = this.openDrawer.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)

 }  
 findFilm(query) {  
    if (query === '') {
      return [];
    }
    const { films } = this.state;
    const regex = new RegExp(`${query.trim()}`, 'i');
    return films.filter(film => film.title.search(regex) >= 0);
}
closeDrawer(){
  this.drawer._root.close();
}
openDrawer(){
  this.drawer._root.open();

}
ConvertNumToFarsi(text){
  if(!text)
    return text;
  var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return text.toString().replace(/[0-9]/g, function(w){
   return id[+w]
  });
}
  componentDidUpdate(){
    if(this.props.navigation && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.p=="LoginTrue"){
      this.props.navigation.state.params.p="a";
      this.setState({
        LoginTrue:true
      })

    }  
  }
  componentDidMount() {
    let that = this;
    AsyncStorage.getItem('CartNumber').then((value) => that.props.dispatch({
      type: 'LoginTrueUser',    
      CartNumber:value
    }))
    let SCallBack = function(response){
    if(response.data.result[0]){
     var HarajDate = response.data.result[0].HarajDate.split("/"),
                    TodayDate = response.data.TodayDate.split("/");

       
                if(parseInt(HarajDate[0])>parseInt(TodayDate[0]) || (parseInt(HarajDate[0])==parseInt(TodayDate[0]) && parseInt(HarajDate[1])>parseInt(TodayDate[1]))|| (parseInt(HarajDate[0])==parseInt(TodayDate[0]) && parseInt(HarajDate[1])==parseInt(TodayDate[1]) && parseInt(HarajDate[2])>parseInt(TodayDate[2])))    
                //if(HarajDate >= TodayDate)
                {  
                   var x = setInterval(function() {
                         var distance = new Date(response.data.result[0].HarajDate) - new Date(new moment().format("jYYYY/jMM/jDD HH:mm:ss"));  
                        var day = Math.floor(distance / (1000 * 60 * 60 * 24));
                        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        var seconds = Math.floor((distance % (1000 * 60)) / 1000); 
                      
                        // Display the result in the element with id="demo"
                        //console.log(response.data.result[0].HarajDate)
                        
                        that.setState({  
                            day:day,   
                            hours:hours,
                            minutes:minutes,    
                            seconds:seconds
                        })
                      
                        // If the count down is finished, write some text
                        if (distance < 0) {
                          clearInterval(x);
                          //document.getElementById("demo").innerHTML = "EXPIRED";
                        }
                      }, 1000); 
                 var maximg = 'https://marketapi.sarvapps.ir/' + response.data.result[0].fileUploaded.split("public")[1];
  
                 that.setState({
                        MaxObj:response.data.result,
                        maximg:maximg
                    }) 
                    
                }
              }    
              that.getOffData(); 
          
    } 
    let ECallBack = function(error){     
     alert(error + "1")     
    }  
        
   this.Server.send("https://marketapi.sarvapps.ir/MainApi/getProducts",{type:1,limit:0},SCallBack,ECallBack) 
      //console.log(this.props)

  }
  
  componentWillUnmount() {
 
 
  }

 getProducts(limit,type){
let that = this;
    let SCallBack = function(response){
        if(type=="bestselling")
        {
          that.setState({
            Products4:response.data.result
          })
         // that.getOffData();  
          that.getProducts(1000);
                           
        }
        /*if(limit==4){
          that.setState({
            Products4:response.data.result
          })
          that.getProducts(1000)
        }*/
        if(limit==1000){
          that.setState({          
            films:response.data.result    
          })
          that.GetBestShop()        
        }   
    } 
    let ECallBack = function(error){      
     alert(error + "2")                       
    } 
  if(limit==4)                              
     type="bestselling"       
  this.Server.send("https://marketapi.sarvapps.ir/MainApi/getProducts",{type:type,limit:limit},SCallBack,ECallBack) 
                  

 }  
 getOffData(){     
  let that = this;   
  let SCallBack = function(response){
     that.setState({
        OffData:response.data.result.reverse()
     })
     that.getCats()
       
        
  } 
  let ECallBack = function(error){
   alert(error + "3")   
  } 
  this.Server.send("https://marketapi.sarvapps.ir/MainApi/getProducts",{type:"bestOff",limit:10},SCallBack,ECallBack)
 }
 getCats(){
   let that = this;
   let SCallBack = function(response){
      that.setState({
          Cat:response.data.result
      })
      that.getProductsPerCat(response.data.result[0],1)
        
         
   } 
   let ECallBack = function(error){
    alert(error)   
   } 
   this.Server.send("https://marketapi.sarvapps.ir/MainApi/GetCategory",{},SCallBack,ECallBack)
    


 }
 GetBestShop(){
  let that = this;
  let SCallBack = function(response){
     that.setState({
        BestShops:response.data.result
     })
       
        
  } 
  let ECallBack = function(error){
   alert(error)   
  } 
  this.Server.send("https://marketapi.sarvapps.ir/MainApi/getShops",{ type: "best"},SCallBack,ECallBack)
 

}
 getProductsPerCat(param,lastIndex){
  let that = this;

  that.Server.send("https://marketapi.sarvapps.ir/MainApi/GetProductsPerCat",{id:param._id,limit:6},function(response){
        let res = {
          name : param.name,                 
          id:  param._id,
          data : response.data.result    
        }     
 
        switch(lastIndex){ 
          case 1 :{

            that.setState({     
              CatData1: res      
            })   

            break;
          }
          case 2 :{
            that.setState({     
              CatData2: res
            })
            break;
          }
          case 3 :{
            that.setState({     
              CatData3: res
            })
            break;
          }
          case 4 :{
            that.setState({     
              CatData4: res
            })
            break;      
          }
        }
             

        if(that.state.Cat[lastIndex])
          that.getProductsPerCat(that.state.Cat[lastIndex],lastIndex+1);
        else
          that.getProducts(1000,"bestselling");
    
      } ,function(error){
          alert(error + "4")   
      })
}
  render() { 
    const {navigate} = this.props.navigation;    
    const { query } = this.state;
    const films = this.findFilm(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();   
    return (  
     
    <Container> 
      {this.props.CartNumber != null &&  
     <TouchableOpacity onPress={() => navigate('Shops')} style={{position:'absolute',bottom:0,zIndex:3,backgroundColor:'#ba6dc7',padding:10,width:'100%'}} >
        <View >
           <Text style={{textAlign:'center',fontFamily:'IRANSansMobile',color:'#fff'}}>
            مشاهده سبد خرید ({this.ConvertNumToFarsi(this.props.CartNumber)}) 
           </Text>    
         </View> 
         </TouchableOpacity>        
  }
      <Drawer
        side="right"
        ref={(ref) => { this.drawer = ref; }}
        content={<SideBar navigator={this.navigator} navigation={this.props.navigation} />}
        onClose={() => this.closeDrawer()} >
         <HeaderBox navigation={this.props.navigation}  />
   
         
        <Content style={{marginTop:5}}>
          <View>
         
            <View>

              
      <View >
        <View style={{flex:1,flexDirection:'row-reverse',justifyContent:'space-between',paddingLeft:15,paddingRight:15,marginTop:15}}>
          <View>
            <Text style={{textAlign:'right',fontFamily:'IRANSansMobile',color:'gray',backgroundColor:'#fff'}}>جستجوی محصولات</Text>

          </View>
          <View>
          <TouchableOpacity onPress={this.openDrawer} style={{flex:1,flexDirection:'row',backgroundColor:'rgba(27,31,35,.35)',padding:3,borderRadius:5}}   >
            
            <View style={{paddingLeft:15}}>   
            <Text style={{fontFamily:'IRANSansMobile',paddingTop:2,color:'#fff'}}> دسته بندی</Text>

            </View>
            
          </TouchableOpacity>
          </View>
        </View>
        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          style={{textAlign:'right',height:40,fontFamily:'IRANSansMobile',padding:5}}
          containerStyle={{zIndex:2,padding:15,backgroundColor:'#fff'}}
          listStyle={{padding:15,backgroundColor:'#fff',maxHeight:130}}
          data={films.length === 1 && comp(query, films[0].title) ? [] : films}
          defaultValue={query}
          onChangeText={text => this.setState({ query: text })}
          placeholder="بخشی از عنوان محصول را وارد کنید"
          renderItem={(p) => (
            <TouchableOpacity onPress={() => navigate('Products', {id: p.item._id})} style={{paddingBottom:10}}  >
              <View><Text style={{textAlign:'right',fontFamily:'IRANSansMobile'}}> 
                { p.item.title}
              </Text>
              
              
              </View>

            </TouchableOpacity>
          )}
        />
        
        <View  style={{textAlign:'right'}}>
          {films.length > 0 ? (
            Home.renderFilm(films[0])
          ) : (
            <Text  style={{textAlign:'right'}}>
            </Text>
          )}
        </View>
      </View>
    </View>
          </View>
         {this.state.BestShops &&
       <ScrollView horizontal  >
          <Grid style={{marginBottom:20}}>
          
          <Row> 
           {this.state.BestShops.data.map((v, i) => { 
             return ( 
             <Col onPress={() => navigate('Products', {id: v._id})}>
                <View>
                  {v.logo ?
                  <Image source={{uri:'https://marketapi.sarvapps.ir/' + v.logo.split("public")[1]}} style={{height: 120, width: 120,marginRight: 2}}/>   
                : 
                <Image source={{uri:'http://www.youdial.in/ydlogo/nologo.png'}} style={{height: 120, width: 120,marginRight: 2}}/>   
 
                }
                  <View>
                    <Text style={{textAlign:'center',fontFamily:'IRANSansMobile',fontSize:12,paddingBottom:5,paddingTop:10,color:'gray',width:120,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} >{v.name}</Text>
                  </View>
                </View>
             </Col>
             )
           })
          }
          </Row>

          </Grid>
          </ScrollView>
  }

        <ScrollView >     
        
         
      
        {this.state.OffData.length > 0 &&
          <View >
            <View style={{padding:5,width:'100%',marginBottom:20,marginTop:20,flex:1, flexDirection: 'row'}}>
                
             <View style={{flexGrow: 1}}>
                
             </View>
             <View style={{flexGrow: 9}}><Text style={{textAlign:'right',fontFamily:'IRANSansMobile'}}>
                محصولات پر تخفیف
             </Text></View> 
          </View>
              
          <ScrollView horizontal  >
          <Grid style={{marginBottom:20}}>
          
          <Row>    
           {this.state.OffData.map((v, i) => { 
             return ( 
             <Col onPress={() => navigate('Products', {id: v._id})}>
                <View>
                  {v.fileUploaded &&
                  <Image source={{uri:'https://marketapi.sarvapps.ir/' + v.fileUploaded.split("public")[1]}} style={{height: 180, width: 150,marginRight: 8}}/>   
                  }
                  <View>
                    <Text style={{textAlign:'center',fontFamily:'IRANSansMobile',fontSize:12,paddingBottom:5,paddingTop:10,color:'gray',width:150,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} >{this.ConvertNumToFarsi(v.title)}</Text>
                    <Text style={{textAlign:'center',fontFamily:'IRANSansMobile',fontSize:14,color:'gray',width:150,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',textDecorationLine:'line-through'}}>{this.ConvertNumToFarsi(v.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</Text>

                    <Text style={{textAlign:'center',fontFamily:'IRANSansMobile',fontSize:14,color:'#000',width:150,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{this.ConvertNumToFarsi((v.price - ((v.price * v.off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</Text>
                <Text style={{textAlign:'center',fontFamily:'IRANSansMobile',fontSize:17,color:'red',width:150,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{this.ConvertNumToFarsi(v.off)}% تخفیف </Text>
                  </View>
                </View>
             </Col>
             )
           })
          }
          </Row>    

          </Grid>
          </ScrollView>
          </View>
        }        


              <View style={{padding:5,width:'100%',marginBottom:20,marginTop:20,flex:1, flexDirection: 'row'}}>
                
             <View style={{flexGrow: 1}}>
               
             </View>
             <View style={{flexGrow: 9}}><Text style={{textAlign:'right',fontFamily:'IRANSansMobile'}}>
                {this.state.Products4[1] ? " محصولات پر فروش" : ""}
             </Text></View> 
          </View>  
               <Grid>
           {this.state.Products4[1] &&
          <Row style={{height:200}}>    
            <Col onPress={() => navigate('Products', {id: this.state.Products4[0]._id})} style={{margin:2}}>
              <View> 
                <Image style={{ height: '100%'}} source={{uri:'https://marketapi.sarvapps.ir/' + this.state.Products4[0].fileUploaded.split("public")[1]}} />
               <View style={{position:'absolute',bottom:50,right:0,backgroundColor:'rgba(0,0,0,0.5)',padding:5,width:'100%'}}>  
               <Text style={{textAlign:'right',color:'#fff',fontFamily:'IRANSansMobile'}} >
              {this.state.Products4[0].title}
                </Text>
                <Text style={{textAlign:'right',color:'#fff',fontFamily:'IRANSansMobile'}}>
                  {this.ConvertNumToFarsi((this.state.Products4[0].price - ((this.state.Products4[0].price * this.state.Products4[0].off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان

                </Text>
                </View>
              </View>
            </Col>
            <Col onPress={() => navigate('Products', {id: this.state.Products4[1]._id})} style={{margin:2}}>
              <View>
                <Image style={{ height: '100%'}} source={{uri:'https://marketapi.sarvapps.ir/' + this.state.Products4[1].fileUploaded.split("public")[1]}} />
               <View style={{position:'absolute',bottom:50,right:0,backgroundColor:'rgba(0,0,0,0.5)',padding:5,width:'100%'}}>  
               <Text style={{textAlign:'right',color:'#fff',fontFamily:'IRANSansMobile'}} >
              {this.state.Products4[1].title}
                </Text>
                <Text style={{textAlign:'right',color:'#fff',fontFamily:'IRANSansMobile'}}>
              {this.ConvertNumToFarsi((this.state.Products4[1].price - ((this.state.Products4[1].price * this.state.Products4[0].off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان

                </Text>
                </View>
              </View>
            </Col>
          </Row>
           }
           {this.state.Products4[3] &&
          <Row style={{height:200}}>
            <Col onPress={() => navigate('Products', {id: this.state.Products4[2]._id})} style={{margin:2}}>
               <View>
                <Image style={{ height: '100%'}} source={{uri:'https://marketapi.sarvapps.ir/' + this.state.Products4[2].fileUploaded.split("public")[1]}} />
               <View style={{position:'absolute',bottom:50,right:0,backgroundColor:'rgba(0,0,0,0.5)',padding:5,width:'100%'}}>  
               <Text style={{textAlign:'right',color:'#fff',fontFamily:'IRANSansMobile'}} >
              {this.state.Products4[2].title}
                </Text>
                <Text style={{textAlign:'right',color:'#fff',fontFamily:'IRANSansMobile'}}>
              {this.ConvertNumToFarsi((this.state.Products4[2].price - ((this.state.Products4[2].price * this.state.Products4[0].off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان

                </Text>
                </View>
              </View>
            </Col>
            <Col onPress={() => navigate('Products', {id: this.state.Products4[3]._id})} style={{margin:2}}>
               <View>
                <Image style={{ height: '100%'}} source={{uri:'https://marketapi.sarvapps.ir/' + this.state.Products4[3].fileUploaded.split("public")[1]}} />
               <View style={{position:'absolute',bottom:50,right:0,backgroundColor:'rgba(0,0,0,0.5)',padding:5,width:'100%'}}>  
               <Text style={{textAlign:'right',color:'#fff',fontFamily:'IRANSansMobile'}} >
              {this.state.Products4[3].title}
                </Text>
                <Text style={{textAlign:'right',color:'#fff',fontFamily:'IRANSansMobile'}}>
              {this.ConvertNumToFarsi((this.state.Products4[3].price - ((this.state.Products4[3].price * this.state.Products4[0].off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان

                </Text>
                </View>
              </View>
            </Col>
          </Row>
          }
        </Grid>

        
        
         
          {this.state.MaxObj && this.state.MaxObj.length > 0 && 
            <Grid style={{marginBottom:45}}>

           <Row>
           <Col>
           <View style={{padding:5,width:'100%',marginTop:20,flex:1, flexDirection: 'row'}}>          
             
             <View style={{flexGrow: 1}}>
                
             </View>
             <View style={{flexGrow: 9}}><Text style={{textAlign:'right',fontFamily:'IRANSansMobile'}}>
                حراج روز
             </Text></View> 
          </View>
           </Col>
         </Row>  
           
           <Row>
             <Col style={{height: 300 }}>   
             <TouchableOpacity onPress={() => navigate('Products', {id: this.state.MaxObj[0]._id})}>
                <View style={{flex:1, flexDirection: 'row',justifyContent:'space-between',padding:10,backgroundColor:'rgba(0,0,0,0.7)',width:200,position:'absolute',top:200,zIndex:2}}>      
                    <View style={{padding:5}}>
                        <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',color:'#fff'}}>{this.ConvertNumToFarsi((this.state.MaxObj[0].price - ((this.state.MaxObj[0].price * this.state.MaxObj[0].off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</Text>
                    </View>
                    <View style={{borderRadius:30,backgroundColor:'red',padding:5}}>
                    <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',color:'#fff',fontSize:15}}>%{this.ConvertNumToFarsi(this.state.MaxObj[0].off)} </Text>

                    </View>          
                </View>             
     
             <View style={{padding:10}}>      
               <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',fontSize:25}}>{this.state.MaxObj[0].title}</Text>
               <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',marginTop:18,marginRight:20}} note >{this.state.MaxObj[0].subTitle}</Text>
             </View>
         
           <Image source={{uri:this.state.maximg}} style={{height: 200, width: null}}/>
       
           <View style={{padding:10,margin:20}}>
             <Text style={{color:'#333',fontFamily:'IRANSansMobile',textAlign:'center',fontSize:18}}> {this.ConvertNumToFarsi(this.state.day)} روز {this.ConvertNumToFarsi(this.state.hours)} ساعت  {this.ConvertNumToFarsi(this.state.minutes)} دقیقه {this.ConvertNumToFarsi(this.state.seconds)} ثانیه </Text>
             
           </View>   
           </TouchableOpacity>
           
       </Col>
          </Row>
          </Grid>    

          }


             {this.state.CatData1 &&
          <View>
            <View style={{padding:5,width:'100%',marginBottom:20,marginTop:20,flex:1, flexDirection: 'row'}}>
                
             <View style={{flexGrow: 1}}>
                <TouchableOpacity onPress={() => navigate('Cat', {id: this.state.CatData1.id,name:this.state.CatData1.name})}>
                  <Text style={{textAlign:'right',fontFamily:'IRANSansMobile',color:'gray'}}> 
                    بیشتر...
                  </Text>
                </TouchableOpacity>
             </View>
             <View style={{flexGrow: 9}}><Text style={{textAlign:'right',fontFamily:'IRANSansMobile'}}>
                {this.state.CatData1.name}
             </Text></View> 
          </View>
              
          <ScrollView horizontal  >
          <Grid style={{marginBottom:20}}>
          
          <Row> 
           {this.state.CatData1.data.map((v, i) => { 
             return ( 
             <Col onPress={() => navigate('Products', {id: v._id})}>
                <View>
                  {v.fileUploaded &&
                  <Image source={{uri:'https://marketapi.sarvapps.ir/' + v.fileUploaded.split("public")[1]}} style={{height: 120, width: 120,marginRight: 2}}/>   
                  }
                  <View>
                    <Text style={{textAlign:'center',fontFamily:'IRANSansMobile',fontSize:12,paddingBottom:5,paddingTop:10,color:'gray',width:120,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} >{v.title}</Text>
                    <Text style={{textAlign:'center',fontFamily:'IRANSansMobile',fontSize:14,color:'gray',width:120}}>{this.ConvertNumToFarsi((v.price - ((v.price * v.off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</Text>
                  </View>
                </View>
             </Col>
             )
           })
          }
          </Row>

          </Grid>
          </ScrollView>
          </View>
        }

        {this.state.CatData2 &&
          <View>
            <View style={{padding:5,width:'100%',marginBottom:20,marginTop:20,flex:1, flexDirection: 'row'}}>
                
             <View style={{flexGrow: 1}}>
                <TouchableOpacity onPress={() => navigate('Cat', {id: this.state.CatData2.id,name:this.state.CatData2.name})}>
                  <Text style={{textAlign:'right',fontFamily:'IRANSansMobile',color:'gray'}}> 
                    بیشتر...
                  </Text>
                </TouchableOpacity> 
             </View>
             <View style={{flexGrow: 9}}><Text style={{textAlign:'right',fontFamily:'IRANSansMobile'}}>
                {this.state.CatData2.name}
             </Text></View> 
          </View>
              
          <ScrollView horizontal  >
          <Grid style={{marginBottom:20}}>
          
          <Row> 
           {this.state.CatData2.data.map((v, i) => { 
             return ( 
             <Col onPress={() => navigate('Products', {id: v._id})}>
                <View>
                  {v.fileUploaded &&
                  <Image source={{uri:'https://marketapi.sarvapps.ir/' + v.fileUploaded.split("public")[1]}} style={{height: 120, width: 120,marginRight: 2}}/>   
                  }
                  <View>
                    <Text style={{textAlign:'center',fontFamily:'IRANSansMobile',fontSize:12,paddingBottom:5,paddingTop:10,color:'gray',width:120,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} >{v.title}</Text>
                    <Text style={{textAlign:'center',fontFamily:'IRANSansMobile',fontSize:14,color:'gray',width:120}}>{this.ConvertNumToFarsi((v.price - ((v.price * v.off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</Text>
                  </View>
                </View>
             </Col>
             )
           })
          }
          </Row>

          </Grid>
          </ScrollView>
          </View>
        }

        {this.state.CatData3 &&
          <View>
            <View style={{padding:5,width:'100%',marginBottom:20,marginTop:20,flex:1, flexDirection: 'row'}}>
                
             <View style={{flexGrow: 1}}>
                <TouchableOpacity onPress={() => navigate('Cat', {id: this.state.CatData3.id,name:this.state.CatData3.name})}>
                  <Text style={{textAlign:'right',fontFamily:'IRANSansMobile',color:'gray'}}> 
                    بیشتر...
                  </Text>
                </TouchableOpacity>
             </View>
             <View style={{flexGrow: 9}}><Text style={{textAlign:'right',fontFamily:'IRANSansMobile'}}>
                {this.state.CatData3.name}
             </Text></View> 
          </View>
              
          <ScrollView horizontal  >
          <Grid style={{marginBottom:20}}>
          
          <Row> 
           {this.state.CatData3.data.map((v, i) => { 
             return ( 
             <Col onPress={() => navigate('Products', {id: v._id})}>
                <View>
                  {v.fileUploaded &&
                  <Image source={{uri:'https://marketapi.sarvapps.ir/' + v.fileUploaded.split("public")[1]}} style={{height: 120, width: 120,marginRight: 2}}/>   
                  }
                  <View>
                    <Text style={{textAlign:'center',fontFamily:'IRANSansMobile',fontSize:12,paddingBottom:5,paddingTop:10,color:'gray',width:120,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} >{v.title}</Text>
                    <Text style={{textAlign:'center',fontFamily:'IRANSansMobile',fontSize:14,color:'gray',width:120}}>{this.ConvertNumToFarsi((v.price - ((v.price * v.off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</Text>
                  </View>
                </View>
             </Col>
             )
           })
          }
          </Row>

          </Grid>   
          </ScrollView>
          </View>
        }       

        {this.state.CatData4 &&
          <View>
            <View style={{padding:5,width:'100%',marginBottom:20,marginTop:20,flex:1, flexDirection: 'row'}}>
                
             <View style={{flexGrow: 1}}>
                <TouchableOpacity onPress={() => navigate('Cat', {id: this.state.CatData4.id,name:this.state.CatData4.name})}>
                  <Text style={{textAlign:'right',fontFamily:'IRANSansMobile',color:'gray'}}> 
                    بیشتر...
                  </Text>
                </TouchableOpacity>
             </View>
             <View style={{flexGrow: 9}}><Text style={{textAlign:'right',fontFamily:'IRANSansMobile'}}>
                {this.state.CatData4.name}
             </Text></View> 
          </View>
              
          <ScrollView horizontal  >
          <Grid style={{marginBottom:20}}>
          
          <Row> 
           {this.state.CatData4.data.map((v, i) => {    
             return ( 
             <Col onPress={() => navigate('Products', {id: v._id})}>
                <View>
                  {v.fileUploaded &&
                  <Image source={{uri:'https://marketapi.sarvapps.ir/' + v.fileUploaded.split("public")[1]}} style={{height: 120, width: 120,marginRight: 2}}/>   
                  }
                  <View>
                    <Text style={{textAlign:'center',fontFamily:'IRANSansMobile',fontSize:12,paddingBottom:5,paddingTop:10,color:'gray',width:120,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} >{v.title}</Text>
                    <Text style={{textAlign:'center',fontFamily:'IRANSansMobile',fontSize:14,color:'gray',width:120}}>{this.ConvertNumToFarsi((v.price - ((v.price * v.off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</Text>
                  </View>
                </View>
             </Col>
             )
           })
          }
          </Row>

          </Grid>

          
         
          </ScrollView>
          </View>
        }

         

         
             <Grid style={{marginBottom:50}}>
             {this.state.Products.length>0 &&
             <Row>  
             <Col style={{  height: 300 }}>  
          <DeckSwiper
            ref={(c) => this._deckSwiper = c}
            dataSource={this.state.Products}
            renderEmpty={() =>
              <View style={{ alignSelf: "center" }}>
                <Text style={{fontFamily:'IRANSansMobile'}}>Over</Text>
              </View>  
            }  
            renderItem={item =>
            
              <Card style={{ elevation: 3 }}>
                <CardItem>
                  <Left> 
                    <Thumbnail source={{uri:'https://marketapi.sarvapps.ir/' + item.fileUploaded.split("public")[1]}} />
                    <Body>    
                      <Text style={{fontFamily:'IRANSansMobile'}}>{item.title}</Text>
                      <Text style={{fontFamily:'IRANSansMobile'}} note>{item.subTitle}</Text>  
                    </Body>
                  </Left> 
                </CardItem>
                <CardItem cardBody>
                  <Image style={{ height: 300, flex: 1 }} source={{uri:'https://marketapi.sarvapps.ir/' + item.fileUploaded.split("public")[1]}} />
                </CardItem>
                <CardItem>
                  <Icon name="heart" style={{ color: '#ED4A6A' }} />
                  <Text style={{fontFamily:'IRANSansMobile'}}>{item.title}</Text>
                </CardItem>
              </Card>
            }
          />  
        </Col></Row>
        }
        </Grid>
            

       </ScrollView>
          </Content></Drawer> 
      </Container>
    );     
  }
}    

const styles = StyleSheet.create({
  Text: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
    fontFamily:'IRANSansMobile'
  },
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    paddingTop: 25,
    textAlign:'right',
    direction:'rtl'
  },
  autocompleteContainer: {
    marginLeft: 10,
    marginRight: 10,
    textAlign:'right',
    direction:'rtl'
  },
  itemText: {
    fontSize: 15,
    margin: 2,
    fontFamily:'IRANSansMobile',
    textAlign:'right'
  },
  descriptionContainer: {
    // `backgroundColor` needs to be set otherwise the
    // autocomplete input will disappear on text input.
    backgroundColor: '#F5FCFF',
    marginTop: 8,
    direction:'rtl'
  },
  infoText: {
    textAlign: 'center'
  }
});
function mapStateToProps(state) {        
  return {
    CartNumber : state.CartNumber
  }
}
export default connect(mapStateToProps)(Home)  

