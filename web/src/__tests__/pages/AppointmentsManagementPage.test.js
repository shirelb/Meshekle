import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../testHelpers";
import PageNotFound from "../../pages/pageNotFound404/PageNotFound";
import AppointmentsManagementPage from '../../pages/appointmentsManagementPage/AppointmentsManagementPage';
import store from 'store';
import moment from 'moment/moment';
import {createMemoryHistory} from 'history';
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import appointmentsStorage from "../../storage/appointmentsStorage";
import usersStorage from "../../storage/usersStorage";
import users from "../jsons/users";
import serviceProviders from "../jsons/serviceProviders";
import appointmentsOf549963652 from "../jsons/appointmentsServiceProvider549963652";
import appointmentRequestsOf549963652 from "../jsons/appointmentRequestsServiceProvider549963652";
import strings from "../../shared/strings";
import helpers from "../../shared/helpers";

jest.mock("../../shared/helpers");
jest.mock("store");
jest.mock("../../storage/usersStorage");
jest.mock("../../storage/serviceProvidersStorage");
jest.mock("../../storage/appointmentsStorage");


describe("AppointmentsManagementPage should", () => {
    let wrapper = null;
    let componentInstance = null;
    const history = createMemoryHistory({
        initialEntries: ['/', '/home', '/appointments'],
        initialIndex: 2,
        keyLength: 10,
        getUserConfirmation: null
    });
    const props = {
        history: history,
        location: {
            pathname: '/appointments'
        },
        match: {
            isExact: true,
            path: '/appointments',
            url: '/appointments',
        }
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
    appointmentsStorage.getServiceProviderAppointments.mockResolvedValue({data: appointmentsOf549963652});
    appointmentsStorage.getServiceProviderAppointmentRequests.mockImplementation(() => Promise.resolve({data: JSON.parse(JSON.stringify(appointmentRequestsOf549963652))}));

    beforeAll(async (done) => {
        done();
    });

    afterAll(() => {
    });

    beforeEach(async (done) => {
        await jest.clearAllMocks();
        done();
    });

    afterEach(() => {
    });

    test.skip('match snapshot', async () => {
        const props = {
            location: {
                pathname: '/appointments'
            },
            match: {
                isExact: true,
                path: '/appointments',
                url: '/appointments',
            }
        };

        const arrResponse = setupComponent('shallow', AppointmentsManagementPage, null, props, "/appointments");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test("renders AppointmentsManagementPage for /appointments", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentsManagementPage, history, props, "/appointments");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(AppointmentsManagementPage)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data", async () => {
        expect(componentInstance.state.serviceProviderRoles.length).toEqual(1);
        expect(componentInstance.state.serviceProviderRoles).toEqual(['appointmentsHairDresser']);

        expect(componentInstance.state.appointments.length).toEqual(3);

        expect(componentInstance.state.appointmentRequests.length).toEqual(2);

        expect(componentInstance.state.userOptions.length).toEqual(513);

        expect(componentInstance.state.appointmentByRoleCount).toEqual({
            "appointmentsDentist": 0,
            "appointmentsHairDresser": 3,
        })
    });

    test("create shadow request when mouse hover on request", async () => {
        expect(componentInstance.state.appointments.length).toEqual(3);
        expect(componentInstance.state.appointmentRequests.length).toEqual(2);

        componentInstance.hoverOnAppointmentRequest(componentInstance.state.appointmentRequests[0].appointmentRequest);
        expect(componentInstance.state.appointments.length).toEqual(5);

        componentInstance.hoverOffAppointmentRequest(componentInstance.state.appointmentRequests[0].appointmentRequest);
        expect(componentInstance.state.appointments.length).toEqual(3);
    });

    test("push /appointments/:appointmentId on select event", async () => {
        componentInstance.onSelectEvent(componentInstance.state.appointments[0]);
        expect(componentInstance.props.history.location.pathname).toEqual('/appointments/428')
    });

    test("push /appointments/set on select slot", async () => {
        componentInstance.onSelectSlot(moment(), moment());
        expect(componentInstance.props.history.location.pathname).toEqual('/appointments/set')
    });

    test("push /appointments/set on drop appointmentRequest", async () => {
        componentInstance.onDropAppointmentRequest(componentInstance.state.appointmentRequests[0]);
        expect(componentInstance.props.history.location.pathname).toEqual('/appointments/set')
    });

    test("render with what the user see", async () => {
        const arrResponse = await setupComponent('mount', AppointmentsManagementPage, history, props, "/appointments");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const mountWrapper = wrapper.find('AppointmentsManagementPage');

        expect(mountWrapper.find('Grid')).toHaveLength(1);
        expect(mountWrapper.find('Header')).toHaveLength(2);
        expect(mountWrapper.find('Header').get(0).props.children).toEqual(strings.mainPageStrings.APPOINTMENTS_PAGE_TITLE);
        expect(mountWrapper.find('Link')).toHaveLength(2);
        expect(mountWrapper.find('Link').first().find('Button')).toHaveLength(1);
        expect(mountWrapper.find('Link').first().find('Button').props().children[2]).toEqual(strings.mainPageStrings.SETTINGS_PAGE_TITLE);
        expect(mountWrapper.find('Button').get(1).props.children[2]).toEqual(strings.mainPageStrings.REPORT_PAGE_TITLE);
        expect(mountWrapper.find('Button')).toHaveLength(3);
        expect(mountWrapper.find('Button').get(2).props.children[1]).toEqual('   יצא לPDF');
        expect(mountWrapper.find('Label')).toHaveLength(1);
        expect(mountWrapper.find('Label').props().children[0]).toEqual('מספרה');
        expect(mountWrapper.find('Header').get(1).props.children).toEqual(' בקשות תורים:');
        expect(mountWrapper.find('DraggableAppointmentRequest')).toHaveLength(1);
        expect(mountWrapper.find('AppointmentCalendar')).toHaveLength(1);
    });

    test("open ServiceProviderEdit on click Settings", async () => {
        const arrResponse = await setupComponent('mount', AppointmentsManagementPage, history, props, "/appointments");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const settingsBtn = wrapper.find('AppointmentsManagementPage').find('Link').first();
        await settingsBtn.simulate('click', { button: 0 });

        expect(wrapper.find('Router').prop('history').location.pathname).toEqual('/appointments/serviceProvider/settings')
        expect(wrapper.find('ServiceProviderEdit')).toHaveLength(1);
    });

    test.skip("open ReportPage on click Report", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentsManagementPage, history, props, "/appointments");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        // const reportBtn = wrapper.find('AppointmentsManagementPage').dive().find('Link').at(1);
        const reportBtn = wrapper.find('AppointmentsManagementPage').dive().find('Button').at(1);
        await reportBtn.simulate('click', { button: 0 });

        expect(wrapper.find('Router').prop('history').location.pathname).toEqual('/appointments/report')
        expect(wrapper.find('AppointmentsReportPage')).toHaveLength(1);
    });

    test("save as PDF on click Report", async () => {
        helpers.exportToPDF = jest.fn();

        const arrResponse = await setupComponent('mount', AppointmentsManagementPage, history, props, "/appointments");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const PDFBtn = wrapper.find('AppointmentsManagementPage').find('Button').at(2);
        await PDFBtn.simulate('click', { button: 0 });

        expect(helpers.exportToPDF).toHaveBeenCalledWith('MeshekleAppointmentsCalendar', 'divToPrint', 'landscape')
    });
});
