import React from 'react';


import {Redirect} from 'react-router-dom';
import {mount, shallow} from "enzyme/build";
import PageNotFound from "../../pages/pageNotFound404/PageNotFound";
import isLoggedIn from "../../shared/isLoggedIn";
import strings from "../../shared/strings";
import {setupComponent} from "../testHelpers";
import MainPage from "../../pages/mainPage/MainPage";
import {PhoneBookManagementPage} from "../../pages/phoneBookManagementPage/PhoneBookManagementPage";
import {AnnouncementsManagementPage} from "../../pages/announcementsManagementPage/AnnouncementsManagementPage";
import AppointmentsReportPage from "../../pages/appointmentsManagementPage/AppointmentsReportPage";
import AppointmentsManagementPage from "../../pages/appointmentsManagementPage/AppointmentsManagementPage";
import {ChoresManagementPage} from "../../pages/choresManagementPage/ChoresManagementPage";
import store from 'store';
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import usersStorage from "../../storage/usersStorage";
import users from "../jsons/users";
import serviceProviders from "../jsons/serviceProviders";
import appointmentsStorage from "../../storage/appointmentsStorage";
import appointmentsOf549963652 from "../jsons/appointmentsServiceProvider549963652";
import appointmentRequestsOf549963652 from "../jsons/appointmentRequestsServiceProvider549963652";
import choresStorage from "../../storage/choresStorage";
import announcementsStorage from "../../storage/announcementsStorage";
import LoginPage from "../../pages/loginPage/LoginPage";


jest.mock("store");
jest.mock("../../shared/isLoggedIn");
jest.mock("../../storage/usersStorage");
jest.mock("../../storage/serviceProvidersStorage");
jest.mock("../../storage/appointmentsStorage");
jest.mock("../../storage/choresStorage");
jest.mock("../../storage/announcementsStorage");


describe("MainPage should", () => {
    let wrapper = null;
    let componentInstance = null;
    const props = {
        location: {
            pathname: '/home'
        },
        match: {
            isExact: true,
            path: '/home',
            url: '/home',
        }
    };
    let mockStore = {
        serviceProviderToken: null,
        serviceProviderId: "549963652",
        userId: "549963652",
    };

    const buildProps = (path) => {
        return {
            location: {
                pathname: path
            },
            match: {
                isExact: true,
                path: path,
                url: path,
            }
        };
    };

    store.get.mockImplementation((key) => mockStore[key]);
    store.remove.mockImplementation((key) => mockStore[key] = null);
    usersStorage.getUsers.mockResolvedValue(users);
    usersStorage.getUserByUserID.mockImplementation((userId) => Promise.resolve(users.filter(user => user.userId === userId)[0]));
    serviceProvidersStorage.getServiceProviderUserDetails.mockImplementation((serviceProviderId) => Promise.resolve({data: users.filter(user => user.userId === serviceProviderId)[0]}));
    serviceProvidersStorage.getServiceProviderById.mockImplementation((serviceProviderId) => Promise.resolve(serviceProviders.filter(provider =>
        provider.serviceProviderId === serviceProviderId)));
    serviceProvidersStorage.getServiceProviderPermissionsById.mockResolvedValue(["appointments"]);
    serviceProvidersStorage.getRolesOfServiceProvider.mockResolvedValue(["appointmentsHairDresser"]);
    serviceProvidersStorage.getServiceProviders.mockResolvedValue(serviceProviders);
    appointmentsStorage.getServiceProviderAppointments.mockResolvedValue({data: appointmentsOf549963652});
    appointmentsStorage.getServiceProviderAppointmentRequests.mockImplementation(() => Promise.resolve({data: JSON.parse(JSON.stringify(appointmentRequestsOf549963652))}));
    choresStorage.getAllChoreTypes.mockResolvedValue([]);
    choresStorage.getChoreTypeSetting.mockResolvedValue({data: []});
    choresStorage.getUserChoresForType.mockResolvedValue({data: []});
    choresStorage.getUsersForChoreType.mockResolvedValue({data: []});
    choresStorage.getReplacementRequests.mockResolvedValue({data: []});
    announcementsStorage.getUsers.mockResolvedValue({data: users});
    announcementsStorage.getCategories.mockResolvedValue({data: [{categoryId:1,serviceProviderId:"544359761",categoryName:"ביטחון"}]});
    announcementsStorage.getCategoriesByServiceProviderId.mockResolvedValue({data: []});
    announcementsStorage.getAnnouncements.mockResolvedValue({data: []});
    announcementsStorage.getAnnouncementsRequests.mockResolvedValue({data: []});

    beforeAll(async () => {

    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockStore['serviceProviderToken'] = "SOME TOKEN eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
    });

    afterEach(() => {
    });

    test("render Login when user is NOT authenticated", async () => {
        mockStore['serviceProviderToken'] = null;

        isLoggedIn.mockResolvedValue(false);
        const arrResponse = await setupComponent('mount', MainPage, null, props, "/login");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        wrapper.update();

        expect(wrapper.find(Redirect)).toHaveLength(1);
        expect(wrapper.find('Router').prop('history').location.pathname).toEqual('/login');
    });

    test("render Home when user is authenticated", async () => {
        mockStore['serviceProviderToken'] = "SOME TOKEN eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

        isLoggedIn.mockResolvedValue(true);
        const arrResponse = await setupComponent('shallow', MainPage, null, props, "/home");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();

        expect(wrapper.find(MainPage)).toHaveLength(1);
        expect(wrapper.find(Redirect)).toHaveLength(0);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("render a page with header and form with two fields and a send button", async () => {
        isLoggedIn.mockResolvedValue(true);
        const arrResponse = await setupComponent('mount', MainPage, null, props, "/home");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];
        const mountWrapper = wrapper.find('MainPage');

        expect(mountWrapper.find('Sidebar')).toHaveLength(1);
        expect(mountWrapper.find('MenuItem')).toHaveLength(4);
        expect(mountWrapper.find('MenuItem').at(0).props().name).toEqual('home');
        expect(mountWrapper.find('MenuItem').at(0).props().children[1]).toEqual(strings.mainPageStrings.MAIN_PAGE_TITLE);
        expect(mountWrapper.find('MenuItem').at(1).props().name).toEqual('phoneBook');
        expect(mountWrapper.find('MenuItem').at(1).props().children[1]).toEqual(strings.mainPageStrings.PHONE_BOOK_PAGE_TITLE);
        expect(mountWrapper.find('MenuItem').at(2).props().name).toEqual('appointments');
        expect(mountWrapper.find('MenuItem').at(2).props().children[1]).toEqual(strings.mainPageStrings.APPOINTMENTS_PAGE_TITLE);
        expect(mountWrapper.find('MenuItem').at(3).props().name).toEqual('logout');
        expect(mountWrapper.find('MenuItem').at(3).props().children[1]).toEqual(strings.mainPageStrings.LOGOUT);

        expect(mountWrapper.find('Home')).toHaveLength(1);
        expect(mountWrapper.find('Home').find('Grid')).toHaveLength(2);
        expect(mountWrapper.find('Home').find('Image')).toHaveLength(1);
        expect(mountWrapper.find('Home').find('Image').props('src').src).toEqual('logo1.png');
        expect(mountWrapper.find('Home').find('Header')).toHaveLength(5);
        expect(mountWrapper.find('Home').find('Header').at(0).props().children[0]).toEqual('משקל\'ה');
        expect(mountWrapper.find('Home').find('Header').find('HeaderSubheader').props().children).toEqual('יש משק ויש משקל\'ה');
        expect(mountWrapper.find('Home').find('Header').at(1).props().children).toEqual('ברוכים הבאים');
        expect(mountWrapper.find('Home').find('Header').at(2).props().children).toEqual('Padget Creaser');
        expect(mountWrapper.find('Home').find('Header').at(3).find('GridRow').at(0).props().children).toEqual('התפקידים באחריותך הם:');
        expect(mountWrapper.find('Home').find('Header').at(3).find('GridRow').at(1).props().children).toHaveLength(1);
        expect(mountWrapper.find('Home').find('Header').at(4).props().children[1]).toEqual('מספרה');
        expect(mountWrapper.find('Home').find('Header').at(4).find('Icon').props().name).toEqual('calendar alternate outline');
    });

    test("render Home on /home", async () => {
        isLoggedIn.mockResolvedValue(true);
        const arrResponse = await setupComponent('mount', MainPage, null, props, "/home");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find('Home')).toHaveLength(1);
    });

    test("render PhoneBookManagementPage for /phoneBook", async () => {
        isLoggedIn.mockResolvedValue(true);
        const arrResponse = await setupComponent('mount', MainPage, null, buildProps("/phoneBook"), "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(PhoneBookManagementPage)).toHaveLength(1);
    });

    test("render AnnouncementsManagementPage for /announcements", async () => {
        isLoggedIn.mockResolvedValue(true);
        const arrResponse = await setupComponent('mount', MainPage, null, buildProps("/announcements"), "/announcements");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(AnnouncementsManagementPage)).toHaveLength(1);
    });

    test("render AppointmentsReportPage for /appointments/report", async () => {
        isLoggedIn.mockResolvedValue(true);
        const arrResponse = await setupComponent('mount', MainPage, null, buildProps("/appointments/report"), "/appointments/report");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(AppointmentsReportPage)).toHaveLength(1);
    });

    test("render AppointmentsManagementPage for /appointments", async () => {
        isLoggedIn.mockResolvedValue(true);
        const arrResponse = await setupComponent('mount', MainPage, null, buildProps("/appointments"), "/appointments");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(AppointmentsManagementPage)).toHaveLength(1);
    });

    test("render ChoresManagementPage for /chores", async () => {
        isLoggedIn.mockResolvedValue(true);
        const arrResponse = await setupComponent('mount', MainPage, null, buildProps("/chores"), "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(ChoresManagementPage)).toHaveLength(1);
    });

    test("render PageNotFound for /random", async () => {
        isLoggedIn.mockResolvedValue(true);
        const arrResponse = await setupComponent('mount', MainPage, null, buildProps("/random"), "/random");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(PageNotFound)).toHaveLength(1);
    });

    test("open Home on click Home button on Sidebar Menu", async () => {
        isLoggedIn.mockResolvedValue(true);
        const arrResponse = await setupComponent('mount', MainPage, history, buildProps("/appointments"), "/appointments");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        // const settingsBtn = wrapper.find('MainPage').find('NavLink').first();
        const menuBtn = wrapper.find('MainPage').find('MenuItem').at(0);
        await menuBtn.simulate('click', {button: 0});

        expect(wrapper.find('Router').prop('history').location.pathname).toEqual('/home');
        expect(wrapper.find('Home')).toHaveLength(1);
    });

    test("open PhoneBook on click Phonebook button on Sidebar Menu", async () => {
        isLoggedIn.mockResolvedValue(true);
        const arrResponse = await setupComponent('mount', MainPage, history, props, "/home");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const menuBtn = wrapper.find('MainPage').find('MenuItem').at(1);
        await menuBtn.simulate('click', {button: 0});

        expect(wrapper.find('Router').prop('history').location.pathname).toEqual('/phoneBook');
        expect(wrapper.find(PhoneBookManagementPage)).toHaveLength(1);
    });

    test("open Appointments on click Appointments button on Sidebar Menu", async () => {
        isLoggedIn.mockResolvedValue(true);
        const arrResponse = await setupComponent('mount', MainPage, history, props, "/home");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const menuBtn = wrapper.find('MainPage').find('MenuItem').at(2);
        await menuBtn.simulate('click', {button: 0});

        expect(wrapper.find('Router').prop('history').location.pathname).toEqual('/appointments');
        expect(wrapper.find(AppointmentsManagementPage)).toHaveLength(1);
    });

    test("logout on click Logout button on Sidebar Menu", async () => {
        isLoggedIn.mockResolvedValue(true);
        const arrResponse = await setupComponent('mount', MainPage, history, props, "/home");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const menuBtn = wrapper.find('MainPage').find('MenuItem').at(3);
        await menuBtn.simulate('click', {button: 0});

        expect(wrapper.find(Redirect)).toHaveLength(1);
    });

});
