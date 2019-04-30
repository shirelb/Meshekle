import React, {Component} from 'react';
import {FlatList, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { Animated, Image, Dimensions, Platform, StatusBar, PanResponder, TouchableWithoutFeedback } from 'react-native';

import {Calendar, LocaleConfig} from 'react-native-calendars';
import moment from 'moment';
import phoneStorage from "react-native-simple-store";
import {CheckBox, /*List,*/ ListItem} from "react-native-elements";
import Button from "../submitButton/Button";
import choresStorage from "../../storage/choresStorage";
import { createStackNavigator, createAppContainer } from 'react-navigation';
import axios from "axios";
import {List} from 'react-native-paper';
//import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
//import {  Separator } from 'native-base';


export default class ReplacementRequests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            markedDates: {},
            selectedDate: '',
            dateModalVisible: false,
            choreModalVisible: false,
            type: {message:'',type:{workers:'' ,startTime:'', endTime:'', choreTypeName:''}},
            workers:'',
            replacementsModal: false,
            userChoreSelected:'',
            inRequests:[],
            outRequests:[],
            alertModal:false,
            alertContent:'',
            requestsTypes:[],
            expanded:'',
            tmp:'',
            reqs:'',
        };

        this.userHeaders = {};
        this.userId = null;
        //this.onDayPress = this.onDayPress.bind(this);
        this.deleteReplacementRequest = this.deleteReplacementRequest.bind(this);
        this.displayInRequestsList = this.displayInRequestsList.bind(this);
        this.displayOutRequestsList = this.displayOutRequestsList.bind(this);
        this.replaceUserChores = this.replaceUserChores.bind(this);
        //this.cancelNotRelevantRequests = this.cancelNotRelevantRequests.bind(this);
        this.denyReplacementRequest = this.denyReplacementRequest.bind(this);
        
    }

    componentDidMount() {
        phoneStorage.get('userData')
            .then(userData => {
                this.userHeaders = {
                    'Authorization': 'Bearer ' + userData.token
                };
                this.userId = userData.userId;
                //this.loadUserChores();
                this.loadRequests();
            });

    }

    loadRequests() {
        console.log("userid: ", this.userId);
        choresStorage.getReplacementRequests(this.userId,this.userHeaders, this.props.choreTypeName, "requested")
            .then(response => {
                let inRequests = [];
                let outRequests = [];
                //let requestsTypes = new Set([]);
                let requestsTypes = [];

                console.log("response= ", response);
                response.data.requests.forEach(request => {
                    if ((request.choreOfReceiver !== undefined) && (request.choreOfReceiver !== null) && (moment(request.choreOfReceiver.date).isAfter(Date.now())) && (moment(request.choreOfSender.date).isAfter(Date.now())) &&(request.choreOfReceiver.userId === this.userId))
                    {
                        if(inRequests[request.choreOfReceiver.choreTypeName]===undefined){
                            inRequests[request.choreOfReceiver.choreTypeName] = [];
                            inRequests[request.choreOfReceiver.choreTypeName].push(request);
                            if(!requestsTypes.includes(request.choreOfReceiver.choreTypeName)){
                                requestsTypes.push(request.choreOfReceiver.choreTypeName);
                            }
                        }
                        else{
                        inRequests[request.choreOfReceiver.choreTypeName].push(request);
                        //requestsTypes.add(request.choreOfReceiver.choreTypeName);
                        }
                    }
                    if ((request.choreOfSender !== undefined) && (request.choreOfSender !== null)&& (moment(request.choreOfReceiver.date).isAfter(Date.now())) && (moment(request.choreOfSender.date).isAfter(Date.now())) &&(request.choreOfSender.userId === this.userId))
                    {
                        if(outRequests[request.choreOfReceiver.choreTypeName]===undefined){
                            outRequests[request.choreOfReceiver.choreTypeName] = [];
                            outRequests[request.choreOfReceiver.choreTypeName].push(request);
                            if(!requestsTypes.includes(request.choreOfReceiver.choreTypeName)){
                                requestsTypes.push(request.choreOfReceiver.choreTypeName);
                            }
                        }else{
                        outRequests[request.choreOfReceiver.choreTypeName].push(request);
                        //requestsTypes.add(request.choreOfReceiver.choreTypeName);
                        
                        }

                    }
                });

                this.setState({
                    inRequests: inRequests,
                    //outRequests:outRequests,
                    requestsTypes: requestsTypes,                    
                    outRequests:outRequests,
                });
            })
            .catch(err=>{

            })

    }
/*
    

    renderItem(item) {
        return (
            <View style={[styles.item, {height: item.height}]}>
                <Text>{item.choreTypeName}</Text>
                <Text>{item.date}</Text>
            </View>
        );
    }

*/
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "14%"
                }}
            />
        );
    };
/*
    renderRow = ({item}) => {
        return (
            <ListItem
                roundAvatar
                //title={moment(item.date).format('YYYY-MM-DD') }
                title={item.choreOfSender.choreTypeName + ' '+moment(item.choreOfSender.date).format('DD-MM-YYYY')+'->'+moment(item.choreOfReceiver.date).format('DD-MM-YYYY')}
                
                disabled={item.status==='canceled'}
                
                containerStyle={{borderBottomWidth: 0}}
                // rightIcon={<Icon name={'chevron-left'}/>}
                // hideIcon

                onPress={()=>{
                    this.setState({choreModalVisible: true, type: item.type, userChoreSelected:item});

                    
                }}
            />
        )
    };
*/
    deleteReplacementRequest(){
        choresStorage.changeReplacementRequestStatus(this.userId, this.userHeaders, this.state.userChoreSelected.choreIdOfSender, this.state.userChoreSelected.choreIdOfReceiver, "canceled")
        .then(res=>{
            this.setState({alertModal:true, alertContent:"בקשת ההחלפה הוסרה בהצלחה"})
        })
    }

    denyReplacementRequest(){
        choresStorage.changeReplacementRequestStatus(this.userId, this.userHeaders, this.state.userChoreSelected.choreIdOfSender, this.state.userChoreSelected.choreIdOfReceiver, "deny")
        .then(res=>{
            this.setState({alertModal:true, alertContent:"נשלחה הודעה ל"+this.state.userChoreSelected.choreOfSender.User.fullname+" על אי יכולתך להחליף עימו"})
        })
    }

  /*  displayRequestsList(){
        let types = this.state.requestsTypes;
        let accList = [];
        let i = 0 ;
        types.forEach(itm=>{
            accList.push(<Collapse>
                <CollapseHeader>
                  <Separator bordered>
                  <Text>{itm}</Text>
                    </Separator>
                </CollapseHeader>
                <CollapseBody>
                    <ListItem >
                    <Text>בקשות אליך:</Text>
                    <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                                {this.state.inRequests[itm] === undefined || this.state.inRequests[itm].length === 0 ?
                                    <Text>אין לך בקשות נכנסות </Text>
                                    :
                                    <FlatList
                                        data={this.state.inRequests[itm]}
                                        renderItem={this.renderRow}
                                        keyExtractor={item => item.choreOfSender}
                                        ItemSeparatorComponent={this.renderSeparator}
                                    
                                    />
                                }
                            </List>

                            <Text>בקשות שלך:</Text>
                            <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                                {this.state.outRequests[itm] === undefined || this.state.outRequests[itm].length === 0 ?
                                    <Text>אין לך בקשות יוצאות </Text>
                                    :
                                    <FlatList
                                        data={this.state.outRequests[itm]}
                                        renderItem={this.renderRow}
                                        keyExtractor={item => item.choreIdOfReceiver}
                                        ItemSeparatorComponent={this.renderSeparator}
                                    />
                                }
                            </List>
                    <Text>Aaron Bennet</Text>
                    </ListItem>
                    <ListItem>
                    <Text>Claire Barclay</Text>
                    </ListItem>
                    <ListItem last>
                    <Text>Kelso Brittany</Text>
                    </ListItem>
                </CollapseBody>
                </Collapse>
                  
                  )
        })
        return <View>{accList}</View>
    }*/

    displayOutRequestsList(){
        let i=0;
        let types = this.state.requestsTypes;
        let outRequests = this.state.outRequests;
        let inRequests = this.state.inRequests;
        //let type=0;
        let t=0;
        //for (t in types){//types.forEach(type=>{
            //types.map(type=>{
            //type = types[t];
            //if(type!== undefined  ){
                let ans = types.map(type=>{
                    return( <View>{outRequests[type]!==undefined && outRequests[type].length>0 && (t=t+1)?<List.Accordion
                            key={type}//{String(item.choreIdOfSender)+String(item.choreIdOfReceiver)}
                            title={type}//{moment(item.choreOfSender.date).format('DD-MM-YYYY') + 'החלפה ל:' + moment(item.choreOfReceiver.date).format('DD-MM-YYYY')}
                            description={outRequests[type]!==undefined? (outRequests[type].length+" בקשות "):"0 בקשות"}//{item.choreOfSender.choreTypeName + ', ' + item.choreOfReceiver.User.fullname+ ' סטטוס: '+item.status}
                            left={props => <List.Icon {...props} icon="shrink"/>}
                            expanded={this.state.expanded[type]}//{this.state.expanded[String(item.choreIdOfSender)+String(item.choreIdOfReceiver)]}
                            onPress={() => {
                                let expanded = this.state.expanded;
                                //expanded[String(item.choreIdOfSender)+String(item.choreIdOfReceiver)] = !expanded[String(item.choreIdOfSender)+String(item.choreIdOfReceiver)];
                                expanded[type] = !expanded[type];
                                this.setState({expanded: expanded})
                            }}
                        >
                        {outRequests[type]!==undefined? //outRequests[type].forEach(item => {
                            
                            outRequests[type].map((value,index)=>{
                                return <List.Item
                                title={value.choreOfReceiver.User.fullname}
                                description={String(value.status)}
                                containerStyle={{borderBottomWidth: 0}}
                                onPress={()=>{
                                    this.setState({choreModalVisible: true, userChoreSelected:value});
                                }}
                                disabled={value.status==="canceled"}
                            />
                            })
                            : <Text>?????</Text>}
        </List.Accordion>:<Text></Text>}
        </View>)}
            
            //else{
            //    return <Text>בעיה</Text>
           // }
        )
        if(t===0){
            return <Text>אין בקשות יוצאות</Text>
        }
        return ans;
    }

    displayInRequestsList(){
        let i=0;
        let types = this.state.requestsTypes;
        let inRequests = this.state.inRequests;
        //let type=0;
        let t=0;
        let ans = types.map(type=>{
                    return( <View>{inRequests[type]!==undefined && inRequests[type].length>0 && (t=t+1)?<List.Accordion
                            key={type}//{String(item.choreIdOfSender)+String(item.choreIdOfReceiver)}
                            title={type}//{moment(item.choreOfSender.date).format('DD-MM-YYYY') + 'החלפה ל:' + moment(item.choreOfReceiver.date).format('DD-MM-YYYY')}
                            description={inRequests[type]!==undefined? (inRequests[type].length+" בקשות "):"0 בקשות"}//{item.choreOfSender.choreTypeName + ', ' + item.choreOfReceiver.User.fullname+ ' סטטוס: '+item.status}
                            left={props => <List.Icon {...props} icon="perm-contact-calendar"/>}
                            expanded={this.state.expanded[type]}//{this.state.expanded[String(item.choreIdOfSender)+String(item.choreIdOfReceiver)]}
                            onPress={() => {
                                let expanded = this.state.expanded;
                                //expanded[String(item.choreIdOfSender)+String(item.choreIdOfReceiver)] = !expanded[String(item.choreIdOfSender)+String(item.choreIdOfReceiver)];
                                expanded[type] = !expanded[type];
                                this.setState({expanded: expanded})
                            }}
                        >
                        {inRequests[type]!==undefined? //outRequests[type].forEach(item => {
                            
                            inRequests[type].map((value,index)=>{
                                return <List.Item
                                title={value.choreOfSender.User.fullname}
                                description={String(value.status)}
                                containerStyle={{borderBottomWidth: 0}}
                                onPress={()=>{
                                    this.setState({choreModalVisible: true, userChoreSelected:value});
                                }}
                                disabled={value.status==="deny"}
                            />
                            })
                            : <Text>?????</Text>}
        </List.Accordion>: <Text></Text>}
        </View>)});
        if(t===0){
            return <Text>אין בקשות נכנסות</Text>
        }
        return ans;           
    }

    replaceUserChores(){
        let reqs = [];
         //this.cancelNotRelevantRequests()
         //.then(resp=>{
            choresStorage.getReplacementRequests(this.userId,this.userHeaders, this.props.choreTypeName, "requested")
            .then(response=>{
                let req = 0;
                let requests = []
                let allReplacementRequests = response.data.requests;
                for(req in allReplacementRequests){
                    if(allReplacementRequests[req].choreIdOfReceiver===this.state.userChoreSelected.choreIdOfReceiver|| allReplacementRequests[req].choreIdOfReceiver===this.state.userChoreSelected.choreIdOfSender||
                        allReplacementRequests[req].choreIdOfSender===this.state.userChoreSelected.choreIdOfReceiver|| allReplacementRequests[req].choreIdOfSender===this.state.userChoreSelected.choreIdOfSender){
                        requests.push([choresStorage.changeReplacementRequestStatus(this.userId, this.userHeaders, allReplacementRequests[req].choreIdOfSender, allReplacementRequests[req].choreIdOfReceiver, "canceled")])
                    }
                }
                axios.all(requests)
                .then(res=>{
                    reqss = requests;
                    reqs = [];
                    reqs.push([ choresStorage.changeReplacementRequestStatus(this.userId, this.userHeaders, this.state.userChoreSelected.choreIdOfSender, this.state.userChoreSelected.choreIdOfReceiver, "replaced"),choresStorage.replaceUserChores(this.userId, this.userHeaders,this.state.userChoreSelected.choreIdOfSender, this.state.userChoreSelected.choreIdOfReceiver),choresStorage.generalReplacementRequest(this.userId, this.userHeaders, this.state.userChoreSelected.choreIdOfSender,false),choresStorage.generalReplacementRequest(this.userId, this.userHeaders, this.state.userChoreSelected.choreIdOfReceiver,false)]);  
                    axios.all(reqs)
                    .then(res=>{   
                        this.setState({ alertModal:true,alertContent:String('החלפת תורנויות בוצעה בהצלחה. כעת, התורנות שלך הועברה לתאריך:'+String(this.state.userChoreSelected.choreOfSender.date))})
                        //this.props.loadUserChores();

                    })
                    .catch(err=>{
                        this.setState({alertModal:true,alertContent:String('משהו השתבש,. ההחלפה לא בוצעה, והתורנות שלך נותרה בתאריך המקורי: '+String(this.state.userChoreSelected.choreOfReceiver.date))})
                    })
                })
            })
         //})
    }

    render() {
        LocaleConfig.defaultLocale = 'il';
        let match1 = 0;
        let match2 = 0;
        let currDay = new Date; // get current date
        let currDayStr = new Date().toUTCString(); // get current date

        return (
            
            <View>
                {/*<Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.props.requestsModal}
                    onRequestClose={() => {
                        console.log('Modal has been closed.');
                    }}>*/}
                    <View style={{marginTop: 22}}>
                        <View>
                        {/*this.state.inRequests.map(item => {
                        return <List.Accordion
                                        key={String(item.choreIdOfSender)+String(item.choreIdOfReceiver)}
                                        title={moment(item.choreOfSender.date).format('DD-MM-YYYY') + 'החלפה ל:' + moment(item.choreOfReceiver.date).format('DD-MM-YYYY')}
                                        description={item.choreOfSender.choreTypeName + ', ' + item.choreOfReceiver.User.fullname+ ' סטטוס: '+item.status}
                                        left={props => <List.Icon {...props} icon="perm-contact-calendar"/>}
                                        expanded={this.state.expanded[String(item.choreIdOfSender)+String(item.choreIdOfReceiver)]}
                                        onPress={() => {
                                            let expanded = this.state.expanded;
                                            expanded[String(item.choreIdOfSender)+String(item.choreIdOfReceiver)] = !expanded[String(item.choreIdOfSender)+String(item.choreIdOfReceiver)];
                                            this.setState({expanded: expanded})
                                        }}
                                    >
                                        <List.Item
                                            title={"title here"}
                                            description={"description here"}
                                            containerStyle={{borderBottomWidth: 0}}
                                        />
                                        
                                    </List.Accordion>})*/}
                                    <Text>בקשות נכנסות:</Text>
                                    { this.displayInRequestsList()}
                                    <Text>בקשות יוצאות:</Text>
                                    { this.displayOutRequestsList()}
         {/*                   <TouchableOpacity
                                onPress={() => {
                                    this.setState({modalVisible: false})
                                }}>
                               
                                <Text>בקשות אליך:</Text>
                            </TouchableOpacity>


                            <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                                {this.state.inRequests === undefined || this.state.inRequests.length === 0 ?
                                    <Text>אין לך בקשות נכנסות </Text>
                                    :
                                    <FlatList
                                        data={this.state.inRequests}
                                        renderItem={this.renderRow}
                                        keyExtractor={item => item.choreOfSender}
                                        ItemSeparatorComponent={this.renderSeparator}
                                        
                                       
                                    />
                                }
                            </List>

                            <Text>בקשות שלך:</Text>
                            <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                                {this.state.outRequests === undefined || this.state.outRequests.length === 0 ?
                                    <Text>אין לך בקשות יוצאות </Text>
                                    :
                                    <FlatList
                                        data={this.state.outRequests}
                                        renderItem={this.renderRow}
                                        keyExtractor={item => item.choreIdOfReceiver}
                                        ItemSeparatorComponent={this.renderSeparator}
                                       
                                    />
                                }
                            </List>*/}
                            <Button
                                label='סגור'
                                onPress={() => {
                                    //this.setState({modalVisible:false});
                                    this.props.onClose();
                                }}
                            />

                            
                        </View>
                    </View>
                {/*</Modal>*/}
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.state.choreModalVisible}
                    onRequestClose={() => {
                        console.log('choreModal has been closed.');
                    }}>
                    <View style={{marginTop: 22}}>
                        <View>
                        {this.state.userChoreSelected.choreOfReceiver!==undefined && this.state.userChoreSelected.choreOfReceiver.userId===this.userId &&(match2=1) &&(match1===0)&&match2===1 ?
                                    <View>
                                <Text>האם תרצה לאשר החלפה של התורנות שלך בתאריך: </Text>
                                <Text>{moment(this.state.userChoreSelected.choreOfReceiver.date).format('DD-MM-YYYY')+' \n' 
                                +"תורנות מסוג: " +  this.state.userChoreSelected.choreOfSender.choreTypeName +'\n'+ 
                                "לפי בקשת: "   +  this.state.userChoreSelected.choreOfSender.User.fullname+ '\n'+
                                "לתאריך: " +  moment(this.state.userChoreSelected.choreOfSender.date).format('DD-MM-YYYY')}              
                                </Text>
                                <Button
                                label='אשר החלפה'
                                onPress={() => {
                                    this.setState({ choreModalVisible: false});
                                    this.replaceUserChores();
                                }}
                            />
                            <Button
                                label='איני יכול'
                                onPress={() => {
                                    this.denyReplacementRequest();
                                    this.setState({ choreModalVisible: false});
                                }}
                            />
                                </View>
                                :
                                <View></View>
                                }
                        {this.state.userChoreSelected.choreOfSender!==undefined && this.state.userChoreSelected.choreOfSender.userId===this.userId && (match1=1)&& match1===1&&(match2===0)?
                        <View>
                        <Text>האם תרצה להסיר את בקשת ההחלפה הבאה:</Text>
                        <Text>התורנות שלך:</Text>
                        <Text>{moment(this.state.userChoreSelected.choreOfSender.date).format('DD-MM-YYYY')+' \n'    +this.state.userChoreSelected.choreOfSender.choreTypeName}</Text>
                                <Text> {'עם:\n'+this.state.userChoreSelected.choreOfReceiver.User.fullname+' \n'    +
                                this.state.userChoreSelected.choreOfReceiver.choreTypeName+' \n' + 'בתאריך:' +
                                moment(this.state.userChoreSelected.choreOfReceiver.date).format('DD-MM-YYYY')+' \n'    
                                                        
                                }</Text>
                                <Button
                                label='הסר בקשה'
                                onPress={() => {
                                    this.deleteReplacementRequest();
                                }}
                            /><Button
                                label='סגור'
                                onPress={() => {
                                    this.setState({ choreModalVisible: false});
                                }}
                            />
                                </View>
                                :
                                <View></View>
                                
                                }
                               
                                {(match1===1&&match2===1)?
                                    <View>
                                        <Text>נמצאה התאמה בהחלפה!</Text>
                                        <Text></Text>

                                    </View>
                                :
                                <View></View>
                                }
                                <Button
                                label='חזור'
                                onPress={() => {
                                    console.log("\nclosepressed\n");
                                    this.setState({ choreModalVisible: false});
                                }}
                            />
                              { /* <Text>פרטי תורנות</Text>
                                <Text>{this.state.userChoreSelected+' \n'                             
                                }</Text>
                                <Text>תורנים:</Text>
                                <Text>{this.state.workers}</Text>
                                <Text>שעות פעילות:</Text>
                                <Text>{this.state.type.type.endTime+'-'+this.state.type.type.startTime}</Text>
                                 

                            <Button
                                label='סמן אותי'
                                onPress={() => {
                                    
                                }}
                            />
                           
                            <Button 
                                label='חפש החלפה'
                                onPress={() => {
                                     this.setState({replacementsModal:true})
                                }}
                            />
                            <Modal visible={this.state.replacementsModal} >
                            <Text>{String(this.state.type.type.choreTypeName)}</Text>
                                        <ReplacementsChoresCalendar 
                                        choreTypeName={this.state.type.type.choreTypeName}
                                        //chores={this.state.markedDates[this.state.selectedDate].userChores}
                                        userChoreSelected={this.state.userChoreSelected}
                                        />
                                    </Modal>*/}

                      </View>
                    </View>
                    
                </Modal>
                <Modal visible={this.state.alertModal}>
                    <Text>{this.state.alertContent}</Text>
                    <Button
                                label='סגור'
                                onPress={() => {
                                    this.setState({alertModal:false, choreModalVisible:false});
                                }}
                            />
                </Modal>

            </View>
        );
    }
}
