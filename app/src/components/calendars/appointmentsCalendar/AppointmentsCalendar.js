import React, {Component} from 'react';
// import {FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {localConfig} from '../localConfig';
import moment from 'moment';
import phoneStorage from "react-native-simple-store";
// import {CheckBox, List,ListItem} from "react-native-elements";
import {CheckBox} from "react-native-elements";
import {List} from 'react-native-paper';
import Button from '../../submitButton/Button';
import appointmentsStorage from "../../../storage/appointmentsStorage";

export default class AppointmentsCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            markedDates: {},
            selectedDate: '',
            dateModalVisible: false,
            expanded:{}
        };

        this.userHeaders = {};
        this.userId = null;

        this.onDayPress = this.onDayPress.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderContent = this.renderContent.bind(this);
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

                console.log('user  333  markedDates ', markedDates);
            })
    }

    onDaySelect = (day) => {
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

        let expanded={};
        updatedMarkedDates[selectedDay].appointments.forEach(appointment =>{
            expanded[appointment.appointmentId]=false;
        });

        this.setState({
            selectedDate: moment(day.dateString).format('YYYY-MM-DD'),
            markedDates: updatedMarkedDates,
            dateModalVisible: true,
            expanded:expanded,
        });
    };

    onDayPress = (date) => {
        console.log('in day press ');
        this.setState({
            date: new Date(date.year, date.month - 1, date.day),
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

    renderRow = ({item}) => {
        return (
            <ListItem
                roundAvatar
                title={moment(item.startDateAndTime).format('HH:mm') + '-' + moment(item.endDateAndTime).format('HH:mm')}
                subtitle={item.AppointmentDetail.role + ',' + item.AppointmentDetail.serviceProviderId}
                description={item.AppointmentDetail.subject}
                // avatar={{uri:item.avatar_url}}
                onPress={() => console.log('pressed!!')}
                containerStyle={{borderBottomWidth: 0}}
                // rightIcon={<Icon name={'chevron-left'}/>}
                // hideIcon
            />
            /*<View>
                <Text>{moment(item.startDateAndTime).format('HH:mm') + '-' + moment(item.endDateAndTime).format('HH:mm')}</Text>
                <Text>{item.AppointmentDetail.role}</Text>
                <Text>{item.AppointmentDetail.serviceProviderId}</Text>
                <Text>{item.AppointmentDetail.subject}</Text>
            </View>*/
        );
    };

    renderHeader = (item) => {
        return (
            <View style={{
                paddingTop: 15,
                paddingRight: 15,
                paddingLeft: 15,
                paddingBottom: 15,
                borderBottomWidth: 1,
                borderBottomColor: '#a9a9a9',
                backgroundColor: '#f9f9f9',
            }}>
                <Text>{moment(item.startDateAndTime).format('HH:mm') + '-' + moment(item.endDateAndTime).format('HH:mm')}</Text>
                <Text>{item.AppointmentDetail.role}</Text>
                <Text>{item.AppointmentDetail.serviceProviderId}</Text>
                <Text>{item.AppointmentDetail.subject}</Text>
            </View>
        );
    }

    renderContent = (item) => {
        return (
            <View style={{
                backgroundColor: '#31363D'
            }}>
                <Text style={{
                    paddingTop: 15,
                    paddingRight: 15,
                    paddingBottom: 15,
                    paddingLeft: 15,
                    color: '#fff',
                }}>
                    This content is hidden in the accordion
                </Text>
                <Text>{moment(item.startDateAndTime).format('HH:mm') + '-' + moment(item.endDateAndTime).format('HH:mm')}</Text>
                <Text>{item.appointmentId}</Text>
                <Text>{item.AppointmentDetail.role}</Text>
                <Text>{item.AppointmentDetail.serviceProviderId}</Text>
                <Text>{item.AppointmentDetail.subject}</Text>
                <Text>{item.remarks}</Text>
            </View>
        );
    }


    render() {
        LocaleConfig.defaultLocale = 'il';

        let currDay = new Date; // get current date
        let currDayStr = new Date().toUTCString(); // get current date

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
                                                expanded[item.appointmentId]=!expanded[item.appointmentId];
                                                this.setState({expanded: expanded})
                                            }                                            }
                                        >
                                            <List.Item
                                                title={moment(item.startDateAndTime).format('HH:mm') + '-' + moment(item.endDateAndTime).format('HH:mm')}
                                                subtitle={item.AppointmentDetail.role + ',' + item.AppointmentDetail.serviceProviderId}
                                                description={item.AppointmentDetail.subject}
                                                containerStyle={{borderBottomWidth: 0}}
                                            />
                                        </List.Accordion>
                                    })
                                }
                            </List.Section>

                            {/* <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                                {this.state.selectedDate === '' || this.state.markedDates[this.state.selectedDate].appointments.length === 0 ?
                                    <Text>אין תורים לתאריך זה</Text>
                                    :
                                    <FlatList
                                        data={this.state.markedDates[this.state.selectedDate].appointments}
                                        renderItem={this.renderRow}
                                        keyExtractor={item => String(item.appointmentId)}
                                        ItemSeparatorComponent={this.renderSeparator}
                                    />
                                }
                            </List>*/
                            }

                            <Button
                                label='בקש תור'
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}
                            />
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