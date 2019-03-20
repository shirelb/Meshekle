import React, {Component} from 'react';
import {ScrollView, Text} from 'react-native';
import AgendaCalendar from "../../components/calendars/agendaCalendar/AgendaCalendar";
import strings from "../../shared/strings";
import phoneStorage from 'react-native-simple-store';
import {APP_SOCKET} from "../../shared/constants";

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
                APP_SOCKET.on('socketServerID', function (socketServerID) {
                    console.log('Connection to server established. SocketID is', socketServerID);
                    APP_SOCKET.emit('storeAppClientInfo', {userId: userData.userId});
                });
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