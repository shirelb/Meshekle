import React, {Component} from 'react';
// import {FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Modal, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {localConfig} from '../localConfig';
import moment from 'moment';
import phoneStorage from "react-native-simple-store";
// import {CheckBox, List,ListItem} from "react-native-elements";
import {List} from 'react-native-paper';
import Button from '../../submitButton/Button';
import appointmentsStorage from "../../../storage/appointmentsStorage";
import {APP_SOCKET} from "../../../shared/constants";

export default class AppointmentsCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            markedDates: {},
            selectedDate: '',
            dateModalVisible: false,
            expanded: {}
        };

        this.userHeaders = {};
        this.userId = null;
    }

    componentDidMount() {
        phoneStorage.get('userData')
            .then(userData => {
                this.userHeaders = {
                    'Authorization': 'Bearer ' + userData.token
                };
                this.userId = userData.userId;
                this.loadAppointments();
            });

        APP_SOCKET.on("getUserAppointments", this.loadAppointments.bind(this));
    }

    componentWillUnmount() {
        APP_SOCKET.off("getUserAppointments‚");
    }

    loadAppointments() {
        appointmentsStorage.getUserAppointments(this.userId, this.userHeaders)
            .then(response => {
                let markedDates = {};

                response.data.forEach(appointment => {
                    const date = moment(appointment.startDateAndTime).format('YYYY-MM-DD');
                    if (markedDates[date] === undefined || markedDates[date] === null) {
                        markedDates[date] = {marked: true, selected: false, appointments: []};
                    }
                    markedDates[date].appointments.push(appointment);
                });

                this.setState({
                    markedDates: markedDates
                });

            })
    }

    onDaySelect = (day) => {
        let updatedMarkedDates = this.state.markedDates;

        if (this.state.selectedDate !== '') {
            let lastMarkedDate = updatedMarkedDates[this.state.selectedDate];
            lastMarkedDate.selected = false;
            updatedMarkedDates[this.state.selectedDate] = lastMarkedDate;
        }

        const selectedDay = moment(day.dateString).format('YYYY-MM-DD');
        if (updatedMarkedDates[selectedDay] === undefined)
            updatedMarkedDates[selectedDay] = {marked: true, selected: false, appointments: []};
        let newMarkedDate = updatedMarkedDates[selectedDay];
        newMarkedDate.selected = true;
        newMarkedDate.color = 'blue';
        updatedMarkedDates[selectedDay] = newMarkedDate;

        let expanded = {};
        updatedMarkedDates[selectedDay].appointments.forEach(appointment => {
            expanded[appointment.appointmentId] = false;
        });

        this.setState({
            selectedDate: moment(day.dateString).format('YYYY-MM-DD'),
            markedDates: updatedMarkedDates,
            dateModalVisible: true,
            expanded: expanded,
        });
    };


    render() {
        LocaleConfig.defaultLocale = 'il';

        return (
            <ScrollView>
                <Calendar
                    markedDates={this.state.markedDates}
                    onDayPress={this.onDaySelect}
                    style={styles.calendar}
                    // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                    // monthFormat={'yyyy MM'}
                    // Handler which gets executed when visible month changes in calendar. Default = undefined
                    // onMonthChange={(month) => {
                    //     console.log('month changed', month)
                    // }}
                    // Replace default arrows with custom ones (direction can be 'left' or 'right')
                    // renderArrow={(direction) => (<Arrow/>)}
                    theme={{
                        backgroundColor: '#ffffff',
                        calendarBackground: '#ffffff',
                        textSectionTitleColor: '#b6c1cd',
                        selectedDayBackgroundColor: '#00adf5',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#00adf5',
                        dayTextColor: '#2d4150',
                        textDisabledColor: '#d9e1e8',
                        dotColor: '#00adf5',
                        selectedDotColor: '#ffffff',
                        arrowColor: 'orange',
                        monthTextColor: 'blue',
                        textDayFontFamily: 'monospace',
                        textMonthFontFamily: 'monospace',
                        textDayHeaderFontFamily: 'monospace',
                        textMonthFontWeight: 'bold',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 16
                    }}
                />
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.state.dateModalVisible}
                    onRequestClose={() => {
                        this.setState({dateModalVisible: false})
                    }}
                    >
                    <View style={{marginTop: 22}}>
                        <View>

                            <Button
                                label='חזור'
                                onPress={() => {
                                    this.setState({dateModalVisible: false})
                                }}
                            />

                            <Button
                                label='בקש תור חדש'
                                onPress={() => {
                                    this.props.onAppointmentRequestPress(this.state.selectedDate);
                                    this.setState({dateModalVisible: false});
                                }}
                            />

                            <List.Section title={this.state.selectedDate}>
                                {this.state.selectedDate === '' || this.state.markedDates[this.state.selectedDate].appointments.length === 0 ?
                                    <Text>אין תורים לתאריך זה</Text>
                                    :
                                    this.state.markedDates[this.state.selectedDate].appointments.map(item => {
                                        return <List.Accordion
                                            key={item.appointmentId}
                                            title={moment(item.startDateAndTime).format('HH:mm') + '-' + moment(item.endDateAndTime).format('HH:mm')}
                                            description={item.AppointmentDetail.role + ',' + item.AppointmentDetail.serviceProviderId}
                                            left={props => <List.Icon {...props} icon="perm-contact-calendar"/>}
                                            expanded={this.state.expanded[item.appointmentId]}
                                            onPress={() => {
                                                let expanded = this.state.expanded;
                                                expanded[item.appointmentId] = !expanded[item.appointmentId];
                                                this.setState({expanded: expanded})
                                            }}
                                        >
                                            <List.Item
                                                title={item.AppointmentDetail.subject}
                                                description={item.remarks}
                                                containerStyle={{borderBottomWidth: 0}}
                                            />
                                        </List.Accordion>
                                    })
                                }
                            </List.Section>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    calendar: {
        borderTopWidth: 2,
        // marginTop: 5,
        paddingTop: 5,
        borderBottomWidth: 2,
        borderColor: '#eee',
        height: 350,
    },
    text: {
        textAlign: 'center',
        borderColor: '#bbb',
        padding: 10,
        backgroundColor: '#eee'
    },
});