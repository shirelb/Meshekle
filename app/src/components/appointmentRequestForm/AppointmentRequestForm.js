import React, {Component} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {CheckBox} from "react-native-elements";
import {SelectMultipleGroupButton} from "react-native-selectmultiple-button";
import DateTimePicker from 'react-native-modal-datetime-picker';
import Button from "../../components/submitButton/Button";


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
            daysAndHoursSelected: [],
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

    handleDatePicked = (date) => {
        console.log('datetimes  ', this.state.daysAndHoursSelected);
        console.log('A date has been picked: ', date);
        if (!this.state.daysAndHoursSelected.filter(datetime => (datetime.date === date)))
            this.setState({
                daysAndHoursSelected: [...this.state.daysAndHoursSelected, date],
            });
        this.setState({
            isDateTimePickerVisible: false,
            isStartDateTimePickerVisible: true,
            dateClicked: date,
        });
    };

    handleStartTimePicked = (time) => {
        console.log('A start time has been picked: ', time);
        let datestimes = this.state.daysAndHoursSelected;
        datestimes.forEach(dateTime => {
            if (dateTime.date === this.state.dateClicked)
                if(!dateTime.hours)
                    dateTime.hours=[];
                dateTime.hours.push({'startHour': time});
        });

        this.setState({
            isStartDateTimePickerVisible: false,
            isSEndDateTimePickerVisible: true,
            daysAndHoursSelected: datestimes,
            startTimeClicked: time,
        });
        this.forceUpdate();
    };

    handleEndTimePicked = (time) => {
        console.log('A endddd time has been picked: ', time);
        let datestimes = this.state.daysAndHoursSelected;
        datestimes.forEach(dateTime => {
            if (dateTime.date === this.state.dateClicked)
                datestimes.hours.forEach(startTime => {
                    if (startTime.startHour === this.state.startTimeClicked)
                        dateTime.hours.push({'endHour': time})
                })
        });
        this.setState({
            isSEndDateTimePickerVisible: false,
            endTimeClicked: time,
        });
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

                            <TouchableOpacity onPress={() => this.setState({isDateTimePickerVisible: true})}>
                                <Text>בחר תאריך</Text>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this.handleDatePicked}
                                onCancel={() => this.setState({isDateTimePickerVisible: false})}
                                is24Hour={true}
                                mode={'date'}
                            />
                            <TouchableOpacity onPress={() => this.setState({isStartDateTimePickerVisible: true})}>
                                <Text>בחר שעת התחלה</Text>
                            </TouchableOpacity>
                            <DateTimePicker
                                date={this.state.dateClicked}
                                isVisible={this.state.isStartDateTimePickerVisible}
                                onConfirm={this.handleStartTimePicked}
                                onCancel={() => this.setState({isStartDateTimePickerVisible: false})}
                                is24Hour={true}
                                mode={'time'}
                            />
                            <TouchableOpacity onPress={() => this.setState({isEndDateTimePickerVisible: true})}>
                                <Text>בחר שעת סיום</Text>
                            </TouchableOpacity>
                            <DateTimePicker
                                date={this.state.dateClicked}
                                isVisible={this.state.isEndDateTimePickerVisible}
                                onConfirm={this.handleEndTimePicked}
                                onCancel={() => this.setState({isEndDateTimePickerVisible: false})}
                                is24Hour={true}
                                mode={'time'}
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
                        </View>
                    </View>
                </Modal>

            </View>
        );
    }
}

const styles = StyleSheet.create({});
