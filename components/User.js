import React, { Component } from 'react';
import { TouchableOpacity} from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Image } from 'react-native';
import moment from 'moment-jalaali'; 
import { Container,Content, Header,Form,Item, View,Button, DeckSwiper, Card, CheckBox, ListItem, Text, Left,Right, Body, Icon,Label,Input,Toast,Segment,Radio } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {AsyncStorage} from 'react-native';
import HeaderBox from './HeaderBox.js'

class User extends React.Component {   
  constructor(props){   
    super(props);    
    this.state = {
      username : null,
      password :  null,
      password2 : null,
      name : null,
      address: null,
      status: null,
      selected:2,
      api_token:null,
      GridDataPayment:[],
      GridDataFactors:[],
      paymentNotOk:false,
      paymentOk:false,
      Stat1:false,
      Stat2:false,
      Stat3:true,
      Stat4:true,
      Stat5:true,            
      Stat6:true,
      Stat7:false

    }
    this.Server = new Server();
    this.updateUserInformation = this.updateUserInformation.bind(this);
    this.GetFactors = this.GetFactors.bind(this);
    this.GetPayment = this.GetPayment.bind(this);

    
   

  }  
  ConvertNumToFarsi(text){
    var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return text.toString().replace(/[0-9]/g, function(w){
     return id[+w]
    });
  }
  componentDidMount() {
      let that = this;
      AsyncStorage.getItem('api_token').then((value) => {   
        that.setState({
            api_token : value
          })
          that.Server.send("https://marketapi.sarvapps.ir/MainApi/checktoken",{
              token:that.state.api_token
          },function(response){
              that.setState({
                UserId : response.data.authData.userId
              })
              that.Server.send("https://marketapi.sarvapps.ir/MainApi/getuserInformation",{
                user_id:that.state.UserId
              },function(response){
                  that.setState({
                    username :  response.data.result[0].username,
                    password :  response.data.result[0].password,
                    password2 : response.data.result[0].password,
                    name : response.data.result[0].name,
                    address: response.data.result[0].address,
                    status: response.data.result[0].status,

                  })
                  
                  that.GetFactors();      


              },function(error){
                  alert(error)   
              })
          },function(error){
              alert(error)   
          })
      })
  
  }
  updateUserInformation(){
          let that = this;
        if(this.state.password != this.state.password2 || this.state.password == ""){
            Toast.show({
              text: "رمز عبور و تکرار آن صحیح نیست",
              textStyle: { fontFamily:'IRANSansMobile',textAlign:'right' },
              type: "danger"
            })
            return;
          }   
        that.Server.send("https://marketapi.sarvapps.ir/AdminApi/ManageUsers",{
                level:"0",
                status:that.state.status,
                username:that.state.username,
                pass:that.state.password,
                name:that.state.name,
                address:that.state.address,      

              },function(response){
                Toast.show({
                  text: 'ویرایش اطلاعات انجام شد',
                  textStyle: { fontFamily:'IRANSansMobile',textAlign:'right' },
                  type: "success"
                })


              },function(error){
                  alert(error)   
              })
  }
  
 
  GetFactors(){   
    let that = this;
    var Stat = [];
    if(this.state.Stat1)
      Stat.push("-2");
    if(this.state.Stat2)
      Stat.push("-1");
    if(this.state.Stat3)
      Stat.push("0");
    if(this.state.Stat4)
      Stat.push("1");
    if(this.state.Stat5)
      Stat.push("2");
    if(this.state.Stat6)
      Stat.push("3"); 
    if(this.state.Stat7)
      Stat.push("4");    
    let param={            
      user_id:this.state.UserId,
      Stat:Stat
    };    

    let SCallBack = function(response){

      response.data.result.map(function(v,i){
        v.radif=i+1;  
        if(v.status=="-2")
          v.statusDesc="درخواست لغو توسط خریدار"
        if(v.status=="-1")
          v.statusDesc="لغو شده"
        if(v.status=="0")
          v.statusDesc="پرداخت نشده"
        if(v.status=="1")
          v.statusDesc="پرداخت شده"  
        if(v.status=="2")
          v.statusDesc="آماده ارسال"  
        if(v.status=="3")
          v.statusDesc="ارسال شده"
        if(v.status=="4")
          v.statusDesc="پایان"  
      })
      that.setState({
        GridDataFactors : response.data.result
      })
      that.GetPayment(1);
    };
    let ECallBack = function(error){    
      console.log(error)
    }
    this.Server.send("https://marketapi.sarvapps.ir/MainApi/getFactors",param,SCallBack,ECallBack)
  }
  GetPayment(p){
    let that = this;
    let param={
      user_id:this.state.UserId,
      OkPayment:p==1 ? 1 : 0      
    };
      this.setState({   
        paymentOk:p==1 ? true : false,
        paymentNotOk:p==2 ? true : false
      })
    let SCallBack = function(response){   
      response.data.result.map(function(v,i){
        v.radif=i+1;
      })
      that.setState({
        GridDataPayment : response.data.result
      })
    };
    let ECallBack = function(error){
      console.log(error)
    }
    this.Server.send("https://marketapi.sarvapps.ir/MainApi/getPayment",param,SCallBack,ECallBack)
  }
 
 
  render() {
   const {navigate} = this.props.navigation;
                    
    return (   
      <Container>
      <HeaderBox navigation={this.props.navigation} title={'محیط کاربری'} goBack={true} NewCartNumber={this.state.CartNumber} />

      <Segment style={{backgroundColor:'#eee'}}>
        <Button first active={this.state.selected === 1}  onPress={() => this.setState({ selected: 1 })}>
          <Text style={{fontFamily:'IRANSansMobile',color:'#333'}} >تنظیمات</Text>
        </Button>
        <Button active={this.state.selected === 2}  onPress={() => this.setState({ selected: 2 })}>
          <Text style={{fontFamily:'IRANSansMobile',color:'#333'}} >سفارشات</Text>
        </Button>
        <Button last active={this.state.selected === 3}  onPress={() => this.setState({ selected: 3 })}>
          <Text style={{fontFamily:'IRANSansMobile',color:'#333'}} >صورت حساب ها</Text>
        </Button>
      </Segment>
      <Content padder>
      
      { this.state.selected==1 &&
        <View >
            <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',paddingRight:10,fontSize:25,marginTop:20}}>ویرایش اطلاعات شخصی</Text>
            <View style={{flex:1,justifyContent:'center',flexDirection:'row',marginTop:15,marginBottom:10}}>
              <View style={{backgroundColor:'#f7f7f7',width:'80%',paddingLeft:15,paddingRight:15,borderRadius:8}}>
              <Text  style={{fontFamily:"IRANSansMobile",textAlign:'right',marginTop:10,marginBottom:10}}>
                 نام کاربری :  {this.state.username} 
               </Text>
              </View>
              
       </View>
        <Form style={{marginTop:5}}>
         
          <Item floatingLabel >
          <Input value={this.state.name} name="name" style={{fontFamily:'IRANSansMobile',textAlign:'right'}}   onChangeText={(text) => this.setState({name:text})  }  />
          <Label style={{fontFamily:'IRANSansMobile',textAlign:'right'}}>نام و نام خانوادگی</Label>

        </Item>
        
        <Item floatingLabel  >
           <Input value={this.state.password} style={{fontFamily:'IRANSansMobile',textAlign:'right'}} secureTextEntry={true} keyboardType="number-pad" name="password"   onChangeText={(text) => this.setState({password:text})  }  />
           <Label style={{fontFamily:'IRANSansMobile',textAlign:'right'}}>رمز عبور</Label>
        </Item>
        <Item floatingLabel  >
           <Input value={this.state.password2}  style={{fontFamily:'IRANSansMobile',textAlign:'right'}} secureTextEntry={true} keyboardType="number-pad" name="password2"   onChangeText={(text) => this.setState({password2:text})  }  />
           <Label style={{fontFamily:'IRANSansMobile',textAlign:'right'}}>تکرار رمز عبور</Label>
        </Item>
        <Item floatingLabel >
          <Input value={this.state.address} style={{fontFamily:'IRANSansMobile',textAlign:'right'}}  name="address"    onChangeText={(text) => this.setState({address:text})  }  />
          <Label style={{fontFamily:'IRANSansMobile',textAlign:'right'}}>آدرس کامل پستی</Label>

        </Item>
        <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:25,marginTop:45}}>
            <Button iconLeft info onPress={this.updateUserInformation}>
                  <Icon name='arrow-back' />
                  <Text style={{fontFamily:'IRANSansMobile',textAlign:'center'}}>ثبت اطلاعات</Text>
                </Button>
        </View>  
        <View style={{flex:1,flexDirection:'row',marginTop:60,justifyContent:'flex-start'}}>
        
          </View> 
       
       
      </Form>
      </View>

          }
          { this.state.selected==2 &&
          <View>
          <View>
          <Grid>
          <Row style={{marginBottom:5}} onPress={() =>{
                this.setState({
                  Stat1:!this.state.Stat1
                })
              }} >
         
              <Col>
              <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',color:'gray',fontSize:12}}>درخواست لغو شده توسط من</Text>
              </Col>
              <Col style={{width:40}}>
              <CheckBox checked={this.state.Stat1} 
                  onPress={() =>{
                    this.setState({
                      Stat1:!this.state.Stat1
                    })
                  }}
              />
              </Col>
            
              
            </Row>
            <Row style={{marginBottom:5}} onPress={() =>{
                this.setState({
                  Stat2:!this.state.Stat2
                })
              }}>
              
              
              <Col>
              <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',color:'gray',fontSize:12}}>لغو شده</Text>
              </Col>
              <Col style={{width:40}} >
              <CheckBox checked={this.state.Stat2} onPress={() =>{
                this.setState({
                  Stat2:!this.state.Stat2
                })
              }}  
              />
              </Col>
              
            </Row>
           
            <Row style={{marginBottom:5}} onPress={() =>{
                this.setState({
                  Stat3:!this.state.Stat3
                })
              }}>
              <Col>
              <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',color:'gray',fontSize:12}}>پرداخت نشده</Text>
              </Col>
              <Col style={{width:40}}>
              <CheckBox checked={this.state.Stat3} onPress={() =>{
                this.setState({
                  Stat3:!this.state.Stat3
                })
              }} 
              />
              </Col>
              
              
            </Row>
            <Row style={{marginBottom:5}} onPress={() =>{
                this.setState({
                  Stat4:!this.state.Stat4
                })
              }} >
              
              
              <Col>
              <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',color:'gray',fontSize:12}}>پرداخت شده</Text>
              </Col>
              <Col style={{width:40}}>
              <CheckBox checked={this.state.Stat4} onPress={() =>{
                this.setState({
                  Stat4:!this.state.Stat4
                })
              }} 
              />
              </Col>
              
            </Row>
            <Row style={{marginBottom:5}} onPress={() =>{
                this.setState({
                  Stat5:!this.state.Stat5
                })
              }} >
              <Col>
              <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',color:'gray',fontSize:12}}>آماده ارسال</Text>
              </Col>
              <Col style={{width:40}}>
              <CheckBox checked={this.state.Stat5}  onPress={() =>{
                this.setState({
                  Stat5:!this.state.Stat5
                })
              }}
              />
              </Col>
              
              
            </Row>
            <Row style={{marginBottom:5}} onPress={() =>{
                this.setState({
                  Stat6:!this.state.Stat6
                })
              }} >
             
              <Col>
              <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',color:'gray',fontSize:12}}>ارسال شده</Text>
              </Col>
              <Col style={{width:40}}>
              <CheckBox checked={this.state.Stat6} onPress={() =>{
                this.setState({
                  Stat6:!this.state.Stat6
                })
              }} 
              />
              </Col>
              
            </Row>
            <Row style={{marginBottom:5}} onPress={() =>{
                this.setState({
                  Stat7:!this.state.Stat7
                })
              }} >
              <Col>
              <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',color:'gray',fontSize:12}}>پایان یافته</Text>
              </Col>
              <Col style={{width:40}}>
              <CheckBox checked={this.state.Stat7}  onPress={() =>{
                this.setState({
                  Stat7:!this.state.Stat7
                })
              }}
              />
              </Col>
              
              
            </Row>
            <Row style={{marginBottom:5}}  >
              <Col>
                  <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                    <Button iconLeft light onPress={this.GetFactors}>
                          <Text style={{fontFamily:'IRANSansMobile',textAlign:'center'}}>به روز رسانی اطلاعات</Text>
                        </Button>
                  </View>  
                
            </Col>
             
              
              
            </Row>
            </Grid>
         
            
          </View>
          <Grid style={{marginTop:15}}>
             <Row style={{backgroundColor:'#333',padding:15}}>
                  <Col>
                  <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',color:'#fff',fontSize:12}}>
                      جزئیات
                  </Text>
                  </Col>
                  <Col>
                  <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',color:'#fff',fontSize:12}}>
                      وضعیت
                  </Text>
                  </Col>
                  <Col>
                  <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',color:'#fff',fontSize:12}}>
                      مبلغ
                  </Text>
                  </Col>
            </Row>
            {this.state.GridDataFactors.map((v, i) => { 
             return ( 
                <Row style={(i % 2) ? {backgroundColor:'#eee',padding:15} : {backgroundColor:'#ccc',padding:15}}>
                  <Col>
                  <TouchableOpacity onPress={this.openDrawer}  >

                  <Icon name="grid" style={{fontFamily:'IRANSansMobile',textAlign:'center',color:'gray'}}  />
                           
                  </TouchableOpacity>
                  </Col>
                 
                 
                  <Col>
                  <Text style={{fontFamily:'IRANSansMobile',textAlign:'center'}}>
                      {v.statusDesc}
                  </Text>  
                      
                  </Col>

                  <Col>
                  <Text style={{fontFamily:'IRANSansMobile',textAlign:'center'}}>
                      {this.ConvertNumToFarsi(v.Amount)} تومان
                  </Text>       
                  </Col>
                  
                  </Row>
             )
            })
          }
          </Grid>
          </View>   

          }
          { this.state.selected==3 &&
            <View>

            <View>
              
              <ListItem selected={this.state.paymentOk} onPress={() => this.GetPayment(1)}>
                <Left >
                  <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',color:'gray',fontSize:12}}>تراکنش های موفق</Text>
                </Left>
                <Body>
                  <Radio
                    color={"#f0ad4e"}
                    selectedColor={"#5cb85c"}
                    selected={this.state.paymentOk}
                  />
                </Body>
              </ListItem>
              <ListItem selected={this.state.paymentNotOk} onPress={() => this.GetPayment(2)}>
                <Left>
                  <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',color:'gray',fontSize:12}}>20 تراکنش اخیر ناموفق</Text>
                </Left>
                <Body>
                  <Radio
                    color={"#f0ad4e"}
                    selectedColor={"#5cb85c"}
                    selected={this.state.paymentNotOk}
                  />
                </Body>
              </ListItem>
            
          </View>
              <Grid>
              <Row style={{backgroundColor:'#333',padding:15}}>
                   <Col>
                   <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',color:'#fff',fontSize:12}}>
                       رسید تراکنش
                   </Text>
                   </Col>
                   <Col>
                   <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',color:'#fff',fontSize:12}}>
                       تاریخ
                   </Text>
                   </Col>
                   <Col>
                   <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',color:'#fff',fontSize:12}}>
                       مبلغ
                   </Text>
                   </Col>
             </Row>
             {this.state.GridDataPayment.map((v, i) => { 
              return ( 
                 <Row style={(i % 2) ? {backgroundColor:'#eee',padding:15} : {backgroundColor:'#ccc',padding:15}}>
                   <Col>
                   <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',fontSize:12}}>
                       {v.refId}
                   </Text>
                   </Col>
                  
                  
                   <Col>
                   <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',fontSize:12}}>
                       {v.date.split(",")[0]}
                   </Text>  
                   <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',fontSize:12}}>
                       {v.date.split(",")[1]}
                   </Text> 
                       
                   </Col>
 
                   <Col>
                   <Text style={{fontFamily:'IRANSansMobile',textAlign:'center'}}>
                       {this.ConvertNumToFarsi(v.amount)} تومان
                   </Text>       
                   </Col>
                   
                   </Row>
              )
             })
           }
           </Grid>
           </View>


          }
      </Content>
    </Container>   
           
    );
  }
}


function mapStateToProps(state) {        
  return{
    CartNumber : state.CartNumber,
  }
}
export default connect(mapStateToProps)(User)  

