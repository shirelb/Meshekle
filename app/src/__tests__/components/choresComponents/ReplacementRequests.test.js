import React from 'react';
import Button from "../../../components/submitButton/Button";

import {Modal} from "react-native";
import {Text} from "react-native-elements";
import {shallow} from "enzyme/build";
import ReplacementRequests from "../../../components/choresComponents/ReplacementRequests";
import choresStorage from "../../../storage/choresStorage";
import phoneStorage from "react-native-simple-store";
import swapRequests from "../../jsons/swapRequests";

jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/choresStorage");
jest.mock("react-native-simple-store");


describe("ReplacementRequests should", () => {
    let wrapper = null;
    let componentInstance = null;

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

        expect(wrapper.find(Modal)).toHaveLength(2);
        expect(wrapper.find(Button)).toHaveLength(2);
        expect(wrapper.find("Text")).toHaveLength(5);
        expect(wrapper.find("Text").at(0).props().children).toEqual('בקשות נכנסות:');
        expect(wrapper.find("Text").at(1).props().children).toEqual('אין בקשות נכנסות');
        expect(wrapper.find("Text").at(2).props().children).toEqual('בקשות יוצאות:');
        expect(wrapper.find("Text").at(3).props().children).toEqual('אין בקשות יוצאות');
        expect(wrapper.find("Text").at(4).props().children).toEqual('');

        expect(wrapper.find('Button').at(0).props().label).toEqual('סגור');
        expect(wrapper.find('Button').at(1).props().label).toEqual('סגור');
    });

    it("mounted with the right data", async () => {

        expect(componentInstance.state.inRequests).toEqual([]);
        expect(componentInstance.state.requestsTypes).toEqual([]);
        expect(componentInstance.state.outRequests).toEqual([]);
        expect(componentInstance.props.choreTypeName).toEqual("");
    });


});