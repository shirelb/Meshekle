import React, {Component} from 'react';
import {Modal, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {CheckBox, FormInput, FormLabel, FormValidationMessage} from "react-native-elements";


export default class AppointmentRequestForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: this.props.modalVisible,
            serviceProvider: this.props.serviceProvider,
            daysSelected: [],
            subjectSelected:[],
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

const styles = StyleSheet.create({});
