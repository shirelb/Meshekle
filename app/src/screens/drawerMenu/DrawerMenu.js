import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './DrawerMenu.style';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View} from 'react-native';
import { StackNavigator, DrawerActions} from 'react-navigation';
import strings from "../../shared/strings";
import phoneStorage from "react-native-simple-store";


export default class DrawerMenu extends Component {
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
            .then(
                // this.props.onLoginPress()
                // this.props.navigation.navigate('MainScreen')
                this.props.navigation.navigate('Auth')
            )
    };

    render () {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View >
                        <View style={styles.menuItem}>
                            <Text onPress={this.navigateToScreen('MainScreen')}>
                                {strings.drawerMenu.MainScreenName}
                            </Text>
                        </View>
                        <View style={styles.menuItem}>
                            <Text onPress={this.navigateToScreen('AppointmentsScreen')}>
                                {strings.drawerMenu.AppointmentsScreenName}
                            </Text>
                        </View>
                        <View style={styles.menuItem}>
                            <Text onPress={this.navigateToScreen('ChoresScreen')}>
                                {strings.drawerMenu.ChoresScreenName}
                            </Text>
                        </View>
                        <View style={styles.menuItem}>
                            <Text onPress={this.onLogoutPress.bind(this)}>
                                {strings.drawerMenu.LOGOUT}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

   /* navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    };

    render () {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View>
                        <Text style={styles.sectionHeadingStyle}>
                            Section 1
                        </Text>
                        <View style={styles.navSectionStyle}>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Page1')}>
                                Page1
                            </Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.sectionHeadingStyle}>
                            Section 2
                        </Text>
                        <View style={styles.navSectionStyle}>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Page2')}>
                                Page2
                            </Text>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Page3')}>
                                Page3
                            </Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.sectionHeadingStyle}>
                            Section 3
                        </Text>
                        <View style={styles.navSectionStyle}>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Page4')}>
                                Page4
                            </Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.footerContainer}>
                    <Text>This is my fixed footer</Text>
                </View>
            </View>
        );
    }
}*/

DrawerMenu.propTypes = {
    navigation: PropTypes.object
};


/*

export default class DrawerMenu extends Component {
    render() {
        const {navigate} = this.props.navigation;
        return (
            <View>
                {/!*<Profile name="John Doe" email="contact@example.com" />*!/}
                {/!*<FlatList
                    data={menuData}
                    keyExtractor={item => item.key.toString()}
                    renderItem={({ item }) => (
                        <MenuItem
                            title={item.name}
                            navigation={this.props.navigation}
                            screenName={item.screenName}
                            icon={item.icon}
                        />
                    )}
                />

                <MenuItem
                    icon="power-settings-new"
                    title="Logout"
                    logoutUser
                    navigation={this.props.navigation}
                />*!/}
            </View>
        );
    }
}*/
