import React, {Component} from 'react';
import {FlatList, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {localConfig} from '../localConfig';
import moment from 'moment';
import phoneStorage from "react-native-simple-store";
import {CheckBox, List, ListItem} from "react-native-elements";
import Button from "../../../components/submitButton/Button";
import appointmentsStorage from "../../../storage/appointmentsStorage";

export default class AppointmentsCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            markedDates: {},
            selectedDate: '',
            dateModalVisible: false,
        };

        this.userHeaders = {};
        this.userId = null;

        this.onDayPress = this.onDayPress.bind(this);
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
    }

    loadAppointments() {
        appointmentsStorage.getAppointmentsOfUser(this.userId,this.userHeaders)
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

                console.log('user  333  markedDates ', markedDates);
            })
            .catch(error => {
                console.log('load appointments error ', error)
            });
    }

    onDaySelect = (day) => {
        console.log('this.state.selectedDate === \'\' ', this.state.selectedDate === '');
        if (this.state.selectedDate !== '')
            console.log('this.state.markedDates[selectedDate].appointments.length === 0 ', this.state.markedDates[this.state.selectedDate].appointments.length === 0);

        console.log("in onDaySelect day ", day);
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

        this.setState({
            selectedDate: moment(day.dateString).format('YYYY-MM-DD'),
            markedDates: updatedMarkedDates,
            dateModalVisible: true,
        });
    };

    onDayPress = (date) => {
        console.log('in day press ');
        this.setState({
            date: new Date(date.year, date.month - 1, date.day),
        });
    };

    onDayChange = (date) => {
        console.log('in day change ');
        this.setState({
            date: new Date(date.year, date.month - 1, date.day),
        });
    };


    renderItem(item) {
        return (
            <View style={[styles.item, {height: item.height}]}>
                <Text>{item.startTime} - {item.endTime}</Text>
                <Text>{item.subject}</Text>
                <Text>{item.serviceProviderId}</Text>
                <Text>{item.role}</Text>
            </View>
        );
    }

    renderDay(day) {
        // renderDay={(day, item) => (<Text>{day ? day.day : 'item'} {day ? day.month.toLocaleString() : 'item'} </Text>)}

        return (
            <View style={styles.dayMonthContainer}>
                <Text style={styles.day}>{day ? day.day : null} </Text>
                <Text
                    style={styles.dayMonth}>{day ? LocaleConfig.locales['il'].monthNamesShort[day.month - 1] : null} </Text>
                <Text
                    style={styles.dayMonth}>{day ? LocaleConfig.locales['il'].dayNames[new Date(day.timestamp).getDay()] : null} </Text>
            </View>
        );
    }

    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}><Text> </Text></View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    getDateStringFromDateAndTime = (dateAndTime) => {
        const date = new Date(dateAndTime);
        return date.toISOString().split('T')[0];
    };
    getTimeStringFromDateAndTime = (dateAndTime) => {
        const date = new Date(dateAndTime);
        return date.toISOString().split('T')[1].split('.')[0].slice(0, -3);
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

    renderRow = ({item}) => {
        return (
            <ListItem
                roundAvatar
                title={moment(item.startDateAndTime).format('HH:mm') + '-' + moment(item.endDateAndTime).format('HH:mm')}
                subtitle={item.AppointmentDetail.role + ',' + item.AppointmentDetail.serviceProviderId}
                description={item.AppointmentDetail.subject}
                // avatar={{uri:item.avatar_url}}
                // onPress={() => this.requestAppointment(item)}
                containerStyle={{borderBottomWidth: 0}}
                // rightIcon={<Icon name={'chevron-left'}/>}
                // hideIcon
            />
        )
    };

    render() {
        LocaleConfig.defaultLocale = 'il';

        let currDay = new Date; // get current date
        let currDayStr = new Date().toUTCString(); // get current date

        return (
            <View>
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
                        console.log('Modal has been closed.');
                    }}>
                    <View style={{marginTop: 22}}>
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({dateModalVisible: false})
                                }}>
                                <Text>XXXXX</Text>
                            </TouchableOpacity>

                            <Text> {this.state.selectedDate} </Text>

                            <CheckBox
                                left
                                title='הוסף תאריך ושעות'
                                iconLeft
                                iconType='material'
                                checkedIcon='clear'
                                uncheckedIcon='add'
                                checkedColor='red'
                                checked={this.state.checked}
                                onPress={() => this.setState({checked: !this.state.checked})}
                            />

                            <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                                {this.state.selectedDate === '' || this.state.markedDates[this.state.selectedDate].appointments.length === 0 ?
                                    <Text>אין תורים לתאריך זה</Text>
                                    :
                                    <FlatList
                                        data={this.state.markedDates[this.state.selectedDate].appointments}
                                        renderItem={this.renderRow}
                                        keyExtractor={item => item.userId}
                                        ItemSeparatorComponent={this.renderSeparator}
                                    />
                                }
                            </List>

                            <Button
                                label='בקש תור'
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    calendar: {
        borderTopWidth: 2,
        marginTop: 10,
        paddingTop: 10,
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
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30,
        borderTopWidth: 2,
        borderTopColor: 'grey',
        borderBottomWidth: 2,
        borderBottomColor: 'grey',
    },
    dayMonthContainer: {
        height: 100,
        // borderTopWidth: 2,
        // borderTopColor: 'grey',
    },
    day: {
        fontSize: 20,
        fontWeight: '300',
        // color: appStyle.agendaDayMonthColor,
        marginTop: -5,
        backgroundColor: 'rgba(0,0,0,0)'
    },
    dayMonth: {
        fontSize: 14,
        fontWeight: '300',
        // color: appStyle.agendaDayMonthColor,
        marginTop: -5,
        backgroundColor: 'rgba(0,0,0,0)'
    },
});