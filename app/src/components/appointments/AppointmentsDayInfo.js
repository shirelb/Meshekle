import React, {Component} from 'react';
import {Modal, ScrollView, StyleSheet, Text, View} from 'react-native';
import moment from 'moment';
import {List} from 'react-native-paper';
import Button from '../submitButton/Button';
import mappers from "../../shared/mappers";
import {Icon} from "react-native-elements";
import appointmentsStorage from "../../storage/appointmentsStorage";


export default class AppointmentsDayInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dateModalVisible: this.props.dateModalVisible,
            selectedDate: this.props.selectedDate,
            markedDates: this.props.markedDates,
            expanded: this.props.expanded,

            errorVisible: false,
            errorHeader: '',
            errorContent: ""
        };

    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log('nextProps. ', nextProps);

        if (nextProps.selectedDate !== "")
            if (nextProps.markedDates[nextProps.selectedDate] === undefined || nextProps.markedDates[nextProps.selectedDate] === null) {
                nextProps.markedDates[nextProps.selectedDate] = {marked: true, selected: true, appointments: []};
            }

        this.setState({
            dateModalVisible: nextProps.dateModalVisible,
            selectedDate: nextProps.selectedDate,
            markedDates: nextProps.markedDates,
            expanded: nextProps.expanded,
        })
    }

    cancelAppointment = (appointment) => {
        appointmentsStorage.cancelAppointmentById(appointment, this.props.userHeaders)
            .then(response => {
                if (response.response) {
                    if (response.response.status !== 200)
                        this.setState({
                            errorVisible: true,
                            errorHeader: 'קרתה שגיאה בעת מחיקת התור',
                            errorContent: mappers.errorMapper(response.response)
                        });
                } else {
                    // console.log("user cancelAppointment ", response);
                    this.props.loadAppointments();
                }
            })
    };

    render() {

        return (
            <Modal
                animationType="fade"
                transparent={false}
                visible={this.state.dateModalVisible}
                onRequestClose={() => {
                    this.setState({dateModalVisible: false});
                    this.props.afterCloseModalShowSelectDay();
                }}
            >
                <ScrollView style={{marginTop: 22}}>
                    <ScrollView>
                        <Text style={styles.textTitle}>{this.state.selectedDate}</Text>

                        <Button
                            label='חזור'
                            onPress={() => {
                                this.setState({dateModalVisible: false})
                                this.props.afterCloseModalShowSelectDay();
                            }}
                        />

                        <Button
                            label='בקש תור חדש'
                            onPress={() => {
                                this.props.onAppointmentRequestPress(this.state.selectedDate);
                                this.setState({dateModalVisible: false});
                            }}
                        />

                        <List.Section title={'תורים'} style={{textAlign: 'right'}}>
                            {this.state.selectedDate === '' || this.state.markedDates[this.state.selectedDate].appointments.length === 0 ?
                                <Text>אין תורים לתאריך זה</Text>
                                :
                                this.state.markedDates[this.state.selectedDate].appointments.map(item => {
                                    return <View key={item.appointmentId} style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                    }}>
                                        <View style={{width: 20 + '%'}}>
                                            <Icon
                                                name="delete-forever"
                                                color={'red'}
                                                // containerStyle={{marginLeft: 10}}
                                                // raised
                                                onPress={() => this.cancelAppointment(item)}
                                            />
                                        </View>
                                        <View style={{width: 80 + '%'}}>
                                            <List.Accordion
                                                title={moment(item.startDateAndTime).format('HH:mm') + '-' + moment(item.endDateAndTime).format('HH:mm')}
                                                description={mappers.serviceProviderRolesMapper(item.AppointmentDetail.role) + ' - ' + item.serviceProviderFullname}
                                                // left={props => <List.Icon {...props} icon="perm-contact-calendar"/>}
                                                expanded={this.state.expanded[item.appointmentId]}
                                                onPress={() => {
                                                    let expanded = this.state.expanded;
                                                    expanded[item.appointmentId] = !expanded[item.appointmentId];
                                                    this.setState({expanded: expanded})
                                                }}
                                            >
                                                <List.Item
                                                    title={JSON.parse(item.AppointmentDetail.subject).join(", ")}
                                                    description={item.remarks}
                                                    containerStyle={{borderBottomWidth: 0}}
                                                />
                                            </List.Accordion>
                                        </View>
                                    </View>
                                })
                            }
                        </List.Section>

                        {
                            this.state.errorVisible === true ?
                                <Text style={{color: 'red'}}>
                                    {this.state.errorHeader + ":\n" + this.state.errorContent}
                                </Text>
                                : null
                        }
                    </ScrollView>
                </ScrollView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    textTitle: {
        textAlign: 'center',
        color: '#050505',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 22
    }
});
