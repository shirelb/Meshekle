import React, {Component} from 'react';
import {Text,Image,View} from 'react-native';
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
        err:null,
    };

    onSubmitPress = () => {
        console.log("in onSubmitPress");
        return axios.post(`${SERVER_URL}/api/users/login/authenticate`,
            {
                "userId": this.state.userId,
                "password": this.state.password
            },
        )
            .then((response) => {
                console.log("after get response");
                console.log(response);
                // deviceStorage.saveKey("id_token", response.data.jwt);
                this.props.onLoginPress();
            })
            .catch((error) => {
                console.log("after get error");
                console.log(error);
                this.setState({err: error})
            });
    };


    render() {
        return (
            /*
            <ScrollView style={styles.container}>
*/

            <View style={styles.container}>
                <Image source={imageLogo} style={styles.logo}/>
                <Text style={styles.titleText}>
                    {strings.APP_NAME}
                </Text>
                <View style={styles.form}>
                    <FormTextInput
                        value={this.state.userId}
                        onChangeText={(userId) => this.setState({userId})}
                        placeholder={strings.USER_ID_PLACEHOLDER}
                    />
                    <FormTextInput
                        value={this.state.password}
                        onChangeText={(password) => this.setState({password})}
                        placeholder={strings.PASSWORD_PLACEHOLDER}
                        secureTextEntry={true}
                    />
                    <Button
                        label={strings.LOGIN}
                        onPress={this.onSubmitPress.bind(this)}
                    />
                    this.state.err ? <Text style={styles.errorText}>{this.state.err}</Text> : null
                    {/*<Text style={styles.errorText}>
                        {this.state.err}
                    </Text>*/}
                    {/* <Text style={styles.loginLabel}>
                    התחבר
                </Text>*/}
                    {/*<TextInput
                    value={this.state.userId}
                    onChangeText={(userId) => this.setState({ userId })}
                    placeholder={'ת.ז.'}
                    style={styles.input}
                />*/}
                    {/*<TextInput
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder={'סיסמא'}
                    secureTextEntry={true}
                    style={styles.input}
                />*/}
                    {/*
                <View style={{margin: 7}}/>
*/}
                    {/* <Button
                    onPress={this.onSubmitPress.bind(this)}
                    title="שלח"
                    style={styles.submitBtn}
                />*/}
                </View>
            </View>
        )
    }
}

LoginScreen.propTypes = {
    onLogoutPress: PropTypes.func,
};