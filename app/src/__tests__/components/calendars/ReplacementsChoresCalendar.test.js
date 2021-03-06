import React from 'react';
import Button from "../../../components/submitButton/Button";

import {Modal} from "react-native";
import {Text} from "react-native-elements";
import {Calendar} from 'react-native-calendars';

import {shallow} from "enzyme/build";
import ReplacementsChoresCalendar from "../../../components/calendars/choresCalendar/ReplacementsChoresCalendar";
import choresStorage from "../../../storage/choresStorage";
import phoneStorage from "react-native-simple-store";
import users from "../../jsons/users";

jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/choresStorage");
jest.mock("react-native-simple-store");


describe("ReplacementsChoresCalendar should", () => {
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
    const props = {
        choreTypeName:"" ,
        userChoreSelected:"" ,
        onClose: jest.fn(),
    };
    phoneStorage.get = jest.fn().mockImplementation((key) => Promise.resolve(mockStore[key]));
    phoneStorage.update = jest.fn().mockImplementation((key, value) => Promise.resolve(mockStore[key] = value));
    choresStorage.getUserChoresForUser = jest.fn().mockResolvedValue({status:200});
    choresStorage.getUserChoresForType = jest.fn().mockResolvedValue({status:200});
    choresStorage.getChoreTypeSetting = jest.fn().mockResolvedValue({status:200});
    choresStorage.getOtherWorkers = jest.fn().mockResolvedValue({status:200});
    choresStorage.generalReplacementRequest = jest.fn().mockResolvedValue({status:200});
    choresStorage.createSpecificReplacementRequest = jest.fn().mockResolvedValue({status:200});
    choresStorage.changeReplacementRequestStatus = jest.fn().mockResolvedValue({status:200});


    beforeEach(async () => {
        jest.clearAllMocks();
        wrapper = await shallow(<ReplacementsChoresCalendar  {...props} />);
        componentInstance = wrapper.instance();

        await wrapper.update();

    });
    //
    // it('match snapshot', async () => {
    //     wrapper = shallow(<AppointmentRequestInfo {...props} />);
    //     expect(wrapper).toMatchSnapshot();
    // });

    it("render what the user see", async () => {

        expect(wrapper.find(Modal)).toHaveLength(3);
        expect(wrapper.find(Calendar)).toHaveLength(1);
        expect(wrapper.find("Text")).toHaveLength(8);
        expect(wrapper.find(Button)).toHaveLength(5);

        expect(wrapper.find("Text").at(0).props().children).toEqual('חיפוש החלפה עבור תורנות: ');
        expect(wrapper.find("Text").at(2).props().children).toEqual('אין תורנויות לתאריך זה ');
        expect(wrapper.find("Text").at(3).props().children).toEqual('שליחת בקשת החלפה:');
        expect(wrapper.find("Text").at(5).props().children).toEqual('תאריך:');
        expect(wrapper.find("Text").at(6).props().children).toEqual('Invalid date');
        expect(wrapper.find("Text").at(7).props().children).toEqual('');

        expect(wrapper.find('Button').at(0).props().label).toEqual('סגור');
        expect(wrapper.find('Button').at(1).props().label).toEqual('חזור');
        expect(wrapper.find('Button').at(2).props().label).toEqual('חזור');
        expect(wrapper.find('Button').at(3).props().label).toEqual('בקש החלפה');
        expect(wrapper.find('Button').at(4).props().label).toEqual('סגור');

    });

    it("mounted with the right data", async () => {

        expect(componentInstance.state.markedDates).toEqual({});
        expect(componentInstance.state.workers).toEqual("");
    });


});