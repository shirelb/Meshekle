import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import {createMemoryHistory} from 'history';
import AppointmentEdit from "../../../components/appointment/AppointmentEdit";
import serviceProvidersStorage from "../../../storage/serviceProvidersStorage";
import appointmentsStorage from "../../../storage/appointmentsStorage";
import usersStorage from "../../../storage/usersStorage";
import users from "../../jsons/users";
import serviceProviders from "../../jsons/serviceProviders";
import appointmentsOf549963652 from "../../jsons/appointmentsServiceProvider549963652";

const appointmentRequestsOf549963652 = require("../../jsons/appointmentRequestsServiceProvider549963652");

jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/appointmentsStorage");


describe("AppointmentEdit should", () => {
    let wrapper = null;
    let componentInstance = null;
    let appointmentTest = appointmentsOf549963652[0];
    const history = createMemoryHistory({
        initialEntries: ['/', '/home', '/appointments', '/appointments/428/edit'],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });
    const props = {
        history: history,
        location: {
            pathname: '/appointments/428/edit',
            state: {
                appointment: appointmentTest,
                openedFrom: "AppointmentInfo",
            }
        },
        match: {
            isExact: true,
            path: '/appointments/428/edit',
            url: '/appointments/428/edit',
        },
        serviceProviderRoles: ["appointmentsHairDresser"],
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
    appointmentsStorage.updateAppointment.mockResolvedValue({});
    appointmentsStorage.getAppointmentByAppointmentID.mockResolvedValue({data: appointmentsOf549963652[0]});

    beforeAll((done) => {
        done();
    });

    afterAll(() => {
    });

    beforeEach((done) => {
        jest.clearAllMocks();
        done();
    });

    afterEach(() => {
    });

    test('match snapshot', async () => {
        const props = {
            location: {
                pathname: '/appointments/428/edit',
                state: {
                    appointment: appointmentTest
                }
            },
            match: {
                isExact: true,
                path: '/appointments/428/edit',
                url: '/appointments/428/edit',
            },
            serviceProviderRoles:["appointmentsHairDresser"],
        };

        const arrResponse = setupComponent('shallow', AppointmentEdit, null, props, "/appointments/428/edit");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test("renders AppointmentEdit for /appointments/428/edit", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentEdit, history, props, "/appointments/428/edit");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(AppointmentEdit)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentEdit, history, props, "/appointments/428/edit");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.appointment).toBeDefined();
        expect(componentInstance.state.appointment.appointmentId).toEqual(appointmentTest.appointmentId);
        expect(componentInstance.state.appointment.clientName).toEqual(appointmentTest.clientName);
        expect(componentInstance.state.appointment.endDateAndTime).toEqual(appointmentTest.endDateAndTime);
        expect(componentInstance.state.appointment.remarks).toEqual(appointmentTest.remarks);
        expect(componentInstance.state.appointment.startDateAndTime).toEqual(appointmentTest.startDateAndTime);
        expect(componentInstance.state.appointment.status).toEqual(appointmentTest.status);
        expect(componentInstance.state.appointment.AppointmentDetail).toBeDefined();
        expect(componentInstance.state.appointment.AppointmentDetail.clientId).toEqual(appointmentTest.AppointmentDetail.clientId);
        expect(componentInstance.state.appointment.AppointmentDetail.role).toEqual(appointmentTest.AppointmentDetail.role);
        expect(componentInstance.state.appointment.AppointmentDetail.serviceProviderId).toEqual(appointmentTest.AppointmentDetail.serviceProviderId);
        expect(componentInstance.state.appointment.AppointmentDetail.subject).toEqual(appointmentTest.AppointmentDetail.subject);
    });

    test("mounted with the right data, without appointment in props", async () => {
        const props = {
            history: history,
            location: {
                pathname: '/appointments/428/edit',
                state:{}
            },
            match: {
                isExact: true,
                path: '/appointments/428/edit',
                url: '/appointments/428/edit',
            },
            serviceProviderRoles:["appointmentsHairDresser"],
        };
        const arrResponse = await setupComponent('shallow', AppointmentEdit, history, props, "/appointments/428/edit");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.appointment).toBeDefined();
        expect(componentInstance.state.appointment.appointmentId).toEqual(appointmentTest.appointmentId);
        expect(componentInstance.state.appointment.clientName).toEqual(appointmentTest.clientName);
        expect(componentInstance.state.appointment.endDateAndTime).toEqual(appointmentTest.endDateAndTime);
        expect(componentInstance.state.appointment.remarks).toEqual(appointmentTest.remarks);
        expect(componentInstance.state.appointment.startDateAndTime).toEqual(appointmentTest.startDateAndTime);
        expect(componentInstance.state.appointment.status).toEqual(appointmentTest.status);
        expect(componentInstance.state.appointment.AppointmentDetail).toBeDefined();
        expect(componentInstance.state.appointment.AppointmentDetail.clientId).toEqual(appointmentTest.AppointmentDetail.clientId);
        expect(componentInstance.state.appointment.AppointmentDetail.role).toEqual(appointmentTest.AppointmentDetail.role);
        expect(componentInstance.state.appointment.AppointmentDetail.serviceProviderId).toEqual(appointmentTest.AppointmentDetail.serviceProviderId);
        expect(componentInstance.state.appointment.AppointmentDetail.subject).toEqual(appointmentTest.AppointmentDetail.subject);
    });

    test("handleCancel", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentEdit, history, props, "/appointments/428/edit");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleCancel({
            preventDefault() {
            }
        });

        wrapper.update();
        expect(componentInstance.props.history.location.pathname).toEqual('/appointments');
    });

    test("handleSubmit", async () => {
        const arrResponse = await setupComponent('mount', AppointmentEdit, history, props, "/appointments/428/edit");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleSubmit(appointmentsOf549963652[1]);
        expect(componentInstance.props.history.location.pathname).toEqual('/appointments');
    });

    test("render with what the user see", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentEdit, history, props, "/appointments/428/edit");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('AppointmentEdit').dive();

        expect(shallowWrapper.find('Modal')).toHaveLength(1);
        expect(shallowWrapper.find('Grid')).toHaveLength(1);
        expect(shallowWrapper.find('Header')).toHaveLength(1);
        expect(shallowWrapper.find('Header').props().children).toEqual('ערוך תור');
        expect(shallowWrapper.find('AppointmentForm')).toHaveLength(1);
    });
});
