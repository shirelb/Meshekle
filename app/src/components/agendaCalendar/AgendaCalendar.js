import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Agenda, LocaleConfig} from 'react-native-calendars';
import {localConfig} from './localConfig';
import axios from "axios";
import {SERVER_URL} from "../../shared/constants";
import phoneStorage from "react-native-simple-store";


export default class AgendaCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: {
                '2018-12-30': [{text: 'item 30 - any js object'}],
                '2018-12-31': [{text: 'item 31 - any js object'}],
                '2019-01-01': [{text: 'item 1 - any js object'}],
                '2019-01-02': [{text: 'item 1 - any js object'}],
                '2019-01-03': [{text: 'item 2 - any js object'}],
                '2019-01-04': [{text: 'item 4 - any js object'}],
                '2019-01-05': [{text: 'item 3 - any js object'}, {text: 'any js object'}],
            },
            date: new Date(),
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
                this.loadItems();
            });
    }

    loadItems() {
        let newItems =
            {
                '2019-01-2': [{text: 'item 1 - any js object'}],
                '2019-01-3': [{text: 'item 2 - any js object'}],
                '2019-01-4': [],
                '2019-01-5': [{text: 'item 3 - any js object'}, {text: 'any js object'}],
            };
        axios.get(`${SERVER_URL}/api/users/events/userId/${this.userId}`,
            {headers: this.userHeaders}
        )
            .then(response => {
                console.log('response ', response);
                let events = response.data;
                // newItems
                if (events.length > 0) {
                    events.forEach((event) => {
                        switch (event.eventType) {
                            case 'Appointments':
                                axios.get(`${SERVER_URL}/api/users/appointments/userId/${this.userId}`,
                                    {
                                        headers: this.userHeaders,
                                        params: {status: 'set'}
                                    })
                                    .then(response => {
                                        console.log('get appointments response ', response);
                                        appointment
                                    })
                        }
                    })
                }
            })
            .catch(error => {
                console.log('error ', error)
            });
        this.setState({
            items: newItems
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
                <Text>{item.name}</Text>
            </View>
        );
    }

    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    render() {
        LocaleConfig.defaultLocale = 'il';

        let currDay = new Date; // get current date
        let currDayStr = new Date().toUTCString(); // get current date
        let first = currDay.getDate() - currDay.getDay(); // First day is the day of the month - the day of the week
        let last = first + 6; // last day is the first day + 6
        let firstDay = new Date(currDay.setDate(first)).toUTCString();
        let lastDay = new Date(currDay.setDate(last)).toUTCString();

        /*const items = {
            [format(new Date(this.state.date), 'YYYY-MM-DD')]: [],
            ...otherItems,
        };*/

        return (
            <Agenda
                items={this.state.items}
                // loadItemsForMonth={this.loadItems.bind(this)}
                selected={currDayStr}//{'2012-05-22'}
                // minDate={firstDay}//{'2012-05-20'}
                // maxDate={lastDay}//{'2012-05-27'}
                // callback that fires when the calendar is opened or closed
                // callback that gets called on day press
                // onDayPress={this.onDayPress.bind(this)}
                // callback that gets called when day changes while scrolling agenda list
                // onDayChange={this.onDayChange.bind(this)}
                renderItem={this.renderItem.bind(this)}
                renderEmptyDate={this.renderEmptyDate.bind(this)}
                rowHasChanged={this.rowHasChanged.bind(this)}
                hideKnob={true}
                // markingType={'period'}
                // markedDates={{
                //    '2017-05-08': {textColor: '#666'},
                //    '2017-05-09': {textColor: '#666'},
                //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
                //    '2017-05-21': {startingDay: true, color: 'blue'},
                //    '2017-05-22': {endingDay: true, color: 'gray'},
                //    '2017-05-24': {startingDay: true, color: 'gray'},
                //    '2017-05-25': {color: 'gray'},
                //    '2017-05-26': {endingDay: true, color: 'gray'}}}
                // monthFormat={'yyyy'}
                // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
                renderDay={(day, item) => (<Text>{day ? day.day : 'item'}</Text>)}
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
        paddingTop: 30
    }
});