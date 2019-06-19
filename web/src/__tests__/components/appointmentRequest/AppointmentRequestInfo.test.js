import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import {createMemoryHistory} from 'history';
import AppointmentRequestInfo from "../../../components/appointmentRequest/AppointmentRequestInfo";
import serviceProvidersStorage from "../../../storage/serviceProvidersStorage";
import appointmentsStorage from "../../../storage/appointmentsStorage";
import usersStorage from "../../../storage/usersStorage";
import users from "../../jsons/users";
import serviceProviders from "../../jsons/serviceProviders";
import appointmentsOf549963652 from "../../jsons/appointmentsServiceProvider549963652";
import strings from "../../../shared/strings";
import mappers from "../../../shared/mappers";
import {Modal} from "semantic-ui-react";

const appointmentRequestsOf549963652 = require("../../jsons/appointmentRequestsServiceProvider549963652");

jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/appointmentsStorage");


describe("AppointmentRequestInfo should", () => {
    let wrapper = null;
    let componentInstance = null;
    let appointmentRequestTest = appointmentRequestsOf549963652[0];
    appointmentRequestTest.clientName = "Rene Dauber";
    const history = createMemoryHistory({
        initialEntries: ['/', '/home', '/appointments', '/appointments/requests/413'],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });
    const props = {
        history: history,
        location: {
            pathname: '/appointments/requests/413',
            state: {
                appointmentRequest: appointmentRequestTest,
            }
        },
        match: {
            isExact: true,
            path: '/appointments/requests/413',
            url: '/appointments/requests/413',
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
    appointmentsStorage.getAppointmentRequestByAppointmentRequestID.mockResolvedValue({data: appointmentRequestsOf549963652[0]});
    appointmentsStorage.cancelAppointmentById.mockResolvedValue({});
    appointmentsStorage.rejectAppointmentRequestById.mockResolvedValue({});

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
                pathname: '/appointments/requests/413',
                state: {
                    appointmentRequest: appointmentRequestTest,
                }
            },
            match: {
                isExact: true,
                path: '/appointments/requests/413',
                url: '/appointments/requests/413',
            },
            serviceProviderRoles: ["appointmentsHairDresser"],
        };

        const arrResponse = setupComponent('shallow', AppointmentRequestInfo, null, props, "/appointments/requests/413");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test("renders AppointmentRequestInfo for /appointments/requests/413", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentRequestInfo, history, props, "/appointments/requests/413");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(AppointmentRequestInfo)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentRequestInfo, history, props, "/appointments/requests/413");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.appointmentRequest).toBeDefined();
        expect(componentInstance.state.appointmentRequest.appointmentRequestId).toEqual(appointmentRequestTest.appointmentRequestId);
        expect(componentInstance.state.appointmentRequest.clientName).toEqual(appointmentRequestTest.clientName);
        expect(componentInstance.state.appointmentRequest.endDateAndTime).toEqual(appointmentRequestTest.endDateAndTime);
        expect(componentInstance.state.appointmentRequest.remarks).toEqual(appointmentRequestTest.remarks);
        expect(componentInstance.state.appointmentRequest.startDateAndTime).toEqual(appointmentRequestTest.startDateAndTime);
        expect(componentInstance.state.appointmentRequest.status).toEqual(appointmentRequestTest.status);
        expect(componentInstance.state.appointmentRequest.AppointmentDetail).toBeDefined();
        expect(componentInstance.state.appointmentRequest.AppointmentDetail.clientId).toEqual(appointmentRequestTest.AppointmentDetail.clientId);
        expect(componentInstance.state.appointmentRequest.AppointmentDetail.role).toEqual(appointmentRequestTest.AppointmentDetail.role);
        expect(componentInstance.state.appointmentRequest.AppointmentDetail.serviceProviderId).toEqual(appointmentRequestTest.AppointmentDetail.serviceProviderId);
        expect(componentInstance.state.appointmentRequest.AppointmentDetail.subject).toEqual(appointmentRequestTest.AppointmentDetail.subject);
    });

    test("mounted with the right data, without appointment in props", async () => {
        appointmentsStorage.getAppointmentRequestByAppointmentRequestID.mockResolvedValue(appointmentRequestsOf549963652[0]);

        const props = {
            history: history,
            location: {
                pathname: '/appointments/requests/413',
                state: undefined
            },
            match: {
                isExact: true,
                path: '/appointments/requests/413',
                url: '/appointments/requests/413',
                params:{
                    appointmentRequestId:413
                }
            },
            serviceProviderRoles: ["appointmentsHairDresser"],
        };
        const arrResponse = await setupComponent('shallow', AppointmentRequestInfo, history, props, "/appointments/requests/413");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.appointmentRequest).toBeDefined();
        expect(componentInstance.state.appointmentRequest.appointmentRequestId).toEqual(appointmentRequestTest.appointmentRequestId);
        expect(componentInstance.state.appointmentRequest.clientName).toEqual(appointmentRequestTest.clientName);
        expect(componentInstance.state.appointmentRequest.endDateAndTime).toEqual(appointmentRequestTest.endDateAndTime);
        expect(componentInstance.state.appointmentRequest.remarks).toEqual(appointmentRequestTest.remarks);
        expect(componentInstance.state.appointmentRequest.startDateAndTime).toEqual(appointmentRequestTest.startDateAndTime);
        expect(componentInstance.state.appointmentRequest.status).toEqual(appointmentRequestTest.status);
        expect(componentInstance.state.appointmentRequest.AppointmentDetail).toBeDefined();
        expect(componentInstance.state.appointmentRequest.AppointmentDetail.clientId).toEqual(appointmentRequestTest.AppointmentDetail.clientId);
        expect(componentInstance.state.appointmentRequest.AppointmentDetail.role).toEqual(appointmentRequestTest.AppointmentDetail.role);
        expect(componentInstance.state.appointmentRequest.AppointmentDetail.serviceProviderId).toEqual(appointmentRequestTest.AppointmentDetail.serviceProviderId);
        expect(componentInstance.state.appointmentRequest.AppointmentDetail.subject).toEqual(appointmentRequestTest.AppointmentDetail.subject);
    });

    test("handleDelete", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentRequestInfo, history, props, "/appointments/requests/413");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleDelete();
        expect(componentInstance.props.history.location.pathname).toEqual('/appointments');
    });

    test("render with what the user see", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentRequestInfo, history, props, "/appointments/requests/413");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('AppointmentRequestInfo').dive();

        expect(shallowWrapper.find('Modal')).toHaveLength(1);
        expect(shallowWrapper.find('ModalHeader')).toHaveLength(1);
        expect(shallowWrapper.find('ModalHeader').props().children).toEqual(appointmentRequestTest.clientName);
        expect(shallowWrapper.find('ModalContent')).toHaveLength(1);
        expect(shallowWrapper.find('p')).toHaveLength(8);
        expect(shallowWrapper.find('p').at(0).props().children[0]).toEqual(strings.appointmentsPageStrings.APPOINTMENT_ID);
        expect(shallowWrapper.find('p').at(0).props().children[2]).toEqual(appointmentRequestTest.requestId);
        expect(shallowWrapper.find('p').at(1).props().children[0]).toEqual(strings.appointmentsPageStrings.CLIENT_NAME);
        expect(shallowWrapper.find('p').at(1).props().children[2]).toEqual(appointmentRequestTest.clientName);
        expect(shallowWrapper.find('p').at(2).props().children[0]).toEqual(strings.appointmentsPageStrings.SERVICE_PROVIDER_ID);
        expect(shallowWrapper.find('p').at(2).props().children[2]).toEqual(appointmentRequestTest.AppointmentDetail.serviceProviderId);
        expect(shallowWrapper.find('p').at(3).props().children[0]).toEqual(strings.appointmentsPageStrings.ROLE);
        expect(shallowWrapper.find('p').at(3).props().children[2]).toEqual(strings.roles[appointmentRequestTest.AppointmentDetail.role]);
        expect(shallowWrapper.find('p').at(4).props().children[0]).toEqual(strings.appointmentsPageStrings.SUBJECT);
        expect(shallowWrapper.find('p').at(4).props().children[2]).toEqual(JSON.parse(appointmentRequestTest.AppointmentDetail.subject).join(", "));
        expect(shallowWrapper.find('p').at(5).props().children[0]).toEqual(strings.appointmentsPageStrings.STATUS);
        expect(shallowWrapper.find('p').at(5).props().children[2]).toEqual(mappers.appointmentRequestStatusMapper(appointmentRequestTest.status));
        expect(shallowWrapper.find('p').at(6).props().children[0]).toEqual(strings.appointmentsPageStrings.REMARKS);
        expect(shallowWrapper.find('p').at(6).props().children[2]).toEqual(appointmentRequestTest.notes);
        expect(shallowWrapper.find('ModalActions')).toHaveLength(1);
        expect(shallowWrapper.find('Button')).toHaveLength(2);
        expect(shallowWrapper.find('Button').at(0).props().children).toEqual("סגור");
        expect(shallowWrapper.find('Button').at(0).props().positive).toBeTruthy();
        expect(shallowWrapper.find('Button').at(1).props().children).toEqual("מחק");
        expect(shallowWrapper.find('Button').at(1).props().negative).toBeTruthy();
    });
});
