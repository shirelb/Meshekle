import React, {Component} from 'react';
import {ScrollView, Text} from 'react-native';
import AgendaCalendar from "../../components/agendaCalendar/AgendaCalendar";
import Button from "../../components/submitButton/Button";
import strings from "../../shared/strings";
import store from 'react-native-simple-store';


export default class MainScreen extends Component {
    componentDidMount() {
        store.get('userData')
            .then(userData => {
                const headers = {
                    'Authorization': 'Bearer ' + userData.token
                };
            });
    }


    render() {
        console.log('in main screen ');
        store.get('userData')
            .then(userData => {
                console.log(userData.token)
            });
        return (
            <ScrollView style={{padding: 20}}>
                <Text
                    style={{fontSize: 27}}>
                    {/*Welcome {userFullname}*/}
                    Welcome
                </Text>

                <Button
                    label={strings.mainScreenStrings.LOGOUT}
                    onPress={() => this.props.navigation.navigate('LoginScreen')}
                />

                <AgendaCalendar/>
            </ScrollView>
        )
    }
}