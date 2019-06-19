import React from 'react';
import Button from "../../components/submitButton/Button";

import {shallow} from "enzyme/build";

import AppointmentsScreen from "../../screens/appointmentsScreen/AppointmentsScreen";
import usersStorage from "../../storage/usersStorage";
import phoneStorage from "react-native-simple-store";
import users from "../jsons/users";

jest.mock("../../storage/serviceProvidersStorage");
jest.mock("../../storage/usersStorage");
jest.mock("react-native-simple-store");


describe("AppointmentsScreen should", () => {
    let wrapper = null;
    let componentInstance = null;
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

    it('match snapshot', async () => {
        wrapper = shallow(<AppointmentsScreen/>);
        expect(wrapper).toMatchSnapshot();
    });

    it("render what the user see", async () => {
        wrapper = shallow(<AppointmentsScreen/>);
        componentInstance = wrapper.instance();

        expect(wrapper.find('Button')).toHaveLength(2);
        expect(wrapper.find('Button').at(0).props().label).toEqual('בקשות התורים שלי');
        expect(wrapper.find('Button').at(1).props().label).toEqual('בקש תור חדש');
        expect(wrapper.find('AppointmentsCalendar')).toHaveLength(1);
    });

    it("handle on Appointment Request Press", async () => {
        wrapper = shallow(<AppointmentsScreen navigation={navigation}/>);
        componentInstance = wrapper.instance();

        await wrapper.find('Button').at(0).props().onPress();
        expect(componentInstance.props.navigation.navigate).toHaveBeenCalled();
    });

    it("handle on My Appointment Requests Press", async () => {
        wrapper = shallow(<AppointmentsScreen navigation={navigation}/>);
        componentInstance = wrapper.instance();

        await wrapper.find('Button').at(1).props().onPress();
        expect(componentInstance.props.navigation.navigate).toHaveBeenCalled();
    });
});