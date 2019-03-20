import React, {Component} from 'react';
import {Button, ScrollView, StyleSheet, Text} from 'react-native';
import {List} from "react-native-paper";
import phoneStorage from "react-native-simple-store";
import appointmentsStorage from "../../storage/appointmentsStorage";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import AppointmentRequestInfo from "../../components/appointmentRequest/AppointmentRequestInfo";
import {APP_SOCKET} from "../../shared/constants";
import {SearchBar} from "react-native-elements";


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

/*    componentWillReceiveProps(nextProps, nextContext) {
        this.loadMyAppointmentsRequests();
    }*/

    loadMyAppointmentsRequests() {
        appointmentsStorage.getUserAppointmentRequests(this.userId, this.userHeaders)
            .then((response) => {
                let userAppointmentRequests = response.data;

                console.log('userAppointmentRequests ', userAppointmentRequests);

                if (userAppointmentRequests.length === 0) {
                    this.setState({
                        userAppointmentRequests: userAppointmentRequests,
                    });
                    this.userAppointmentRequests = userAppointmentRequests
                }
                else
                    userAppointmentRequests.forEach(appointmentRequest => {
                        serviceProvidersStorage.getServiceProviderUserDetails(appointmentRequest.AppointmentDetail.serviceProviderId, this.userHeaders)
                            .then(user => {
                                appointmentRequest.serviceProviderFullname = user.data.fullname;
                                appointmentRequest.expanded = false;

                                this.setState({
                                    userAppointmentRequests: userAppointmentRequests,
                                });

                                this.userAppointmentRequests = userAppointmentRequests
                            })
                    })
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


    render() {
        // console.log('props ',this.props);

        return (
            <ScrollView>
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
                            return <List.Accordion
                                key={item.requestId}
                                // title={moment(item.startDateAndTime).format('HH:mm') + '-' + moment(item.endDateAndTime).format('HH:mm')}
                                title={item.AppointmentDetail.role}
                                description={item.serviceProviderFullname}
                                // left={props => <List.Icon {...props} icon="perm-contact-calendar"/>}
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
                                    title={"סטאטוס: " + item.status}
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
                                {/*<List.Item
                                // key={item.requestId+'2'}
                                title={item.notes === "" ? "אין הערות" : "הערות:" + item.notes}
                                // description={item.notes + ' \n ' + item.optionalTimes.toString()}
                                containerStyle={{borderBottomWidth: 0}}
                                onPress={() => console.log("item was presssed!!  ", item)}
                            />
                            <List.Item
                                // key={item.requestId+'3'}
                                title={JSON.parse(item.optionalTimes).map(function (elem) {
                                    return elem.date + ": " + elem.hours.map(function (h) {
                                        return h.startHour + '-' + h.endHour
                                    }).join(', ');
                                }).join("; ")}
                                // description={item.notes + ' \n ' + }
                                containerStyle={{borderBottomWidth: 0}}
                                onPress={() => console.log("item was presssed!!  ", JSON.parse(item.optionalTimes).join(": "))}
                            />*/}
                                {/*<List.Item
                                // key={item.requestId+'3'}
                                // title={"לפרטים נוספים"}
                                description={"לפרטים נוספים הקש כאן"}
                                containerStyle={{borderBottomWidth: 0}}
                                onPress={() => {
                                    this.setState({appointmentRequestSelected: item, infoModal: true})
                                }}
                            />*/}
                            </List.Accordion>
                        })
                        }
                    </List.Section>
                }

                {this.state.appointmentRequestDetails.requestId ?
                    <AppointmentRequestInfo
                        appointmentRequest={this.state.appointmentRequestDetails}
                        modalVisible={this.state.infoModal}
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

