import React from 'react';

import {Calendar} from 'react-native-calendars';
import {shallow} from "enzyme/build";
import AppointmentsCalendar from "../../../components/calendars/appointmentsCalendar/AppointmentsCalendar";
import usersStorage from "../../../storage/usersStorage";
import phoneStorage from "react-native-simple-store";
import users from "../../jsons/users";
import serviceProvidersStorage from "../../../storage/serviceProvidersStorage";
import serviceProviders from "../../jsons/serviceProviders";
import appointmentsStorage from "../../../storage/appointmentsStorage";
import user135985058Appointments from "../../jsons/user135985058Appointments";

jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/usersStorage");
jest.mock("react-native-simple-store");


describe("AppointmentsCalendar should", () => {
    let wrapper = null;
    let componentInstance = null;
    const userIdTest = "135985058";
    const userTest = users.findIndex(user => user.userId === userIdTest);
    const props = {};
    const mockStore = {
        userData: {
            userId: userIdTest,
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
    appointmentsStorage.getUserAppointments = jest.fn().mockImplementation(() => Promise.resolve({data: user135985058Appointments}));

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('match snapshot', async () => {
        wrapper = shallow(<AppointmentsCalendar {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("render what the user see", async () => {
        wrapper = await shallow(<AppointmentsCalendar {...props} />);
        componentInstance = wrapper.instance();

        await wrapper.update();

        expect(wrapper.find(Calendar)).toHaveLength(1);
        expect(wrapper.find('AppointmentsDayInfo')).toHaveLength(1);
    });

    it("mounted with the right data", async () => {
        expect(Object.keys(componentInstance.state.markedDates).length).toEqual(3);
        expect(componentInstance.state.selectedDate).toEqual('');
        expect(componentInstance.state.dateModalVisible).toEqual(false);
        expect(componentInstance.state.expanded).toEqual({});
    });

    it("show select day after cosed modal", async () => {
        wrapper = await shallow(<AppointmentsCalendar {...props} />);
        componentInstance = wrapper.instance();

        await wrapper.update();

        await componentInstance.setState({selectedDate: "2019-07-03"});
        await componentInstance.afterCloseModalShowSelectDay();

        expect(componentInstance.state.markedDates["2019-07-03"].selected).toEqual(true);
        expect(componentInstance.state.markedDates["2019-07-03"].color).toEqual("blue");
    });

    it("on select day show day info modal with appointment in the day", async () => {
        wrapper = await shallow(<AppointmentsCalendar {...props} />);
        componentInstance = wrapper.instance();

        await wrapper.update();

        await componentInstance.setState({selectedDate: "2019-07-03"});
        await componentInstance.onDaySelect({dateString: "2020-03-21"});

        expect(Object.keys(componentInstance.state.markedDates).length).toEqual(3);
        expect(componentInstance.state.markedDates["2020-03-21"].appointments.length).toEqual(1);
        expect(componentInstance.state.markedDates["2020-03-21"].selected).toEqual(true);
        expect(componentInstance.state.markedDates["2020-03-21"].color).toEqual("blue");
    });

    it("on select day show day info modal with out appointment in the day", async () => {
        wrapper = await shallow(<AppointmentsCalendar {...props} />);
        componentInstance = wrapper.instance();

        await wrapper.update();

        await componentInstance.setState({selectedDate: "2019-07-03"});
        await componentInstance.onDaySelect({dateString: "2021-03-21"});

        expect(Object.keys(componentInstance.state.markedDates).length).toEqual(4);
        expect(componentInstance.state.markedDates["2021-03-21"].appointments.length).toEqual(0);
        expect(componentInstance.state.markedDates["2021-03-21"].selected).toEqual(true);
        expect(componentInstance.state.markedDates["2021-03-21"].color).toEqual("blue");
        expect(componentInstance.state.selectedDate).toEqual("2021-03-21");
        expect(componentInstance.state.dateModalVisible).toEqual(true);
    });

});