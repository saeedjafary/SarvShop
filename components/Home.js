import React, { Component } from 'react';
import { StyleSheet ,ScrollView,ListView,SafeAreaView,FlatList,TouchableOpacity } from 'react-native'; 
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
Drawer.defaultProps.styles.mainOverlay.elevation = 0;   
     
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
          const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.Server = new Server();
    this.state = {
            MaxObj:[],
            HsrajDate:moment(),
            GotoLogin:false,
            GotoCart:false,
            dataSource: ds.cloneWithRows(['row 1', 'row 2']),
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
             query: ''
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
  componentDidUpdate(){
   
  }
  componentDidMount() {
 let that = this;
   
    let SCallBack = function(response){

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
                        MaxObj:response.data.result[0],
                        maximg:maximg
                    })   
                }     
          that.getProducts(6)
    } 
    let ECallBack = function(error){  
     alert(error)   
    }  
        
   this.Server.send("https://marketapi.sarvapps.ir/MainApi/getProducts",{type:1,limit:0},SCallBack,ECallBack) 
      //console.log(this.props)

  }
  
  componentWillUnmount() {
 
 
  }

 getProducts(limit){
let that = this;
   
    let SCallBack = function(response){
        if(limit==6)
        {
          that.setState({
            Products:response.data.result
          })
          that.getProducts(4);
        }
        if(limit==4){
          that.setState({
            Products4:response.data.result
          })
          that.getProducts(1000)
        }
        if(limit==1000){
          that.setState({
            films:response.data.result
          })
        }
        } 
    let ECallBack = function(error){
     alert(error)   
    } 
  this.Server.send("https://marketapi.sarvapps.ir/MainApi/getProducts",{type:1,limit:limit},SCallBack,ECallBack) 


 }  

  render() { 
    const {navigate} = this.props.navigation;    
    const { query } = this.state;
    const films = this.findFilm(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();   
    return (  
     
    <Container>
     
 <Drawer
        side="right"
        ref={(ref) => { this.drawer = ref; }}
        content={<SideBar navigator={this.navigator} navigation={this.props.navigation} />}
        onClose={() => this.closeDrawer()} >
                     <HeaderBox navigation={this.props.navigation} />

         
        <Content style={{marginTop:5}}>
          <View>
          <Button transparent onPress={this.openDrawer}>
              <Icon type="Ionicons" name="folder" style={{fontSize: 30, color: 'blue'}} />
            </Button>
            <View>
      <View style={styles.container}>
        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.autocompleteContainer}
          data={films.length === 1 && comp(query, films[0].title) ? [] : films}
          defaultValue={query}
          onChangeText={text => this.setState({ query: text })}
          placeholder="بخشی از عنوان محصول را وارد کنید"
          renderItem={(p) => (
            <TouchableOpacity onPress={() => navigate('Products', {id: p.item._id})}>
              <Text style={styles.itemText}> 
                {p.item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
        <View style={styles.descriptionContainer}>
          {films.length > 0 ? (
            Home.renderFilm(films[0])
          ) : (
            <Text style={styles.infoText}>
            </Text>
          )}
        </View>
      </View>
    </View>
          </View>
            
        
       
        <ScrollView >     
        
         

          <Grid >
          
             <Row>
                <Col>
             
                </Col>
             </Row>
             {this.state.MaxObj.length > 0 &&
              <Row >
                <Col style={{height: 300 }}>
        <Card>
            <CardItem>
              <Left>
                <Thumbnail source={{uri:'https://www.pizzagooshe.com/Content/UploadFiles/contents/LG_7f48205b-a12c-4dde-a99b-f7a5b5eb022e.png'}} />
                <Body>
                  <Text style={{fontFamily:'IRANSansMobile'}}>{this.state.MaxObj.title}</Text>
                  <Text style={{fontFamily:'IRANSansMobile'}} note>{this.state.MaxObj.subTitle}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Image source={{uri:this.state.maximg}} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              
 <Body style={{position:'absolute',bottom:50,right:0,backgroundColor:'rgba(0,0,0,0.5)',direction:'rtl',padding:5}}>
               <Text style={{color:'#fff',fontFamily:'IRANSansMobile'}}>حراج روز</Text>
                <Text style={{color:'yellow',fontFamily:'IRANSansMobile'}}> {this.state.day} روز {this.state.hours} ساعت  {this.state.minutes} دقیقه {this.state.seconds} ثانیه </Text>
                
              </Body>    
            </CardItem>
          </Card>
          </Col>
             </Row>
             }
             </Grid>
             
               <Grid>
           {this.state.Products4[1] &&
          <Row style={{height:200}}>
            <Col onPress={() => navigate('Products', {id: this.state.Products4[0]._id})}>
              <View> 
                <Image style={{ height: '100%',opacity:'0.8'}} source={{uri:'https://marketapi.sarvapps.ir/' + this.state.Products4[0].fileUploaded.split("public")[1]}} />
               <View style={{position:'absolute',bottom:50,right:0,backgroundColor:'rgba(0,0,0,0.5)',padding:5,width:'100%'}}>  
               <Text style={{textAlign:'right',color:'#fff',fontFamily:'IRANSansMobile'}} >
              {this.state.Products4[0].title}
                </Text>
                <Text style={{textAlign:'right',color:'#fff',fontFamily:'IRANSansMobile'}}>
              {this.state.Products4[0].price - ((this.state.Products4[0].price * this.state.Products4[0].off)/100)} تومان

                </Text>
                </View>
              </View>
            </Col>
            <Col onPress={() => navigate('Products', {id: this.state.Products4[1]._id})}>
              <View>
                <Image style={{ height: '100%',opacity:'0.8'}} source={{uri:'https://marketapi.sarvapps.ir/' + this.state.Products4[1].fileUploaded.split("public")[1]}} />
               <View style={{position:'absolute',bottom:50,right:0,backgroundColor:'rgba(0,0,0,0.5)',padding:5,width:'100%'}}>  
               <Text style={{textAlign:'right',color:'#fff',fontFamily:'IRANSansMobile'}} >
              {this.state.Products4[1].title}
                </Text>
                <Text style={{textAlign:'right',color:'#fff',fontFamily:'IRANSansMobile'}}>
              {this.state.Products4[1].price - ((this.state.Products4[1].price * this.state.Products4[0].off)/100)} تومان

                </Text>
                </View>
              </View>
            </Col>
          </Row>
           }
           {this.state.Products4[3] &&
          <Row style={{height:200}}>
            <Col onPress={() => navigate('Products', {id: this.state.Products4[2]._id})}>
               <View>
                <Image style={{ height: '100%',opacity:'0.8'}} source={{uri:'https://marketapi.sarvapps.ir/' + this.state.Products4[2].fileUploaded.split("public")[1]}} />
               <View style={{position:'absolute',bottom:50,right:0,backgroundColor:'rgba(0,0,0,0.5)',padding:5,width:'100%'}}>  
               <Text style={{textAlign:'right',color:'#fff',fontFamily:'IRANSansMobile'}} >
              {this.state.Products4[2].title}
                </Text>
                <Text style={{textAlign:'right',color:'#fff',fontFamily:'IRANSansMobile'}}>
              {this.state.Products4[2].price - ((this.state.Products4[2].price * this.state.Products4[0].off)/100)} تومان

                </Text>
                </View>
              </View>
            </Col>
            <Col onPress={() => navigate('Products', {id: this.state.Products4[3]._id})}>
               <View>
                <Image style={{ height: '100%',opacity:'0.8'}} source={{uri:'https://marketapi.sarvapps.ir/' + this.state.Products4[3].fileUploaded.split("public")[1]}} />
               <View style={{position:'absolute',bottom:50,right:0,backgroundColor:'rgba(0,0,0,0.5)',padding:5,width:'100%'}}>  
               <Text style={{textAlign:'right',color:'#fff',fontFamily:'IRANSansMobile'}} >
              {this.state.Products4[3].title}
                </Text>
                <Text style={{textAlign:'right',color:'#fff',fontFamily:'IRANSansMobile'}}>
              {this.state.Products4[3].price - ((this.state.Products4[3].price * this.state.Products4[0].off)/100)} تومان

                </Text>
                </View>
              </View>
            </Col>
          </Row>
          }
        </Grid>
             <Grid>
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

function mapStateToProps(state) {        
  return {
    CartNumber : state.CartNumber
  }
}
export default connect(mapStateToProps)(Home)  

