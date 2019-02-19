import React, {Component} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import AppointmentsCalendar from "../../components/calendars/appointmentsCalendar/AppointmentsCalendar";

export default class AppointmentsScreen extends Component {

    onAppointmentRequestPress = (selectedDate = '') => {
        this.props.navigation.navigate('AppointmentRequest', {selectedDate: selectedDate})
    };


    render() {
        return (
            <View>
                <Button
                    title="בקש תור חדש"
                    onPress={this.onAppointmentRequestPress.bind(this)}
                />

                {/* <Button
                    label='get events'
                    onPress={this.getUserEvents.bind(this)}
                />*/}

                <AppointmentsCalendar
                    onAppointmentRequestPress={this.onAppointmentRequestPress}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center'
    }
});

