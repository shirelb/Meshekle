import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {DrawerActions, NavigationActions, StackActions} from 'react-navigation';
import {Linking, ScrollView} from 'react-native';
import phoneStorage from "react-native-simple-store";
import {Avatar, Icon, List, ListItem} from 'react-native-elements'
import strings from '../../shared/strings'
import UserProfileInfo from "../../components/userProfile/UserProfileInfo";
import usersStorage from "../../storage/usersStorage";
import UserProfileForm from "../../components/userProfile/UserProfileForm";
import {APP_SOCKET} from "../../shared/constants";

export default class DrawerMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formModal: false,
            infoModal: false,
            userLoggedin: {},

            mainBadgeVisible: 0,
            appointmentsBadgeVisible: 0,
            choresBadgeVisible: 0,
            phoneBookBadgeVisible: 0,
            announcementsBadgeVisible: 0,
        };
    }

    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
        this.props.navigation.dispatch(DrawerActions.closeDrawer());

        switch (route) {
            case 'MainScreen':
                this.setState({
                    mainBadgeVisible: 0,
                    appointmentsBadgeVisible: 0,
                    choresBadgeVisible: 0,
                    announcementsBadgeVisible: 0,
                });
                break;
            case 'AppointmentsScreen':
                this.setState({appointmentsBadgeVisible: 0,});
                break;
            case 'ChoresScreen':
                this.setState({choresBadgeVisible: 0,});
                break;
            case 'PhoneBookScreen':
                this.setState({phoneBookBadgeVisible: 0,});
                break;
            case 'AnnouncementsScreen':
                this.setState({announcementsBadgeVisible: 0,});
                break;
        }
    };

    onLogoutPress = () => {
        const navigation = this.props.navigation;
        phoneStorage.update('userData', {
            token: null,
            userId: null,
            userFullname: null
        })
            .then(() => {
                APP_SOCKET.emit('disconnectAppClient', {userId: this.userId});
                this.props.navigation.navigate('Auth');
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName: 'LoginScreen'})
                    ]
                });
                setTimeout(this.props.navigation.dispatch.bind(null, resetAction), 500);
            })
    };

    componentWillMount() {
        phoneStorage.get('userData')
            .then(userData => {
                // console.log('agenda componentDidMount userData ', userData);
                this.userHeaders = {
                    'Authorization': 'Bearer ' + userData.token
                };
                this.userId = userData.userId;
                this.loadUser();
            });
    }

    componentDidMount() {
        APP_SOCKET.on("getUsers", this.loadUser.bind(this));

        APP_SOCKET.on("getUserAppointments", this.turnOnBadge.bind(this, "AppointmentsScreen"));
        APP_SOCKET.on("getUserChore", this.turnOnBadge.bind(this, "ChoresScreen"));

        this.setState({
            mainBadgeVisible: 0,
            appointmentsBadgeVisible: 0,
            choresBadgeVisible: 0,
            phoneBookBadgeVisible: 0,
            announcementsBadgeVisible: 0,
        });
    }

    componentWillUnmount() {
        APP_SOCKET.off("getUsers");

        APP_SOCKET.off("getUserAppointments");
        APP_SOCKET.off("getUserChore");
    }

    turnOnBadge = (route) => {
        switch (route) {
            case 'MainScreen':
                this.setState({mainBadgeVisible: 1,});
                break;
            case 'AppointmentsScreen':
                this.setState({mainBadgeVisible: 1, appointmentsBadgeVisible: 1,});
                break;
            case 'ChoresScreen':
                this.setState({mainBadgeVisible: 1, choresBadgeVisible: 1,});
                break;
            case 'PhoneBookScreen':
                this.setState({mainBadgeVisible: 1, phoneBookBadgeVisible: 1,});
                break;
            case 'AnnouncementsScreen':
                this.setState({mainBadgeVisible: 1, announcementsBadgeVisible: 1,});
                break;
        }
    };

    loadUser() {
        usersStorage.getUserById(this.userId, this.userHeaders)
            .then(user => {
                if (user.response) {
                    if (user.response.status !== 200) {
                    }
                } else {
                    // console.log("DrawerMenu user ", user);
                    let userLoggedin = user.data[0];

                    this.setState({
                        userLoggedin: userLoggedin,
                        formModal: false,
                        infoModal: false,
                    });
                }
            })
    };

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            formModal: false,
            infoModal: false,
            // userLoggedin: {},
        });
    }

    setFormModalVisible = () => {
        this.setState({
            formModal: true,
            infoModal: false,
        });
    };

    render() {
        return (
            <ScrollView style={{flex: 1, backgroundColor: '#ededed'}}>
                <List containerStyle={{marginBottom: 20}}>
                    <ListItem
                        containerStyle={{height: 150}}
                        roundAvatar
                        onPress={() => this.setState({infoModal: true})}
                        avatar={<Avatar
                            large
                            rounded
                            source={{uri: this.state.userLoggedin.image}}
                            activeOpacity={0.7}
                        />}
                        // key={i}
                        title={this.state.userLoggedin.fullname}
                        subtitle="צפייה בפרופיל"
                        // rightIcon=null
                        hideChevron
                        titleStyle={{fontSize: 20}}
                    />
                    <ListItem
                        // roundAvatar
                        onPress={this.navigateToScreen('MainScreen')}
                        // avatar={l.avatar_url}
                        // key={i}
                        title={strings.drawerMenu.MAIN_SCREEN_NAME}
                        // subtitle="test"
                        leftIcon={{name: 'home'}}
                        rightIcon={<Icon name={'chevron-left'}/>}
                        badge={{
                            value: '👋',
                            textStyle: {color: '#00adf5'},
                            containerStyle: {backgroundColor: 'transparent', opacity: this.state.mainBadgeVisible}
                        }}
                    />
                    <ListItem
                        // roundAvatar
                        onPress={this.navigateToScreen('AppointmentsScreen')}
                        // avatar={l.avatar_url}
                        // key={i}
                        title={strings.drawerMenu.APPOINTMENTS_SCREEN_NAME}
                        // subtitle="test"
                        leftIcon={{name: 'insert-invitation'}}
                        rightIcon={<Icon name={'chevron-left'}/>}
                        badge={{
                            value: '👋',
                            textStyle: {color: '#00adf5'},
                            containerStyle: {
                                backgroundColor: 'transparent',
                                opacity: this.state.appointmentsBadgeVisible
                            }
                        }}
                    />
                    <ListItem
                        // roundAvatar
                        onPress={this.navigateToScreen('ChoresScreen')}
                        // avatar={l.avatar_url}
                        // key={i}
                        title={strings.drawerMenu.CHORES_SCREEN_NAME}
                        // subtitle="test"
                        leftIcon={{name: 'transfer-within-a-station'}}
                        rightIcon={<Icon name={'chevron-left'}/>}
                        badge={{
                            value: '👋',
                            textStyle: {color: '#00adf5'},
                            containerStyle: {backgroundColor: 'transparent', opacity: this.state.choresBadgeVisible}
                        }}
                    />
                    <ListItem
                        // roundAvatar
                        onPress={this.navigateToScreen('PhoneBookScreen')}
                        // avatar={l.avatar_url}
                        // key={i}
                        title={strings.drawerMenu.PhoneBook_SCREEN_NAME}
                        // subtitle="test"
                        leftIcon={{name: 'contacts'}}
                        rightIcon={<Icon name={'chevron-left'}/>}
                        badge={{
                            value: '👋',
                            textStyle: {color: '#00adf5'},
                            containerStyle: {backgroundColor: 'transparent', opacity: this.state.phoneBookBadgeVisible}
                        }}
                    />
                    <ListItem
                        // roundAvatar
                        onPress={this.navigateToScreen('AnnouncementsScreen')}
                        // avatar={l.avatar_url}
                        // key={i}
                        title={strings.drawerMenu.ANNOUNCEMENTS_SCREEN_NAME}
                        // subtitle="test"
                        leftIcon={{name: 'insert-comment'}}
                        rightIcon={<Icon name={'chevron-left'}/>}
                        badge={{
                            value: '👋',
                            textStyle: {color: '#00adf5'},
                            containerStyle: {
                                backgroundColor: 'transparent',
                                opacity: this.state.announcementsBadgeVisible
                            }
                        }}
                    />
                    <ListItem
                        // roundAvatar
                        onPress={() => Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLSf6LE1pu78hgel5GWB_JxOtoJ8kcIuDXi4KOtGXydGE7ZMhFA/viewform?usp=sf_link')}
                        // avatar={l.avatar_url}
                        // key={i}
                        title={strings.drawerMenu.REPORT}
                        // subtitle="test"
                        leftIcon={{name: 'error'}}
                        // rightIcon=null
                        hideChevron
                    />
                    <ListItem
                        // roundAvatar
                        onPress={this.onLogoutPress.bind(this)}
                        // avatar={l.avatar_url}
                        // key={i}
                        title={strings.drawerMenu.LOGOUT}
                        // subtitle="test"
                        leftIcon={{name: 'power'}}
                        // rightIcon=null
                        hideChevron
                    />
                </List>

                {this.state.infoModal ?
                    <UserProfileInfo
                        modalVisible={this.state.infoModal}
                        user={this.state.userLoggedin}
                        openedFrom={"DrawerMenu"}
                        userHeaders={this.userHeaders}
                        setFormModalVisible={this.setFormModalVisible}
                    />
                    : null
                }

                {this.state.formModal ?
                    <UserProfileForm
                        modalVisible={this.state.formModal}
                        user={this.state.userLoggedin}
                        userHeaders={this.userHeaders}
                        loadUser={this.loadUser.bind(this)}
                    />
                    : null
                }

            </ScrollView>
        );
    }
}

DrawerMenu.propTypes = {
    navigation: PropTypes.object
};
