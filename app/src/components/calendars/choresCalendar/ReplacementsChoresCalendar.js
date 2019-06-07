import React, {Component} from 'react';
import {FlatList, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {localConfig} from '../localConfig';
import moment from 'moment';
import phoneStorage from "react-native-simple-store";
import {CheckBox, List, ListItem} from "react-native-elements";
import Button from "../../../components/submitButton/Button";
import choresStorage from "../../../storage/choresStorage";
import { createStackNavigator, createAppContainer } from 'react-navigation';
import axios from "axios";
import { APP_SOCKET } from '../../../shared/constants';

export default class ReplacementsChoresCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            month:'', 
            markedDates: {},
            selectedDate: '',
            dateModalVisible: false,
            choreModalVisible: false,
            typeName:props.choreTypeName,
            workers:'',
            choreModalUser: '',
            choreModalUserChore:'',
            alertModalVisible:false,
            alertModalContent:'',
        };

        this.userHeaders = {};
        this.userId = null;
        this.onDayPress = this.onDayPress.bind(this);
    }

    componentDidMount() {
        phoneStorage.get('userData')
            .then(userData => {
                this.userHeaders = {
                    'Authorization': 'Bearer ' + userData.token
                };
                this.userId = userData.userId;
                this.loadUserChores();
                connectToServerSocket(userData.userId);
                APP_SOCKET.on("usersMadeChoreReplacement", this.loadUserChores.bind(this));

            });

    }

    loadUserChores() {
        console.log("userid: ", this.userId);
        choresStorage.getUserChoresForType(this.userId,this.userHeaders, this.props.choreTypeName, "04", "2019")
            .then(response => {
                let markedDates = [];

                console.log("getUserChoresForType response= ", response);
                response.data.usersChores.forEach(userChore => {
                    if ((userChore.date !== undefined) && (userChore.date !== null && (userChore.date)))
                    {
                        const date = moment(userChore.date).format('YYYY-MM-DD');
                        if (markedDates[date] === undefined || markedDates[date] === null) {
                            markedDates[date] = {marked: true, selected: userChore.isMark, userChores: [], selectedColor:'yellow'};
                        }
                        let requests = [choresStorage.getChoreTypeSetting(this.userId,this.userHeaders, userChore.choreTypeName),
                            choresStorage.getOtherWorkers(this.userId,this.userHeaders, userChore.choreTypeName, moment(date).format('MM'), moment(date).format('YYYY'), moment(date).format('DD'))];
                        markedDates[date].selected= userChore.isMark||markedDates[date].selected;//uc.isMark;

                        //requests.push( choresStorage.getChoreTypeSetting(this.userId,this.userHeaders, userChore.choreTypeName));
                        //requests.push(choresStorage.getOtherWorkers(this.userId,this.userHeaders, userChore.choreTypeName, moment(date).format('MM'), moment(date).format('YYYY'), moment(date).format('DD')) );
                        axios.all(requests)
                        .then(responses=>{
                            console.log("LOAD USERSCHORES response: ", response);
                            var uc = userChore;
                            uc.type = responses[0].data;
                            //uc.workers = response[1].data;
                            //markedDates[date]= 'red'
                            markedDates[date].userChores.push(uc);
                            this.setState({
                                markedDates: markedDates,
                                workers: String(responses[1])
                            });
                            this.forceUpdate();
                        })
                        //choresStorage.getChoreTypeSetting(this.userId,this.userHeaders, userChore.choreTypeName)
                    //.then(itm => {
                        //choresStorage.getOtherWorkers(this.userId,this.userHeaders, userChore.choreTypeName, "03", "2019", "09")
                        //.then(res=>{
                            //var uc = userChore;
                            //uc.type = itm.data;
                            //uc.type.workers = res.data;
                        //})
                        
                    //console.log("item: ", this.state.item);
                    //console.log("itm: ", itm);
                    //---markedDates[date].userChores.push(uc);
                ///--});
                    }
                });

                this.setState({
                    markedDates: markedDates
                });

                console.log('user  333  markedDates ', markedDates);
            })
    }

    onDaySelect = (day) => {
        console.log('this.state.selectedDate === \'\' ', this.state.selectedDate === '');
        if (this.state.selectedDate !== '')
            console.log('this.state.markedDates[selectedDate].userChores.length === 0 ', this.state.markedDates[this.state.selectedDate].userChores.length === 0);

        console.log("in onDaySelect day ", day);
        let updatedMarkedDates = this.state.markedDates;

        if (this.state.selectedDate !== '') {
            let lastMarkedDate = updatedMarkedDates[this.state.selectedDate];
            lastMarkedDate.selected = false;
            updatedMarkedDates[this.state.selectedDate] = lastMarkedDate;
        }

        const selectedDay = moment(day.dateString).format('YYYY-MM-DD');
        if (updatedMarkedDates[selectedDay] === undefined)
            updatedMarkedDates[selectedDay] = {marked: true, selected: false, userChores: []};
        let newMarkedDate = updatedMarkedDates[selectedDay];
        //newMarkedDate.selected = true;
        newMarkedDate.color = 'blue';
        updatedMarkedDates[selectedDay] = newMarkedDate;

        this.setState({
            selectedDate: moment(day.dateString).format('YYYY-MM-DD'),
            markedDates: updatedMarkedDates,
            dateModalVisible: true,
            choreModalVisible: false,
        });
    };

    onDayPress = (date) => {
        console.log('in day press ');
        this.setState({
            date: new Date(date.year, date.month - 1, date.day),
        });
    };

    onDayChange = (date) => {
        console.log('in day change ');
        this.setState({
            date: new Date(date.year, date.month - 1, date.day),
        });
    };

    renderItem(item) {
        return (
            <View style={[styles.item, {height: item.height}]}>
                <Text>{item.choreTypeName}</Text>
                <Text>{item.date}</Text>
            </View>
        );
    }

    renderDay(day) {
        return (
            <View style={styles.dayMonthContainer}>
                <Text style={styles.day}>{day ? day.day : null} </Text>
                <Text
                    style={styles.dayMonth}>{day ? LocaleConfig.locales['il'].monthNamesShort[day.month - 1] : null} </Text>
                <Text
                    style={styles.dayMonth}>{day ? LocaleConfig.locales['il'].dayNames[new Date(day.timestamp).getDay()] : null} </Text>
            </View>
        );
    }

    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}><Text> </Text></View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    getDateStringFromDateAndTime = (dateAndTime) => {
        const date = new Date(dateAndTime);
        return date.toISOString().split('T')[0];
    };
    getTimeStringFromDateAndTime = (dateAndTime) => {
        const date = new Date(dateAndTime);
        return date.toISOString().split('T')[1].split('.')[0].slice(0, -3);
    };

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

    renderRow = ({item}) => {
        return (
            <ListItem
                roundAvatar
                //title={moment(item.date).format('YYYY-MM-DD') }
                title={item.isMark? String(item.User.fullname)+" <מחפש/ת החלפה>": String(item.User.fullname)}
                
                containerStyle={{borderBottomWidth: 0}}
                // rightIcon={<Icon name={'chevron-left'}/>}
                // hideIcon
                onPress={()=>{
                    this.setState({choreModalVisible: true, type: item.type, choreModalUser: item.User, choreModalUserChore:item});
                    //choresStorage.getChoreTypeSetting(this.userId,this.userHeaders, item.choreTypeName)
                    //.then(itm => {
                        //this.setState({item: itm});
                       // this.setState({ choreModalVisible: true, item: itm.body.type});
                    //console.log("item: ", this.state.item);
                    //console.log("itm: ", itm);
                      //  });
                    
                }}
            />
        )
    };

    /*getChoreSettings =  ({typeName}) => {
        choresStorage.getChoreTypeSetting(this.userId,this.userHeaders, typeName)
            .then(itm => {
                this.setState({item: itm});
                });
            };*/

    sendReplacementRequest(userChoreSender){
        choresStorage.createSpecificReplacementRequest(this.userId, this.userHeaders, userChoreSender.userChoreId, this.state.choreModalUserChore.userChoreId, "requested")
        .then(res=>{
            if(res!==undefined){
                this.setState({alertModalVisible:true, alertModalContent:"בקשה נשלחה ל"+this.state.choreModalUserChore.User.fullname})
            }
            else{
                choresStorage.changeReplacementRequestStatus(this.userId, this.userHeaders, userChoreSender.userChoreId, this.state.choreModalUserChore.userChoreId, "requested")
                .then(r=>{
                    this.setState({alertModalVisible:true, alertModalContent:"בקשה נשלחה ל"+this.state.choreModalUserChore.User.fullname+" בעבר, אך נשלחה כעת שנית"})
                })
            }
        })
        .catch(err=>{
            this.setState({alertModalVisible:true, alertModalContent:"משהו השתבש, נסה שוב."});
        })
    }

    render() {
        LocaleConfig.defaultLocale = 'il';

        let currDay = new Date; // get current date
        let currDayStr = new Date().toUTCString(); // get current date

        return (
            <View>
            
                <Button
                    label='סגור'
                    onPress={() => {
                        this.setState({})
                        this.props.onClose();
                    }}
                />
                <Text>{"חיפוש החלפה עבור תורנות: "+String(this.props.choreTypeName)}</Text>
                <Calendar

                    markedDates={this.state.markedDates}
                    onDayPress={this.onDaySelect}
                    style={styles.calendar}
                    theme={{
                        backgroundColor: '#ffffff',
                        calendarBackground: '#ffffff',
                        textSectionTitleColor: '#b6c1cd',
                        selectedDayBackgroundColor: '#00adf5',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#00adf5',
                        dayTextColor: '#2d4150',
                        textDisabledColor: '#d9e1e8',
                        dotColor: '#00f548',
                        selectedDotColor: '#ffffff',
                        arrowColor: 'orange',
                        monthTextColor: 'blue',
                        textDayFontFamily: 'monospace',
                        textMonthFontFamily: 'monospace',
                        textDayHeaderFontFamily: 'monospace',
                        textMonthFontWeight: 'bold',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 16
                    }}
                />
                
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.state.dateModalVisible}
                    onRequestClose={() => {
                        this.setState({dateModalVisible:false});
                    }}>
                    <View style={{marginTop: 22}}>
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({dateModalVisible: false})
                                }}>
                                <Button
                                label='חזור'
                                onPress={() => {
                                    this.setState({dateModalVisible: false});
                                }}
                            />
                            </TouchableOpacity>

                            <Text> {this.state.selectedDate} </Text>

                            

                            <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                                {this.state.selectedDate === '' || this.state.markedDates[this.state.selectedDate].userChores.length === 0 ?
                                    <Text>אין תורנויות לתאריך זה </Text>
                                    :
                                    <FlatList
                                        data={this.state.markedDates[this.state.selectedDate].userChores}
                                        renderItem={this.renderRow}
                                        keyExtractor={item => item.userChoreId}
                                        ItemSeparatorComponent={this.renderSeparator}
                                        /*onPress={
                                            this.setModalVisible(!this.state.modalVisible);
                                            this.setState({dateModalVisible: false, choreModalVisible: true})
                                        }*/
                                    />
                                }
                            </List>

                           
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.state.choreModalVisible}
                    onRequestClose={() => {
                        this.setState({choreModalVisible:false});
                    }}>
                    <View style={{marginTop: 22}}>
                        <View>
                            {/*<TouchableOpacity*/}
                                <Button
                                label='חזור'
                                onPress={() => {
                                    console.log("\nclosepressed\n");
                                    this.setState({dateModalVisible:true, choreModalVisible: false})
                                }}
                            />
                                <Text >
                                שליחת בקשת החלפה:
                                </Text>
                                <Text>{this.state.choreModalUser.fullname+' \n'                             
                                }</Text>
                                <Text>תאריך:</Text>
                                <Text>{this.state.selectedDate}</Text>

                            <Button
                                label='בקש החלפה'
                                onPress={() => {
                                    this.sendReplacementRequest(this.props.userChoreSelected);
                                }}
                            />

                      </View>
                    </View>
                </Modal>
                <Modal animationType="fade"
                    transparent={false}
                    visible={this.state.alertModalVisible}
                    onRequestClose={() => {
                        this.setState({alertModalVisible:false});
                    }}>
<Text>{this.state.alertModalContent}</Text>
<Button
                                label='סגור'
                                onPress={() => {
                                    this.setState({alertModalVisible:false, dateModalVisible:false, choreModalVisible:false});
                                }}
                            />
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    calendar: {
        borderTopWidth: 2,
        marginTop: 10,
        paddingTop: 10,
        borderBottomWidth: 2,
        borderColor: '#eee',
        height: 350,
    },
    text: {
        textAlign: 'center',
        borderColor: '#bbb',
        padding: 10,
        backgroundColor: '#eee',
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30,
        borderTopWidth: 2,
        borderTopColor: 'grey',
        borderBottomWidth: 2,
        borderBottomColor: 'grey',
    },
    dayMonthContainer: {
        height: 100,
        // borderTopWidth: 2,
        // borderTopColor: 'grey',
    },
    day: {
        fontSize: 20,
        fontWeight: '300',
        // color: appStyle.agendaDayMonthColor,
        marginTop: -5,
        backgroundColor: 'rgba(0,0,0,0)'
    },
    dayMonth: {
        fontSize: 14,
        fontWeight: '300',
        // color: appStyle.agendaDayMonthColor,
        marginTop: -5,
        backgroundColor: 'rgba(0,0,0,0)'
    },
});