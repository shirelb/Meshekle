import React, {Component} from 'react';
import {Button, ScrollView, Text, TextInput, View} from 'react-native';
import axios from 'axios';

export default class Login extends Component {
    onSubmitPress = () => {
        console.log("in onSubmitPress");
        return axios.get("http://192.168.0.104:3000/users")
            .then((response) => {
                console.log("after get response");
                console.log(response);
                this.props.onLoginPress();
            })
            .catch((error) => {
                console.log("after get error");
                console.log(error);
            });
    };


    render() {
        return (
            <ScrollView style={{padding: 20}}>
                <Text
                    style={{fontSize: 27}}>
                    Login
                </Text>
                <TextInput placeholder='Username'/>
                <TextInput placeholder='Password'/>
                <View style={{margin: 7}}/>
                <Button
                    onPress={this.onSubmitPress}
                    title="Submit"
                />
            </ScrollView>
        )
    }
}
