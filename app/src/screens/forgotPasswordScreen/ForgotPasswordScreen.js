import React, {Component} from 'react';
import {Alert, ScrollView, StyleSheet, TextInput, View} from "react-native";
import {FormLabel, FormValidationMessage, Text} from "react-native-elements";
import DateTimePicker from 'react-native-modal-datetime-picker';
import Button from "../../components/submitButton/Button";
import moment from 'moment';
import usersStorage from "../../storage/usersStorage";
import colors from "../../shared/colors";


export default class ForgotPasswordScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},

            errorMsg: '',
            errorVisible: false
        };
    }

    // componentWillReceiveProps(nextProps, nextContext) {
    //     this.setState({
    //         isDateTimePickerVisible: false,
    //         errorMsg: '',
    //         errorVisible: true
    //     });
    // }

    validateForm = () => {
        let user = this.state.user;
        if (user.userId === '' || !(/^\d*$/.test(user.userId))) {
            this.setState({
                formError: true,
                errorMsg: "ת.ז. חסר וצריך להכיל רק ספרות",
                errorVisible: true
            });
            return false;
        }

        if (user.email === '' || !(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(user.email))) {
            this.setState({
                formError: true,
                errorMsg: "אימייל חסר או לא וואלידי",
                errorVisible: true
            });
            return false;
        }

        if (!user.mailbox || !(/^\d*$/.test(user.mailbox))) {
            this.setState({
                formError: true,
                errorMsg: "תיבת דואר חסרה וצריכה להכיל רק ספרות",
                errorVisible: true
            });
            return false;
        }

        if (!user.cellphone && !user.phone) {
            this.setState({
                formError: true,
                errorMsg: "עלייך למלא פלאפון או טלפון",
                errorVisible: true
            });
            return false;
        }

        if (user.cellphone && !(/^\d*$/.test(user.cellphone))) {
            this.setState({
                formError: true,
                errorMsg: "הפלאפון לא וואלידי",
                errorVisible: true
            });
            return false;
        }

        if (user.phone && !(/^\d*$/.test(user.phone))) {
            this.setState({
                formError: true,
                errorMsg: "הטלפון לא וואלידי",
                errorVisible: true
            });
            return false;
        }

        if (!user.bornDate || user.bornDate === null) {
            this.setState({
                formError: true,
                errorMsg: "תאריך הלידה חסר",
                errorVisible: true
            });
            return false;
        }

        return true;
    };

    handleForgetPassword = (e) => {
        if (!this.validateForm()) {
            return;
        }

        usersStorage.forgetPassword(this.state.user)
            .then(response => {
                console.log('forgetPassword response ', response);
                if (!response) {
                    this.setState({showError: true});
                } else {
                    Alert.alert(
                        'התראה',
                        'במידה והפרטים נכונים תישלח אלייך סיסמא חדשה למייל. בבקשה לשנות אותה ברגע כניסה לאפליקציה',
                    );
                    this.props.navigation.navigate('LoginScreen');
                }
            })
            .catch(response => {
                this.setState({showError: true});
            })
    };


    render() {
        let user = this.state.user;

        return (
            <View style={{marginTop: 20}}>
                <ScrollView>

                    <Text h4 style={styles.textTitle}>שכחתי סיסמא</Text>


                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
                        <FormLabel labelStyle={styles.formText}>*ת.ז.</FormLabel>
                        <TextInput
                            value={user.userId}
                            // placeholder={user.email}
                            onChangeText={(text) => this.setState({
                                user: {
                                    ...this.state.user,
                                    userId: text
                                }
                            })}
                            onFocus={() => this.setState({errorVisible: false, showError: false, errorMsg: ''})}
                            underlineColorAndroid="#4aba91"
                            style={styles.textInput}
                            // autoComplete={"email"}
                            keyboardType={"number-pad"}
                            // textContentType={'emailAddress'}
                        />
                    </View>

                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
                        <FormLabel labelStyle={styles.formText}>*אימייל</FormLabel>
                        <TextInput
                            value={user.email}
                            // placeholder={user.email}
                            onChangeText={(text) => this.setState({
                                user: {
                                    ...this.state.user,
                                    email: text
                                }
                            })}
                            onFocus={() => this.setState({errorVisible: false, showError: false, errorMsg: ''})}
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
                            value={user.mailbox ? user.mailbox.toString() : ""}
                            // placeholder={user.mailbox ? user.mailbox.toString() : ""}
                            onChangeText={(text) => this.setState({
                                user: {
                                    ...this.state.user,
                                    mailbox: text
                                }
                            })}
                            onFocus={() => this.setState({errorVisible: false, showError: false, errorMsg: ''})}
                            underlineColorAndroid="#4aba91"
                            style={styles.textInput}
                            keyboardType={"number-pad"}
                        />
                    </View>

                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
                        <FormLabel labelStyle={styles.formText}>פלאפון</FormLabel>
                        <TextInput
                            value={user.cellphone}
                            // placeholder={user.cellphone}
                            onChangeText={(text) => this.setState({
                                user: {
                                    ...this.state.user,
                                    cellphone: text
                                }
                            })}
                            onFocus={() => this.setState({errorVisible: false, showError: false, errorMsg: ''})}
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
                            value={user.phone}
                            // placeholder={user.phone}
                            onChangeText={(text) => this.setState({
                                user: {
                                    ...this.state.user,
                                    phone: text
                                }
                            })}
                            onFocus={() => this.setState({errorVisible: false, showError: false, errorMsg: ''})}
                            underlineColorAndroid="#4aba91"
                            style={styles.textInput}
                            autoComplete={"tel"}
                            keyboardType={"phone-pad"}
                            textContentType={'telephoneNumber'}
                        />
                    </View>

                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start',}}>
                        <FormLabel labelStyle={styles.formText}> תאריך לידה</FormLabel>
                        <TextInput
                            value={user.bornDate ? moment(user.bornDate).format("DD/MM/YYYY") : ""}
                            // placeholder={moment(user.bornDate).format("DD/MM/YYYY")}
                            onFocus={() => this.setState({
                                errorVisible: false,
                                isDateTimePickerVisible: true,
                                showError: false
                            })}
                            underlineColorAndroid="#4aba91"
                            style={styles.textInput}
                        />
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
                            label='שחזר סיסמא'
                            onPress={this.handleForgetPassword}
                        />

                        <Button
                            label='חזור'
                            onPress={() => {
                                this.props.navigation.navigate('LoginScreen');
                            }}
                        />
                    </View>

                    {this.state.showError ?
                        <View>
                            <Text style={styles.errorText}>
                                ישנם פרטים שאינם נכונים לפי המידע השמור במערכת או שהמשתמש אינו קיים
                            </Text>
                        </View>
                        : null
                    }

                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    errorText: {
        textAlign: 'center',
        color: colors.TORCH_RED,
    },

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
