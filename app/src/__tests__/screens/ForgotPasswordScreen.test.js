import React from 'react';

import moment from 'moment';

import {ScrollView, TextInput} from "react-native";
import Button from "../../components/submitButton/Button";
import {FormLabel, FormValidationMessage, Text} from "react-native-elements";

import {shallow} from "enzyme/build";

import ForgotPasswordScreen from "../../screens/forgotPasswordScreen/ForgotPasswordScreen";
import usersStorage from "../../storage/usersStorage";
import phoneStorage from "react-native-simple-store";
import users from "../jsons/users";

jest.mock("../../storage/serviceProvidersStorage");
jest.mock("../../storage/usersStorage");
jest.mock("react-native-simple-store");


describe("ForgotPasswordScreen should", () => {
    let wrapper = null;
    let componentInstance = null;
    const props = {};
    const userTest = users[2];
    const userIdTest = "972350803";
    const userFullnameTest = "Dion Revance";

    const mockStore = {
        userData: {
            token: "some token",
            userId: userIdTest,
            userFullname: userFullnameTest,
        }
    };

    const navigation = {navigate: jest.fn()};
    usersStorage.getUsers = jest.fn().mockResolvedValue(users);
    phoneStorage.get = jest.fn().mockImplementation((key) => Promise.resolve(mockStore[key]));
    phoneStorage.update = jest.fn().mockImplementation((key, value) => Promise.resolve(mockStore[key] = value));

    beforeEach(() => {
        jest.clearAllMocks();
    });

    xit('match snapshot', async () => {
        wrapper = shallow(<ForgotPasswordScreen/>);
        expect(wrapper).toMatchSnapshot();
    });

    it("render what the user see", async () => {
        wrapper = shallow(<ForgotPasswordScreen/>);
        componentInstance = wrapper.instance();

        expect(wrapper.find(ScrollView)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(Text).props().children).toEqual("שכחתי סיסמא");
        expect(wrapper.find('FormLabel')).toHaveLength(6);
        expect(wrapper.find('FormLabel').at(0).props().children).toEqual('*ת.ז.');
        expect(wrapper.find('FormLabel').at(1).props().children).toEqual('*אימייל');
        expect(wrapper.find('FormLabel').at(2).props().children).toEqual(' תיבת דואר');
        expect(wrapper.find('FormLabel').at(3).props().children).toEqual('פלאפון');
        expect(wrapper.find('FormLabel').at(4).props().children).toEqual(' טלפון');
        expect(wrapper.find('FormLabel').at(5).props().children).toEqual(' תאריך לידה');
        expect(wrapper.find('TextInput')).toHaveLength(6);
        expect(wrapper.find('TextInput').at(0).props().value).toBeUndefined();
        expect(wrapper.find('TextInput').at(1).props().value).toBeUndefined();
        expect(wrapper.find('TextInput').at(2).props().value).toEqual('');
        expect(wrapper.find('TextInput').at(3).props().value).toBeUndefined();
        expect(wrapper.find('TextInput').at(4).props().value).toBeUndefined();
        expect(wrapper.find('TextInput').at(5).props().value).toEqual('');
        expect(wrapper.find('Button')).toHaveLength(2);
        expect(wrapper.find('Button').at(0).props().label).toEqual('שחזר סיסמא');
        expect(wrapper.find('Button').at(1).props().label).toEqual('חזור');

        expect(componentInstance.state.user).toEqual({});
        expect(componentInstance.state.errorMsg).toEqual('');
        expect(componentInstance.state.errorVisible).toEqual(false);
    });

    it("handle change of userId", async () => {
        wrapper = shallow(<ForgotPasswordScreen/>);
        componentInstance = wrapper.instance();

        await wrapper.find('TextInput').at(0).props().onChangeText(userIdTest);
        expect(componentInstance.state.user.userId).toEqual(userIdTest);
    });

    it("handle change of email", async () => {
        wrapper = shallow(<ForgotPasswordScreen/>);
        componentInstance = wrapper.instance();

        await wrapper.find('TextInput').at(1).props().onChangeText(userTest.email);
        expect(componentInstance.state.user.email).toEqual(userTest.email);
    });

    it("validate form of forgot password", async () => {
        wrapper = shallow(<ForgotPasswordScreen/>);
        componentInstance = wrapper.instance();

        componentInstance.setState({
            user: {
                "userId": "972350d803",
            }
        });
        let validateFormResponse = componentInstance.validateForm();
        expect(validateFormResponse).toEqual(false);
        expect(componentInstance.state.errorMsg).toEqual("ת.ז. חסר וצריך להכיל רק ספרות");
        expect(componentInstance.state.errorVisible).toEqual(true);

        componentInstance.setState({
            user: {
                "userId": userIdTest,
                "email": "972350d803",
            }
        });
        validateFormResponse = componentInstance.validateForm();
        expect(validateFormResponse).toEqual(false);
        expect(componentInstance.state.errorMsg).toEqual("אימייל חסר או לא וואלידי");
        expect(componentInstance.state.errorVisible).toEqual(true);

        componentInstance.setState({
            user: {
                "userId": userIdTest,
                email: userTest.email,
                "mailbox": "972350d803",
            }
        });
        validateFormResponse = componentInstance.validateForm();
        expect(validateFormResponse).toEqual(false);
        expect(componentInstance.state.errorMsg).toEqual("תיבת דואר חסרה וצריכה להכיל רק ספרות");
        expect(componentInstance.state.errorVisible).toEqual(true);

        componentInstance.setState({
            user: {
                "userId": userIdTest,
                email: userTest.email,
                mailbox: userTest.mailbox,
            }
        });
        validateFormResponse = componentInstance.validateForm();
        expect(validateFormResponse).toEqual(false);
        expect(componentInstance.state.errorMsg).toEqual("עלייך למלא פלאפון או טלפון");
        expect(componentInstance.state.errorVisible).toEqual(true);

        componentInstance.setState({
            user: {
                "userId": userIdTest,
                email: userTest.email,
                mailbox: userTest.mailbox,
                "phone": "dddddd",
            }
        });
        validateFormResponse = componentInstance.validateForm();
        expect(validateFormResponse).toEqual(false);
        expect(componentInstance.state.errorMsg).toEqual("הטלפון לא וואלידי");
        expect(componentInstance.state.errorVisible).toEqual(true);

        componentInstance.setState({
            user: {
                "userId": userIdTest,
                email: userTest.email,
                mailbox: userTest.mailbox,
                phone: userTest.phone,
                "bornDate": null,
            }
        });
        validateFormResponse = componentInstance.validateForm();
        expect(validateFormResponse).toEqual(false);
        expect(componentInstance.state.errorMsg).toEqual("תאריך הלידה חסר");
        expect(componentInstance.state.errorVisible).toEqual(true);

        componentInstance.setState({
            errorMsg: "",
            errorVisible: false,
            user: {
                "userId": "972350803",
                "email": "drevance2@google.fr",
                "mailbox": 3,
                "cellphone": "0538274431",
                "phone": "041748647",
                "bornDate": moment("1966-07-30T10:19:42.000Z"),
            }
        });
        validateFormResponse = componentInstance.validateForm();
        expect(validateFormResponse).toEqual(true);
        expect(componentInstance.state.errorMsg).toEqual("");
        expect(componentInstance.state.errorVisible).toEqual(false);

    });

    it("submit forgot password form with wrong data", async () => {
        wrapper = shallow(<ForgotPasswordScreen/>);
        componentInstance = wrapper.instance();
        const handleForgetPasswordSpy = jest.spyOn(componentInstance, 'handleForgetPassword');

        await componentInstance.setState({user: {userId: "7j"}});
        await wrapper.find('Button').at(0).props().onPress();

        expect(handleForgetPasswordSpy).toHaveBeenCalled();
        expect(componentInstance.state.errorMsg).toEqual("ת.ז. חסר וצריך להכיל רק ספרות");
        expect(componentInstance.state.errorVisible).toEqual(true);
        expect(wrapper.find('FormValidationMessage')).toHaveLength(1);
        expect(wrapper.find('FormValidationMessage').props().children).toEqual("שגיאה בעת מילוי טופס:\n" +
            "ת.ז. חסר וצריך להכיל רק ספרות");
    });

    it("submit forgot password form with right data", async () => {
        usersStorage.forgetPassword = jest.fn().mockResolvedValue('response of usersStorage forgot password');

        wrapper = shallow(<ForgotPasswordScreen navigation={navigation}/>);
        componentInstance = wrapper.instance();
        const handleForgetPasswordSpy = jest.spyOn(componentInstance, 'handleForgetPassword');

        await componentInstance.setState({user: userTest});
        // const validateFormSpy = jest.spyOn(componentInstance, 'validateForm');
        // validateFormSpy.mockReturnValue(true);

        await wrapper.find(Button).at(0).props().onPress();

        expect(handleForgetPasswordSpy).toHaveBeenCalled();

        expect(wrapper.find(FormValidationMessage)).toHaveLength(0);
        expect(componentInstance.state.errorMsg).toEqual('');
        expect(componentInstance.state.errorVisible).toEqual(false);
    });
});