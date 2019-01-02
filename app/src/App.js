/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet} from 'react-native';

import LoginScreen from './screens/loginScreen/LoginScreen';
import MainScreen from './screens/mainScreen/MainScreen';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});


export default class App extends Component {
    state = {
        isLoggedIn: false
    };

    render() {
        if (this.state.isLoggedIn)
            return <MainScreen
                onLogoutPress={() => this.setState({isLoggedIn: false})}
            />;
        else
            return <LoginScreen
                onLoginPress={() => this.setState({isLoggedIn: true})}
            />;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
