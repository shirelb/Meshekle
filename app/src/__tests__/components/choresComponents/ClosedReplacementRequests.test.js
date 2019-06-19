import React from 'react';
import Button from "../../../components/submitButton/Button";

import {Modal} from "react-native";
import {Text} from "react-native-elements";
import {shallow} from "enzyme/build";
import ClosedReplacementRequests from "../../../components/choresComponents/ClosedReplacementRequests";
import choresStorage from "../../../storage/choresStorage";
import phoneStorage from "react-native-simple-store";
import swapRequests from "../../jsons/swapRequests";



jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/choresStorage");
jest.mock("react-native-simple-store");


describe("ClosedReplacementRequests should", () => {
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

    beforeEach(async () => {
        jest.clearAllMocks();
        wrapper = await shallow(<ClosedReplacementRequests {...props} />);
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
        expect(wrapper.find(Button)).toHaveLength(3);
        expect(wrapper.find("Text")).toHaveLength(11);
        expect(wrapper.find("Text").at(0).props().children).toEqual('בקשות שהוחלפו:');
        expect(wrapper.find("Text").at(1).props().children).toEqual('בקשות נכנסות:');
        expect(wrapper.find("Text").at(2).props().children).toEqual('אין בקשות נכנסות');
        expect(wrapper.find("Text").at(3).props().children).toEqual('בקשות יוצאות:');
        expect(wrapper.find("Text").at(4).props().children).toEqual('אין בקשות יוצאות');
        expect(wrapper.find("Text").at(5).props().children).toEqual('בקשות שנדחו:');
        expect(wrapper.find("Text").at(6).props().children).toEqual('בקשות נכנסות:');
        expect(wrapper.find("Text").at(7).props().children).toEqual('אין בקשות נכנסות');
        expect(wrapper.find("Text").at(8).props().children).toEqual('בקשות יוצאות:');
        expect(wrapper.find("Text").at(9).props().children).toEqual('אין בקשות יוצאות');
        expect(wrapper.find("Text").at(10).props().children).toEqual('');

        expect(wrapper.find('Button').at(0).props().label).toEqual('סגור');
        expect(wrapper.find('Button').at(1).props().label).toEqual('חזור');
        expect(wrapper.find('Button').at(2).props().label).toEqual('סגור');
    });

    it("mounted with the right data", async () => {

        expect(componentInstance.state.replacedIn).toEqual([]);
        expect(componentInstance.state.requestsTypesReplaced).toEqual([]);
        expect(componentInstance.state.replacedOut).toEqual([]);
        expect(componentInstance.state.denyIn).toEqual([]);
        expect(componentInstance.state.requestsTypesDeny).toEqual([]);
        expect(componentInstance.state.denyOut).toEqual([]);
        expect(componentInstance.props.choreTypeName).toEqual("");
    });


});