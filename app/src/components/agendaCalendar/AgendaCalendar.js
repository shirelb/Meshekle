import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Agenda,LocaleConfig} from 'react-native-calendars';
import {localConfig} from './localConfig';


export default class AgendaCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {}
        };
    }

    loadItems(day) {
        let newItems =
            {
                '2012-05-22': [{text: 'item 1 - any js object'}],
                '2012-05-23': [{text: 'item 2 - any js object'}],
                '2012-05-24': [],
                '2012-05-25': [{text: 'item 3 - any js object'}, {text: 'any js object'}],
            };
        this.setState({
            items: newItems
        });
    }

    renderItem(item) {
        return (
            <View style={[styles.item, {height: item.height}]}><Text>{item.name}</Text></View>
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

        return (
            <Agenda
                items={this.state.items}
                loadItemsForMonth={this.loadItems.bind(this)}
                selected={'2012-05-22'}
                minDate={'2012-05-20'}
                maxDate={'2012-05-27'}
                renderItem={this.renderItem.bind(this)}
                renderEmptyDate={this.renderEmptyDate.bind(this)}
                rowHasChanged={this.rowHasChanged.bind(this)}
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
                renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
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