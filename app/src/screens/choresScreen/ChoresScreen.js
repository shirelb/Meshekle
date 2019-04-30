import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import ChoresCalendar from "../../components/calendars/choresCalendar/ChoresCalendar";


export default class ChoresScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>
                    התורנויות שלי
                </Text>

                {/*<Button
                    title="בקש תור חדש"
                    onPress={this.onAppointmentRequestPress.bind(this)}
                />*/}

                {/* <Button
                    label='get events'
                    onPress={this.getUserEvents.bind(this)}
                />*/}

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

