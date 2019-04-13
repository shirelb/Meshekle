import React, {Component} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Icon, List, ListItem, SearchBar} from 'react-native-elements';
import phoneStorage from "react-native-simple-store";
import UserProfileInfo from "../../components/userProfile/UserProfileInfo";
import usersStorage from "../../storage/usersStorage";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import mappers from "../../shared/mappers";
import {APP_SOCKET} from "../../shared/constants";


export default class PhoneBookScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            serviceProviders: [],
            infoModal: false,
            userSelected: {},
            noUserFound: false,
        };

        this.users = [];
        this.serviceProviders = [];
        this.openUserInfo = this.openUserInfo.bind(this);
    }

    componentDidMount() {
        phoneStorage.get('userData')
            .then(userData => {
                // console.log('agenda componentDidMount userData ', userData);
                this.userHeaders = {
                    'Authorization': 'Bearer ' + userData.token
                };
                this.userId = userData.userId;
                this.loadUsers();
            });

        APP_SOCKET.on("getServiceProviders", this.loadUsers.bind(this));
        APP_SOCKET.on("getUsers", this.loadUsers.bind(this));
    }

    componentWillUnmount() {
        APP_SOCKET.off("getServiceProviders");
        APP_SOCKET.off("getUsers");
    }

    loadUsers() {
        usersStorage.getUsers(this.userHeaders)
            .then(users => {
                console.log("phonebook users ", users);

                this.setState({
                    users: users,
                });

                this.users = users;

            })
    };

    loadServiceProviders() {
        serviceProvidersStorage.getServiceProviders(this.userHeaders)
            .then(serviceProviders => {
                // let serviceProviders = response.data;

                this.setState({
                    serviceProviders: serviceProviders,
                });

                this.serviceProviders = serviceProviders;
            })
    };

    openUserInfo = (user) => {
        this.setState({
            infoModal: true,
            userSelected: user
        });
    };

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "14%"
                }}
            />
        );
    };

    updateSearch = search => {
        // console.log("in search ", search);
        let users = this.state.users;
        let filteredByNameOrRole = users.filter((item) => {
            let roleFound = false;
            item.ServiceProviders.forEach(provider => {
                if (mappers.serviceProviderRolesMapper(provider.role).includes(search)) {
                    roleFound = true;
                }
            });
            return item.fullname.includes(search) || roleFound;
        });
        if (!search || search === '') {
            this.setState({
                users: this.users
            })
        } else if (!Array.isArray(filteredByNameOrRole) && !filteredByNameOrRole.length) {
            // set no data flag to true so as to render flatlist conditionally
            this.setState({
                noUserFound: true
            })
        } else if (Array.isArray(filteredByNameOrRole)) {
            this.setState({
                noUserFound: false,
                users: filteredByNameOrRole
            })
        }
    };

    renderHeader = () => {
        return <SearchBar
            placeholder="חפש..."
            lightTheme
            onChangeText={this.updateSearch.bind(this)}
            // round
        />;
    };

    renderRow = ({item}) => {
        let roles = [];
        item.ServiceProviders.forEach(provider => {
            if (provider.active)
                roles.push(mappers.serviceProviderRolesMapper(provider.role));
        });

        return (
            <ListItem
                roundAvatar
                title={item.fullname}
                subtitle={roles.join(", ")}
                // avatar={{uri:item.avatar_url}}
                onPress={() => this.openUserInfo(item)}
                containerStyle={{borderBottomWidth: 0}}
                rightIcon={<Icon name={'chevron-left'}/>}
            />
        )
    };

    render() {
        return (
            <View>
                <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                    {this.state.noUserFound ? <Text>לא נמצאו תוצאות</Text> :
                        <FlatList
                            data={this.state.users}
                            renderItem={this.renderRow}
                            keyExtractor={item => item.userId}
                            ItemSeparatorComponent={this.renderSeparator}
                            ListHeaderComponent={this.renderHeader}
                        />
                    }
                </List>
                <UserProfileInfo
                    modalVisible={this.state.infoModal}
                    user={this.state.userSelected}
                    openedFrom={"PhoneBookScreen"}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

