import React from 'react';

import {Modal} from "react-native";
import {CheckBox, FormInput, FormLabel, FormValidationMessage, Text} from "react-native-elements";
import {List} from "react-native-paper";
import {shallow} from "enzyme/build";
import ReplacementRequests from "../../../components/choresComponents/ReplacementRequests";
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


describe("ReplacementRequests should", () => {
    let wrapper = null;
    let componentInstance = null;
    const userTest = users[2];
    const userIdTest = "972350803";
    const userFullnameTest = "Dion Revance";
    const props = {
        choreTypeName:"" ,
        onClose: jest.fn(),
    };
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
    choresStorage.getReplacementRequests = jest.fn().mockResolvedValue(swapRequests);
    choresStorage.changeReplacementRequestStatus = jest.fn().mockResolvedValue({status:200});
    choresStorage.replaceUserChores =  jest.fn().mockResolvedValue({status:200});
    choresStorage.generalReplacementRequest =jest.fn().mockResolvedValue({status:200});

    beforeEach(async () => {
        jest.clearAllMocks();
        wrapper = await shallow(<ReplacementRequests {...props} />);
        componentInstance = wrapper.instance();

        await wrapper.update();

    });
    //
    // it('match snapshot', async () => {
    //     wrapper = shallow(<AppointmentRequestInfo {...props} />);
    //     expect(wrapper).toMatchSnapshot();
    // });

    it("render what the user see", async () => {

        expect(wrapper.find(Modal)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(6);
        expect(wrapper.find(Text).at(0).props().children).toEqual('בקשת תור');
        expect(wrapper.find(Text).at(1).props().children).toEqual(appointmentRequestTest.serviceProviderFullname);
        expect(wrapper.find(Text).at(2).props().children).toEqual(mappers.serviceProviderRolesMapper(appointmentRequestTest.AppointmentDetail.role));
        expect(wrapper.find(Text).at(3).props().children).toEqual(mappers.appointmentRequestStatusMapper(appointmentRequestTest.status));
        expect(wrapper.find(Text).at(4).props().children).toEqual(JSON.parse(appointmentRequestTest.AppointmentDetail.subject).join(", "));
        expect(wrapper.find(Text).at(5).props().children).toEqual(appointmentRequestTest.notes);
        expect(wrapper.find('FormLabel')).toHaveLength(6);
        expect(wrapper.find('FormLabel').at(0).props().children).toEqual('נותן שירות');
        expect(wrapper.find('FormLabel').at(1).props().children).toEqual(" ענף");
        expect(wrapper.find('FormLabel').at(2).props().children).toEqual(" סטאטוס");
        expect(wrapper.find('FormLabel').at(3).props().children).toEqual("נושא");
        expect(wrapper.find('FormLabel').at(4).props().children).toEqual(' תאריכים ושעות אופציונאליים');
        expect(wrapper.find('FormLabel').at(5).props().children).toEqual('הערות');
        expect(wrapper.find(List.Section)).toHaveLength(1);
        expect(wrapper.find(List.Accordion)).toHaveLength(2);
        expect(wrapper.find(List.Item)).toHaveLength(4);
        expect(wrapper.find('Button')).toHaveLength(2);
        expect(wrapper.find('Button').at(0).props().label).toEqual('מחק');
        expect(wrapper.find('Button').at(1).props().label).toEqual('חזור');
    });

    it("mounted with the right data", async () => {

        expect(componentInstance.state.inRequests).toEqual([]);
        expect(componentInstance.state.requestsTypes).toEqual([]);
        expect(componentInstance.state.outRequests).toEqual([]);
        expect(componentInstance.props.choreTypeName).toEqual("");
    });


});