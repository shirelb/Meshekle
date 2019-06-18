import React from 'react';
import Button from "../../../components/submitButton/Button";

import {Modal} from "react-native";
import {CheckBox, FormInput, FormLabel, FormValidationMessage, Text} from "react-native-elements";
import {List} from "react-native-paper";
import {FlatList} from "react-native"
import {Calendar} from 'react-native-calendars';

import {shallow} from "enzyme/build";
import ChoresCalendar from "../../../components/calendars/choresCalendar/ChoresCalendar";
import ReplacementsChoresCalendar from "../../../components/calendars/choresCalendar/ReplacementsChoresCalendar";
import usersStorage from "../../../storage/usersStorage";
import choresStorage from "../../../storage/choresStorage";
import phoneStorage from "react-native-simple-store";
import users from "../../jsons/users";
import serviceProvidersStorage from "../../../storage/serviceProvidersStorage";
import serviceProviders from "../../jsons/serviceProviders";
import chores from "../../jsons/chores";
import swapRequests from "../../jsons/swapRequests";


import mappers from "../../../shared/mappers";

jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/choresStorage");
jest.mock("react-native-simple-store");


describe("ChoresCalendar should", () => {
    let wrapper = null;
    let componentInstance = null;
    const userTest = users[2];
    const userIdTest = "972350803";
    const userFullnameTest = "Dion Revance";

    const mockStore = {
        userData: {
            serviceProviderId: "549963652",
            userId: "549963652",
            token: "some token"
        }
    };
    const navigation = {navigate: jest.fn(), dispatch: jest.fn()};

    phoneStorage.get = jest.fn().mockImplementation((key) => Promise.resolve(mockStore[key]));
    phoneStorage.update = jest.fn().mockImplementation((key, value) => Promise.resolve(mockStore[key] = value));
    choresStorage.getUserChoresForUser = jest.fn().mockResolvedValue({status:200});
    choresStorage.getChoreTypeSetting = jest.fn().mockResolvedValue({status:200});
    choresStorage.getOtherWorkers = jest.fn().mockResolvedValue({status:200});
    choresStorage.generalReplacementRequest = jest.fn().mockResolvedValue({status:200});


    beforeEach(async () => {
        jest.clearAllMocks();
        wrapper = await shallow(<ChoresCalendar/>);
        componentInstance = wrapper.instance();

        await wrapper.update();

    });
    //
    // it('match snapshot', async () => {
    //     wrapper = shallow(<AppointmentRequestInfo {...props} />);
    //     expect(wrapper).toMatchSnapshot();
    // });

    it("render what the user see", async () => {

        expect(wrapper.find(Modal)).toHaveLength(6);
        expect(wrapper.find(Calendar)).toHaveLength(1);
        expect(wrapper.find(ReplacementsChoresCalendar)).toHaveLength(1);
        expect(wrapper.find("Text")).toHaveLength(11);

        expect(wrapper.find("Text").at(0).props().children).toEqual('XXXXX');
        expect(wrapper.find("Text").at(2).props().children).toEqual('אין לך תורנויות לתאריך זה ');
        expect(wrapper.find("Text").at(3).props().children).toEqual('פרטי תורנות');
        expect(wrapper.find("Text").at(6).props().children).toEqual('תורנים:');
        expect(wrapper.find("Text").at(7).props().children).toEqual('');
        expect(wrapper.find("Text").at(8).props().children).toEqual('שעות פעילות:');
        expect(wrapper.find("Text").at(9).props().children).toEqual('-');
        expect(wrapper.find("Text").at(10).props().children).toEqual('');

        expect(wrapper.find('Button').at(0).props().label).toEqual('בקשות החלפה');
        expect(wrapper.find('Button').at(1).props().label).toEqual('בקשות סגורות');
        expect(wrapper.find('Button').at(2).props().label).toEqual('חזור');
        expect(wrapper.find('Button').at(3).props().label).toEqual('חזור');
        expect(wrapper.find('Button').at(4).props().label).toEqual('סמן אותי');

    });

    it("mounted with the right data", async () => {

        expect(componentInstance.state.markedDates).toEqual({});
        expect(componentInstance.state.workers).toEqual("");
    });


});