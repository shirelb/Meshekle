import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import ChoresCalendar from "../../components/calendars/choresCalendar/ChoresCalendar";


export default class ChoresScreen extends Component {
    render() {
        return (
            <View>
              {/*  <Text>
                    התורנויות שלי
                </Text>*/}

                <ChoresCalendar userId="1"/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

