import React, {Component} from 'react';
import {ScrollView, Text} from 'react-native';

import AgendaCalendar from "../../components/calendars/agendaCalendar/AgendaCalendar";
import strings from "../../shared/strings";
import phoneStorage from 'react-native-simple-store';
import axios from "axios";
import {SERVER_URL} from "../../shared/constants";


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
                })
            })
            .catch(error => {
                console.log('main componentDidMount ', error)
            })
    }

    onLogoutPress = () => {
        phoneStorage.update('userData', {
            token: null,
            userId: null,
            userFullname: null
        })
            .then(
                // this.props.onLoginPress()
                // this.props.navigation.navigate('MainScreen')
                this.props.navigation.navigate('Auth')
            )
    };

    getUserEvents = () => {
        console.log('getUserEvents this.state.userId ', this.state.userId);
        console.log('getUserEvents this.userHeaders ', this.userHeaders);
        axios.get(`${SERVER_URL}/api/users/events/userId/${this.state.userId}`, {headers: this.userHeaders})
            .then(events => {
                console.log('events ', events)
            })
            .catch(error => {
                console.log('error ', error)
            });
    };

    render() {
        return (
            <ScrollView style={{padding: 20}}>
                <Text>
                    {strings.mainScreenStrings.WELCOME}
                </Text>
                <Text>
                    {this.state.userFullname}
                </Text>

                {/*<Button
                    label={strings.mainScreenStrings.LOGOUT}
                    onPress={this.onLogoutPress.bind(this)}
                />*/}

                {/* <Button
                    label='get events'
                    onPress={this.getUserEvents.bind(this)}
                />*/}

                <AgendaCalendar
                    userId={this.state.userId}
                />
            </ScrollView>
        )
    }
}