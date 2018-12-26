import React, {Component} from 'react';
import {Button, ScrollView, Text, TextInput, View} from 'react-native';
import axios from 'axios';
import styles from './LoginCSS';
import {SERVER_URL} from '../../shared/constants'

export default class LoginScreen extends Component {
    /*componentDidMount(){
        const headers = {
            'Authorization': 'Bearer ' + this.props.jwt
        };
    }*/

    onSubmitPress = () => {
        console.log("in onSubmitPress");
        return axios.get(`${SERVER_URL}/api/users/login/authenticate`,
            {
                "userId": "436547125",
                "password": "tset22"
            }
        )
            .then((response) => {
                console.log("after get response");
                console.log(response);
                // deviceStorage.saveKey("id_token", response.data.jwt);
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
                <Text style={styles.loginLabel}>
                    Login
                </Text>
                <TextInput  placeholder='Username'/>
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
