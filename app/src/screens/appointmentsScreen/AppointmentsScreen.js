import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import AppointmentsCalendar from "../../components/calendars/appointmentsCalendar/AppointmentsCalendar";
import Button from "../../components/submitButton/Button"

export default class AppointmentsScreen extends Component {

    onAppointmentRequestPress = (selectedDate = '') => {
        this.props.navigation.navigate('AppointmentRequest', {selectedDate: selectedDate})
    };

    onMyAppointmentRequestsPress = () => {
        this.props.navigation.navigate('UserAppointmentRequests',{ onAppointmentRequestPress:this.onAppointmentRequestPress})
    };


    render() {
        return (
            <View>
                <Button
                    label="בקשות התורים שלי"
                    onPress={this.onMyAppointmentRequestsPress.bind(this)}
                />

                <Button
                    label="בקש תור חדש"
                    onPress={this.onAppointmentRequestPress.bind(this)}
                />

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
    },
    buttonStyle:{
        marginTop: 50,
    }
});

