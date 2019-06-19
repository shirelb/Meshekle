import React from 'react';

import {Card} from 'react-native-elements';
import {Agenda} from 'react-native-calendars';
import {shallow} from "enzyme/build";
import AgendaCalendar from "../../../components/calendars/agendaCalendar/AgendaCalendar";
import usersStorage from "../../../storage/usersStorage";
import phoneStorage from "react-native-simple-store";
import users from "../../jsons/users";
import serviceProvidersStorage from "../../../storage/serviceProvidersStorage";
import serviceProviders from "../../jsons/serviceProviders";
import appointmentsStorage from "../../../storage/appointmentsStorage";
import user013637605AppointmentRequests from "../../jsons/user013637605AppointmentRequests";
import user135985058Events from "../../jsons/user135985058Events";

jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/usersStorage");
jest.mock("react-native-simple-store");


describe("AgendaCalendar should", () => {
    let wrapper = null;
    let componentInstance = null;
    const userIdTest = "135985058";
    const props = {};
    const mockStore = {
        userData: {
            userId: userIdTest,
            token: "some token"
        }
    };

    phoneStorage.get = jest.fn().mockImplementation((key) => Promise.resolve(mockStore[key]));
    phoneStorage.update = jest.fn().mockImplementation((key, value) => Promise.resolve(mockStore[key] = value));
    usersStorage.getUsers = jest.fn().mockImplementation(() => Promise.resolve(users));
    usersStorage.getUserEvents = jest.fn().mockImplementation(() => Promise.resolve({data: user135985058Events}));
    usersStorage.getUserByUserID = jest.fn().mockImplementation((userId) => Promise.resolve(users.filter(user => user.userId === userId)[0]));
    serviceProvidersStorage.getServiceProviders = jest.fn().mockResolvedValue(serviceProviders);
    serviceProvidersStorage.getServiceProviderUserDetails = jest.fn().mockImplementation((serviceProviderId) => Promise.resolve({data: users.filter(user => user.userId === serviceProviderId)[0]}));
    serviceProvidersStorage.getServiceProviderById = jest.fn().mockImplementation((serviceProviderId) => Promise.resolve(serviceProviders.filter(provider =>
        provider.serviceProviderId === serviceProviderId)));
    appointmentsStorage.getUserAppointmentRequests = jest.fn().mockImplementation(() => Promise.resolve(user013637605AppointmentRequests));
    appointmentsStorage.postUserAppointmentRequest = jest.fn().mockImplementation(() => Promise.resolve());
    appointmentsStorage.cancelAppointmentById = jest.fn().mockImplementation(() => Promise.resolve());

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('match snapshot', async () => {
        wrapper = shallow(<AgendaCalendar {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("render what the user see", async () => {
        wrapper = await shallow(<AgendaCalendar {...props} />);
        componentInstance = wrapper.instance();

        await wrapper.update();

        expect(wrapper.find(Agenda)).toHaveLength(1);
        expect(wrapper.find(Card)).toHaveLength(0);
    });

    it("mounted with the right data", async () => {
        expect(Object.keys(componentInstance.state.items).length).toEqual(6);
        expect(Object.values(componentInstance.state.items)[0][0].type).toEqual('Announcements');
        expect(Object.values(componentInstance.state.items)[1][0].type).toEqual('Announcements');
        expect(Object.values(componentInstance.state.items)[2][0].type).toEqual('Appointments');
        expect(Object.values(componentInstance.state.items)[3][0].type).toEqual('Appointments');
        expect(Object.values(componentInstance.state.items)[4][0].type).toEqual('Appointments');
    });

});
