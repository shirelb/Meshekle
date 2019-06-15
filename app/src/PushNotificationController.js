import React, {Component} from 'react';
import {AppState} from "react-native";

import PushNotification from 'react-native-push-notification';
import {APP_SOCKET} from "./shared/constants";


export default class PushNotificationController extends Component {

    componentDidMount() {
        PushNotification.configure({
            onNotification: function (notification) {
                console.log('NOTIFICATION:', notification);
            },
        });

        AppState.addEventListener('change', this.handleAppStateChange);

        APP_SOCKET.on("getUserAppointments", this.sendNewAppointmentNotification);
        APP_SOCKET.on("getUserChore", this.sendNewAppointmentNotification);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);

        APP_SOCKET.off("getUserAppointments");
        APP_SOCKET.off("getUserChore");
    }

    handleAppStateChange = (appState) => {
        this.setState({appState: appState})
    };

    sendNewAppointmentNotification = () => {
        // if (this.state.appState === 'background') {
            PushNotification.localNotificationSchedule({
                message: "My Notification Message",
                date: new Date(Date.now()) // in 60 secs
            });
        // }
    };

    render() {
        return null;
    }
}