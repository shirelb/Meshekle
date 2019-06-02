import React, {Component} from 'react';
import {ScrollView, Text} from 'react-native';
import AgendaCalendar from "../../components/calendars/agendaCalendar/AgendaCalendar";
import strings from "../../shared/strings";
import phoneStorage from 'react-native-simple-store';
import {connectToServerSocket} from "../../shared/constants";

window.navigator.userAgent = "react-native";


export default class MainScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
            userFullname: null
        };

        this.userHeaders = {};
    }


    componentDidMount() {
        phoneStorage.get('userData')
            .then(userData => {
                this.userHeaders = {
                    'Authorization': 'Bearer ' + userData.token
                };

                this.setState({
                    userId: userData.userId,
                    userFullname: userData.userFullname,
                });

                console.log('APP_SOCKET main page');
                connectToServerSocket(userData.userId);
            })
            .catch(error => {
                console.log('main componentDidMount ', error)
            })
    }

    render() {
        return (
            <ScrollView style={{}}>
                <Text style={{textAlign: "center",fontSize:16}}>
                    {strings.mainScreenStrings.WELCOME}
                </Text>
                <Text style={{textAlign: "center",fontSize:20}}>
                    {this.state.userFullname}
                </Text>

                <AgendaCalendar
                    userId={this.state.userId}
                />
            </ScrollView>
        )
    }
}