import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import PropTypes from 'prop-types'
import axios from 'axios';
import styles from './LoginStyles';
import {SERVER_URL} from '../../shared/constants'
import Button from "../../components/submitButton/Button";
import FormTextInput from "../../components/formTextInput/FormTextInput";
import strings from "../../shared/strings";

const imageLogo = require("../../images/logo4000.png");

export default class LoginScreen extends Component {
    /*componentDidMount(){
        const headers = {
            'Authorization': 'Bearer ' + this.props.jwt
        };
    }*/

    state = {
        userId: '',
        password: '',
        err: [],
    };

    validate = (userId, password) => {
        console.log('in validate func');
        const errors = [];

        if (userId.length === 0) {
            errors.push("הוסף ת.ז. ונסה להתחבר שוב");
        } else {
            if (userId.length > 9) {
                errors.push("ת.ז. צריכה להיות באורך של מקסימום 9 ספרות");
            }
            if (!(/^\d+$/.test(userId))) {
                errors.push("ת.ז. צריכה להכיל רק ספרות");
            }
        }


        if (password.length === 0) {
            errors.push("הוסף סיסמא ונסה להתחבר שוב");
        } else {
            if (password.length < 8) {
                errors.push("סיסמא צריכה להכיל 8 ספרות לפחות");
            }
            if (password.length > 12) {
                errors.push("סיסמא צריכה להכיל 12 ספרות לכל היותר");
            }
            if (!(/\d/.test(password) && /[a-zA-Z]/.test(password))) {
                errors.push("סיסמא צריכה להכיל לפחות ספרה אחת ולפחות אות אחת");
            }
        }

        return errors;
    };

    onSubmitPress = () => {
        console.log("in onSubmitPress");
        const userId = this.state.userId;
        const password = this.state.password;

        const errors = this.validate(userId, password);
        if (errors.length > 0) {
            console.log(errors);
            this.setState({err: errors});
        } else {
            axios.post(`${SERVER_URL}/api/users/login/authenticate`,
                {
                    "userId": this.state.userId,
                    "password": this.state.password
                },
            )
                .then((response) => {
                    console.log(response);
                    // deviceStorage.saveKey("id_token", response.data.jwt);
                    this.props.onLoginPress();
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({err: [error.response.data.message]});
                });
        }
    };


    render() {
        // const errors = this.state.err;

        return (
            <View style={styles.container}>
                <Image source={imageLogo} style={styles.logo}/>
                <Text style={styles.titleText}>
                    {strings.APP_NAME}
                </Text>
                <View style={styles.form}>
                    <FormTextInput
                        value={this.state.userId}
                        onChangeText={(userId) => this.setState({userId: userId})}
                        onFocus={() => this.setState({err: []})}
                        placeholder={strings.USER_ID_PLACEHOLDER}
                    />
                    <FormTextInput
                        value={this.state.password}
                        onChangeText={(password) => this.setState({password: password})}
                        onFocus={() => this.setState({err: []})}
                        placeholder={strings.PASSWORD_PLACEHOLDER}
                        secureTextEntry={true}
                    />
                    <Button
                        label={strings.LOGIN}
                        onPress={this.onSubmitPress.bind(this)}
                    />
                    {this.state.err.map(error => (
                        <View key={error}>
                            <Text style={styles.errorText}>
                                {/*שגיאה: */}
                                {error}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        )
    }
}

LoginScreen.propTypes = {
    onLogoutPress: PropTypes.func,
};