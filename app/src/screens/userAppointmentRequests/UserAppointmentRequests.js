import React, {Component} from 'react';
import {Button, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {List} from "react-native-paper";
import phoneStorage from "react-native-simple-store";
import appointmentsStorage from "../../storage/appointmentsStorage";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import AppointmentRequestInfo from "../../components/appointmentRequest/AppointmentRequestInfo";
import {APP_SOCKET} from "../../shared/constants";
import {Icon, SearchBar} from "react-native-elements";
import mappers from "../../shared/mappers";


export default class UserAppointmentRequests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userAppointmentRequests: [],
            appointmentRequestSelected: {},
            formModal: false,
            infoModal: false,
            appointmentRequestDetails: {},
            noAppointmentRequestsFound: false,
            refreshing: false,
        };

    }

    componentDidMount() {
        phoneStorage.get('userData')
            .then(userData => {
                // console.log('agenda componentDidMount userData ', userData);
                this.userHeaders = {
                    'Authorization': 'Bearer ' + userData.token
                };
                this.userId = userData.userId;
                this.loadMyAppointmentsRequests();
            });

        APP_SOCKET.on("getUserAppointmentRequests", this.loadMyAppointmentsRequests.bind(this));
    }

    componentWillUnmount() {
        APP_SOCKET.off("getUserAppointmentRequests");
    }

    loadMyAppointmentsRequests() {
        appointmentsStorage.getUserAppointmentRequests(this.userId, this.userHeaders)
            .then((response) => {
                let userAppointmentRequests = response.data;

                //console.log('userAppointmentRequests ', userAppointmentRequests);

                if (userAppointmentRequests.length === 0) {
                    this.setState({
                        userAppointmentRequests: userAppointmentRequests,
                    });
                    this.userAppointmentRequests = userAppointmentRequests
                } else
                    userAppointmentRequests.forEach(appointmentRequest => {
                        serviceProvidersStorage.getServiceProviderUserDetails(appointmentRequest.AppointmentDetail.serviceProviderId, this.userHeaders)
                            .then(user => {
                                console.log('userAppointmentRequests ', user);

                                appointmentRequest.serviceProviderFullname = user.data.fullname;
                                appointmentRequest.expanded = false;

                                this.setState({
                                    userAppointmentRequests: userAppointmentRequests,
                                });

                                this.userAppointmentRequests = userAppointmentRequests
                            })
                    });

                this.setState({refreshing: false});
            })
            .catch(err => console.log("loadMyAppointmentsRequests error ", err))
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
        let userAppointmentRequests = this.state.userAppointmentRequests;
        let filteredByNameOrRole = userAppointmentRequests.filter((item) => {
            return item.serviceProviderFullname.toLowerCase().match(searchText) || item.AppointmentDetail.role.toLowerCase().match(searchText);
        });
        // let filteredByRole = userAppointmentRequests.filter((item) => {
        //     return item.role.toLowerCase().match(searchText)
        // });
        if (!searchText || searchText === '') {
            this.setState({
                userAppointmentRequests: this.userAppointmentRequests
            })
        } else if (!Array.isArray(filteredByNameOrRole) && !filteredByNameOrRole.length) {
            // set no data flag to true so as to render flatlist conditionally
            this.setState({
                noAppointmentRequestsFound: true
            })
        } else if (Array.isArray(filteredByNameOrRole)) {
            this.setState({
                noAppointmentRequestsFound: false,
                userAppointmentRequests: filteredByNameOrRole
            })
        }
    };

    cancelAppointmentRequest = (appointmentRequest) => {
        appointmentsStorage.cancelAppointmentRequestById(appointmentRequest, this.userHeaders)
            .then(response => {
                console.log("user cancelAppointmentRequest ", response);
                this.loadMyAppointmentsRequests();
            })
    };

    onRefresh = () => {
        this.setState({refreshing: true});

        this.loadMyAppointmentsRequests();
    };

    closeAppointmentRequestInfo = () => {
        this.setState({
            appointmentRequestDetails: {},
            infoModal: false,
        })
    };

    render() {
        return (
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                />
            }>
                <Button
                    title="בקש תור חדש"
                    onPress={() => {
                        this.props.navigation.state.params.onAppointmentRequestPress();
                    }}
                />

                <SearchBar
                    placeholder="חפש..."
                    lightTheme
                    onChangeText={this.updateSearch.bind(this)}
                    // round
                />

                {/*{this.state.noAppointmentRequestsFound ?*/}
                {this.state.userAppointmentRequests.length === 0 ?
                    <Text>אין לך בקשות תורים</Text>
                    :
                    <List.Section>
                        {Array.isArray(this.state.userAppointmentRequests) &&
                        this.state.userAppointmentRequests.map((item) => {
                            return <View key={item.requestId} style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                            }}>
                                <View style={{width: 30 + '%'}}>
                                    <Icon
                                        name="delete-forever"
                                        color={'red'}
                                        // containerStyle={{marginLeft: 10}}
                                        // raised
                                        onPress={() => this.cancelAppointmentRequest(item)}
                                    />
                                </View>
                                <View style={{width: 70 + '%'}}>
                                    <List.Accordion
                                        // title={moment(item.startDateAndTime).format('HH:mm') + '-' + moment(item.endDateAndTime).format('HH:mm')}
                                        title={mappers.serviceProviderRolesMapper(item.AppointmentDetail.role)}
                                        description={item.serviceProviderFullname}
                                        // left={props => <List.Icon {...props} icon="perm-contact-calendar"/>}
                                        // left={props => <Icon {...props}
                                        //                      name="delete-forever"
                                        //                      color={'red'}
                                        //                      containerStyle={{marginLeft: 10}}
                                        //                      raised
                                        //
                                        //                      onPress={() => this.cancelAppointmentRequest(item)}/>}
                                        // style={{marginLeft: 10, width: 100+"%",}}
                                        expanded={item.expanded}
                                        onPress={() => {
                                            // let expanded = this.state.expanded;
                                            // expanded[item.date] = !expanded[item.date];
                                            // this.setState({expanded: expanded})
                                            let appointmentRequestSelected = item;
                                            appointmentRequestSelected.expanded = !appointmentRequestSelected.expanded;
                                            this.setState({
                                                appointmentRequestSelected: appointmentRequestSelected,
                                                appointmentRequestDetails: {}
                                            })
                                        }}
                                    >
                                        <List.Item
                                            // key={item.requestId+'0'}
                                            title={"סטאטוס: " + mappers.appointmentRequestStatusMapper(item.status)}
                                            // description={item.notes + ' \n ' + item.optionalTimes.toString()}
                                            containerStyle={{borderBottomWidth: 0}}
                                            // onPress={() => console.log("item was presssed!!  ", item)}
                                        />
                                        <List.Item
                                            // key={item.requestId+'1'}
                                            title={"נושא: " + JSON.parse(item.AppointmentDetail.subject).join(", ")}
                                            // description={item.notes + ' \n ' + item.optionalTimes.toString()}
                                            description={"לפרטים נוספים הקש כאן"}
                                            containerStyle={{borderBottomWidth: 0}}
                                            onPress={() => {
                                                this.setState({appointmentRequestDetails: item, infoModal: true})
                                            }}
                                        />
                                    </List.Accordion>
                                </View>
                            </View>
                        })
                        }
                    </List.Section>
                }

                {this.state.appointmentRequestDetails.requestId ?
                    <AppointmentRequestInfo
                        appointmentRequest={this.state.appointmentRequestDetails}
                        modalVisible={this.state.infoModal}
                        cancelAppointmentRequest={this.cancelAppointmentRequest}
                        closeAppointmentRequestInfo={this.closeAppointmentRequestInfo}
                    />
                    : null
                }
            </ScrollView>
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

