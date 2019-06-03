import React from 'react';

import {FlatList} from 'react-native';

import {shallow} from "enzyme/build";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import usersStorage from "../../storage/usersStorage";
import user013637605AppointmentRequests from "../jsons/user013637605AppointmentRequests";
import users from "../jsons/users";
import serviceProviders from "../jsons/serviceProviders";
import UserAppointmentRequests from "../../screens/userAppointmentRequests/UserAppointmentRequests";
import phoneStorage from "react-native-simple-store";
import UserProfileInfo from "../../components/userProfile/UserProfileInfo";
import appointmentsStorage from "../../storage/appointmentsStorage";


jest.mock("react-native-simple-store");
jest.mock("../../storage/usersStorage");
jest.mock("../../storage/serviceProvidersStorage");
jest.mock("../../storage/appointmentsStorage");


var scheduler = typeof setImmediate === 'function' ? setImmediate : setTimeout;

const flushPromises = function () {
    return new Promise(function (resolve) {
        scheduler(resolve);
    });
};

const flushAllPromises = () => new Promise(resolve => setImmediate(resolve()));


describe("UserAppointmentRequests should", () => {
    let wrapper = null;
    let componentInstance = null;
    const props = {};
    const userTest = users[698];
    const mockStore = {
        userData: {
            serviceProviderId: "549963652",
            userId: "549963652",
            token: "some token"
        }
    };

    phoneStorage.get = jest.fn().mockImplementation((key) => Promise.resolve(mockStore[key]));
    usersStorage.getUsers = jest.fn().mockImplementation(() => Promise.resolve(users));
    usersStorage.getUserByUserID = jest.fn().mockImplementation((userId) => Promise.resolve(users.filter(user => user.userId === userId)[0]));
    serviceProvidersStorage.getServiceProviders = jest.fn().mockResolvedValue(serviceProviders);
    serviceProvidersStorage.getServiceProviderUserDetails= jest.fn().mockImplementation((serviceProviderId) => Promise.resolve(
        {data: users.filter(user => user.userId === serviceProviderId)[0]}));
    serviceProvidersStorage.getServiceProviderById = jest.fn().mockImplementation((serviceProviderId) => Promise.resolve(serviceProviders.filter(provider =>
        provider.serviceProviderId === serviceProviderId)));
    appointmentsStorage.getUserAppointmentRequests = jest.fn().mockResolvedValue({data: user013637605AppointmentRequests});

    beforeAll(async (done) => {

        done();
    });

    afterAll(() => {
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
    });

    it('match snapshot', async () => {
        wrapper = await shallow(<UserAppointmentRequests/>);
        componentInstance = wrapper.instance();

        await wrapper.update();

        expect(wrapper).toMatchSnapshot();
    });

    it("mounted with the right data", async () => {
        wrapper = await shallow(<UserAppointmentRequests/>);
        componentInstance = wrapper.instance();

        // await flushAllPromises();
        await wrapper.update();
        await flushAllPromises();
        await new Promise((resolve) => setTimeout(resolve, 0));


        expect(componentInstance.state.userAppointmentRequests.length).toEqual(2);
        expect(componentInstance.state.formModal).toEqual(false);
        expect(componentInstance.state.infoModal).toEqual(false);
        expect(componentInstance.state.appointmentRequestSelected).toEqual({});
        expect(componentInstance.state.appointmentRequestDetails).toEqual({});
        expect(componentInstance.state.noAppointmentRequestsFound).toEqual(false);
    });

    it("render with what the user see", async () => {
        wrapper = shallow(<UserAppointmentRequests/>);
        componentInstance = wrapper.instance();

        expect(wrapper.find(UserProfileInfo)).toHaveLength(1);
        expect(wrapper.find(FlatList)).toHaveLength(1);
        expect(wrapper.find('Button')).toHaveLength(1);
        expect(wrapper.find('Button').props().title).toEqual('בקש תור חדש');
        expect(wrapper.find('SearchBar')).toHaveLength(1);
        expect(wrapper.find('SearchBar').props().placeholder).toEqual("חפש...");
        expect(wrapper.find('Text')).toHaveLength(0);
        expect(wrapper.find('ListSection')).toHaveLength(1);
        expect(wrapper.find('ListAccordion')).toHaveLength(2);
        expect(wrapper.find('ListItem')).toHaveLength(4);
        expect(wrapper.find('AppointmentRequestInfo')).toHaveLength(0);
    });

    it("search for appointment requests with service provider with name that has ra", async () => {
        wrapper = await shallow(<UserAppointmentRequests/>);
        componentInstance = wrapper.instance();

        await wrapper.update();
        const updateSearchSpy = jest.spyOn(componentInstance, 'updateSearch');

        await componentInstance.updateSearch('ra');

        expect(updateSearchSpy).toHaveBeenCalled();
        expect(componentInstance.state.userAppointmentRequests.length).toEqual(39);
    });

    it("search for appointment requests with service provider with role מספרה", async () => {
        wrapper = await shallow(<UserAppointmentRequests/>);
        componentInstance = wrapper.instance();

        await wrapper.update();

        const updateSearchSpy = jest.spyOn(componentInstance, 'updateSearch');

        await componentInstance.updateSearch('מספרה');

        expect(updateSearchSpy).toHaveBeenCalled();
        expect(componentInstance.state.userAppointmentRequests.length).toEqual(39);
    });

    it("cancel Appointment Request on click erase icon", async () => {
        wrapper = shallow(<UserAppointmentRequests/>);
        componentInstance = wrapper.instance();

        const cancelAppointmentRequestSpy = jest.spyOn(componentInstance, 'cancelAppointmentRequest');

        componentInstance.cancelAppointmentRequest(userTest);

        expect(cancelAppointmentRequestSpy).toHaveBeenCalled();
        expect(cancelAppointmentRequestSpy).toHaveBeenCalledWith(userTest);
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
