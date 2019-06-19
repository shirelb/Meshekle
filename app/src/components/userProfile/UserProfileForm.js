import React, {Component} from 'react';
import {Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import {Avatar, FormLabel, FormValidationMessage, Text} from "react-native-elements";
import DateTimePicker from 'react-native-modal-datetime-picker';
import Button from "../submitButton/Button";
import moment from 'moment';
import _ from "lodash";
import usersStorage from "../../storage/usersStorage";
import ImagePicker from 'react-native-image-crop-picker';
import mappers from "../../shared/mappers";

var sha512 = require('js-sha512');


export default class UserProfileForm extends Component {
    constructor(props) {
        super(props);

        this.subjects = [];

        this.state = {
            modalVisible: this.props.modalVisible,
            user: this.props.user ?
                this.props.user
                : {
                    password: "",
                    email: "",
                    mailbox: "",
                    cellphone: "",
                    phone: "",
                    bornDate: "",
                    image: "",
                },

            errorMsg: '',
            errorHeader: '',
            errorVisible: true,

            oldPassword: "",
            newPassword: "",
            newPasswordCopy: "",
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
            image: nextProps.user.image,

            isDateTimePickerVisible: false,
            errorMsg: '',
            errorVisible: true
        });
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    validateForm = () => {
        if ((this.state.oldPassword.length > 0 && this.state.newPassword.length === 0 && this.state.newPasswordCopy.length === 0) ||
            (this.state.oldPassword.length === 0 && this.state.newPassword.length > 0 && this.state.newPasswordCopy.length === 0) ||
            (this.state.oldPassword.length === 0 && this.state.newPassword.length === 0 && this.state.newPasswordCopy.length > 0) ||
            (this.state.oldPassword.length > 0 && this.state.newPassword.length > 0 && this.state.newPasswordCopy.length === 0) ||
            (this.state.oldPassword.length === 0 && this.state.newPassword.length > 0 && this.state.newPasswordCopy.length > 0) ||
            (this.state.oldPassword.length > 0 && this.state.newPassword.length === 0 && this.state.newPasswordCopy.length > 0)) {
            this.setState({
                errorHeader: 'שגיאה בעת מילוי טופס',
                errorMsg: 'בעת עדכון סיסמא עלייך למלא את כל השדות הרלוונטים',
                errorVisible: true
            })
            return false;
        }

        if (this.state.oldPassword.length > 0 && this.state.newPassword.length > 0 && this.state.newPasswordCopy.length > 0) {

            if (this.state.oldPassword.length < 8 || this.state.newPassword.length < 8 || this.state.newPasswordCopy.length < 8) {
                this.setState({
                    errorHeader: 'שגיאה בעת מילוי טופס',
                    errorMsg: 'סיסמא צריכה להכיל לפחות 8 תווים',
                    errorVisible: true
                })
                return false;
            }
            if (this.state.oldPassword.length > 12 || this.state.newPassword.length > 12 || this.state.newPasswordCopy.length > 12) {
                this.setState({
                    errorHeader: 'שגיאה בעת מילוי טופס',
                    errorMsg: 'סיסמא צריכה להכיל לכל היותר 12 תווים',
                    errorVisible: true
                })
                return false;
            }
            if (!(/\d/.test(this.state.oldPassword) && /[a-zA-Z]/.test(this.state.oldPassword)) ||
                !(/\d/.test(this.state.newPassword) && /[a-zA-Z]/.test(this.state.newPassword)) ||
                !(/\d/.test(this.state.newPasswordCopy) && /[a-zA-Z]/.test(this.state.newPasswordCopy))) {
                this.setState({
                    errorHeader: 'שגיאה בעת מילוי טופס',
                    errorMsg: 'סיסמא צריכה להכיל לפחות ספרה אחת ולפחות אות לועזית אחת',
                    errorVisible: true
                })
                return false;
            }

            let hash = sha512.update(this.state.oldPassword);
            if (hash.hex() !== this.state.user.password) {
                this.setState({
                    errorHeader: 'שגיאה בעת מילוי טופס',
                    errorMsg: 'הסיסמא שהזנת אינה תואמת לזו השמורה במערכת',
                    errorVisible: true
                })
                return false;
            }
            if (this.state.newPassword !== this.state.newPasswordCopy) {
                this.setState({
                    errorHeader: 'שגיאה בעת מילוי טופס',
                    errorMsg: 'הסיסמא החדשה שהוזמנה אינה תואמת לחזרה על הסיסמא החדשה',
                    errorVisible: true
                })
                return false;
            }
        }

        if (this.state.user.email.length > 0)
            if (!(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(this.state.user.email))) {
                this.setState({
                    errorHeader: 'שגיאה בעת מילוי טופס',
                    errorMsg: 'אימייל לא וואלידי',
                    errorVisible: true
                });
                return false;
            }

        if (this.state.user.mailbox > 0)
            if (!(/^\d*$/.test(this.state.user.mailbox))) {
                this.setState({
                    errorHeader: 'שגיאה בעת מילוי טופס',
                    errorMsg: "תיבת דואר צריכה להכיל רק ספרות",
                    errorVisible: true
                });
                return false;
            }

        if (this.state.user.cellphone.length > 0)
            if (!(/^\d*$/.test(this.state.user.cellphone))) {
                this.setState({
                    errorHeader: 'שגיאה בעת מילוי טופס',
                    errorMsg: "הפלאפון לא וואלידי",
                    errorVisible: true
                });
                return false;
            }

        if (this.state.user.phone.length > 0)
            if (!(/^\d*$/.test(this.state.user.phone))) {
                this.setState({
                    errorHeader: 'שגיאה בעת מילוי טופס',
                    errorMsg: "הטלפון לא וואלידי",
                    errorVisible: true
                });
                return false;
            }

        return true;
    };

    updateUserProfile() {
        if (this.validateForm()) {

            let userUpdated = this.state.user;
            if (this.state.newPassword !== "") {
                let hash = sha512.update(this.state.newPassword);
                userUpdated.password = hash.hex();
            }
            userUpdated = _.omitBy(userUpdated, (att) => att === "");


            usersStorage.updateUserById(userUpdated, this.props.userHeaders)
                .then((response) => {
                    if (response.response) {
                        if (response.response.status !== 200)
                            this.setState({
                                errorVisible: true,
                                errorHeader: 'קרתה שגיאה בעת עדכון הפרופיל',
                                errorContent: mappers.errorMapper(response.response)
                            });
                    } else {
                        // console.log('updateUserById response ', response);
                        this.setModalVisible(!this.state.modalVisible);
                        Alert.alert(
                            'התראה',
                            'הפרופיל עודכן בהצלחה',
                        );
                        this.props.loadUser();
                    }
                })
        }
    }

    onChangeImage = (e) => {
        e.preventDefault();

        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            includeBase64: true,
        }).then(image => {
            // console.log(image);
            this.setState({
                user: {...this.state.user, image: "data:" + image.mime + ";base64," + image.data},
                imageResponse: image,
            });
        });
    };


    render() {
        let {user, oldPassword, newPassword, newPasswordCopy} = this.state;

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
                            <TouchableOpacity onPress={this.onChangeImage}>
                                <Avatar
                                    large
                                    rounded
                                    source={{uri: user.image}}
                                    // source={user.image}
                                    activeOpacity={0.7}
                                    // onPress={() => this.onChangeImage}
                                />
                            </TouchableOpacity>
                        </View>

                        <Text h6 style={{marginTop: 20, marginLeft: 20, width: 90 + '%'}}>
                            בעת עדכון סיסמא עלייך למלא את שלושת השדות הבאים:
                        </Text>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
                            <FormLabel labelStyle={styles.formText}>סיסמא ישנה</FormLabel>
                            <TextInput
                                // maxLength={40}
                                value={oldPassword}
                                // placeholder={user.password}
                                onChangeText={(text) => this.setState({oldPassword: text})}
                                onFocus={() => this.setState({errorVisible: false})}
                                underlineColorAndroid="#4aba91"
                                style={styles.textInput}
                                // autoComplete={"password"}
                                // keyboardType={"visible-password"}
                                // textContentType={'password'}
                                secureTextEntry={true}
                            />
                        </View>

                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
                            <FormLabel labelStyle={styles.formText}>סיסמא חדשה</FormLabel>
                            <TextInput
                                // maxLength={40}
                                value={newPassword}
                                // placeholder={user.password}
                                onChangeText={(text) => this.setState({newPassword: text})}
                                onFocus={() => this.setState({errorVisible: false})}
                                underlineColorAndroid="#4aba91"
                                style={styles.textInput}
                                // autoComplete={"password"}
                                // keyboardType={"visible-password"}
                                // textContentType={'newPassword'}
                                secureTextEntry={true}
                            />
                        </View>

                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
                            <FormLabel labelStyle={styles.formText}> סיסמא חדשה שוב</FormLabel>
                            <TextInput
                                // maxLength={40}
                                value={newPasswordCopy}
                                // placeholder={user.password}
                                onChangeText={(text) => this.setState({newPasswordCopy: text})}
                                onFocus={() => this.setState({errorVisible: false})}
                                underlineColorAndroid="#4aba91"
                                style={styles.textInput}
                                // autoComplete={"password"}
                                // keyboardType={"visible-password"}
                                // textContentType={'newPassword'}
                                secureTextEntry={true}
                            />
                        </View>

                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
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
                                <FormValidationMessage>{this.state.errorHeader + ":\n" + this.state.errorMsg}</FormValidationMessage>
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
