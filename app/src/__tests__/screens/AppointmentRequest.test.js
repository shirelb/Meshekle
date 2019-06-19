import React from 'react';

import {FlatList} from 'react-native';
import {List} from 'react-native-elements';

import {shallow} from "enzyme/build";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import usersStorage from "../../storage/usersStorage";
import users from "../jsons/users";
import serviceProviders from "../jsons/serviceProviders";
import AppointmentRequest from "../../screens/appointmentRequest/AppointmentRequest";
import phoneStorage from "react-native-simple-store";
import strings from "../../shared/strings";

jest.mock("react-native-simple-store");
jest.mock("../../storage/usersStorage");
jest.mock("../../storage/serviceProvidersStorage");


describe("AppointmentRequest should", () => {
    let wrapper = null;
    let componentInstance = null;
    const props = {};
    const serviceProviderTest = serviceProviders[41];
    const mockStore = {
        userData: {
            userId: "549963652",
            token: "some token"
        }
    };
    const navigation = {
        navigate: jest.fn(),
        state: {
            params: {
                selectedDate: "2019-06-03"
            }
        }
    };

    phoneStorage.get = jest.fn().mockImplementation((key) => Promise.resolve(mockStore[key]));
    usersStorage.getUsers = jest.fn().mockImplementation(() => Promise.resolve(users));
    usersStorage.getUserByUserID = jest.fn().mockImplementation((userId) => Promise.resolve(users.filter(user => user.userId === userId)[0]));
    serviceProvidersStorage.getServiceProviders = jest.fn().mockImplementation(() => Promise.resolve(serviceProviders));
    serviceProvidersStorage.getServiceProviderUserDetails = jest.fn().mockImplementation((serviceProviderId) => Promise.resolve({data: users.filter(user => user.userId === serviceProviderId)[0]}));
    serviceProvidersStorage.getServiceProviderById = jest.fn().mockImplementation((serviceProviderId) => Promise.resolve(serviceProviders.filter(provider =>
        provider.serviceProviderId === serviceProviderId)));

    let appointmentsServiceProviders = serviceProviders.filter(provider => strings.appointmentsServiceProviderRoles.includes(provider.role));
    let appointmentsServiceProvidersTest = [];
    appointmentsServiceProviders.forEach((provider, index) => {
        if (index > 159)
            provider.fullname = "Tara";
        else
            provider.fullname = "Gil";
        appointmentsServiceProvidersTest.push(provider);
    });


    beforeAll(async (done) => {
        wrapper = await shallow(<AppointmentRequest navigation={navigation}/>);
        componentInstance = wrapper.instance();
        await wrapper.update();
        componentInstance.setState({serviceProviders: appointmentsServiceProvidersTest});
        done();
    });

    afterAll(() => {
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        componentInstance.setState({serviceProviders: appointmentsServiceProvidersTest});
    });

    it('match snapshot', async () => {
        expect(wrapper).toMatchSnapshot();
    });

    it("render with what the user see", async () => {
        expect(wrapper.find(List)).toHaveLength(1);
        expect(wrapper.find('AppointmentRequestForm')).toHaveLength(1);
        expect(wrapper.find(FlatList)).toHaveLength(1);
    });

    it("mounted with the right data", () => {

        expect(componentInstance.state.serviceProviders.length).toEqual(161);
        expect(componentInstance.state.formModal).toEqual(false);
        expect(componentInstance.state.serviceProviderSelected).toEqual({});
        expect(componentInstance.state.noServiceProviderFound).toEqual(false);
    });

    it("search for serviceProviders with name that has ra", async () => {

        const updateSearchSpy = jest.spyOn(componentInstance, 'updateSearch');

        await componentInstance.updateSearch('ra');

        expect(updateSearchSpy).toHaveBeenCalled();
        expect(componentInstance.state.serviceProviders.length).toEqual(1);
    });

    it("search for serviceProviders with role מספרה", async () => {

        const updateSearchSpy = jest.spyOn(componentInstance, 'updateSearch');

        await componentInstance.updateSearch('מספרה');

        expect(updateSearchSpy).toHaveBeenCalled();
        expect(componentInstance.state.serviceProviders.length).toEqual(88);
    });

    it("open AppointmentRequestForm on click serviceProvider", async () => {
        wrapper = shallow(<AppointmentRequest navigation={navigation}/>);
        componentInstance = wrapper.instance();

        const requestAppointmentSpy = jest.spyOn(componentInstance, 'requestAppointment');

        componentInstance.requestAppointment(serviceProviderTest);

        expect(requestAppointmentSpy).toHaveBeenCalled();
        expect(requestAppointmentSpy).toHaveBeenCalledWith(serviceProviderTest);
        expect(componentInstance.state.formModal).toEqual(true);
        expect(componentInstance.state.serviceProviderSelected).toEqual(serviceProviderTest);
    });

    it("close AppointmentRequestForm", async () => {
        wrapper = shallow(<AppointmentRequest navigation={navigation}/>);
        componentInstance = wrapper.instance();

        const closeAppointmentRequestFormSpy = jest.spyOn(componentInstance, 'closeAppointmentRequestForm');

        componentInstance.closeAppointmentRequestForm();

        expect(closeAppointmentRequestFormSpy).toHaveBeenCalled();
        expect(componentInstance.state.formModal).toEqual(false);
        expect(componentInstance.state.serviceProviderSelected).toEqual({});
    });

});
