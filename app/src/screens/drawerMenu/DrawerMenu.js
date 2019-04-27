import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {DrawerActions, NavigationActions} from 'react-navigation';
import {View} from 'react-native';
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
        };
    }

    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
        this.props.navigation.dispatch(DrawerActions.closeDrawer())
    };

    onLogoutPress = () => {
        phoneStorage.update('userData', {
            token: null,
            userId: null,
            userFullname: null
        })
            .then(() => {
                APP_SOCKET.emit('disconnectAppClient', {userId: this.userId});
                this.props.navigation.navigate('Auth');
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
    }

    componentWillUnmount() {
        APP_SOCKET.off("getUsers");
    }

    loadUser() {
        usersStorage.getUserById(this.userId, this.userHeaders)
            .then(user => {
                console.log("DrawerMenu user ", user);
                let userLoggedin = user.data[0];

                this.setState({
                    userLoggedin: userLoggedin,
                    formModal: false,
                    infoModal: false,
                });
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
            // userLoggedin: {},
        });
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#ededed'}}>
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
                        // badge={{ value: 3, textStyle: { color: 'orange' } }}
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
                        badge={{value: 3, textStyle: {color: 'orange'}}}
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
                        badge={{value: 3, textStyle: {color: 'orange'}}}
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
                        badge={{value: 3, textStyle: {color: 'orange'}}}
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

                <UserProfileInfo
                    modalVisible={this.state.infoModal}
                    user={this.state.userLoggedin}
                    openedFrom={"DrawerMenu"}
                    userHeaders={this.userHeaders}
                    setFormModalVisible={this.setFormModalVisible}
                />

                <UserProfileForm
                    modalVisible={this.state.formModal}
                    user={this.state.userLoggedin}
                    userHeaders={this.userHeaders}
                    loadUser={this.loadUser.bind(this)}
                />

            </View>
        );
    }
}

DrawerMenu.propTypes = {
    navigation: PropTypes.object
};