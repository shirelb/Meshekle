import React from 'react';

import {FlatList} from 'react-native';
import {List} from "react-native-paper";

import {shallow} from "enzyme/build";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import usersStorage from "../../storage/usersStorage";
import user013637605AppointmentRequests from "../jsons/user013637605AppointmentRequests";
import users from "../jsons/users";
import serviceProviders from "../jsons/serviceProviders";
import UserAppointmentRequests from "../../screens/userAppointmentRequests/UserAppointmentRequests";
import phoneStorage from "react-native-simple-store";
import appointmentsStorage from "../../storage/appointmentsStorage";


jest.mock("react-native-simple-store");
jest.mock("../../storage/usersStorage");
jest.mock("../../storage/serviceProvidersStorage");
jest.mock("../../storage/appointmentsStorage");


describe("UserAppointmentRequests should", () => {
    let wrapper = null;
    let componentInstance = null;
    const props = {};
    const userTest = users[698];
    const mockStore = {
        userData: {
            userId: "549963652",
            token: "some token"
        }
    };

    phoneStorage.get = jest.fn().mockImplementation((key) => Promise.resolve(mockStore[key]));
    usersStorage.getUsers = jest.fn().mockImplementation(() => Promise.resolve(users));
    usersStorage.getUserByUserID = jest.fn().mockImplementation((userId) => Promise.resolve(users.filter(user => user.userId === userId)[0]));
    serviceProvidersStorage.getServiceProviders = jest.fn().mockResolvedValue(serviceProviders);
    serviceProvidersStorage.getServiceProviderUserDetails = jest.fn().mockImplementation((serviceProviderId) => Promise.resolve(
        {data: users.filter(user => user.userId === serviceProviderId)[0]}));
    serviceProvidersStorage.getServiceProviderById = jest.fn().mockImplementation((serviceProviderId) => Promise.resolve(serviceProviders.filter(provider =>
        provider.serviceProviderId === serviceProviderId)));
    appointmentsStorage.getUserAppointmentRequests = jest.fn().mockResolvedValue({data: user013637605AppointmentRequests});
    appointmentsStorage.cancelAppointmentRequestById = jest.fn().mockResolvedValue();

    let userRequestsTest = user013637605AppointmentRequests;
    userRequestsTest[0].serviceProviderFullname = "Tara";
    userRequestsTest[1].serviceProviderFullname = "Gil";

    beforeAll(async (done) => {
        wrapper = await shallow(<UserAppointmentRequests/>);
        componentInstance = wrapper.instance();

        await wrapper.update();
        done();
    });

    afterAll(() => {
    });

    beforeEach(async (done) => {
        jest.clearAllMocks();
        await componentInstance.setState({userAppointmentRequests: userRequestsTest});
        await wrapper.update();
        done();
    });

    afterEach( async (done) => {
        await componentInstance.setState({userAppointmentRequests: userRequestsTest});
        await wrapper.update();
        done();
    });

    it('match snapshot', async () => {
        expect(wrapper).toMatchSnapshot();
    });

    it("mounted with the right data", () => {

        expect(componentInstance.state.userAppointmentRequests.length).toEqual(2);
        expect(componentInstance.state.formModal).toEqual(false);
        expect(componentInstance.state.infoModal).toEqual(false);
        expect(componentInstance.state.appointmentRequestSelected).toEqual({});
        expect(componentInstance.state.appointmentRequestDetails).toEqual({});
        expect(componentInstance.state.noAppointmentRequestsFound).toEqual(false);
    });

    it("render with what the user see", async () => {

        expect(wrapper.find('Button')).toHaveLength(1);
        expect(wrapper.find('Button').props().title).toEqual('בקש תור חדש');
        expect(wrapper.find('Text')).toHaveLength(0);
        expect(wrapper.find(List.Section)).toHaveLength(1);
        expect(wrapper.find(List.Accordion)).toHaveLength(2);
        expect(wrapper.find(List.Item)).toHaveLength(4);
        expect(wrapper.find('AppointmentRequestInfo')).toHaveLength(0);
    });

    it("search for appointment requests with service provider with name that has ra", async () => {
        const updateSearchSpy = jest.spyOn(componentInstance, 'updateSearch');

        await componentInstance.updateSearch('ra');

        expect(updateSearchSpy).toHaveBeenCalled();
        expect(componentInstance.state.userAppointmentRequests.length).toEqual(1);
    });

    it("cancel Appointment Request on click erase icon", async () => {
        wrapper = shallow(<UserAppointmentRequests/>);
        componentInstance = wrapper.instance();

        const cancelAppointmentRequestSpy = jest.spyOn(componentInstance, 'cancelAppointmentRequest');

        componentInstance.cancelAppointmentRequest(userRequestsTest[0]);

        expect(cancelAppointmentRequestSpy).toHaveBeenCalled();
        expect(cancelAppointmentRequestSpy).toHaveBeenCalledWith(userRequestsTest[0]);
    });

    it("close Appointment Request Info", async () => {
        wrapper = shallow(<UserAppointmentRequests/>);
        componentInstance = wrapper.instance();

        const closeAppointmentRequestInfoSpy = jest.spyOn(componentInstance, 'closeAppointmentRequestInfo');

        componentInstance.closeAppointmentRequestInfo(userTest);

        expect(closeAppointmentRequestInfoSpy).toHaveBeenCalled();
        expect(componentInstance.state.infoModal).toEqual(false);
        expect(componentInstance.state.appointmentRequestDetails).toEqual({});
    });

});
