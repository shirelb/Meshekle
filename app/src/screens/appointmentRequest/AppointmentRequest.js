import React, {Component} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Icon, List, ListItem, SearchBar} from 'react-native-elements';
import phoneStorage from "react-native-simple-store";
import AppointmentRequestForm from "../../components/appointmentRequest/AppointmentRequestForm";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import usersStorage from "../../storage/usersStorage";
import mappers from "../../shared/mappers";
import strings from "../../shared/strings";


export default class AppointmentRequest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            serviceProviders: [],
            formModal: false,
            serviceProviderSelected: {},
            noServiceProviderFound: false,
        };

        this.serviceProviders = [];
        this.requestAppointment = this.requestAppointment.bind(this);
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
            });
    }

    loadServiceProviders() {
        serviceProvidersStorage.getServiceProviders(this.userHeaders)
            .then(serviceProviders => {
                console.log("serviceProviders ",serviceProviders.length);

                let appointmentsServiceProviders = serviceProviders.filter(provider => strings.appointmentsServiceProviderRoles.includes(provider.role));

                appointmentsServiceProviders.forEach(provider => {
                    provider.role = mappers.serviceProviderRolesMapper(provider.role);

                    usersStorage.getUserById(provider.userId, this.userHeaders)
                        .then(user => {
                            provider.fullname = user.data[0].fullname;

                            this.setState({
                                serviceProviders: appointmentsServiceProviders,
                            });

                            this.serviceProviders = appointmentsServiceProviders;

                            console.log(" 2  2 serviceProviders ",serviceProviders.length);
                        })
                })
            });
    };

    requestAppointment = (serviceProvider) => {
        this.setState({
            formModal: true,
            serviceProviderSelected: serviceProvider
        });
        // console.log('pressed on serviceProvider ', this.state.formModal, this.state.serviceProviderSelected);
    };

    closeAppointmentRequestForm = () => {
        this.setState({
            formModal: false,
            serviceProviderSelected: {},
        });
        // console.log('pressed on serviceProvider ', this.state.formModal, this.state.serviceProviderSelected);
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
        let serviceProviders = this.state.serviceProviders;
        let filteredByNameOrRole = serviceProviders.filter((item) => {
            return item.fullname.toLowerCase().match(searchText) || item.role.toLowerCase().match(searchText);
        });
        // let filteredByRole = serviceProviders.filter((item) => {
        //     return item.role.toLowerCase().match(searchText)
        // });
        if (!searchText || searchText === '') {
            this.setState({
                serviceProviders: this.serviceProviders
            })
        } else if (!Array.isArray(filteredByNameOrRole) && !filteredByNameOrRole.length) {
            // set no data flag to true so as to render flatlist conditionally
            this.setState({
                noServiceProviderFound: true
            })
        } else if (Array.isArray(filteredByNameOrRole)) {
            this.setState({
                noServiceProviderFound: false,
                serviceProviders: filteredByNameOrRole
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
                title={mappers.serviceProviderRolesMapper(item.role)}
                subtitle={item.fullname}
                // avatar={{uri:item.avatar_url}}
                onPress={() => this.requestAppointment(item)}
                containerStyle={{borderBottomWidth: 0}}
                rightIcon={<Icon name={'chevron-left'}/>}
            />
        )
    };

    render() {
        return (
            <View>
                <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                    {this.state.noServiceProviderFound ? <Text>לא נמצאו תוצאות</Text> :
                        <FlatList
                            data={this.state.serviceProviders}
                            renderItem={this.renderRow}
                            keyExtractor={item => item.serviceProviderId + "-" + item.role}
                            ItemSeparatorComponent={this.renderSeparator}
                            ListHeaderComponent={this.renderHeader}
                        />
                    }
                </List>
                <AppointmentRequestForm
                    modalVisible={this.state.formModal}
                    userHeaders={this.userHeaders}
                    userId={this.userId}
                    serviceProvider={this.state.serviceProviderSelected}
                    selectedDate={this.props.navigation.state.params.selectedDate}
                    closeAppointmentRequestForm={this.closeAppointmentRequestForm}
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

