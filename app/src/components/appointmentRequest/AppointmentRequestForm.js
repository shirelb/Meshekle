import React, {Component} from 'react';
import {Alert, Modal, ScrollView, StyleSheet, View} from "react-native";
import {CheckBox, FormInput, FormLabel, FormValidationMessage, Icon, Text} from "react-native-elements";
import {SelectMultipleGroupButton} from "react-native-selectmultiple-button";
import DateTimePicker from 'react-native-modal-datetime-picker';
import Button from "../submitButton/Button";
import {List} from "react-native-paper";
import moment from 'moment';
import appointmentsStorage from "../../storage/appointmentsStorage";


export default class AppointmentRequestForm extends Component {
    constructor(props) {
        super(props);

        this.subjects = [];

        this.state = {
            modalVisible: this.props.modalVisible,
            datesAndHoursSelected: this.props.selectedDate === '' || typeof this.props.selectedDate !== "string" ? [] : [{
                'date': this.props.selectedDate,
                'hours': [{startHour: "", endHour: ""}, {startHour: "", endHour: ""}],
                'expanded': false,
            }],
            subjectSelected: [],
            subjectText: "",
            displaySubjectList: false,
            notes: '',
            isDateTimePickerVisible: false,
            isStartDateTimePickerVisible: false,
            isEndDateTimePickerVisible: false,
            dateClicked: new Date(),
            startTimeClicked: '',
            endTimeClicked: '',
            errorMsg: '',
            errorVisible: true
        };

        this.handleDatePicked = this.handleDatePicked.bind(this);
        this.handleStartTimePicked = this.handleStartTimePicked.bind(this);
        this.handleEndTimePicked = this.handleEndTimePicked.bind(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            modalVisible: nextProps.modalVisible,
            serviceProvider: nextProps.serviceProvider,

            datesAndHoursSelected: nextProps.selectedDate === '' || typeof nextProps.selectedDate !== "string" ? [] : [{
                'date': nextProps.selectedDate,
                'hours': [{startHour: "", endHour: ""}, {startHour: "", endHour: ""}],
                'expanded': false,
            }],
            subjectSelected: [],
            subjectText: "",
            displaySubjectList: false,
            notes: '',
            isDateTimePickerVisible: false,
            isStartDateTimePickerVisible: false,
            isEndDateTimePickerVisible: false,
            dateClicked: new Date(),
            startTimeClicked: '',
            endTimeClicked: '',
            errorMsg: '',
            errorVisible: true
        });

        this.subjects = [];
        nextProps.serviceProvider.subjects ?
            JSON.parse(nextProps.serviceProvider.subjects).map(subject => {
                this.subjects.push({value: subject})
            })
            : null;
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
        this.props.closeAppointmentRequestForm();
    }

    groupButtonOnSelectedValuesChange(selectedValues) {
        this.setState({
            subjectSelected: selectedValues,
            errorVisible: false
        });
    }

    handleDatePicked = (selectedDate) => {
        const date = moment(selectedDate).format('YYYY-MM-DD');
        let datestimes = this.state.datesAndHoursSelected;
        let found = datestimes.some(function (el) {
            return el.date === date;
        });
        if (!found) {
            datestimes.push({'date': date, 'hours': [], 'expanded': false});
            // let expanded = this.state.expanded;
            // expanded.push({date: false});
            this.setState({
                datesAndHoursSelected: datestimes,
                // expanded: expanded,
            });
        }
        this.setState({
            isDateTimePickerVisible: false,
            isStartDateTimePickerVisible: true,
            dateClicked: date,
        });
    };

    handleStartTimePicked = (selectedTime) => {
        const time = moment(selectedTime).format('HH:mm');
        let datestimes = this.state.datesAndHoursSelected;
        datestimes.forEach(dateTime => {
            if (dateTime.date === this.state.dateClicked)
                if (!dateTime.hours)
                    dateTime.hours = [];
            dateTime.hours.push({'startHour': time});
        });

        this.setState({
            isStartDateTimePickerVisible: false,
            isEndDateTimePickerVisible: true,
            datesAndHoursSelected: datestimes,
            startTimeClicked: time,
        });
    };

    handleEndTimePicked = (selectedTime) => {
        const time = moment(selectedTime).format('HH:mm');
        let datestimes = this.state.datesAndHoursSelected;
        datestimes.forEach(dateTime => {
            if (dateTime.date === this.state.dateClicked)
                dateTime['hours'].forEach(times => {
                    if (times.startHour === this.state.startTimeClicked)
                        times['endHour'] = time;
                })
        });

        datestimes.forEach(dateTime => {
            dateTime['hours'] = dateTime['hours'].filter(function (times) {
                return times.startHour && times.endHour;
            });
        });

        this.setState({
            isEndDateTimePickerVisible: false,
            datesAndHoursSelected: datestimes,
            endTimeClicked: time,
        });
    };

    sendAppointmentRequest() {
        if (this.state.datesAndHoursSelected.length === 0 ||
            this.state.subjectSelected.length === 0) {
            this.setState({errorMsg: 'ישנו מידע חסר, השלם שדות חובה (שדות עם *)', errorVisible: true})
        } else {
            this.setModalVisible(!this.state.modalVisible);

            let appointmentRequest = {
                availableTime: this.state.datesAndHoursSelected,
                notes: this.state.notes,
                subject: this.state.subjectSelected,
            };

            appointmentsStorage.postUserAppointmentRequest(this.props.userId, this.props.serviceProvider, appointmentRequest, this.props.userHeaders)
                .then(() => {
                    Alert.alert(
                        'התראה',
                        'הבקשה נשלחה בהצלחה',
                    );
                })
        }
    }

    deleteHoursSelected = (item, hourIndex, dateIndex) => {
        let updateDatesAndHoursSelected = this.state.datesAndHoursSelected;
        updateDatesAndHoursSelected[dateIndex].hours.splice(hourIndex, 1);

        if (updateDatesAndHoursSelected[dateIndex].hours.length === 0)
            updateDatesAndHoursSelected.splice(dateIndex, 1);

        this.setState({
            datesAndHoursSelected: updateDatesAndHoursSelected,
        })
    };


    render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.setModalVisible(!this.state.modalVisible);
                }}
            >
                <View style={{marginTop: 20}}>
                    <ScrollView>
                        <Text h4 style={styles.textTitle}>בקשת תור</Text>
                        {/*<Header
                                backgroundColor={'white'}
                                // leftComponent={{ icon: 'menu', color: '#fff' }}
                                centerComponent={{ text: 'בקשת תור', style: { color: '#050505',fontWeight: 'bold',fontSize:26 } }}
                                // rightComponent={{ icon: 'home', color: '#fff' }}
                            />*/}

                        <FormLabel>*נותן שירות</FormLabel>
                        <Text style={{marginLeft: 10}}>
                            {this.props.serviceProvider.fullname}
                        </Text>

                        <FormLabel> *ענף</FormLabel>
                        <Text style={{marginLeft: 10}}>
                            {this.props.serviceProvider.role}
                        </Text>

                        <FormLabel> *תאריכים ושעות אופציונאליים</FormLabel>
                        <List.Section title={this.state.selectedDate}>
                            {Array.isArray(this.state.datesAndHoursSelected) &&
                            this.state.datesAndHoursSelected.map((item, index) => {
                                return <List.Accordion
                                    key={index}
                                    // title={moment(item.startDateAndTime).format('HH:mm') + '-' + moment(item.endDateAndTime).format('HH:mm')}
                                    title={item.date}
                                    // description={item.AppointmentDetail.role + ',' + item.AppointmentDetail.serviceProviderId}
                                    // left={props => <List.Icon {...props} icon="perm-contact-calendar"/>}
                                    // expanded={this.state.expanded[item.date]}
                                    expanded={item.expanded}
                                    onPress={() => {
                                        // let expanded = this.state.expanded;
                                        // expanded[item.date] = !expanded[item.date];
                                        // this.setState({expanded: expanded})
                                        let datesAndTimes = this.state.datesAndHoursSelected;
                                        datesAndTimes[index].expanded = !datesAndTimes[index].expanded;
                                        this.setState({datesAndHoursSelected: datesAndTimes})
                                    }}
                                >
                                    {Array.isArray(item['hours']) && item['hours'] ?
                                        item['hours'].map((hour, j) => {
                                            return <List.Item
                                                key={j}
                                                title={hour.startHour + '-' + hour.endHour}
                                                // description={item.remarks}
                                                containerStyle={{borderBottomWidth: 0}}
                                                right={props => <Icon {...props}
                                                                      name="delete-forever"
                                                                      color={'red'}
                                                                      onPress={() => this.deleteHoursSelected(item, j, index)}/>}
                                            />
                                        }) : null
                                    }
                                </List.Accordion>
                            })
                            }
                        </List.Section>

                        <CheckBox
                            left
                            title='הוסף תאריך ושעות'
                            iconLeft
                            iconType='material'
                            checkedIcon='clear'
                            uncheckedIcon='add'
                            // checkedColor='red'
                            // checked={this.state.checked}
                            onPress={() => this.setState({
                                errorVisible: false,
                                isDateTimePickerVisible: true,
                                isStartDateTimePickerVisible: false,
                                isEndDateTimePickerVisible: false,
                            })}
                        />

                        {/*<TouchableOpacity onPress={() => this.setState({isDateTimePickerVisible: true})}>*/}
                        {/*<Text>בחר תאריך</Text>*/}
                        {/*</TouchableOpacity>*/}
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this.handleDatePicked}
                            onCancel={() => this.setState({isDateTimePickerVisible: false})}
                            is24Hour={true}
                            mode={'date'}
                            // datePickerModeAndroid={'spinner'}
                            title='תאריך'
                        />
                        {/*<TouchableOpacity onPress={() => this.setState({isStartDateTimePickerVisible: true})}>
                                <Text>בחר שעת התחלה</Text>
                            </TouchableOpacity>*/}
                        <DateTimePicker
                            date={new Date(this.state.dateClicked)}
                            isVisible={this.state.isStartDateTimePickerVisible}
                            onConfirm={this.handleStartTimePicked}
                            onCancel={() => this.setState({isStartDateTimePickerVisible: false})}
                            is24Hour={true}
                            mode={'time'}
                            title='זמן התחלה'
                        />
                        {/* <TouchableOpacity onPress={() => this.setState({isEndDateTimePickerVisible: true})}>
                                <Text>בחר שעת סיום</Text>
                            </TouchableOpacity>*/}
                        <DateTimePicker
                            date={new Date(this.state.dateClicked)}
                            isVisible={this.state.isEndDateTimePickerVisible}
                            onConfirm={this.handleEndTimePicked}
                            onCancel={() => this.setState({isEndDateTimePickerVisible: false})}
                            is24Hour={true}
                            mode={'time'}
                            title='זמן סיום'
                        />

                        <FormLabel>*נושא</FormLabel>
                        <Text style={{marginLeft: 10}}>
                            {this.state.subjectSelected.join(", ")}
                        </Text>
                        <SelectMultipleGroupButton
                            containerViewStyle={{
                                justifyContent: "flex-start"
                            }}
                            highLightStyle={{
                                borderColor: "gray",
                                backgroundColor: "transparent",
                                textColor: "gray",
                                borderTintColor: '#007AFF',
                                backgroundTintColor: "transparent",
                                textTintColor: '#007AFF',
                            }}
                            onSelectedValuesChange={selectedValues =>
                                this.groupButtonOnSelectedValuesChange(selectedValues)
                            }
                            group={this.subjects}
                        />

                        <FormLabel>הערות</FormLabel>
                        <FormInput
                            editable={true}
                            maxLength={40}
                            value={this.state.notes}
                            placeholder={"כתוב הערות נוספות כאן"}
                            multiline={true}
                            onChangeText={(text) => this.setState({notes: text})}
                            onFocus={() => this.setState({errorVisible: false})}
                        />

                        {
                            this.state.errorVisible === true ?
                                <FormValidationMessage>{this.state.errorMsg}</FormValidationMessage>
                                : null
                        }

                        <View style={{marginTop: 20}}>
                            <Button
                                label='שלח'
                                onPress={() => {
                                    this.sendAppointmentRequest();
                                }}
                            />

                            <Button
                                label='חזור'
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}
                            />
                        </View>

                    </ScrollView>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    textTitle: {
        textAlign: 'center',
        color: '#050505',
        fontWeight: 'bold',
    }
});
