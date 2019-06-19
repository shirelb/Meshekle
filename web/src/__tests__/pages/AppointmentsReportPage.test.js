import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../testHelpers";
import PageNotFound from "../../pages/pageNotFound404/PageNotFound";
import AppointmentsReportPage from '../../pages/appointmentsManagementPage/AppointmentsReportPage';
import store from 'store';
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


describe("AppointmentsReportPage should", () => {
    let wrapper = null;
    let componentInstance = null;
    const history = createMemoryHistory({
        initialEntries: ['/', '/home', '/appointments', '/appointments/report'],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });
    const props = {
        history: history,
        location: {
            pathname: '/appointments/report'
        },
        match: {
            isExact: true,
            path: '/appointments/report',
            url: '/appointments/report',
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

    test('match snapshot', async () => {
        const props = {
            location: {
                pathname: '/appointments/report'
            },
            match: {
                isExact: true,
                path: '/appointments/report',
                url: '/appointments/report',
            }
        };

        const arrResponse = setupComponent('shallow', AppointmentsReportPage, null, props, "/appointments/report");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test("renders AppointmentsReportPage for /appointments/report", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentsReportPage, history, props, "/appointments/report");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(AppointmentsReportPage)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data", async () => {
        expect(componentInstance.state.page).toEqual(0);
        expect(componentInstance.state.totalPages).toEqual(1);
        expect(componentInstance.state.appointments.length).toEqual(3);
    });

    test("render with what the user see", async () => {
        const arrResponse = await setupComponent('mount', AppointmentsReportPage, history, props, "/appointments/report");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const mountWrapper = wrapper.find('AppointmentsReportPage');

        expect(mountWrapper.find('Grid')).toHaveLength(1);
        expect(mountWrapper.find('Header')).toHaveLength(1);
        expect(mountWrapper.find('Header').get(0).props.children).toEqual(strings.mainPageStrings.REPORT_PAGE_TITLE);
        expect(mountWrapper.find('Link')).toHaveLength(1);
        expect(mountWrapper.find('Link').first().find('Button')).toHaveLength(1);
        expect(mountWrapper.find('Link').first().find('Button').props().children[2]).toEqual(strings.mainPageStrings.SETTINGS_PAGE_TITLE);
        expect(mountWrapper.find('Button')).toHaveLength(4);
        expect(mountWrapper.find('Button').at(1).props().children[2]).toEqual(strings.mainPageStrings.BACK_TO_APPOINTMENTS_PAGE_TITLE);
        expect(mountWrapper.find('Button').at(2).props().children[1]).toEqual('   יצא לPDF');
        expect(mountWrapper.find('Table')).toHaveLength(1);
        expect(mountWrapper.find('TableRow')).toHaveLength(6);
        expect(mountWrapper.find('TableHeader')).toHaveLength(2);
        expect(mountWrapper.find('TableRow').at(0).props().children).toHaveLength(10);
        expect(mountWrapper.find('TableRow').at(0).props().children[1].props.children).toEqual(strings.appointmentsPageStrings.CLIENT_ID);
        expect(mountWrapper.find('TableRow').at(0).props().children[2].props.children).toEqual(strings.appointmentsPageStrings.CLIENT_NAME);
        expect(mountWrapper.find('TableRow').at(0).props().children[3].props.children).toEqual(strings.appointmentsPageStrings.ROLE);
        expect(mountWrapper.find('TableRow').at(0).props().children[4].props.children).toEqual(strings.appointmentsPageStrings.SUBJECT);
        expect(mountWrapper.find('TableRow').at(0).props().children[5].props.children).toEqual(strings.appointmentsPageStrings.STATUS);
        expect(mountWrapper.find('TableRow').at(0).props().children[6].props.children).toEqual(strings.appointmentsPageStrings.DATE);
        expect(mountWrapper.find('TableRow').at(0).props().children[7].props.children).toEqual(strings.appointmentsPageStrings.START_TIME);
        expect(mountWrapper.find('TableRow').at(0).props().children[8].props.children).toEqual(strings.appointmentsPageStrings.END_TIME);
        expect(mountWrapper.find('TableRow').at(0).props().children[9].props.children).toEqual(strings.appointmentsPageStrings.REMARKS);
        expect(mountWrapper.find('TableRow').at(1).props().children).toHaveLength(10);
        expect(mountWrapper.find('TableRow').at(1).props().children[1].props.children).toHaveLength(2);
        expect(mountWrapper.find('TableRow').at(1).props().children[1].props.children[0].props.name).toEqual('filter');
        expect(mountWrapper.find('TableRow').at(1).props().children[1].props.children[1].props.className).toEqual('filterInput');
        expect(mountWrapper.find('TableBody')).toHaveLength(1);
        expect(mountWrapper.find('TableBody').props().children).toHaveLength(3);
        expect(mountWrapper.find('TableFooter')).toHaveLength(1);
        expect(mountWrapper.find('TableFooter').find('MenuItem')).toHaveLength(1);
    });

    test("open ServiceProviderEdit on click Settings", async () => {
        const arrResponse = await setupComponent('mount', AppointmentsReportPage, history, props, "/appointments/report");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const settingsBtn = wrapper.find('AppointmentsReportPage').find('Link').first();
        await settingsBtn.simulate('click', {button: 0});

        expect(wrapper.find('Router').prop('history').location.pathname).toEqual('/appointments/report/serviceProvider/settings')
        expect(wrapper.find('ServiceProviderEdit')).toHaveLength(1);
    });

    test.skip("open ReportPage on click Report", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentsReportPage, history, props, "/appointments/report");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const reportBtn = wrapper.find('AppointmentsReportPage').dive().find('Button').at(1);
        await reportBtn.simulate('click', {button: 0});

        expect(wrapper.find('Router').prop('history').location.pathname).toEqual('/appointments');
        expect(wrapper.find('AppointmentsManagementPage')).toHaveLength(1);
    });

    test("save as PDF on click Report", async () => {
        helpers.exportToPDF = jest.fn();

        const arrResponse = await setupComponent('mount', AppointmentsReportPage, history, props, "/appointments/report");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const PDFBtn = wrapper.find('AppointmentsReportPage').find('Button').at(2);
        await PDFBtn.simulate('click', {button: 0});

        expect(helpers.exportToPDF).toHaveBeenCalledWith('MeshekleAppointmentsReport', 'divToPrint', 'landscape')
    });

    test("render page of appointments on click of another page", async () => {
        const setPageSpy = jest.spyOn(AppointmentsReportPage.prototype, 'setPage');

        const arrResponse = await setupComponent('mount', AppointmentsReportPage, history, props, "/appointments/report");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const page1Btn = wrapper.find('AppointmentsReportPage').find('MenuItem');
        await page1Btn.simulate('click', {button: 0});

        expect(setPageSpy).toHaveBeenCalled();
    });

    test.skip("render next page of appointments on click of another page", async () => {
        const incrementPageSpy = jest.spyOn(AppointmentsReportPage.prototype, 'incrementPage');

        const arrResponse = await setupComponent('mount', AppointmentsReportPage, history, props, "/appointments/report");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const nextPageBtn = wrapper.find('AppointmentsReportPage').find('MenuItem').at(2);
        await nextPageBtn.simulate('click', {button: 0});

        expect(incrementPageSpy).toHaveBeenCalled();
    });

    test.skip("render previous page of appointments on click of another page", async () => {
        const decrementPageSpy = jest.spyOn(AppointmentsReportPage.prototype, 'decrementPage');

        const arrResponse = await setupComponent('mount', AppointmentsReportPage, history, props, "/appointments/report");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const previousPageBtn = wrapper.find('AppointmentsReportPage').find('MenuItem').at(2);
        await previousPageBtn.simulate('click', {button: 0});

        expect(decrementPageSpy).toHaveBeenCalled();
    });

    test("render /appointments/report/428/edit on edit appointment", async () => {
        const arrResponse = await setupComponent('mount', AppointmentsReportPage, history, props, "/appointments/report");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const editBtn = wrapper.find('TableBody').find('Icon').at(0);
        await editBtn.simulate('click', {button: 0});

        expect(componentInstance.props.history.location.pathname).toEqual('/appointments/report/428/edit');
    });

    test("sort the table by userId when userId column clicked", async () => {
        const arrResponse = await setupComponent('mount', AppointmentsReportPage, history, props, "/appointments/report");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const handleSortSpy = jest.spyOn(componentInstance, 'handleSort');

        const sortBtn = wrapper.find('TableHeaderCell').at(1);
        await sortBtn.simulate('click', {button: 0});

        expect(handleSortSpy).toHaveBeenCalled();
        expect(componentInstance.state.appointments[0].clientId).toEqual("561933550");
        expect(componentInstance.state.appointments[1].clientId).toEqual("580624494");
        expect(componentInstance.state.appointments[2].clientId).toEqual("616314141");
        expect(componentInstance.state.column).toEqual("clientId");
        expect(componentInstance.state.direction).toEqual("ascending");
    });

    test("filter the table by userId when userId column clicked", async () => {
        const arrResponse = await setupComponent('mount', AppointmentsReportPage, history, props, "/appointments/report");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const handleFilterSpy = jest.spyOn(componentInstance, 'handleFilter');

        wrapper.find('TableHeaderCell').at(11).find('Input').props().onChange({
            target: {
                value: "580624494"
            }
        });

        expect(handleFilterSpy).toHaveBeenCalled();
        expect(componentInstance.state.appointments).toHaveLength(1);
        expect(componentInstance.state.appointments[0].clientId).toEqual("580624494");
        expect(componentInstance.state.filterColumnsAndTexts.clientId).toEqual("580624494");
        expect(componentInstance.state.filterColumnsAndTexts.clientName).toEqual("");
        expect(componentInstance.state.filterColumnsAndTexts.serviceProviderId).toEqual("");
        expect(componentInstance.state.filterColumnsAndTexts.role).toEqual("");
        expect(componentInstance.state.filterColumnsAndTexts.subject).toEqual("");
        expect(componentInstance.state.filterColumnsAndTexts.date).toEqual("");
    });

});
