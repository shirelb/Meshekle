import React from 'react';

import {shallow} from "enzyme/build";
import LoginScreen from "../../screens/loginScreen/LoginScreen";
import strings from "../../shared/strings";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import usersStorage from "../../storage/usersStorage";
import phoneStorage from "react-native-simple-store";
import users from "../jsons/users";

jest.mock("../../storage/serviceProvidersStorage");
jest.mock("../../storage/usersStorage");
jest.mock("react-native-simple-store");


describe("LoginScreen should", () => {
    let wrapper = null;
    let componentInstance = null;
    const props = {};
    const userIdTest = "549963652";
    const passwordTest = "Qw345678";

    const navigation = {navigate: jest.fn()};
    usersStorage.getUsers.mockResolvedValue(users);
    phoneStorage.get.mockImplementation((key) => Promise.resolve(mockStore[key]));
    phoneStorage.update.mockImplementation((key, value) => Promise.resolve(mockStore[key] = value));

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('match snapshot', async () => {
        wrapper = shallow(<LoginScreen/>);
        expect(wrapper).toMatchSnapshot();
    });

    test("render what the user see", async () => {
        wrapper = shallow(<LoginScreen/>);
        componentInstance = wrapper.instance();

        expect(wrapper.find('Image')).toHaveLength(1);
        expect(wrapper.find('Text')).toHaveLength(1);
        expect(wrapper.find('Text').props().children).toEqual(strings.loginScreenStrings.APP_NAME);
        expect(wrapper.find('FormTextInput')).toHaveLength(2);
        expect(wrapper.find('FormTextInput').at(0).props().placeholder).toEqual(strings.loginScreenStrings.USER_ID_PLACEHOLDER);
        expect(wrapper.find('FormTextInput').at(0).props().value).toEqual('');
        expect(wrapper.find('FormTextInput').at(1).props().placeholder).toEqual(strings.loginScreenStrings.PASSWORD_PLACEHOLDER);
        expect(wrapper.find('FormTextInput').at(1).props().value).toEqual('');
        expect(wrapper.find('Button')).toHaveLength(2);
        expect(wrapper.find('Button').at(0).props().label).toEqual(strings.loginScreenStrings.LOGIN);
        expect(wrapper.find('Button').at(1).props().label).toEqual(strings.loginScreenStrings.FORGOT_PASSWORD);

        expect(componentInstance.state.err.length).toEqual(0);
        expect(componentInstance.state.err).toEqual([]);
        expect(componentInstance.state.userId).toEqual('');
        expect(componentInstance.state.password).toEqual('');
    });

    test("handle change of userId", async () => {
        wrapper = shallow(<LoginScreen/>);
        componentInstance = wrapper.instance();

        expect(componentInstance.state.userId).toEqual('');

        await wrapper.find('FormTextInput').at(0).props().onChangeText(userIdTest);
        expect(componentInstance.state.userId).toEqual(userIdTest);
    });

    test("handle change of password", async () => {
        wrapper = shallow(<LoginScreen/>);
        componentInstance = wrapper.instance();

        expect(componentInstance.state.password).toEqual('');

        await wrapper.find('FormTextInput').at(1).props().onChangeText(passwordTest);
        expect(componentInstance.state.password).toEqual(passwordTest);
    });

    test("validate userId and password", async () => {
        wrapper = shallow(<LoginScreen/>);
        componentInstance = wrapper.instance();

        let validateResponse = componentInstance.validate("", passwordTest);
        expect(validateResponse.length).toEqual(1);
        expect(validateResponse[0]).toEqual(strings.loginScreenStrings.EMPTY_USER_ID);

        validateResponse = componentInstance.validate("11111111111111111", passwordTest);
        expect(validateResponse.length).toEqual(1);
        expect(validateResponse[0]).toEqual(strings.loginScreenStrings.WRONG_CREDENTIALS);

        validateResponse = componentInstance.validate("user223", passwordTest);
        expect(validateResponse.length).toEqual(1);
        expect(validateResponse[0]).toEqual(strings.loginScreenStrings.WRONG_CREDENTIALS);

        validateResponse = componentInstance.validate(userIdTest, "");
        expect(validateResponse.length).toEqual(1);
        expect(validateResponse[0]).toEqual(strings.loginScreenStrings.EMPTY_PASSWORD);

        validateResponse = componentInstance.validate(userIdTest, "5");
        expect(validateResponse.length).toEqual(1);
        expect(validateResponse[0]).toEqual(strings.loginScreenStrings.WRONG_CREDENTIALS);

        validateResponse = componentInstance.validate(userIdTest, "55555555555555555555555555");
        expect(validateResponse.length).toEqual(1);
        expect(validateResponse[0]).toEqual(strings.loginScreenStrings.WRONG_CREDENTIALS);

        validateResponse = componentInstance.validate(userIdTest, "סיסמא");
        expect(validateResponse.length).toEqual(1);
        expect(validateResponse[0]).toEqual(strings.loginScreenStrings.WRONG_CREDENTIALS);

        validateResponse = componentInstance.validate("", "סיסמא");
        expect(validateResponse.length).toEqual(2);
        expect(validateResponse[0]).toEqual(strings.loginScreenStrings.EMPTY_USER_ID);
        expect(validateResponse[1]).toEqual(strings.loginScreenStrings.WRONG_CREDENTIALS);

        validateResponse = componentInstance.validate(userIdTest, passwordTest);
        expect(validateResponse.length).toEqual(0);
    });

    test("submit login form with wrong credentials", async () => {
        wrapper = shallow(<LoginScreen/>);
        componentInstance = wrapper.instance();
        const onSubmitPressSpy = jest.spyOn(componentInstance, 'onSubmitPress');

        await componentInstance.setState({userId: "", password: ""});
        const validateSpy = jest.spyOn(componentInstance, 'validate');
        validateSpy.mockReturnValue([strings.loginScreenStrings.EMPTY_USER_ID, strings.loginScreenStrings.EMPTY_PASSWORD]);

        await wrapper.find('Button').at(0).props().onPress();

        expect(onSubmitPressSpy).toHaveBeenCalled();
        expect(componentInstance.state.err).toHaveLength(2);
        expect(wrapper.find('Text')).toHaveLength(3);
        expect(wrapper.find('Text').at(1).props().children).toEqual(strings.loginScreenStrings.EMPTY_USER_ID);
        expect(wrapper.find('Text').at(2).props().children).toEqual(strings.loginScreenStrings.EMPTY_PASSWORD);
    });

    test("submit login form with right credentials", async () => {
        usersStorage.userLogin.mockResolvedValue({
            "success": true,
            "message": "Token generated successfully !",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXJ2aWNlUHJvdmlkZXJJZCI6IjU0OTk2MzY1MiIsInVzZXJJZCI6IjU0OTk2MzY1MiIsImlhdCI6MTU1ODYyNjk3MSwiZXhwIjoxNTU4NjYyOTcxfQ.r4oH3N4qvGwRVAFMMRsH5Ls7hC1SQGDme7Gw_bipOc0"
        });
        usersStorage.userValidToken.mockResolvedValue({
            data: {
                payload: {
                    userId: "549963652",
                    userFullname: "Padget Creaser",
                }
            }
        });

        wrapper = shallow(<LoginScreen navigation={navigation}/>);
        componentInstance = wrapper.instance();
        const onSubmitPressSpy = jest.spyOn(componentInstance, 'onSubmitPress');

        await componentInstance.setState({userId: userIdTest, password: passwordTest});
        const validateSpy = jest.spyOn(componentInstance, 'validate');
        validateSpy.mockReturnValue([]);

        await wrapper.find('Button').at(0).simulate('click', {
            preventDefault() {
            }
        });

        expect(onSubmitPressSpy).toHaveBeenCalled();

        expect(componentInstance.state.err.length).toEqual(0);
        expect(componentInstance.state.err).toEqual([]);
        expect(wrapper.find('.errorText')).toHaveLength(0);
    });
});