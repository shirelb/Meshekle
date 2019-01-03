/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform} from 'react-native';
import {createAppContainer, createStackNavigator, createSwitchNavigator} from 'react-navigation';

import LoginScreen from './screens/loginScreen/LoginScreen';
import MainScreen from './screens/mainScreen/MainScreen';
import AuthLoadingScreen from './screens/authLoadingScreen/AuthLoadingScreen';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

const AppNavigator = createStackNavigator(
    {
        MainScreen: {
            screen: MainScreen,
            params: {},
            navigationOptions: {
                // header: null,
                // title: `Main`,
                headerStyle: {
                    elevation: 0,
                },
            }
        }
    }
);
const AuthNavigator = createStackNavigator(
    {
        LoginScreen: {
            screen: LoginScreen,
            params: {},
            /*navigationOptions: {
                header: null,
            }*/
        },
    },
    {
        headerMode: 'none'
    }
);


const AppContainer = createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: AuthLoadingScreen,
            App: AppNavigator,
            Auth: AuthNavigator,
        },
        {
            initialRouteName: 'AuthLoading',
        }
    )
);

export default class App extends Component {
    state = {
        isLoggedIn: false,
        initialScreen: 'LoginScreen',
        userId: null,
        userFullname: null
    };

    /*
        checkUserDataInStorage = () => {
            phoneStorage.get('userData')
                .then(userData => {
                    if (userData.token) {
                        axios.post(`${SERVER_URL}/api/users/validToken`,
                            {
                                "token": userData.token,
                            },
                        )
                            .then((response) => {
                                console.log(response);
                                this.setState({
                                    userId: response.data.payload.userId,
                                    userFullname: response.data.payload.userId,
                                    initialScreen: 'MainScreen',
                                })
                            })
                            .catch((error) => {
                                this.setState({
                                    userId: null,
                                    userFullname: null,
                                    initialScreen: 'LoginScreen',
                                })
                            });
                    } else {
                        this.setState({
                            userId: null,
                            userFullname: null,
                            initialScreen: 'LoginScreen',
                        })
                    }
                });
        };
    */

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
