import React, {Component} from 'react';
import {ScrollView, Text, View} from 'react-native';
import AgendaCalendar from "../../components/agendaCalendar/AgendaCalendar";
import Button from "../../components/submitButton/Button";
import strings from "../../shared/strings";


export default class MainScreen extends Component {
    render() {
        return (
            <ScrollView style={{padding: 20}}>
                <Text
                    style={{fontSize: 27}}>
                    {/*Welcome {userFullname}*/}
                    Welcome
                </Text>

                <Button
                    label={strings.mainScreenStrings.LOGOUT}
                    onPress={this.props.onLogoutPress}
                />

                <AgendaCalendar />
            </ScrollView>
        )
    }
}