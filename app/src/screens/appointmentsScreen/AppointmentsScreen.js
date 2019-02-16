import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import AppointmentsCalendar from "../../components/calendars/appointmentsCalendar/AppointmentsCalendar";

export default class AppointmentsScreen extends Component {

    onAppointmentRequestPress = () => {
        this.props.navigation.navigate('AppointmentRequest')
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

                <AppointmentsCalendar/>
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

