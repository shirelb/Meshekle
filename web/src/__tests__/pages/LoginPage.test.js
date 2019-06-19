import React from 'react';


import {Redirect} from 'react-router-dom';
import {mount, shallow} from "enzyme/build";
import PageNotFound from "../../pages/pageNotFound404/PageNotFound";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import LoginPage from "../../pages/loginPage/LoginPage";
import isLoggedIn from "../../shared/isLoggedIn";
import strings from "../../shared/strings";
import {setupComponent} from "../testHelpers";

jest.mock("../../shared/isLoggedIn");
jest.mock("../../storage/serviceProvidersStorage");


describe("LoginPage should", () => {
    let wrapper = null;
    let componentInstance = null;
    const props = {
        location: {
            pathname: '/login'
        },
        match: {
            isExact: true,
            path: '/login',
            url: '/login',
        }
    };
    const userIdTest = "549963652";
    const passwordTest = "Qw345678";

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test("renders Login when user is NOT authenticated", async () => {
        isLoggedIn.mockResolvedValue(false);
        const arrResponse = await setupComponent('shallow', LoginPage, null, props, "/login");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();

        expect(wrapper.find(LoginPage)).toHaveLength(1);
        expect(wrapper.find(Redirect)).toHaveLength(0);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("renders Redirect when user is authenticated", async () => {
        isLoggedIn.mockResolvedValue(true);
        const arrResponse = await setupComponent('mount', LoginPage, null, props, "/login");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];
        // await setupLoginPage(true, 'mount');

        expect(wrapper.find(Redirect)).toHaveLength(1);
        expect(wrapper.find('Router').prop('history').location.pathname).toEqual('/home')
    });

    test("render a page with header and form with two fields and a send button", async () => {
        isLoggedIn.mockResolvedValue(false);
        const arrResponse = await setupComponent('shallow', LoginPage, null, props, "/login");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];
        const shallowWrapper = wrapper.find('LoginPage').dive();

        expect(shallowWrapper.find('Form')).toHaveLength(1);
        expect(shallowWrapper.find('Header')).toHaveLength(1);
        expect(shallowWrapper.find('Header').dive().text()).toEqual(strings.loginPageStrings.LOGIN);
        expect(shallowWrapper.find('FormInput')).toHaveLength(2);
        expect(shallowWrapper.find('FormInput').first().props().name).toEqual('userId');
        expect(shallowWrapper.find('FormInput').first().props().label).toEqual(strings.loginPageStrings.USER_ID_PLACEHOLDER);
        expect(shallowWrapper.find('FormInput').get(1).props.name).toEqual('password');
        expect(shallowWrapper.find('FormInput').get(1).props.label).toEqual(strings.loginPageStrings.PASSWORD_PLACEHOLDER);
        expect(shallowWrapper.find('FormButton')).toHaveLength(1);
        expect(shallowWrapper.find('FormButton').props().children).toEqual(strings.loginPageStrings.SUBMIT);
        expect(shallowWrapper.find('FormButton').props().type).toEqual('submit');

        expect(componentInstance.state.err.length).toEqual(0);
        expect(componentInstance.state.err).toEqual([]);
        expect(componentInstance.state.error).toBeFalsy();
        expect(shallowWrapper.find('Message')).toHaveLength(0);
    });

    test("handle change of userId", async () => {
        const handleChangeSpy = jest.spyOn(LoginPage.prototype, 'handleChange');

        isLoggedIn.mockResolvedValue(false);
        const arrResponse = await setupComponent('shallow', LoginPage, null, props, "/login");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.userId).toEqual('');

        const userIdInput = wrapper.find('LoginPage').dive().find('FormInput').first();
        await userIdInput.simulate('change', {
            target: {
                name: 'userId',
                value: userIdTest
            }
        });
        expect(handleChangeSpy).toHaveBeenCalled();
        expect(handleChangeSpy.mock.instances[0].state.userId).toEqual(userIdTest);
    });

    test("handle change of password", async () => {
        const handleChangeSpy = jest.spyOn(LoginPage.prototype, 'handleChange');

        isLoggedIn.mockResolvedValue(false);
        const arrResponse = await setupComponent('shallow', LoginPage, null, props, "/login");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.password).toEqual('');

        const passwordInput = wrapper.find('LoginPage').dive().find('FormInput').at(1);
        await passwordInput.simulate('change', {
            target: {
                name: 'password',
                value: passwordTest
            }
        });
        expect(handleChangeSpy).toHaveBeenCalled();
        expect(handleChangeSpy.mock.instances[0].state.password).toEqual(passwordTest);
    });

    test("validate userId and password", async () => {
        isLoggedIn.mockResolvedValue(false);
        const arrResponse = await setupComponent('shallow', LoginPage, null, props, "/login");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        let validateResponse = componentInstance.validate("", passwordTest);
        expect(validateResponse.length).toEqual(1);
        expect(validateResponse[0]).toEqual(strings.loginPageStrings.EMPTY_USER_ID);

        validateResponse = componentInstance.validate("11111111111111111", passwordTest);
        expect(validateResponse.length).toEqual(1);
        expect(validateResponse[0]).toEqual(strings.loginPageStrings.WRONG_CREDENTIALS);

        validateResponse = componentInstance.validate("user223", passwordTest);
        expect(validateResponse.length).toEqual(1);
        expect(validateResponse[0]).toEqual(strings.loginPageStrings.WRONG_CREDENTIALS);

        validateResponse = componentInstance.validate(userIdTest, "");
        expect(validateResponse.length).toEqual(1);
        expect(validateResponse[0]).toEqual(strings.loginPageStrings.EMPTY_PASSWORD);

        validateResponse = componentInstance.validate(userIdTest, "5");
        expect(validateResponse.length).toEqual(1);
        expect(validateResponse[0]).toEqual(strings.loginPageStrings.WRONG_CREDENTIALS);

        validateResponse = componentInstance.validate(userIdTest, "55555555555555555555555555");
        expect(validateResponse.length).toEqual(1);
        expect(validateResponse[0]).toEqual(strings.loginPageStrings.WRONG_CREDENTIALS);

        validateResponse = componentInstance.validate(userIdTest, "סיסמא");
        expect(validateResponse.length).toEqual(1);
        expect(validateResponse[0]).toEqual(strings.loginPageStrings.WRONG_CREDENTIALS);

        validateResponse = componentInstance.validate("", "סיסמא");
        expect(validateResponse.length).toEqual(2);
        expect(validateResponse[0]).toEqual(strings.loginPageStrings.EMPTY_USER_ID);
        expect(validateResponse[1]).toEqual(strings.loginPageStrings.WRONG_CREDENTIALS);

        validateResponse = componentInstance.validate(userIdTest, passwordTest);
        expect(validateResponse.length).toEqual(0);
    });

    test("submit login form with wrong credentials", async () => {
        const onSubmitSpy = jest.spyOn(LoginPage.prototype, 'onSubmit');

        isLoggedIn.mockResolvedValue(false);
        const arrResponse = await setupComponent('mount', LoginPage, null, props, "/login");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.setState({userId: "", password: ""});
        const validateSpy = jest.spyOn(componentInstance, 'validate');
        validateSpy.mockReturnValue([strings.loginPageStrings.EMPTY_USER_ID, strings.loginPageStrings.EMPTY_PASSWORD]);

        const loginForm = wrapper.find('LoginPage').find('Form');
        await loginForm.simulate('submit', {
            preventDefault() {
            }
        });

        expect(onSubmitSpy).toHaveBeenCalled();
        expect(componentInstance.state.error).toBeTruthy();
        expect(componentInstance.state.err).toHaveLength(2);
        expect(wrapper.find('LoginPage').find('Message')).toHaveLength(1);
        expect(wrapper.find('LoginPage').find('Message').props().content).toEqual(strings.loginPageStrings.WRONG_CREDENTIALS);
    });

    test("submit login form with right credentials", async () => {
        const onSubmitSpy = jest.spyOn(LoginPage.prototype, 'onSubmit');
        serviceProvidersStorage.serviceProviderLogin.mockResolvedValue({
            "success": true,
            "message": "Token generated successfully !",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXJ2aWNlUHJvdmlkZXJJZCI6IjU0OTk2MzY1MiIsInVzZXJJZCI6IjU0OTk2MzY1MiIsImlhdCI6MTU1ODYyNjk3MSwiZXhwIjoxNTU4NjYyOTcxfQ.r4oH3N4qvGwRVAFMMRsH5Ls7hC1SQGDme7Gw_bipOc0"
        });

        isLoggedIn.mockResolvedValue(false);
        const arrResponse = await setupComponent('mount', LoginPage, null, props, "/login");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.setState({userId: userIdTest, password: passwordTest});
        const validateSpy = jest.spyOn(componentInstance, 'validate');
        validateSpy.mockReturnValue([]);

        const loginForm = wrapper.find('LoginPage').find('Form');
        await loginForm.simulate('submit', {
            preventDefault() {
            }
        });

        expect(onSubmitSpy).toHaveBeenCalled();

        expect(componentInstance.state.err.length).toEqual(0);
        expect(componentInstance.state.err).toEqual([]);
        expect(componentInstance.state.error).toBeFalsy();
        expect(wrapper.find('LoginPage').find('Message')).toHaveLength(0);
    });
});
