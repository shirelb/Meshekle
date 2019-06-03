import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../testHelpers";
import PageNotFound from "../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import {createMemoryHistory} from 'history';
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import usersStorage from "../../storage/usersStorage";
import users from "../jsons/users";
import serviceProviders from "../jsons/serviceProviders";
import strings from "../../shared/strings";
import helpers from "../../shared/helpers";
import {PhoneBookManagementPage} from "../../pages/phoneBookManagementPage/PhoneBookManagementPage";

jest.mock("../../shared/helpers");
jest.mock("store");
jest.mock("../../storage/usersStorage");
jest.mock("../../storage/serviceProvidersStorage");


describe("PhoneBookManagementPage should", () => {
    let wrapper = null;
    let componentInstance = null;
    const history = createMemoryHistory({
        initialEntries: ['/', '/home', '/phoneBook'],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });
    const props = {
        history: history,
        location: {
            pathname: '/phoneBook'
        },
        match: {
            isExact: true,
            path: '/phoneBook',
            url: '/phoneBook',
        }
    };
    const mockStore = {
        serviceProviderId: "549963652",
        userId: "549963652",
    };

    store.get.mockImplementation((key) => mockStore[key]);
    usersStorage.getUsers.mockResolvedValue(users);
    usersStorage.getUserByUserID.mockImplementation((userId) => Promise.resolve(users.filter(user => user.userId === userId)[0]));
    serviceProvidersStorage.getServiceProviders.mockResolvedValue(serviceProviders);
    serviceProvidersStorage.getServiceProviderUserDetails.mockImplementation((serviceProviderId) => Promise.resolve({data: users.filter(user => user.userId === serviceProviderId)[0]}));
    serviceProvidersStorage.getServiceProviderById.mockImplementation((serviceProviderId) => Promise.resolve(serviceProviders.filter(provider =>
        provider.serviceProviderId === serviceProviderId)));

    beforeAll(() => {
    });

    afterAll(() => {
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
    });

    test('match snapshot', async () => {
        const props = {
            location: {
                pathname: '/phoneBook'
            },
            match: {
                isExact: true,
                path: '/phoneBook',
                url: '/phoneBook',
            }
        };

        const arrResponse = setupComponent('shallow', PhoneBookManagementPage, null, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test("renders PhoneBookManagementPage for /phoneBook", async () => {
        const arrResponse = await setupComponent('shallow', PhoneBookManagementPage, history, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(PhoneBookManagementPage)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data", async () => {
        expect(componentInstance.state.users.length).toEqual(1000);
        expect(componentInstance.state.serviceProviders.length).toEqual(400);
        expect(componentInstance.state.pageUsers).toEqual(0);
        expect(componentInstance.state.totalPagesUsers).toEqual(25);
        expect(componentInstance.state.pageServiceProviders).toEqual(0);
        expect(componentInstance.state.totalPagesServiceProviders).toEqual(10);
    });

    test("render with what the user see", async () => {
        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, history, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const mountWrapper = wrapper.find('PhoneBookManagementPage');

        expect(mountWrapper.find('Page')).toHaveLength(2);
        expect(mountWrapper.find('Button')).toHaveLength(4);
        expect(mountWrapper.find('Button').at(0).props().children[1]).toEqual('   יצא לPDF');
        expect(mountWrapper.find('Button').at(2).props().children[1]).toEqual('   יצא לPDF');
        expect(mountWrapper.find('Button').at(1).find('CSVLink').props().children[1]).toEqual('   יצא לExcel');
        expect(mountWrapper.find('Button').at(3).find('CSVLink').props().children[1]).toEqual('   יצא לExcel');
        expect(mountWrapper.find('Table')).toHaveLength(2);
        expect(mountWrapper.find('Table').at(0).props().children).toHaveLength(3);
        expect(mountWrapper.find('Table').at(0).props().children[0].props.children).toHaveLength(2);
        expect(mountWrapper.find('Table').at(0).props().children[0].props.children[0].props.children).toHaveLength(8);
        expect(mountWrapper.find('Table').at(0).props().children[0].props.children[0].props.children[0].props.children).toEqual(strings.phoneBookPageStrings.USER_ID_HEADER);
        expect(mountWrapper.find('Table').at(0).props().children[1].props.children).toHaveLength(40);
        expect(mountWrapper.find('Table').at(1).props().children).toHaveLength(3);
        expect(mountWrapper.find('Table').at(1).props().children[0].props.children).toHaveLength(2);
        expect(mountWrapper.find('Table').at(1).props().children[0].props.children[0].props.children).toHaveLength(8);
        expect(mountWrapper.find('Table').at(1).props().children[0].props.children[0].props.children[0].props.children).toEqual(strings.phoneBookPageStrings.SERVICE_PROVIDER_ID_HEADER);
        expect(mountWrapper.find('Table').at(1).props().children[1].props.children).toHaveLength(40);
        expect(mountWrapper.find('TableBody')).toHaveLength(2);
        expect(mountWrapper.find('TableBody').at(0).props().children).toHaveLength(40);
        expect(mountWrapper.find('TableBody').at(1).props().children).toHaveLength(40);
        expect(mountWrapper.find('TableFooter')).toHaveLength(2);
        expect(mountWrapper.find('TableFooter').find('MenuItem')).toHaveLength(37);
    });

    test("not render ServiceProviderAdd button", async () => {
        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, history, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const mountWrapper = wrapper.find('PhoneBookManagementPage');

        expect(mountWrapper.find('Link')).toHaveLength(80);
        expect(mountWrapper.find('Button')).toHaveLength(4);
        expect(mountWrapper.find('Button').at(0).props().children[1]).toEqual('   יצא לPDF');
        expect(mountWrapper.find('Button').at(2).props().children[1]).toEqual('   יצא לPDF');
        expect(mountWrapper.find('Button').at(1).find('CSVLink').props().children[1]).toEqual('   יצא לExcel');
        expect(mountWrapper.find('Button').at(3).find('CSVLink').props().children[1]).toEqual('   יצא לExcel');
    });

    test("not render UserAdd button", async () => {
        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, history, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const mountWrapper = wrapper.find('PhoneBookManagementPage');

        expect(mountWrapper.find('Link')).toHaveLength(80);
        expect(mountWrapper.find('Button')).toHaveLength(4);
        expect(mountWrapper.find('Button').at(0).props().children[1]).toEqual('   יצא לPDF');
        expect(mountWrapper.find('Button').at(2).props().children[1]).toEqual('   יצא לPDF');
        expect(mountWrapper.find('Button').at(1).find('CSVLink').props().children[1]).toEqual('   יצא לExcel');
        expect(mountWrapper.find('Button').at(3).find('CSVLink').props().children[1]).toEqual('   יצא לExcel');
    });

    test("open UserInfo on click User /phoneBook/user/549963652", async () => {
        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, history, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const userInfoLink = wrapper.find('PhoneBookManagementPage').find('Link').at(0);
        await userInfoLink.simulate('click', {button: 0});

        expect(wrapper.find('Router').prop('history').location.pathname).toEqual('/phoneBook/user/549963652');
        expect(wrapper.find('UserInfo')).toHaveLength(1);
    });

    test("open ServiceProviderInfo on click ServiceProvider /phoneBook/serviceProvider/804790549  ", async () => {
        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, history, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const serviceProviderInfoLink = wrapper.find('PhoneBookManagementPage').find('Link').at(41);
        await serviceProviderInfoLink.simulate('click', {button: 0});

        expect(wrapper.find('Router').prop('history').location.pathname).toEqual('/phoneBook/serviceProvider/804790549');
        expect(wrapper.find('ServiceProviderInfo')).toHaveLength(1);
    });

    test("save as PDF on click", async () => {
        helpers.exportToPDF = jest.fn();

        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, history, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const PDFBtn = wrapper.find('PhoneBookManagementPage').find('Button').at(0);
        await PDFBtn.simulate('click', {button: 0});

        expect(helpers.exportToPDF).toHaveBeenCalledWith('MesheklePhoneBookUsers', 'divUsersToPrint', 'landscape')

        const PDFBtn2 = wrapper.find('PhoneBookManagementPage').find('Button').at(2);
        await PDFBtn2.simulate('click', {button: 0});

        expect(helpers.exportToPDF).toHaveBeenCalledWith('MesheklePhoneBookServiceProviders', 'divServiceProvidersToPrint', 'landscape')
    });

    test("save as Excel on click", async () => {
        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, history, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const excelBtn = wrapper.find('PhoneBookManagementPage').find('CSVLink').at(0);
        await excelBtn.simulate('click', {button: 0});

        expect(componentInstance.state.usersCSV).toHaveLength(1000);

        const excelBtn2 = wrapper.find('PhoneBookManagementPage').find('CSVLink').at(1);
        await excelBtn2.simulate('click', {button: 0});

        expect(componentInstance.state.serviceProvidersCSV).toHaveLength(400);
    });

    test("render page of users on click of another page", async () => {
        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, history, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const setPageUsersSpy = jest.spyOn(componentInstance, 'setPageUsers');

        const page3Btn = wrapper.find('PhoneBookManagementPage').find('MenuItem').at(2);
        await page3Btn.simulate('click', {button: 0});

        expect(setPageUsersSpy).toHaveBeenCalled();
        expect(componentInstance.state.pageUsers).toEqual(2);
    });

    test("render page of serviceProviders on click of another page", async () => {
        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, history, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const setPageServiceProvidersSpy = jest.spyOn(componentInstance, 'setPageServiceProviders');

        const page3Btn = wrapper.find('PhoneBookManagementPage').find('MenuItem').at(30);
        await page3Btn.simulate('click', {button: 0});

        expect(setPageServiceProvidersSpy).toHaveBeenCalled();
        expect(componentInstance.state.pageServiceProviders).toEqual(4);
    });

    test("render next page of users on click", async () => {
        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, history, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.pageUsers).toEqual(0);

        const nextPageBtn = wrapper.find('PhoneBookManagementPage').find('MenuItem').at(25);
        await nextPageBtn.simulate('click', {button: 0});

        expect(componentInstance.state.pageUsers).toEqual(1);
    });

    test("render next page of serviceProviders on click", async () => {
        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, history, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.pageServiceProviders).toEqual(0);

        const nextPageBtn = wrapper.find('PhoneBookManagementPage').find('MenuItem').at(36);
        await nextPageBtn.simulate('click', {button: 0});

        expect(componentInstance.state.pageServiceProviders).toEqual(1);
    });

    test("render previous page of users on click", async () => {
        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, history, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const page10Btn = wrapper.find('PhoneBookManagementPage').find('MenuItem').at(10);
        await page10Btn.simulate('click', {button: 0});

        expect(componentInstance.state.pageUsers).toEqual(10);

        const previousPageBtn = wrapper.find('PhoneBookManagementPage').find('MenuItem').at(0);
        await previousPageBtn.simulate('click', {button: 0});

        expect(componentInstance.state.pageUsers).toEqual(9);
    });
    test("render previous page of serviceProviders on click", async () => {
        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, history, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const page10Btn = wrapper.find('PhoneBookManagementPage').find('MenuItem').at(32);
        await page10Btn.simulate('click', {button: 0});

        expect(componentInstance.state.pageServiceProviders).toEqual(6);

        const previousPageBtn = wrapper.find('PhoneBookManagementPage').find('MenuItem').at(26);
        await previousPageBtn.simulate('click', {button: 0});

        expect(componentInstance.state.pageServiceProviders).toEqual(5);
    });

    test("sort user table by userId when userId column clicked", async () => {
        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, history, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const handleUsersSortSpy = jest.spyOn(componentInstance, 'handleUsersSort');

        const sortBtn = wrapper.find('TableHeaderCell').at(0);
        await sortBtn.simulate('click', {button: 0});

        expect(handleUsersSortSpy).toHaveBeenCalled();
        expect(componentInstance.state.users[0].userId).toEqual("000425698");
        expect(componentInstance.state.users[1].userId).toEqual("000824216");
        expect(componentInstance.state.users[999].userId).toEqual("999809245");
        expect(componentInstance.state.usersColumn).toEqual("userId");
        expect(componentInstance.state.usersDirection).toEqual("ascending");
    });

    test("filter user table by userId", async () => {
        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, history, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const handleFilterSpy = jest.spyOn(componentInstance, 'handleFilter');

        wrapper.find('TableHeaderCell').at(8).find('Input').props().onChange({
            target: {
                value: "580624494"
            }
        });

        expect(handleFilterSpy).toHaveBeenCalled();
        expect(componentInstance.state.users).toHaveLength(1);
        expect(componentInstance.state.users[0].userId).toEqual("580624494");
        expect(componentInstance.state.usersFilterColumnsAndTexts.userId).toEqual("580624494");
        expect(componentInstance.state.usersFilterColumnsAndTexts.fullname).toEqual("");
        expect(componentInstance.state.usersFilterColumnsAndTexts.email).toEqual("");
        expect(componentInstance.state.usersFilterColumnsAndTexts.mailbox).toEqual("");
        expect(componentInstance.state.usersFilterColumnsAndTexts.active).toEqual("");
    });

    test("filter user table by userId and active", async () => {
        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, null, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const handleFilterSpy = jest.spyOn(componentInstance, 'handleFilter');

        await wrapper.find('TableHeaderCell').at(8).find('Input').props().onChange({
            target: {
                value: "58"
            }
        });

        await wrapper.find('PhoneBookManagementPage').find('Checkbox').at(0).simulate('change');

        expect(handleFilterSpy).toHaveBeenCalledTimes(2);
        expect(componentInstance.state.users).toHaveLength(41);
        expect(componentInstance.state.users[0].userId).toEqual("358907060");
        expect(componentInstance.state.usersFilterColumnsAndTexts.userId).toEqual("58");
        expect(componentInstance.state.usersFilterColumnsAndTexts.fullname).toEqual("");
        expect(componentInstance.state.usersFilterColumnsAndTexts.email).toEqual("");
        expect(componentInstance.state.usersFilterColumnsAndTexts.mailbox).toEqual("");
        expect(componentInstance.state.usersFilterColumnsAndTexts.active).toEqual(true);
    });

    test("sort serviceProvider table by serviceProviderId when serviceProviderId column clicked", async () => {
        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, history, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const handleServiceProvidersSortSpy = jest.spyOn(componentInstance, 'handleServiceProvidersSort');

        const sortBtn = wrapper.find('TableHeaderCell').at(17);
        await sortBtn.simulate('click', {button: 0});

        expect(handleServiceProvidersSortSpy).toHaveBeenCalled();
        expect(componentInstance.state.serviceProviders[0].serviceProviderId).toEqual("000425698");
        expect(componentInstance.state.serviceProviders[1].serviceProviderId).toEqual("002070472");
        expect(componentInstance.state.serviceProviders[399].serviceProviderId).toEqual("997674091");
        expect(componentInstance.state.serviceProvidersColumn).toEqual("serviceProviderId");
        expect(componentInstance.state.serviceProvidersDirection).toEqual("ascending");
    });

    test("filter serviceProvider table by serviceProviderId", async () => {
        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, history, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const handleServiceProviderFilterSpy = jest.spyOn(componentInstance, 'handleServiceProviderFilter');

        wrapper.find('TableHeaderCell').at(25).find('Input').props().onChange({
            target: {
                value: "002070472"
            }
        });

        expect(handleServiceProviderFilterSpy).toHaveBeenCalled();
        expect(componentInstance.state.serviceProviders).toHaveLength(1);
        expect(componentInstance.state.serviceProviders[0].serviceProviderId).toEqual("002070472");
        expect(componentInstance.state.serviceProvidersFilterColumnsAndTexts.serviceProviderId).toEqual("002070472");
        expect(componentInstance.state.serviceProvidersFilterColumnsAndTexts.fullname).toEqual("");
        expect(componentInstance.state.serviceProvidersFilterColumnsAndTexts.role).toEqual("");
        expect(componentInstance.state.serviceProvidersFilterColumnsAndTexts.operationTime).toEqual("");
        expect(componentInstance.state.serviceProvidersFilterColumnsAndTexts.phone).toEqual("");
        expect(componentInstance.state.serviceProvidersFilterColumnsAndTexts.appointmentWayType).toEqual("");
        expect(componentInstance.state.serviceProvidersFilterColumnsAndTexts.active).toEqual("");
    });

    test("filter serviceProvider table by serviceProviderId and active", async () => {
        const arrResponse = await setupComponent('mount', PhoneBookManagementPage, null, props, "/phoneBook");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const handleServiceProviderFilterSpy = jest.spyOn(componentInstance, 'handleServiceProviderFilter');

        await wrapper.find('TableHeaderCell').at(25).find('Input').props().onChange({
            target: {
                value: "58"
            }
        });

        await wrapper.find('PhoneBookManagementPage').find('Checkbox').at(1).simulate('change');

        expect(handleServiceProviderFilterSpy).toHaveBeenCalledTimes(2);
        expect(componentInstance.state.serviceProviders).toHaveLength(14);
        expect(componentInstance.state.serviceProviders[0].serviceProviderId).toEqual("358907060");
        expect(componentInstance.state.serviceProvidersFilterColumnsAndTexts.serviceProviderId).toEqual("58");
        expect(componentInstance.state.serviceProvidersFilterColumnsAndTexts.fullname).toEqual("");
        expect(componentInstance.state.serviceProvidersFilterColumnsAndTexts.role).toEqual("");
        expect(componentInstance.state.serviceProvidersFilterColumnsAndTexts.operationTime).toEqual("");
        expect(componentInstance.state.serviceProvidersFilterColumnsAndTexts.phone).toEqual("");
        expect(componentInstance.state.serviceProvidersFilterColumnsAndTexts.appointmentWayType).toEqual("");
        expect(componentInstance.state.serviceProvidersFilterColumnsAndTexts.active).toEqual(true);
    });

});
