import React from 'react';

import {Modal} from "react-native";
import {CheckBox, FormInput, FormLabel, FormValidationMessage, Text} from "react-native-elements";
import {List} from "react-native-paper";
import {shallow} from "enzyme/build";
import AppointmentRequestInfo from "../../../components/appointmentRequest/AppointmentRequestInfo";
import usersStorage from "../../../storage/usersStorage";
import phoneStorage from "react-native-simple-store";
import users from "../../jsons/users";
import serviceProvidersStorage from "../../../storage/serviceProvidersStorage";
import serviceProviders from "../../jsons/serviceProviders";
import appointmentsStorage from "../../../storage/appointmentsStorage";
import user013637605AppointmentRequests from "../../jsons/user013637605AppointmentRequests";
import mappers from "../../../shared/mappers";

jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/usersStorage");
jest.mock("react-native-simple-store");


describe("AppointmentRequestInfo should", () => {
    let wrapper = null;
    let componentInstance = null;
    const userTest = users[2];
    const appointmentRequestTest = user013637605AppointmentRequests[0];
    const userIdTest = "972350803";
    const userFullnameTest = "Dion Revance";
    const props = {
        modalVisible: true,
        appointmentRequest: appointmentRequestTest,
        cancelAppointmentRequest: jest.fn(),
        closeAppointmentRequestInfo: jest.fn(),
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
    usersStorage.getUsers = jest.fn().mockImplementation(() => Promise.resolve(users));
    usersStorage.getUserByUserID = jest.fn().mockImplementation((userId) => Promise.resolve(users.filter(user => user.userId === userId)[0]));
    serviceProvidersStorage.getServiceProviders = jest.fn().mockResolvedValue(serviceProviders);
    serviceProvidersStorage.getServiceProviderUserDetails = jest.fn().mockImplementation((serviceProviderId) => Promise.resolve({data: users.filter(user => user.userId === serviceProviderId)[0]}));
    serviceProvidersStorage.getServiceProviderById = jest.fn().mockImplementation((serviceProviderId) => Promise.resolve(serviceProviders.filter(provider =>
        provider.serviceProviderId === serviceProviderId)));
    appointmentsStorage.getUserAppointmentRequests = jest.fn().mockImplementation(() => Promise.resolve(user013637605AppointmentRequests));
    appointmentsStorage.postUserAppointmentRequest = jest.fn().mockImplementation(() => Promise.resolve());

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('match snapshot', async () => {
        wrapper = shallow(<AppointmentRequestInfo {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("render what the user see", async () => {
        wrapper = await shallow(<AppointmentRequestInfo {...props} />);
        componentInstance = wrapper.instance();

        await wrapper.update();

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
        expect(componentInstance.state.modalVisible).toEqual(true);
        expect(componentInstance.props.appointmentRequest).toEqual(appointmentRequestTest);
    });

    it("handle setModalVisible", async () => {
        wrapper = shallow(<AppointmentRequestInfo {...props} />);
        componentInstance = wrapper.instance();

        expect(componentInstance.state.modalVisible).toEqual(true);

        await componentInstance.setModalVisible(false);
        expect(componentInstance.state.modalVisible).toEqual(false);
    });

});