import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {DrawerActions, NavigationActions, StackNavigator} from 'react-navigation';
import {View} from 'react-native';
import phoneStorage from "react-native-simple-store";
import {Avatar, Icon, List, ListItem, SideMenu} from 'react-native-elements'
import strings from '../../shared/strings'

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

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#ededed'}}>
                <List containerStyle={{marginBottom: 20}}>
                    <ListItem
                        containerStyle={{height: 150}}
                        roundAvatar
                        // onPress={() => console.log('Pressed')}
                        // avatar='https://cdn.iconscout.com/icon/free/png-256/avatar-373-456325.png'
                        avatar={<Avatar
                            large
                            rounded
                            source={{uri: "https://cdn.iconscout.com/icon/free/png-256/avatar-373-456325.png"}}
                            activeOpacity={0.7}
                        />}
                        // key={i}
                        title="מנהל מנהל"
                        subtitle="מנהל"
                        // rightIcon=null
                        hideChevron
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
            </View>
            /*<View style={styles.container}>
                <ScrollView>
                    <View >
                        <View style={styles.menuItem}>
                            <Text onPress={this.navigateToScreen('MainScreen')}>
                                {strings.drawerMenu.MAIN_SCREEN_NAME}
                            </Text>
                        </View>
                        <View style={styles.menuItem}>
                            <Text onPress={this.navigateToScreen('AppointmentsScreen')}>
                                {strings.drawerMenu.APPOINTMENTS_SCREEN_NAME}
                            </Text>
                        </View>
                        <View style={styles.menuItem}>
                            <Text onPress={this.navigateToScreen('ChoresScreen')}>
                                {strings.drawerMenu.CHORES_SCREEN_NAME}
                            </Text>
                        </View>
                        <View style={styles.menuItem}>
                            <Text onPress={this.onLogoutPress.bind(this)}>
                                {strings.drawerMenu.LOGOUT}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>*/
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
