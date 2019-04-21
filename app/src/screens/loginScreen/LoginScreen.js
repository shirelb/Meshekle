import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import phoneStorage from 'react-native-simple-store';
import styles from './Login.style';
import Button from "../../components/submitButton/Button";
import FormTextInput from "../../components/formTextInput/FormTextInput";
import strings from "../../shared/strings";
import mappers from "../../shared/mappers";
import usersStorage from "../../storage/usersStorage";

const imageLogo = require("../../images/logo4000.png");

var sha512 = require('js-sha512');




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
            let hash = sha512.update('Message to hash');
            usersStorage.userLogin(this.state.userId, hash.hex())
                .then((response) => {
                    console.log(response);
                    phoneStorage.update('userData', {
                        token: response.data.token
                    })
                        .then(
                            usersStorage.userValidToken(response.data.token)
                                .then((validTokenResponse) => {
                                    phoneStorage.update('userData', {
                                        userId: validTokenResponse.data.payload.userId,
                                        userFullname: validTokenResponse.data.payload.userFullname,
                                    })
                                        .then(res => {
                                            this.props.navigation.navigate('App');
                                        })
                                        .catch(err => {
                                            console.log('in login valid token ', err)
                                        });
                                })
                        )
                    // this.props.onLoginPress()
                    // this.props.navigation.navigate('MainScreen')
                    // this.props.navigation.navigate('App')

                })
                .catch((error) => {
                    let msg = mappers.loginScreenMapper(error.response.data.message);
                    this.setState({err: [msg]});
                    // console.log('in auth msg: ',msg);
                    // if (this.state.err.indexOf(msg) === -1) this.setState({err: [msg]});
                });
        }
    };


    render() {
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
