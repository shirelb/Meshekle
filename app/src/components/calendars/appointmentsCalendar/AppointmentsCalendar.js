import React, {Component} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import '../localConfig';
import moment from 'moment';
import phoneStorage from "react-native-simple-store";
import appointmentsStorage from "../../../storage/appointmentsStorage";
import {APP_SOCKET} from "../../../shared/constants";
import AppointmentsDayInfo from "../../appointments/AppointmentsDayInfo";
import serviceProvidersStorage from "../../../storage/serviceProvidersStorage";

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

    loadAppointments = () => {
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

    afterCloseModalShowSelectDay = () => {
        let updatedMarkedDates = this.state.markedDates;

        const selectedDay = updatedMarkedDates[this.state.selectedDate];
        selectedDay.selected = true;
        selectedDay.color = 'blue';
        updatedMarkedDates[selectedDay] = selectedDay;

        this.setState({markedDates: updatedMarkedDates, dateModalVisible: false})
    };

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
        if (updatedMarkedDates[selectedDay].appointments.length > 0)
            updatedMarkedDates[selectedDay].appointments.forEach(appointment => {
                serviceProvidersStorage.getServiceProviderUserDetails(appointment.AppointmentDetail.serviceProviderId, this.userHeaders)
                    .then(user => {
                        appointment.serviceProviderFullname = user.data.fullname;

                        expanded[appointment.appointmentId] = false;

                        this.setState({
                            selectedDate: moment(day.dateString).format('YYYY-MM-DD'),
                            markedDates: updatedMarkedDates,
                            dateModalVisible: true,
                            expanded: expanded,
                        });
                    });
            });
        else
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
                    onDayLongPress={this.onDaySelect}
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

                <AppointmentsDayInfo
                    dateModalVisible={this.state.dateModalVisible}
                    selectedDate={this.state.selectedDate}
                    onAppointmentRequestPress={this.props.onAppointmentRequestPress}
                    loadAppointments={this.loadAppointments}
                    markedDates={this.state.markedDates}
                    expanded={this.state.expanded}
                    afterCloseModalShowSelectDay={this.afterCloseModalShowSelectDay}
                    userHeaders={this.userHeaders}
                />
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