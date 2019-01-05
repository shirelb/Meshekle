/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform} from 'react-native';
import {createAppContainer, createStackNavigator} from 'react-navigation';

import LoginScreen from './screens/loginScreen/LoginScreen';
import MainScreen from './screens/mainScreen/MainScreen';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

const AppNavigator = createStackNavigator(
    {
        LoginScreen: {
            screen: LoginScreen,
            params: {},
            /*navigationOptions: {
                header: null,
            }*/
        },
        MainScreen: {
            screen: MainScreen,
            params: {},
            /*navigationOptions: {
                header: null,
            }*/
        }
    },
    {
        // initialRouteName: 'Login',
        headerMode: 'none',
        /*contentOptions: {
            activeTintColor: '#e91e63',
        },*/
    }
);


const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
    state = {
        isLoggedIn: false
    };

    render() {
        return (
            <AppContainer/>

            /*<AppContainer
        screenProps={/!* this prop will get passed to the screen components as this.props.screenProps *!/}
        />*/
        );

        /* store.get('userData')
             .then(userData => {
                 if (userData.token) {
                     axios.post(`${SERVER_URL}/api/users/validToken`,
                         {
                             "token": userData.token,
                         },
                     )
                         .then((response) => {
                             console.log(response);
                             store.save('userData', {
                                 userId: response.data.payload.userId,
                                 userFullname: response.data.payload.userId
                             })
                                 .then(() => {
                                     this.setState({isLoggedIn: true});
                                     return <MainScreen
                                         onLogoutPress={() => this.setState({isLoggedIn: false})}
                                     />
                                 })
                                 .catch((error) => {
                                     console.log(error);
                                     if (this.state.isLoggedIn)
                                         return <MainScreen
                                             onLogoutPress={() => this.setState({isLoggedIn: false})}
                                         />;
                                     else
                                         return <LoginScreen
                                             onLoginPress={() => this.setState({isLoggedIn: true})}
                                         />;
                                 });
                         })
                         .catch((error) => {
                             console.log(error);
                             if (this.state.isLoggedIn)
                                 return <MainScreen
                                     onLogoutPress={() => this.setState({isLoggedIn: false})}
                                 />;
                             else
                                 return <LoginScreen
                                     onLoginPress={() => this.setState({isLoggedIn: true})}
                                 />;
                         });
                 } else {
                     if (this.state.isLoggedIn)
                         return <MainScreen
                             onLogoutPress={() => this.setState({isLoggedIn: false})}
                         />;
                     else
                         return <LoginScreen
                             onLoginPress={() => this.setState({isLoggedIn: true})}
                         />;
                 }
             });*/
    }
}
/*

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
*/
