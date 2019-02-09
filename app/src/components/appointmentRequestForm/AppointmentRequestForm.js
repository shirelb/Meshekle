import React, {Component} from 'react';
import {Modal, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {CheckBox, FormInput, FormLabel, FormValidationMessage} from "react-native-elements";
import {    SelectMultipleGroupButton} from "react-native-selectmultiple-button";

export default class AppointmentRequestForm extends Component {
    constructor(props) {
        super(props);

        this.subjects = [
            { value: "פן" },
            { value: "צבע" },
            { value: "תספורת" },
            { value: "החלקה" },
            { value: "גוונים" }
        ];

        this.state = {
            modalVisible: this.props.modalVisible,
            serviceProvider: this.props.serviceProvider,
            daysSelected: [],
            subjectSelected:[],
            subjectText: "",
            displaySubjectList: false,
            notes:'',
        };
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

    render() {
        return (
            <View style={{marginTop: 22}}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <View style={{marginTop: 22}}>
                        <View>
                            <Text>Hello World!</Text>

                            {/*<FormLabel>Name</FormLabel>*/}
                            {/*<FormInput onChangeText={someFunction}/>*/}
                            {/*<FormValidationMessage>Error message</FormValidationMessage>*/}

                            <CheckBox
                                right
                                title='ראשון'
                                iconRight
                                iconType='material'
                                checkedIcon='clear'
                                uncheckedIcon='add'
                                checkedColor='red'
                                checked={this.state.checked}
                            />

                            <Text style={{ color: '#007AFF', marginLeft: 10 }}>
                                נושא  {this.state.subjectSelected.join( ", ")}
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

                            <TouchableHighlight
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}>
                                <Text>Hide Modal</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>

            </View>
        );
    }
}

const styles = StyleSheet.create({
});
