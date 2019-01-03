import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import PropTypes from 'prop-types'
import axios from 'axios';
import store from 'react-native-simple-store';
import styles from './LoginStyles';
import {SERVER_URL} from '../../shared/constants'
import Button from "../../components/submitButton/Button";
import FormTextInput from "../../components/formTextInput/FormTextInput";
import strings from "../../shared/strings";
import mappers from "../../shared/mappers";

const imageLogo = require("../../images/logo4000.png");

export default class LoginScreen extends Component {
    state = {
        userId: '',
        password: '',
        err: [],
    };

    validate = (userId, password) => {
        console.log('in validate func');
        const errors = [];
        let item = strings.loginScreenStrings.WRONG_CREDENTIALS;

        if (userId.length === 0) {
            errors.push(strings.loginScreenStrings.EMPTY_USER_ID);
        } else {

            if (userId.length > 9) {
                if (errors.indexOf(item) === -1) errors.push(item);
            }
            if (!(/^\d+$/.test(userId))) {
                if (errors.indexOf(item) === -1) errors.push(item);
            }
        }


        if (password.length === 0) {
            errors.push(strings.loginScreenStrings.EMPTY_PASSWORD);
        } else {
            if (password.length < 8) {
                if (errors.indexOf(item) === -1) errors.push(item);
            }
            if (password.length > 12) {
                if (errors.indexOf(item) === -1) errors.push(item);
            }
            if (!(/\d/.test(password) && /[a-zA-Z]/.test(password))) {
                if (errors.indexOf(item) === -1) errors.push(item);
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
                    store.save('userData', {
                        token: response.data.token
                    })
                        .then(
                            // this.props.onLoginPress()
                            this.props.navigation.navigate('MainScreen')
                        )
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({err: []});
                    this.setState({err: [mappers.loginScreenMapper(error.response.data.message)]});
                });
        }
    };


    render() {
        // const errors = this.state.err;

        return (
            <View style={styles.container}>
                <Image source={imageLogo} style={styles.logo}/>
                <Text style={styles.titleText}>
                    {strings.loginScreenStrings.APP_NAME}
                </Text>
                <View style={styles.form}>
                    <FormTextInput
                        value={this.state.userId}
                        onChangeText={(userId) => this.setState({userId: userId})}
                        onFocus={() => this.setState({err: []})}
                        placeholder={strings.loginScreenStrings.USER_ID_PLACEHOLDER}
                    />
                    <FormTextInput
                        value={this.state.password}
                        onChangeText={(password) => this.setState({password: password})}
                        onFocus={() => this.setState({err: []})}
                        placeholder={strings.loginScreenStrings.PASSWORD_PLACEHOLDER}
                        secureTextEntry={true}
                    />
                    <Button
                        label={strings.loginScreenStrings.LOGIN}
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

/*
LoginScreen.propTypes = {
    onLogoutPress: PropTypes.func,
};*/
