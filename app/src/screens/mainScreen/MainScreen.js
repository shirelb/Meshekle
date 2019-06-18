import React, {Component} from 'react';
import {Text, View} from 'react-native';
import strings from "../../shared/strings";
import phoneStorage from 'react-native-simple-store';
import {connectToServerSocket} from "../../shared/constants";
import PushNotificationController from "../../PushNotificationController";
import usersStorage from "../../storage/usersStorage";
import mappers from "../../shared/mappers";
import AgendaCalendar from "../../components/calendars/agendaCalendar/AgendaCalendar";

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

                this.userId = userData.userId;

                this.setState({
                    userId: userData.userId,
                    userFullname: userData.userFullname,
                });

                // console.log('APP_SOCKET main page');
                connectToServerSocket(userData.userId);
                this.notif = new PushNotificationController(this.onRegister.bind(this));
            })
            .catch(error => {
                console.log('main componentDidMount ', error)
            });
    }


    onRegister(token) {
        console.log("firebase registered ", token);
        // this.setState({registerToken: token.token, fcmRegistered: true});
        usersStorage.saveRegistrationToken(this.userId, token.token, this.userHeaders)
            .then(response => {
                if (response.response) {
                    if (response.response.status !== 200) {
                        this.setState({
                            errorVisible: true,
                            errorHeader: 'קרתה שגיאה בעת שמירת הטוקן',
                            errorContent: mappers.errorMapper(response.response)
                        });
                    }
                } else {
                    console.log(`firebase registered device with token ${token}`);
                }
            });
    }


    render() {
        return (
            <View style={{}}>
                <Text style={{textAlign: "center", fontSize: 16}}>
                    {strings.mainScreenStrings.WELCOME}
                </Text>
                <Text style={{textAlign: "center", fontSize: 20}}>
                    {this.state.userFullname}
                </Text>
                <Text style={{marginTop: 20, textAlign: "center", fontSize: 18}}>
                    האירועים שלי
                </Text>

                <AgendaCalendar
                    userId={this.state.userId}
                />

            </View>
        )
    }
}