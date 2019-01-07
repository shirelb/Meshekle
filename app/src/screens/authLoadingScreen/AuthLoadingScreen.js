import React from 'react';
import {ActivityIndicator, StatusBar, StyleSheet, View,} from 'react-native';
import phoneStorage from "react-native-simple-store";
import axios from "axios";
import {SERVER_URL} from "../../shared/constants";

export default class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.checkUserDataInStorage();
    }

    checkUserDataInStorage = async () => {
        try {
            var userData = await phoneStorage.get('userData');
            if (userData.token === null)
                this.props.navigation.navigate('Auth');
            else {
                try {
                    var validTokenResponse = await axios.post(`${SERVER_URL}/api/users/validToken`,
                        {
                            "token": userData.token,
                        },
                    );
                    console.log("validTokenResponse ", validTokenResponse);
                    validTokenResponse.status === 200 ?
                        phoneStorage.update('userData', {
                            userId: validTokenResponse.data.payload.userId,
                            userFullname: validTokenResponse.data.payload.userFullname,
                        })
                            .then(res => {
                                this.props.navigation.navigate('App');
                            })
                            .catch(err => {
                                console.log('in checkUserDataInStorage ', err)
                            })
                        :
                        this.props.navigation.navigate('Auth');
                }
                catch (e) {
                    this.props.navigation.navigate('Auth');
                }
            }
        }
        catch (e) {
            this.props.navigation.navigate('Auth');
        }
    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator/>
                <StatusBar barStyle="default"/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});