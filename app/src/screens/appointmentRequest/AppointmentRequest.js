import React, {Component} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Icon, List, ListItem, SearchBar} from 'react-native-elements';
import axios from "axios";
import {SERVER_URL} from "../../shared/constants";
import phoneStorage from "react-native-simple-store";
import AppointmentRequestForm from "../../components/appointmentRequestForm/AppointmentRequestForm";


export default class AppointmentRequest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            serviceProviders: [],
            formModal: false,
            serviceProviderSelected:{},
        };

        this.requestAppointment = this.requestAppointment.bind(this);
    }

    componentDidMount() {
        phoneStorage.get('userData')
            .then(userData => {
                console.log('agenda componentDidMount userData ', userData);
                this.userHeaders = {
                    'Authorization': 'Bearer ' + userData.token
                };
                this.userId = userData.userId;
                this.loadServiceProviders();
            });
    }

    loadServiceProviders() {
        axios.get(`${SERVER_URL}/api/serviceProviders`,
            {headers: this.userHeaders}
        )
            .then((response) => {
                let serviceProviders = response.data;

                serviceProviders.forEach(provider => {
                    axios.get(`${SERVER_URL}/api/users/userId/${provider.userId}`,
                        {headers: this.userHeaders}
                    )
                        .then(user => {
                            provider.fullname = user.data[0].fullname;

                            this.setState({
                                serviceProviders: serviceProviders,
                            });
                        })
                        .catch(error => {
                            console.log('error ', error)
                        });
                })
            });
    };

    requestAppointment = (serviceProvider) => {
        this.setState({formModal:true, serviceProviderSelected: serviceProvider})
        // console.log('pressed on serviceProvider ', serviceProvider);
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

    renderHeader = () => {
        return <SearchBar placeholder="Type Here..." lightTheme round/>;
    };

    renderRow = ({item}) => {
        return (
            <ListItem
                roundAvatar
                title={item.role}
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
                    <FlatList
                        data={this.state.serviceProviders}
                        renderItem={this.renderRow}
                        keyExtractor={item => item.userId}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent={this.renderHeader}
                    />
                </List>
                <AppointmentRequestForm
                    modalVisible={this.state.formModal}
                    serviceProvider={this.state.serviceProviderSelected}
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

