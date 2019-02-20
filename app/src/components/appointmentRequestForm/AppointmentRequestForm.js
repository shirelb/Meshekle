import React, {Component} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {CheckBox} from "react-native-elements";
import {SelectMultipleGroupButton} from "react-native-selectmultiple-button";
import DateTimePicker from 'react-native-modal-datetime-picker';
import Button from "../../components/submitButton/Button";
import {List} from "react-native-paper";
import moment from 'moment';


export default class AppointmentRequestForm extends Component {
    constructor(props) {
        super(props);

        this.subjects = [
            {value: "פן"},
            {value: "צבע"},
            {value: "תספורת"},
            {value: "החלקה"},
            {value: "גוונים"}
        ];

        this.state = {
            modalVisible: this.props.modalVisible,
            serviceProvider: this.props.serviceProvider,
            datesAndHoursSelected: this.props.selectedDate === '' || typeof this.props.selectedDate !== "string" ? [] : [{
                'date': this.props.selectedDate,
                'hours': [{startHour: "", endHour: ""}, {startHour: "", endHour: ""}],
                'expanded': false,
            }],
            // expanded: this.props.selectedDate === '' || typeof this.props.selectedDate !== "string" ? [] : [{date:this.props.selectedDate : false}],
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
        };

        this.handleDatePicked = this.handleDatePicked.bind(this);
        this.handleStartTimePicked = this.handleStartTimePicked.bind(this);
        this.handleEndTimePicked = this.handleEndTimePicked.bind(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            modalVisible: this.props.modalVisible,
            serviceProvider: this.props.serviceProvider,
        })
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    groupButtonOnSelectedValuesChange(selectedValues) {
        this.setState({
            subjectSelected: selectedValues
        });
    }

    handleDatePicked = (selectedDate) => {
        const date = moment(selectedDate).format('YYYY-MM-DD');
        console.log('A date has been picked: ', date);
        // console.log('this.state.expanded ', this.state.expanded);
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
        console.log('ddddatetimes 1 ', this.state.datesAndHoursSelected);
        // console.log('this.state.expanded 2  ', this.state.expanded);
    };

    handleStartTimePicked = (selectedTime) => {
        const time = moment(selectedTime).format('HH:mm');
        console.log('A start time has been picked: ', time);
        console.log('typeof ', typeof this.state.datesAndHoursSelected);
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
        console.log('dsdddddatetimes 2 ', this.state.datesAndHoursSelected);
    };

    handleEndTimePicked = (selectedTime) => {
        const time = moment(selectedTime).format('HH:mm');
        console.log('A endddd time has been picked: ', time);
        let datestimes = this.state.datesAndHoursSelected;
        datestimes.forEach(dateTime => {
            console.log('dateTime ', dateTime);
            if (dateTime.date === this.state.dateClicked)
                console.log('dateTime[hours] ', dateTime['hours']);
            dateTime['hours'].forEach(times => {
                console.log('timessssss ', times);
                if (times.startHour === this.state.startTimeClicked)
                    times['endHour'] = time;
            })
        });
        this.setState({
            isEndDateTimePickerVisible: false,
            datesAndHoursSelected: datestimes,
            endTimeClicked: time,
        });
        console.log('ddddddddatetimes 3 ', this.state.datesAndHoursSelected);
    };

    render() {
        return (
            <View style={{marginTop: 22}}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        console.log('Modal has been closed.');
                    }}>
                    <View style={{marginTop: 22}}>
                        <View>
                            <Text>Hello World!</Text>

                            {/*<FormLabel>Name</FormLabel>*/}
                            {/*<FormInput onChangeText={someFunction}/>*/}
                            {/*<FormValidationMessage>Error message</FormValidationMessage>*/}

                            <Text style={{marginLeft: 10}}>
                                תאריכים ושעות אופציונאליים
                            </Text>

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
                                // onPress={() => this.setState({checked: !this.state.checked})}
                                onPress={() => this.setState({isStartDateTimePickerVisible: true})}
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

                            <Text style={{marginLeft: 10}}>
                                נושא {this.state.subjectSelected.join(", ")}
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

                            {/*<TouchableHighlight
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}>
                                <Text>שלח</Text>
                            </TouchableHighlight>
*/}
                            <Button
                                label='שלח'
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}
                            />

                            <Button
                                label='חזור'
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

const styles = StyleSheet.create({});
