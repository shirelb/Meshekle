import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import moment from 'moment';
import {createMemoryHistory} from 'history';
import AppointmentInfo from "../../../components/appointment/AppointmentInfo";
import serviceProvidersStorage from "../../../storage/serviceProvidersStorage";
import appointmentsStorage from "../../../storage/appointmentsStorage";
import usersStorage from "../../../storage/usersStorage";
import users from "../../jsons/users";
import serviceProviders from "../../jsons/serviceProviders";
import appointmentsOf549963652 from "../../jsons/appointmentsServiceProvider549963652";
import strings from "../../../shared/strings";
import mappers from "../../../shared/mappers";

const appointmentRequestsOf549963652 = require("../../jsons/appointmentRequestsServiceProvider549963652");

jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/appointmentsStorage");


describe("AppointmentInfo should", () => {
    let wrapper = null;
    let componentInstance = null;
    let appointmentTest = appointmentsOf549963652[0];
    appointmentTest.clientName = "Padget Creaser";
    const history = createMemoryHistory({
        initialEntries: ['/', '/home', '/appointments', '/appointments/428'],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });
    const props = {
        history: history,
        location: {
            pathname: '/appointments/428',
            state: {
                appointment: appointmentTest,
            }
        },
        match: {
            isExact: true,
            path: '/appointments/428',
            url: '/appointments/428',
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
    appointmentsStorage.cancelAppointmentById.mockResolvedValue({});

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
                pathname: '/appointments/428',
                state: {
                    appointment: appointmentTest
                }
            },
            match: {
                isExact: true,
                path: '/appointments/428',
                url: '/appointments/428',
            },
            serviceProviderRoles: ["appointmentsHairDresser"],
        };

        const arrResponse = setupComponent('shallow', AppointmentInfo, null, props, "/appointments/428");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test("renders AppointmentInfo for /appointments/428", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentInfo, history, props, "/appointments/428");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(AppointmentInfo)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentInfo, history, props, "/appointments/428");
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
        appointmentsStorage.getAppointmentByAppointmentID.mockResolvedValue(appointmentsOf549963652[0]);

        const props = {
            history: history,
            location: {
                pathname: '/appointments/428',
                state: undefined
            },
            match: {
                isExact: true,
                path: '/appointments/428',
                url: '/appointments/428',
                params:{
                    appointmentId:428
                }
            },
            serviceProviderRoles: ["appointmentsHairDresser"],
        };
        const arrResponse = await setupComponent('shallow', AppointmentInfo, history, props, "/appointments/428");
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

    test("handleDelete", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentInfo, history, props, "/appointments/428");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleDelete();
        expect(componentInstance.props.history.location.pathname).toEqual('/appointments');
    });

    test("handleEdit", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentInfo, history, props, "/appointments/428");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleEdit();
        expect(componentInstance.props.history.location.pathname).toEqual('/appointments/428/edit');
    });

    test("handleDelete on click delete button", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentInfo, history, props, "/appointments/428");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('AppointmentInfo').dive().find('Button').at(1).simulate('click')
        expect(componentInstance.props.history.location.pathname).toEqual('/appointments');
    });

    test("handleEdit on click edit button", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentInfo, history, props, "/appointments/428");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('AppointmentInfo').dive().find('Button').at(0).simulate('click')
        expect(componentInstance.props.history.location.pathname).toEqual('/appointments/428/edit');
    });

    test("render with what the user see", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentInfo, history, props, "/appointments/428");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('AppointmentInfo').dive();

        expect(shallowWrapper.find('Modal')).toHaveLength(1);
        expect(shallowWrapper.find('ModalHeader')).toHaveLength(1);
        expect(shallowWrapper.find('ModalHeader').props().children).toEqual(appointmentTest.clientName);
        expect(shallowWrapper.find('ModalContent')).toHaveLength(1);
        expect(shallowWrapper.find('p')).toHaveLength(10);
        expect(shallowWrapper.find('p').at(0).props().children[0]).toEqual(strings.appointmentsPageStrings.APPOINTMENT_ID);
        expect(shallowWrapper.find('p').at(0).props().children[2]).toEqual(appointmentTest.appointmentId);
        expect(shallowWrapper.find('p').at(1).props().children[0]).toEqual(strings.appointmentsPageStrings.CLIENT_NAME);
        expect(shallowWrapper.find('p').at(1).props().children[2]).toEqual(appointmentTest.clientName);
        expect(shallowWrapper.find('p').at(2).props().children[0]).toEqual(strings.appointmentsPageStrings.SERVICE_PROVIDER_ID);
        expect(shallowWrapper.find('p').at(2).props().children[2]).toEqual(appointmentTest.AppointmentDetail.serviceProviderId);
        expect(shallowWrapper.find('p').at(3).props().children[0]).toEqual(strings.appointmentsPageStrings.ROLE);
        expect(shallowWrapper.find('p').at(3).props().children[2]).toEqual(strings.roles[appointmentTest.AppointmentDetail.role]);
        expect(shallowWrapper.find('p').at(4).props().children[0]).toEqual(strings.appointmentsPageStrings.SUBJECT);
        expect(shallowWrapper.find('p').at(4).props().children[2]).toEqual(JSON.parse(appointmentTest.AppointmentDetail.subject).join(", "));
        expect(shallowWrapper.find('p').at(5).props().children[0]).toEqual(strings.appointmentsPageStrings.STATUS);
        expect(shallowWrapper.find('p').at(5).props().children[2]).toEqual(mappers.appointmentStatusMapper(appointmentTest.status));
        expect(shallowWrapper.find('p').at(6).props().children[0]).toEqual(strings.appointmentsPageStrings.DATE);
        expect(shallowWrapper.find('p').at(6).props().children[2]).toEqual(moment(appointmentTest.startDateAndTime).format('DD.MM.YYYY'));
        expect(shallowWrapper.find('p').at(7).props().children[0]).toEqual(strings.appointmentsPageStrings.START_TIME);
        expect(shallowWrapper.find('p').at(7).props().children[2]).toEqual(moment(appointmentTest.startDateAndTime).format("HH:mm"));
        expect(shallowWrapper.find('p').at(8).props().children[0]).toEqual(strings.appointmentsPageStrings.END_TIME);
        expect(shallowWrapper.find('p').at(8).props().children[2]).toEqual(moment(appointmentTest.endDateAndTime).format("HH:mm"));
        expect(shallowWrapper.find('p').at(9).props().children[0]).toEqual(strings.appointmentsPageStrings.REMARKS);
        expect(shallowWrapper.find('p').at(9).props().children[2]).toEqual(appointmentTest.remarks);
        expect(shallowWrapper.find('ModalActions')).toHaveLength(1);
        expect(shallowWrapper.find('Button')).toHaveLength(2);
        expect(shallowWrapper.find('Button').at(0).props().children).toEqual("ערוך");
        expect(shallowWrapper.find('Button').at(0).props().positive).toBeTruthy();
        expect(shallowWrapper.find('Button').at(1).props().children).toEqual("מחק");
        expect(shallowWrapper.find('Button').at(1).props().negative).toBeTruthy();
    });
});
