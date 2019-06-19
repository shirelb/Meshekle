import React from 'react';
import {shallow} from "enzyme/build";
import {flushPromises,setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import moment from 'moment';
import {createMemoryHistory} from 'history';
import AppointmentAdd from "../../../components/appointment/AppointmentAdd";
import serviceProvidersStorage from "../../../storage/serviceProvidersStorage";
import appointmentsStorage from "../../../storage/appointmentsStorage";
import usersStorage from "../../../storage/usersStorage";
import users from "../../jsons/users";
import serviceProviders from "../../jsons/serviceProviders";
import appointmentsOf549963652 from "../../jsons/appointmentsServiceProvider549963652";

const appointmentRequestsOf549963652 = require("../../jsons/appointmentRequestsServiceProvider549963652")

jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/appointmentsStorage");


describe("AppointmentAdd should", () => {
    let wrapper = null;
    let componentInstance = null;
    let appointmentRequestTest = appointmentRequestsOf549963652[1];
    appointmentRequestTest.optionalTimes = JSON.parse(appointmentRequestTest.optionalTimes);
    const history = createMemoryHistory({
        initialEntries: ['/', '/home', '/appointments', '/appointments/set'],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });
    const slotInfo = {
        end: moment(),
        start: moment(),
    };
    const appointmentRequestDropped = {
        allDay: false,
        appointmentRequest: appointmentRequestTest,
        end: moment(),
        id: 985,
        start: moment(),
        title: "Catherina Blackmuir",
    };
    const propsWithSlotInfo = {
        history: history,
        location: {
            pathname: '/appointments/set',
            state: {
                slotInfo: slotInfo
            }
        },
        match: {
            isExact: true,
            path: '/appointments/set',
            url: '/appointments/set',
        },
        serviceProviderRoles: ["appointmentsHairDresser"],
        getUsersForAppointmentForm: jest.fn(),
        getServiceProviderRoles: jest.fn(),
        userOptions: [],
    };
    const propsWithRequest = {
        history: history,
        location: {
            pathname: '/appointments/set',
            state: {
                appointmentRequestDropped: appointmentRequestDropped
            }
        },
        match: {
            isExact: true,
            path: '/appointments/set',
            url: '/appointments/set',
        },
        serviceProviderRoles: ["appointmentsHairDresser"],
        getUsersForAppointmentForm: jest.fn(),
        getServiceProviderRoles: jest.fn(),
        userOptions: [],
    };
    const mockStore = {
        serviceProviderId: "549963652",
        userId: "549963652",
    };

    store.get.mockImplementation((key) => mockStore[key]);
    usersStorage.getUsers.mockResolvedValue(users);
    usersStorage.getUserByUserID.mockImplementation((userId) => Promise.resolve(users.filter(user => user.userId === userId)[0]));
    serviceProvidersStorage.getServiceProviderUserDetails.mockImplementation((serviceProviderId) => Promise.resolve({data: users.filter(user => user.userId === serviceProviderId)[0]}));
    serviceProvidersStorage.getServiceProviderById.mockImplementation((serviceProviderId) => Promise.resolve(serviceProviders.filter(provider =>
        provider.serviceProviderId === serviceProviderId)));
    serviceProvidersStorage.getRolesOfServiceProvider.mockResolvedValue(["appointmentsHairDresser"]);
    appointmentsStorage.setAppointment.mockResolvedValue({});
    appointmentsStorage.getServiceProviderAppointments.mockResolvedValue({data: appointmentsOf549963652});
    appointmentsStorage.getServiceProviderAppointmentRequests.mockImplementation(() => Promise.resolve({data: JSON.parse(JSON.stringify(appointmentRequestsOf549963652))}));

    beforeAll(() => {
    });

    afterAll(() => {
    });

    beforeEach(async () => {
        jest.clearAllMocks();
        await flushPromises();
    });

    afterEach(() => {
    });

    test('match snapshot with slotInfo', async () => {
        const props = {
            location: {
                pathname: '/appointments/set',
                state: {
                    slotInfo: slotInfo
                }
            },
            match: {
                isExact: true,
                path: '/appointments/set',
                url: '/appointments/set',
            },
            serviceProviderRoles: ["appointmentsHairDresser"],
            getUsersForAppointmentForm: jest.fn(),
            getServiceProviderRoles: jest.fn(),
            userOptions: [],
        };

        const arrResponse = setupComponent('shallow', AppointmentAdd, null, props, "/appointments/set");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test('match snapshot with appointmentRequestDropped', async () => {
        const props = {
            location: {
                pathname: '/appointments/set',
                state: {
                    appointmentRequestDropped: appointmentRequestDropped
                }
            },
            match: {
                isExact: true,
                path: '/appointments/set',
                url: '/appointments/set',
            },
            serviceProviderRoles: ["appointmentsHairDresser"],
            getUsersForAppointmentForm: jest.fn(),
            getServiceProviderRoles: jest.fn(),
            userOptions: [],
        };

        const arrResponse = setupComponent('shallow', AppointmentAdd, null, props, "/appointments/set");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test("renders AppointmentAdd for /appointments/set and slotInfo", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentAdd, history, propsWithSlotInfo, "/appointments/set");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(AppointmentAdd)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data for slotInfo", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentAdd, history, propsWithSlotInfo, "/appointments/set");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.slotInfo).toBeDefined();
        expect(componentInstance.state.slotInfo.end).toEqual(slotInfo.end);
        expect(componentInstance.state.slotInfo.start).toEqual(slotInfo.start);
    });

    test("renders AppointmentAdd for /appointments/set and appointmentRequestDropped", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentAdd, history, propsWithRequest, "/appointments/set");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(AppointmentAdd)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data for appointmentRequestDropped", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentAdd, history, propsWithRequest, "/appointments/set");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.appointmentRequestEvent).toBeDefined();
        expect(componentInstance.state.appointmentRequestEvent.appointmentRequest).toBeDefined();
        expect(componentInstance.state.appointmentRequestEvent.allDay).toEqual(appointmentRequestDropped.allDay);
        expect(componentInstance.state.appointmentRequestEvent.end).toEqual(appointmentRequestDropped.end);
        expect(componentInstance.state.appointmentRequestEvent.start).toEqual(appointmentRequestDropped.start);
        expect(componentInstance.state.appointmentRequestEvent.title).toEqual(appointmentRequestDropped.title);
        expect(componentInstance.state.appointmentRequestEvent.id).toEqual(appointmentRequestDropped.id);
    });

    test("handleCancel", async () => {
        const arrResponse = await setupComponent('mount', AppointmentAdd, history, propsWithRequest, "/appointments/set");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleCancel({
            preventDefault() {
            }
        });

        expect(componentInstance.props.history.location.pathname).toEqual('/appointments');
    });

    test("render with what the user see", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentAdd, history, propsWithSlotInfo, "/appointments/set");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('AppointmentAdd').dive();

        expect(shallowWrapper.find('Modal')).toHaveLength(1);
        expect(shallowWrapper.find('Grid')).toHaveLength(1);
        expect(shallowWrapper.find('Header')).toHaveLength(1);
        expect(shallowWrapper.find('Header').props().children).toEqual('תור חדש');
        expect(shallowWrapper.find('AppointmentForm')).toHaveLength(1);
    });

    test("handleSubmit", async () => {
        const arrResponse = await setupComponent('mount', AppointmentAdd, history, propsWithSlotInfo, "/appointments/set");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleSubmit(appointmentsOf549963652[1]);
        expect(componentInstance.props.history.location.pathname).toEqual('/home');
    });
});
