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


export default class ClosedReplacementRequests extends Component {
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
            alertModal:false,
            alertContent:'',
            expanded:'',
            reqs:'',
            requestsTypesReplaced:[],
            requestsTypesDeny:[],
            denyOut:[],
            denyIn:[],
            replacedOut:[],
            replacedIn:[],
        };

        this.userHeaders = {};
        this.userId = null;
        this.renewReplacementRequest = this.renewReplacementRequest.bind(this);
        this.displayInReplacedRequestsList = this.displayInReplacedRequestsList.bind(this);
        this.displayInDenyRequestsList = this.displayInDenyRequestsList.bind(this);
        this.displayOutReplacedRequestsList = this.displayOutReplacedRequestsList.bind(this);
        this.displayOutDenyRequestsList = this.displayOutDenyRequestsList.bind(this);
        this.replaceUserChores = this.replaceUserChores.bind(this);
        
    }

    componentDidMount() {
        phoneStorage.get('userData')
            .then(userData => {
                this.userHeaders = {
                    'Authorization': 'Bearer ' + userData.token
                };
                this.userId = userData.userId;
                this.loadReplacedRequests();
                this.loadDenyRequests();
            });

    }

    loadReplacedRequests() {
        choresStorage.getReplacementRequests(this.userId,this.userHeaders, this.props.choreTypeName, "replaced")
            .then(response => {
                let inRequests = [];
                let outRequests = [];
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
                        
                        }

                    }
                });

                this.setState({
                    replacedIn: inRequests,
                    requestsTypesReplaced: requestsTypes,                    
                    replacedOut:outRequests,
                });
            })
            .catch(err=>{

            })

    }

    loadDenyRequests() {
        choresStorage.getReplacementRequests(this.userId,this.userHeaders, this.props.choreTypeName, "deny")
            .then(response => {
                let inRequests = [];
                let outRequests = [];
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
                        
                        }

                    }
                });

                this.setState({
                    denyIn: inRequests,
                    requestsTypesDeny: requestsTypes,                    
                    denyOut:outRequests,
                });
            })
            .catch(err=>{

            })

    }

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

    renewReplacementRequest(){
        choresStorage.changeReplacementRequestStatus(this.userId, this.userHeaders, this.state.userChoreSelected.choreIdOfSender, this.state.userChoreSelected.choreIdOfReceiver, "requested")
        .then(res=>{
            this.setState({alertModal:true, alertContent:"בקשת ההחלפה נשלחה שנית בהצלחה"})
        })
    }


    displayOutReplacedRequestsList(){
        let i=0;
        let types = this.state.requestsTypesReplaced;
        let outRequests = this.state.replacedOut;
        let t=0;
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
            
        )
        if(t===0){
            return <Text>אין בקשות יוצאות</Text>
        }
        return ans;
    }

    displayInReplacedRequestsList(){
        let i=0;
        let types = this.state.requestsTypesReplaced;
        let inRequests = this.state.replacedIn;
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

    displayOutDenyRequestsList(){
        let i=0;
        let types = this.state.requestsTypesDeny;
        let outRequests = this.state.denyOut;
        let t=0;
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
            
        )
        if(t===0){
            return <Text>אין בקשות יוצאות</Text>
        }
        return ans;
    }

    displayInDenyRequestsList(){
        let i=0;
        let types = this.state.requestsTypesDeny;
        let inRequests = this.state.denyIn;
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
                    let reqss = requests;
                    reqs = [];
                    reqs.push([ choresStorage.changeReplacementRequestStatus(this.userId, this.userHeaders, this.state.userChoreSelected.choreIdOfSender, this.state.userChoreSelected.choreIdOfReceiver, "replaced"),choresStorage.replaceUserChores(this.userId, this.userHeaders,this.state.userChoreSelected.choreIdOfSender, this.state.userChoreSelected.choreIdOfReceiver)]);  
                    axios.all(reqs)
                    .then(res=>{   
                            this.setState({reqs: reqss.length, alertModal:true,alertContent:String('החלפת תורנויות בוצעה בהצלחה. כעת, התורנות שלך הועברה לתאריך:'+String(this.state.userChoreSelected.choreOfSender.date))})
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

        let currDay = new Date; // get current date
        let currDayStr = new Date().toUTCString(); // get current date

        return (
            
            <View>
                    <View style={{marginTop: 22}}>
                        <View>
                        <Text>בקשות שהוחלפו:</Text>
                                    <Text>בקשות נכנסות:</Text>
                                    { this.displayInReplacedRequestsList()}
                                    <Text>בקשות יוצאות:</Text>
                                    { this.displayOutReplacedRequestsList()}

                                    <Text>בקשות שנדחו:</Text>
                                    <Text>בקשות נכנסות:</Text>
                                    { this.displayInDenyRequestsList()}
                                    <Text>בקשות יוצאות:</Text>
                                    { this.displayOutDenyRequestsList()}

                            <Button
                                label='סגור'
                                onPress={() => {
                                    this.props.onClose();
                                }}
                            />

                            
                        </View>
                    </View>
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.state.choreModalVisible}
                    onRequestClose={() => {
                        this.setState({choreModalVisible:false});
                    }}>
                    <View style={{marginTop: 22}}>
                        <View>
                        {this.state.userChoreSelected.choreOfSender!==undefined && this.state.userChoreSelected.choreOfSender.userId===this.userId ?
                        <View>
                        {this.state.userChoreSelected.status==='replaced'?<Text>ההחלפה בוצעה!  </Text>:<Text>התקבלה דחיה לבקשה שלך מהמשתמש:</Text>}
                        <Text>פרטי הבקשה: </Text>
                        <Text>תורנות:</Text>
                        <Text> {this.state.userChoreSelected.choreOfReceiver.choreTypeName}</Text>
                        <Text>שולח הבקשה:</Text>
                        <Text>{this.state.userChoreSelected.choreOfSender.User.fullname +'\nבתאריך: '+moment(this.state.userChoreSelected.choreOfSender.date).format('DD-MM-YYYY')+' \n'}</Text>
                                <Text> {'מקבל הבקשה:\n'+this.state.userChoreSelected.choreOfReceiver.User.fullname+' \n'    +
                                +' \n' + 'בתאריך:' +
                                moment(this.state.userChoreSelected.choreOfReceiver.date).format('DD-MM-YYYY')+' \n'    
                                                        
                                }</Text>
                                <Button
                                label='חדש בקשה'
                                onPress={() => {
                                    this.renewReplacementRequest();
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
                                {this.state.userChoreSelected.choreOfReceiver!==undefined && this.state.userChoreSelected.choreOfReceiver.userId===this.userId ?
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
                                </View>
                                :
                                <View></View>
                                }
                            {/*<TouchableOpacity*/}
                                <Button
                                label='חזור'
                                onPress={() => {
                                    console.log("\nclosepressed\n");
                                    this.setState({ choreModalVisible: false});
                                }}
                            />
                        

                      </View>
                    </View>
                    
                </Modal>
                <Modal visible={this.state.alertModal}
                onRequestClose={() => {
                        this.setState({alertModal:false});
                    }}>
                    <Text>{this.state.alertContent}</Text>
                    <Button
                                label='סגור'
                                onPress={() => {
                                    this.setState({alertModal:false});
                                }}
                            />
                </Modal>

            </View>
        );
    }
}
