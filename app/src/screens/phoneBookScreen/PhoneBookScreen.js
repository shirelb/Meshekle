import React, {Component} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Icon, List, ListItem, SearchBar} from 'react-native-elements';
import phoneStorage from "react-native-simple-store";
import AppointmentRequestForm from "../../components/appointmentRequest/AppointmentRequestForm";
import usersStorage from "../../storage/usersStorage";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import mappers from "../../shared/mappers";


export default class PhoneBookScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            serviceProviders: [],
            formModal: false,
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
                this.loadServiceProviders();
                this.loadUsers();
            });
    }

    loadUsers() {
        usersStorage.getUsers(this.userHeaders)
            .then(users => {
                console.log("phonebook users ", users);

                serviceProvidersStorage.getServiceProviders(this.userHeaders)
                    .then(serviceProviders => {
                        // let serviceProviders = response.data;

                        users.forEach(user => {
                            let serviceProvidersRelated = serviceProviders.filter(provider => provider.userId === user.userId);

                            if (serviceProvidersRelated.length > 0) {
                                user.serviceProvidersRelated = {};
                                user.serviceProvidersRelated.serviceProviders = serviceProvidersRelated;
                                let roles = [];
                                serviceProvidersRelated.forEach(provider => {
                                    roles.push(mappers.serviceProviderRolesMapper(provider.role));
                                });
                                user.serviceProvidersRelated.roles = roles;
                            }
                        });

                        this.setState({
                            serviceProviders: serviceProviders,
                            users: users,
                        });

                        this.users = users;
                    })
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
            formModal: true,
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
        console.log("in search ", search);
        // this.setState({search});
        let searchText = search.toLowerCase();
        let users = this.state.users;
        let filteredByNameOrRole = users.filter((item) => {
            return item.fullname.toLowerCase().match(searchText) || item.role.toLowerCase().match(searchText);
        });
        // let filteredByRole = users.filter((item) => {
        //     return item.role.toLowerCase().match(searchText)
        // });
        if (!searchText || searchText === '') {
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
        return (
            <ListItem
                roundAvatar
                title={item.fullname}
                subtitle={item.serviceProvidersRelated ? item.serviceProvidersRelated.roles.join(", ") : null}
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
                {/*<AppointmentRequestForm
                    modalVisible={this.state.formModal}
                    userHeaders={this.userHeaders}
                    userId={this.userId}
                    serviceProvider={this.state.serviceProviderSelected}
                    selectedDate={this.props.navigation.state.params.selectedDate}
                />*/}
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

