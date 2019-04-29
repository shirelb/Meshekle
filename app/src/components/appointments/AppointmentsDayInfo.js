import React, {Component} from 'react';
import {Modal, ScrollView, StyleSheet, Text} from 'react-native';
import moment from 'moment';
import {List} from 'react-native-paper';
import Button from '../submitButton/Button';
import mappers from "../../shared/mappers";


export default class AppointmentsDayInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dateModalVisible: this.props.dateModalVisible,
            selectedDate: this.props.selectedDate,
            markedDates: this.props.markedDates,
            expanded: this.props.expanded,
        };

    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log('nextProps. ', nextProps);

        this.setState({
            dateModalVisible: nextProps.dateModalVisible,
            selectedDate: nextProps.selectedDate,
            markedDates: nextProps.markedDates,
            expanded: nextProps.expanded,
        })
    }


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

                        <List.Section title={'תורים'}>
                            {this.state.selectedDate === '' || this.state.markedDates[this.state.selectedDate].appointments.length === 0 ?
                                <Text>אין תורים לתאריך זה</Text>
                                :
                                this.state.markedDates[this.state.selectedDate].appointments.map(item => {
                                    return <List.Accordion
                                        key={item.appointmentId}
                                        title={moment(item.startDateAndTime).format('HH:mm') + '-' + moment(item.endDateAndTime).format('HH:mm')}
                                        description={mappers.serviceProviderRolesMapper(item.AppointmentDetail.role) + ' - ' + item.serviceProviderFullname}
                                        left={props => <List.Icon {...props} icon="perm-contact-calendar"/>}
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
                                })
                            }
                        </List.Section>
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
