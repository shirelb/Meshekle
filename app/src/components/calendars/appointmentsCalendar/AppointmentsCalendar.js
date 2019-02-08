import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {localConfig} from '../localConfig';
import axios from "axios";
import {SERVER_URL} from "../../../shared/constants";
import phoneStorage from "react-native-simple-store";


export default class AppointmentsCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
                this.userHeaders = {
                    'Authorization': 'Bearer ' + userData.token
                };
                this.userId = userData.userId;
                this.loadAppointments();
            });
    }

    loadAppointments() {
        let newItems = {};
        var promises = [];
        axios.get(`${SERVER_URL}/api/users/events/userId/${this.userId}`,
            {headers: this.userHeaders}
        )
            .then(response => {
                let events = response.data;
                if (events.length > 0) {
                    events.forEach((event) => {
                        switch (event.eventType) {
                            case 'Appointments':
                                promises.push(axios.get(`${SERVER_URL}/api/users/appointments/userId/${this.userId}`,
                                    {
                                        headers: this.userHeaders,
                                        params: {status: 'set', appointmentId: event.eventId}
                                    })
                                );
                                break;
                            // TODO add case of chores here
                        }
                    });

                    axios.all(promises)
                        .then((results) => {
                            results.forEach((response, i) => {
                                let item = {};
                                switch (events[i].eventType) {
                                    case 'Appointments':
                                        let appointment = response.data[0];
                                        item.itemId = appointment.appointmentId;
                                        item.date = this.getDateStringFromDateAndTime(appointment.startDateAndTime);
                                        item.startTime = this.getTimeStringFromDateAndTime(appointment.startDateAndTime);
                                        item.endTime = this.getTimeStringFromDateAndTime(appointment.endDateAndTime);
                                        item.role = appointment.AppointmentDetail.role;
                                        item.serviceProviderId = appointment.AppointmentDetail.serviceProviderId;
                                        item.subject = appointment.AppointmentDetail.subject;
                                        // TODO add request of get service provider by id to get his name.
                                        if (newItems[item.date]) {
                                            newItems[item.date].push(item);
                                        } else {
                                            newItems[item.date] = [item];
                                        }
                                        break;
                                    // TODO add case of chores here
                                }
                            });

                            console.log('newItems ', newItems);
                            this.setState({
                                items: newItems
                            });
                        })
                        .catch(err => {
                            console.log('err ', err)
                        });
                }
            })
            .catch(error => {
                console.log('load items error ', error)
            });
    }

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
                <Text>{item.startTime} - {item.endTime}</Text>
                <Text>{item.subject}</Text>
                <Text>{item.serviceProviderId}</Text>
                <Text>{item.role}</Text>
            </View>
        );
    }

    renderDay(day) {
        // renderDay={(day, item) => (<Text>{day ? day.day : 'item'} {day ? day.month.toLocaleString() : 'item'} </Text>)}

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

    render() {
        LocaleConfig.defaultLocale = 'il';

        let currDay = new Date; // get current date
        let currDayStr = new Date().toUTCString(); // get current date

        return (
            <Calendar
                // Initially visible month. Default = Date()
                current={'2012-03-01'}
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                minDate={'2012-05-10'}
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                maxDate={'2012-05-30'}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={(day) => {
                    console.log('selected day', day)
                }}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                monthFormat={'yyyy MM'}
                // Handler which gets executed when visible month changes in calendar. Default = undefined
                onMonthChange={(month) => {
                    console.log('month changed', month)
                }}
                // Hide month navigation arrows. Default = false
                hideArrows={true}
                // Replace default arrows with custom ones (direction can be 'left' or 'right')
                renderArrow={(direction) => (<Arrow/>)}
                // Do not show days of other months in month page. Default = false
                hideExtraDays={true}
                // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                // day from another month that is visible in calendar page. Default = false
                disableMonthChange={true}
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                firstDay={1}
                // Hide day names. Default = false
                hideDayNames={true}
                // Show week numbers to the left. Default = false
                showWeekNumbers={true}
            />
        );
    }
}

const styles = StyleSheet.create({
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