import React, {Component} from 'react';
import {Alert, Modal, ScrollView, StyleSheet, TextInput, View} from "react-native";
import {Avatar, FormLabel, FormValidationMessage, Text} from "react-native-elements";
import DateTimePicker from 'react-native-modal-datetime-picker';
import Button from "../submitButton/Button";
import moment from 'moment';
import usersStorage from "../../storage/usersStorage";


export default class UserProfileForm extends Component {
    constructor(props) {
        super(props);

        this.subjects = [];

        this.state = {
            modalVisible: this.props.modalVisible,
            user: this.props.user,

            errorMsg: '',
            errorVisible: true
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            modalVisible: nextProps.modalVisible,
            user: nextProps.user,

            password: nextProps.user.password,
            email: nextProps.user.email,
            mailbox: nextProps.user.mailbox.toString(),
            cellphone: nextProps.user.cellphone,
            phone: nextProps.user.phone,
            bornDate: nextProps.user.bornDate,

            isDateTimePickerVisible: false,
            errorMsg: '',
            errorVisible: true
        });
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    updateUserProfile() {
        if (this.state.user.password.length < 8) {
            this.setState({errorMsg: 'סיסמא צריכה להכיל לפחות 8 תווים', errorVisible: true})
            return;
        }
        if (this.state.user.password.length > 12) {
            this.setState({errorMsg: 'סיסמא צריכה להכיל לכל היותר 12 תווים', errorVisible: true})
            return;
        }
        if (!(/\d/.test(this.state.user.password) && /[a-zA-Z]/.test(this.state.user.password))) {
            this.setState({errorMsg: 'סיסמא צריכה להכיל לפחות ספרה אחת ולפחות אות לועזית אחת', errorVisible: true})
            return;
        }

        this.setModalVisible(!this.state.modalVisible);

        usersStorage.updateUserById(this.state.user, this.props.userHeaders)
            .then((response) => {
                console.log('updateUserById response ', response);
                Alert.alert(
                    'התראה',
                    'הפרופיל עודכן בהצלחה',
                );
                this.props.loadUser();
            })
    }


    render() {
        let user = this.state.user;

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

                        <Text h4 style={styles.textTitle}>עריכת פרופיל</Text>


                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start',}}>
                            <FormLabel labelStyle={styles.formText}>תמונה</FormLabel>
                            <Avatar
                                large
                                rounded
                                source={{uri: "https://cdn.iconscout.com/icon/free/png-256/avatar-373-456325.png"}}
                                activeOpacity={0.7}
                                onPress={() => console.log("this will change the image")}
                            />
                        </View>

                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
                            <FormLabel labelStyle={styles.formText}>סיסמא</FormLabel>
                            <TextInput
                                // maxLength={40}
                                value={user.password}
                                placeholder={user.password}
                                onChangeText={(text) => this.setState({
                                    user: {
                                        ...this.state.user,
                                        password: text
                                    }
                                })}
                                onFocus={() => this.setState({errorVisible: false})}
                                underlineColorAndroid="#4aba91"
                                style={styles.textInput}
                                autoComplete={"password"}
                                keyboardType={"visible-password"}
                                textContentType={'password'}
                            />
                        </View>

                        {/* <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
                            <FormLabel labelStyle={styles.formText}>הקש שוב סיסמא</FormLabel>
                            <TextInput
                                // maxLength={40}
                                value={user.passwordCopy}
                                // placeholder={user.password}
                                onChangeText={(text) => this.setState({
                                    user: {
                                        ...this.state.user,
                                        password: text
                                    }
                                })}
                                onFocus={() => this.setState({errorVisible: false})}
                                underlineColorAndroid="#4aba91"
                                style={styles.textInput}
                                autoComplete={"password"}
                                keyboardType={"visible-password"}
                                textContentType={'newPassword'}
                            />
                        </View>*/}

                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
                            <FormLabel labelStyle={styles.formText}>אימייל</FormLabel>
                            <TextInput
                                // maxLength={40}
                                value={user.email}
                                placeholder={user.email}
                                onChangeText={(text) => this.setState({
                                    user: {
                                        ...this.state.user,
                                        email: text
                                    }
                                })}
                                onFocus={() => this.setState({errorVisible: false})}
                                underlineColorAndroid="#4aba91"
                                style={styles.textInput}
                                autoComplete={"email"}
                                keyboardType={"email-address"}
                                textContentType={'emailAddress'}
                            />
                        </View>

                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
                            <FormLabel labelStyle={styles.formText}> תיבת דואר</FormLabel>
                            <TextInput
                                // maxLength={40}
                                value={user.mailbox ? user.mailbox.toString() : ""}
                                placeholder={user.mailbox ? user.mailbox.toString() : ""}
                                onChangeText={(text) => this.setState({
                                    user: {
                                        ...this.state.user,
                                        mailbox: text
                                    }
                                })}
                                onFocus={() => this.setState({errorVisible: false})}
                                underlineColorAndroid="#4aba91"
                                style={styles.textInput}
                                keyboardType={"number-pad"}
                            />
                        </View>

                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
                            <FormLabel labelStyle={styles.formText}>פלאפון</FormLabel>
                            <TextInput
                                // maxLength={40}
                                value={user.cellphone}
                                placeholder={user.cellphone}
                                onChangeText={(text) => this.setState({
                                    user: {
                                        ...this.state.user,
                                        cellphone: text
                                    }
                                })}
                                onFocus={() => this.setState({errorVisible: false})}
                                underlineColorAndroid="#4aba91"
                                style={styles.textInput}
                                autoComplete={"tel"}
                                keyboardType={"phone-pad"}
                                textContentType={'telephoneNumber'}
                            />
                        </View>

                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
                            <FormLabel labelStyle={styles.formText}> טלפון</FormLabel>
                            <TextInput
                                // maxLength={40}
                                value={user.phone}
                                placeholder={user.phone}
                                onChangeText={(text) => this.setState({
                                    user: {
                                        ...this.state.user,
                                        phone: text
                                    }
                                })}
                                onFocus={() => this.setState({errorVisible: false})}
                                underlineColorAndroid="#4aba91"
                                style={styles.textInput}
                                autoComplete={"tel"}
                                keyboardType={"phone-pad"}
                                textContentType={'telephoneNumber'}
                            />
                        </View>

                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start',}}>
                            <FormLabel labelStyle={styles.formText}> תאריך לידה</FormLabel>
                            {/*<TouchableOpacity*/}
                            {/*    onPress={() => this.setState({isDateTimePickerVisible: true})}*/}
                            {/*    // style={{marginTop: 12}}*/}
                            {/*>*/}
                            {/*<Text style={styles.textInput}>{moment(user.bornDate).format("DD/MM/YYYY")}</Text>*/}
                            {/*<View style={[Object.assign({}, {marginTop: 10}), styles.formInputContainer]}/>*/}
                            <TextInput
                                value={moment(user.bornDate).format("DD/MM/YYYY")}
                                placeholder={moment(user.bornDate).format("DD/MM/YYYY")}
                                onFocus={() => this.setState({errorVisible: false, isDateTimePickerVisible: true})}
                                underlineColorAndroid="#4aba91"
                                style={styles.textInput}
                            />
                            {/*</TouchableOpacity>*/}
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={(date) => this.setState({
                                    user: {
                                        ...this.state.user,
                                        bornDate: moment(date).format()
                                    },
                                    isDateTimePickerVisible: false
                                })}
                                onCancel={() => this.setState({isDateTimePickerVisible: false})}
                                is24Hour={true}
                                mode={'date'}
                                datePickerModeAndroid={'spinner'}
                                title='תאריך לידה'
                            />
                        </View>

                        {
                            this.state.errorVisible === true ?
                                <FormValidationMessage>{this.state.errorMsg}</FormValidationMessage>
                                : null
                        }

                        <View style={{marginTop: 20}}>
                            <Button
                                label='שלח'
                                onPress={() => {
                                    this.updateUserProfile();
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
        marginBottom: 20,
    },

    formText: {
        fontSize: 16
    },

    formInputContainer: {
        borderBottomWidth: 1,
        width: 180,
        marginRight: 40,
    },

    textInput: {
        height: 50,
        width: 200,
        // borderRadius: 10 ,
        // borderWidth: 2,
        // borderColor: '#009688',
        backgroundColor: "#FFF",
        // marginBottom: 10,
        // color: '#bbbbbb',
        fontSize: 16,
        // textAlign: 'center',
        marginLeft: 20,
        marginRight: 20,
    }
});
