import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Avatar, Card} from 'react-native-elements';
import {Agenda, LocaleConfig} from 'react-native-calendars';
import '../localConfig';
import phoneStorage from "react-native-simple-store";
import usersStorage from "../../../storage/usersStorage";
import moment from "moment";
import 'moment/locale/he.js';
import mappers from "../../../shared/mappers";

moment.locale('he');

const module2color = {
    Appointments: 'purple', //'#00adf5',
    UsersChores: 'red',
    Announcements: 'green',
};

const module2selectedDotColor = {
    Appointments: 'purple',
    UsersChores: 'red',
    Announcements: 'green',
};


export default class AgendaCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            items: {}
            /* '2018-12-30': [{text: 'item 30 - any js object'}],
             '2018-12-31': [{text: 'item 31 - any js object'}],
             '2019-01-01': [{text: 'item 1 - any js object'}],
             '2019-01-02': [{text: 'item 1 - any js object'}],
             '2019-01-03': [{text: 'item 2 - any js object'}],
             '2019-01-04': [{text: 'item 4 - any js object'}],
             '2019-01-05': [{text: 'item 3 - any js object'}, {text: 'any js object'}],
         },*/
        };

        this.userHeaders = {};
        this.userId = null;
    }

    componentDidMount() {
        phoneStorage.get('userData')
            .then(userData => {
                console.log('agenda componentDidMount userData ', userData);
                this.userHeaders = {
                    'Authorization': 'Bearer ' + userData.token
                };
                this.userId = userData.userId;

                this.serviceProviders = [];
                usersStorage.getUsers(this.userHeaders)
                    .then(serviceProvidersFound => {
                        this.serviceProviders = serviceProvidersFound.filter(user => user['ServiceProviders'].length > 0);

                        this.loadItems();
                    });
            });
    }

    onRefresh = () => {
        this.setState({refreshing: true});

        this.loadItems();
    };

    loadItems() {
        let newItems = {};
        let serviceProviderUserDetails = this.serviceProviders;
        usersStorage.getUserEvents(this.userId, this.userHeaders)
            .then(response => {
                let events = response.data;
                if (events.length > 0) {
                    events.forEach((event) => {
                        let item = {};
                        switch (event.eventType) {
                            case 'Appointments':
                                let appointment = event['ScheduledAppointment'];
                                item.type = event.eventType;
                                item.itemId = appointment.appointmentId;
                                item.date = moment(appointment.startDateAndTime).format("YYYY-MM-DD");
                                item.startTime = moment(appointment.startDateAndTime).format("HH:mm");
                                item.endTime = moment(appointment.endDateAndTime).format("HH:mm");
                                item.role = mappers.serviceProviderRolesMapper(appointment.AppointmentDetail.role);
                                item.serviceProviderId = appointment.AppointmentDetail.serviceProviderId;
                                item.subject = JSON.parse(appointment.AppointmentDetail.subject).join(", ");
                                let serviceProvider = serviceProviderUserDetails.filter(provider => provider.userId === appointment.AppointmentDetail.serviceProviderId.toString())[0];
                                item.serviceProviderFullname = serviceProvider.fullname;
                                item.serviceProviderImage = serviceProvider.image;
                                if (newItems[item.date]) {
                                    newItems[item.date].push(item);
                                } else {
                                    newItems[item.date] = [item];
                                }
                                break;
                            case 'UsersChores':
                                console.log("load items-> userschores", this.state.items)
                                let chore = event['UsersChore'];
                                item.type = event.eventType;
                                item.date = moment(chore.date).format("YYYY-MM-DD");
                                ///item.itemId = chore.userChoreId;
                                ////item.date = moment(chore.date).format("YYYY-MM-DD");
                                item.title = chore.choreTypeName;
                                item.startTime = moment(chore.date).format("HH:mm");
                                item.endTime = moment(chore.date).format("HH:mm");
                                //item.role = mappers.serviceProviderRolesMapper(appointment.AppointmentDetail.role);
                                //item.serviceProviderId = appointment.AppointmentDetail.serviceProviderId;
                                //item.subject = JSON.parse(appointment.AppointmentDetail.subject).join(", ");
                                //let serviceProvider = serviceProviderUserDetails.filter(provider => provider.userId === appointment.AppointmentDetail.serviceProviderId.toString())[0];
                                //item.serviceProviderFullname = serviceProvider.fullname;
                                //item.serviceProviderImage = serviceProvider.image;
                                if (newItems[item.date]) {
                                    newItems[item.date].push(item);
                                } else {
                                    newItems[item.date] = [item];
                                }
                                break;
                            case 'Announcements': {
                                let announcement = event['Announcement'];
                                item.type = event.eventType;
                                item.itemId = announcement.announcementId;
                                item.date = moment(announcement.dateOfEvent).format("YYYY-MM-DD");
                                item.title = announcement.title;
                                item.content = announcement.content;

                                if (newItems[item.date]) {
                                    newItems[item.date].push(item);
                                } else {
                                    newItems[item.date] = [item];
                                }
                                break;
                            }
                        }
                    });
                    this.setState({
                        items: newItems,
                        refreshing: false
                    });
                }
            })
    }

    onDayPress = (date) => {
        console.log('in day press ');
        this.setState({
            date: moment(date).subtract(1, 'months'),
        });
    };


    renderItem = (item) => {
        switch (item.type) {
            case 'Appointments':
                return (
                    <Card
                        title={`תור ל ${item.role} - ${item.serviceProviderFullname}`}
                        // containerStyle={{width: 70 + '%'}}
                    >
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                            <Text style={{marginBottom: 10}}>{item.startTime} - {item.endTime}</Text>

                            <Avatar
                                width={50}
                                rounded
                                source={{uri: item.serviceProviderImage}}
                                // avatarStyle={{height: 40, width: 40}}
                            />
                        </View>
                        <Text h3>{item.subject}</Text>
                    </Card>
                );
            case 'UsersChores':
                return (
                    <Card
                        title={`תורנות`}
                        // containerStyle={{width: 70 + '%'}}
                    >
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                            <Text style={{marginBottom: 10}}>{item.title}</Text>


                        </View>
                    </Card>
                );
            case 'Announcements': {
                return (
                    <Card
                        title={`מודעה - ${item.title} `}
                        // containerStyle={{width: 70 + '%'}}
                    >
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                            <Text style={{marginBottom: 10}}>{item.dateOfEvent}</Text>


                        </View>
                        <Text h3>{item.content}</Text>
                    </Card>
                );
            }

        }
    };

    renderDay = (day) => {
        if (day !== undefined) {
            let color = moment().format("YYYY-MM-DD") === day.dateString ? '#00adf5' : '#2d4150';
            return (
                <View style={{marginTop: 15, marginLeft: 15}}>
                    <Text style={[styles.day, {color: color}]}>{day.day} </Text>
                    <Text
                        style={[styles.dayMonth, {color: color}]}>{moment(day.dateString).format("MMM")} </Text>
                    <Text
                        style={[styles.dayMonth, {color: color}]}>{moment(day.dateString).format("dddd")} </Text>
                </View>
            );
        } else {
            return <View style={{width: 18 + '%'}}><Text> </Text></View>
        }
    };

    renderEmptyDate = () => {
        // return <View style={{width: 18 + '%'}}><Text> אין אירועים בתאריך זה </Text></View>
        return <View style={styles.emptyDate}><Text> אין אירועים בתאריך זה </Text></View>
    };

    rowHasChanged = (r1, r2) => {
        return r1.itemId !== r2.itemId;
    };


    render() {
        console.log("agendacalendar state ", this.state);

        LocaleConfig.defaultLocale = 'il';

        // let currDay = new Date; // get current date
        // let currDayStr = new Date().toUTCString(); // get current date
        // let first = currDay.getDate() - currDay.getDay(); // First day is the day of the month - the day of the week
        // let last = first + 6; // last day is the first day + 6
        // let firstDay = new Date(currDay.setDate(first)).toUTCString();
        // let lastDay = new Date(currDay.setDate(last)).toUTCString();

        const today = moment();
        const from_date = today.startOf('week');
        const to_date = today.endOf('week');

        return (
            <Agenda
                items={this.state.items}
                // loadItemsForMonth={this.loadItems.bind(this)}
                // selected={today.format("YYYY-MM-DD")}//{'2012-05-22'}
                // minDate={from_date}//{'2012-05-20'}
                // maxDate={to_date}//{'2012-05-27'}
                // callback that fires when the calendar is opened or closed
                // callback that gets called on day press
                // onDayPress={this.onDayPress}
                // callback that gets called when day changes while scrolling agenda list
                // onDayChange={this.onDayChange}
                renderItem={this.renderItem}
                renderEmptyDate={this.renderEmptyDate}
                renderEmptyData={this.renderEmptyDate}
                renderDay={this.renderDay}
                rowHasChanged={this.rowHasChanged}
                onRefresh={this.onRefresh}
                refreshing={this.state.refreshing}
                refreshControl = {null}
                // hideKnob={true}
                // markingType={'period'}
                // markedDates={{
                //     '2019-01-08': {textColor: '#666'},
                //     '2019-01-09': {textColor: '#666'},
                //     '2019-01-04': {startingDay: true, endingDay: true, color: 'blue'},
                //     '2019-01-01': {startingDay: true, color: 'blue'},
                //     '2019-01-02': {endingDay: true, color: 'gray'},
                //     '2019-01-03': {startingDay: true, color: 'gray'},
                //     '2019-01-05': {color: 'gray'},
                //     '2019-01-06': {endingDay: true, color: 'gray'}
                // }}
                // monthFormat={'yyyy'}
                // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
                // Specify theme properties to override specific styles for calendar parts. Default = {}
                theme={{
                    backgroundColor: '#f7f7f7',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#5a646d',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#00adf5',
                    dayTextColor: '#2d4150',
                    textDisabledColor: '#d9e1e8',
                    dotColor: '#00adf5',
                    selectedDotColor: '#ffffff',
                    arrowColor: 'orange',
                    monthTextColor: 'blue',
                    textDayFontFamily: 'monospace',
                    textMonthFontFamily: 'monospace',
                    textDayHeaderFontFamily: 'monospace',
                    textMonthFontWeight: 'bold',
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 16,
                    agendaDayTextColor: 'yellow',
                    agendaDayNumColor: 'green',
                    agendaTodayColor: 'orange',
                    agendaKnobColor: 'blue',
                    agendaBackgroundColor: '#424242',
                }}
                style={styles.calendar}
            />
        );
    }
}

const styles = StyleSheet.create({
    calendar: {
        // borderTopWidth: 2,
        // marginTop: 5,
        paddingTop: 5,
        // borderBottomWidth: 2,
        // borderColor: '#eee',
        height: 500,
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
        flex: 1, justifyContent: "center", alignItems: "center",
        // height: 15,
        // flex: 1,
        // paddingTop: 30,
        borderTopWidth: 2,
        borderTopColor: 'grey',
        borderBottomWidth: 2,
        borderBottomColor: 'grey',
        // textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },
    dayMonthContainer: {
        height: 100,
        // borderTopWidth: 2,
        // borderTopColor: 'grey',
        // marginRight: 30
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