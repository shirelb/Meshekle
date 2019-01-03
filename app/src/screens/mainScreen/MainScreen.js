import React, {Component} from 'react';
import {ScrollView, Text} from 'react-native';
import axios from 'axios';
import {SERVER_URL} from '../../shared/constants'

import AgendaCalendar from "../../components/agendaCalendar/AgendaCalendar";
import Button from "../../components/submitButton/Button";
import strings from "../../shared/strings";
import phoneStorage from 'react-native-simple-store';


export default class MainScreen extends Component {
    state = {
        userId: null,
        userFullname: null
    };

    componentDidMount() {
        phoneStorage.get('userData')
            .then(userData => {
                const headers = {
                    'Authorization': 'Bearer ' + userData.token
                };
                axios.post(`${SERVER_URL}/api/users/validToken`,
                    {
                        "token": userData.token,
                    },
                )
                    .then((response) => {
                        console.log(response);
                        phoneStorage.update('userData', {
                            userId: response.data.payload.userId,
                            userFullname: response.data.payload.userFullname,
                        });
                        this.setState({
                            userId: response.data.payload.userId,
                            userFullname: response.data.payload.userFullname,
                        })
                    })
            });
    }

    onLogoutPress = () => {
        phoneStorage.update('userData', {
            token: null
        })
            .then(
                // this.props.onLoginPress()
                // this.props.navigation.navigate('MainScreen')
                this.props.navigation.navigate('Auth')
            )
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

                <Button
                    label={strings.mainScreenStrings.LOGOUT}
                    onPress={this.onLogoutPress.bind(this)}
                />

                <AgendaCalendar/>
            </ScrollView>
        )
    }
}