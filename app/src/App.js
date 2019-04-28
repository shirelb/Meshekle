/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Dimensions, Platform, TouchableOpacity, YellowBox} from 'react-native';
import {
    createAppContainer,
    createDrawerNavigator,
    createStackNavigator,
    createSwitchNavigator,
    DrawerActions
} from 'react-navigation';
import VectorIcons from "react-native-vector-icons/Ionicons";

import LoginScreen from './screens/loginScreen/LoginScreen';
import MainScreen from './screens/mainScreen/MainScreen';
import AppointmentsScreen from './screens/appointmentsScreen/AppointmentsScreen';
import AppointmentRequest from './screens/appointmentRequest/AppointmentRequest';
import UserAppointmentRequests from './screens/userAppointmentRequests/UserAppointmentRequests';
import ChoresScreen from './screens/choresScreen/ChoresScreen';
import PhoneBookScreen from './screens/phoneBookScreen/PhoneBookScreen';
import AnnouncementsScreen from './screens/announcementsScreen/AnnouncementsScreen';
import AuthLoadingScreen from './screens/authLoadingScreen/AuthLoadingScreen';
import DrawerMenu from './screens/drawerMenu/DrawerMenu';
import UserAnnouncementsSettings from './screens/userAnnouncementsSettings/UserAnnouncementsSettings';
import RequestAnnouncement from './screens/requestAnnouncement/RequestAnnouncement';
import UserAnnouncementsRequests from './screens/userAnnouncementsRequests/UserAnnouncementsRequests';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

console.ignoredYellowBox = ['Remote debugger'];
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

const DrawerMenuNavigator = createDrawerNavigator(
    {
        // AppNavigator: AppNavigator,
        MainScreen: {
            screen: MainScreen,
            params: {
                headerTitle: 'משקל\'ה',
            },
        },
        AppointmentsScreen: {
            screen: AppointmentsScreen,
            params: {
                headerTitle: 'התורים שלי',
            },
        },
        AppointmentRequest: {
            screen: AppointmentRequest,
            params: {
                headerTitle: 'בקשת תור',
            },
        },
        UserAppointmentRequests: {
            screen: UserAppointmentRequests,
            params: {
                headerTitle: 'בקשות התורים שלי',
            },
        },
        ChoresScreen: {
            screen: ChoresScreen,
            params: {
                headerTitle: 'התורנויות שלי',
            },
        },
        PhoneBookScreen: {
            screen: PhoneBookScreen,
            params: {
                headerTitle: 'ספר טלפונים',
            },
        },
        RequestAnnouncement: {
            screen: RequestAnnouncement,
            params: {
                headerTitle: 'מודעה חדשה',
            },
        },
        UserAnnouncementsSettings: {
            screen: UserAnnouncementsSettings,
            params: {
                headerTitle: 'מסך הגדרות מודעות',
            },
        },
        UserAnnouncementsRequests: {
            screen: UserAnnouncementsRequests,
            params: {
                headerTitle: 'בקשות קיימות',
            },
        },
        AnnouncementsScreen: {
            screen: AnnouncementsScreen,
            params: {
                headerTitle: 'לוח מודעות',
            },
        },

    },
    {
        initialRouteName: 'MainScreen',
        contentComponent: DrawerMenu,
        drawerWidth: Dimensions.get('window').width - 120,
        drawerPosition: 'right',
    }
);


const AppNavigator = createStackNavigator(
    {
        DrawerMenuNavigator: {
            screen: DrawerMenuNavigator
        },
    },
    /*{
        headerMode: "none"
    }*/
    {
        // MainScreen: {
        //     screen: MainScreen,
        //     params: {},
        defaultNavigationOptions: ({navigation}) => ({
            // header: null,
            title: `${navigation.state.routes[navigation.state.index].params.headerTitle}`,
            headerLeft: (
                <TouchableOpacity onPress={() => {
                    navigation.dispatch(DrawerActions.toggleDrawer())
                }}>
                    <VectorIcons
                        name={Platform.OS === "ios" ? "ios-menu" : "md-menu"}
                        // color="#ccc"
                        size={40}
                    />
                </TouchableOpacity>
            ),
            // headerTitle:'דף בית',
            headerStyle: {
                // paddingRight: 10,
                // paddingLeft: 15,
                marginVertical: 10,
                marginHorizontal: 20,
                elevation: 0,
            },
            // headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }),
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
    // constructor(props) {
    //     super(props);
    //     I18nManager.forceRTL(true);
    // }

    state = {
        isLoggedIn: false,
        initialScreen: 'LoginScreen',
        userId: null,
        userFullname: null
    };

    render() {
        return (
            <AppContainer/>

            /*<AppContainer
        screenProps={/!* this prop will get passed to the screen components as this.props.screenProps *!/}
        />*/
        );
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
    menuIcon: {
        width: 35,
        height: 5,
        backgroundColor: black,
        marginHorizontal: 0,
        marginVertical: 6,
    }
});
*/
