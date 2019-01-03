import React from 'react';
import {ActivityIndicator, StyleSheet, StatusBar, View,} from 'react-native';
import phoneStorage from "react-native-simple-store";

export default class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.checkUserDataInStorage();
    }

    checkUserDataInStorage = () => {
        phoneStorage.get('userData')
            .then(userData => {
                // This will switch to the App screen or Auth screen and this loading
                // screen will be unmounted and thrown away.
                this.props.navigation.navigate(userData.token ? 'App' : 'Auth');
            })
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