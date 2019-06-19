import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import moment from 'moment';
import {createMemoryHistory} from 'history';
import UserInfo from "../../../components/user/UserInfo";
import usersStorage from "../../../storage/usersStorage";
import users from "../../jsons/users";
import strings from "../../../shared/strings";


jest.mock("store");
jest.mock("../../../storage/usersStorage");


describe("UserInfo should", () => {
    let wrapper = null;
    let componentInstance = null;
    const userToDisplay={ "userId": "549963652",
        "fullname": "Padget Creaser",
        "password": "0878efd4feafce4d8bbe412bf0343468a589d33a2148a72fcfeee9db8498bde8482db4f6339048e41885761659050555def2673591a55faeab898dc56462eabe",
        "email": "pcreaser0@timesonline.co.uk",
        "mailbox": 1,
        "cellphone": "0543755416",
        "phone": "040450354",
        "bornDate": "1964-11-06T13:41:51.000Z",
        "active": false,
        "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALoSURBVDjLbVNbSJNhGH7+7z9scyqepi6JobKmE5ZigSWpYV5UskYZkRJk0lVeVN5GF96EF0kXZXRVFHWTKynqKijFQmvqTYRMcWuYodtS59zxP/T9vwdc9P08vP93eJ738L0foygKdkbb7bHLhlxdF2HQSqcM/RJQGEiSqFsNK0PjA429+GcwewVO3fmcetZbzxOqsLOs2mA0hReeNSz5EvE5rzd/9P7p5A6H7FVjWSLyLIFvlYN/jcVcmMGPFaDcZITr0D6UW/UGLtf4eC8nQ0BRw95eJAyzi99/4rBkp3H1SCFYnj3/X4H+/n4DlSBqyByrggFLU1HtPI1kMiBCx7NgOEbu7u42ZAhQcg81K9S9oKbOMUTb4CmZoxHoBBZ6CoWu0oiEZDK50tHR0aOlTQhpM5vNL5ubm4WxnwrOHDYjlqaeKFGR1VSo6qYHBeEnMBTWYsSzipsd9cLy8rJzcHDwC0dF7jY0NKC4uBgHIw9wb+B9xjXxrIz22kWYatox7r6F+oQJVus1uFwuBAKBh6qAzW63a4edTidsNluGwGbgLa1DNXLNdagqGUGptQ1FRUUahoeHKzhJkgQK7bDf79c2QqHQVoHEEAwr71BxtBNS5A1M9k6EJl5DTJ8EQ1isr68zRBRFLCwsaFCJtECIRqMUG7SDPqK46iyQmMbXp8+RnRdHVtKHec/ILodLp9NYXFzUPMZiMaiCqVQKurQfBUYeOfkx6t0HtaJS9BvKW/ow++ERopZcBIPBLQGVoA69Xg+3200rr6DRNI28E5cgxyYpN476czbIqSXojV6Yba2Y932CyiWULEciEU1ATaG6xoHjjhxU1rQgKycERQzT/mQx9cpLT8iQE16YDlhAfo2hNEcB63A4ymZnZ4WZmZmSzeou3LjQhLWJAViaroPQlmT4/SD6KpTVHdMsI1SCM1qhy7YgPzz6PeM1XhmalDjaWhc3+sBK9CXLyjbkbWz9EykZhzpXlKm/wwxDbisZJhAAAAAASUVORK5CYII=",
    };

    const history = createMemoryHistory({
        initialEntries: ['/', '/home', '/phoneBook', '/phoneBook/user/549963652'],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });
    const props = {
        history: history,
        location: {
            pathname: '/phoneBook/user/549963652',
            state: {
                user:userToDisplay,
            }
        },
        match: {
            isExact: true,
            path: '/phoneBook/user/549963652',
            url: '/phoneBook/user/549963652',
            params: {userId:"549963652"}
        },
        hasPhoneBookPermissions:true,
    };
    const mockStore = {
        serviceProviderId: "804790549",
        userId: "804790549",
    };

    store.get.mockImplementation((key) => mockStore[key]);
    usersStorage.getUsers.mockResolvedValue(users);
    usersStorage.getUserByUserID.mockImplementation((userId) => Promise.resolve(users.filter(user => user.userId === userId)[0]));
    usersStorage.deleteUserByUserID.mockResolvedValue({status:200});

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

    // test.skip('match snapshot', async () => {
    //     const props = {
    //         location: {
    //             pathname: '/appointments/428',
    //             state: {
    //                 appointment: appointmentTest
    //             }
    //         },
    //         match: {
    //             isExact: true,
    //             path: '/appointments/428',
    //             url: '/appointments/428',
    //         },
    //         serviceProviderRoles: ["appointmentsHairDresser"],
    //     };
    //
    //     const arrResponse = setupComponent('shallow', AppointmentInfo, null, props, "/appointments/428");
    //     wrapper = arrResponse[0];
    //     componentInstance = arrResponse[1];
    //
    //     expect(componentInstance).toMatchSnapshot();
    // });

    test("renders UserInfo for /phoneBook/user/549963652", async () => {
        const arrResponse = await setupComponent('shallow', UserInfo, history, props, "/phoneBook/user/549963652");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(UserInfo)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data", async () => {
        const arrResponse = await setupComponent('shallow', UserInfo, history, props, "/phoneBook/user/549963652");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.user).toBeDefined();
        expect(componentInstance.state.user.userId).toEqual(userToDisplay.userId);
        expect(componentInstance.state.user.fullname).toEqual(userToDisplay.fullname);
        expect(componentInstance.state.user.password).toEqual(userToDisplay.password);
        expect(componentInstance.state.user.email).toEqual(userToDisplay.email);
        expect(componentInstance.state.user.mailbox).toEqual(userToDisplay.mailbox);
        expect(componentInstance.state.user.cellphone).toEqual(userToDisplay.cellphone);
        expect(componentInstance.state.user.phone).toEqual(userToDisplay.phone);
        expect(componentInstance.state.user.bornDate).toEqual(userToDisplay.bornDate);
        expect(componentInstance.state.user.active).toEqual(userToDisplay.active);
        expect(componentInstance.state.user.image).toEqual(userToDisplay.image);

    });

    test("handleDelete", async () => {
        const arrResponse = await setupComponent('shallow', UserInfo, history, props, "/phoneBook/user/549963652");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleDelete();
        expect(componentInstance.props.history.location.pathname).toEqual('/phoneBook');
    });

    test("handleEdit", async () => {
        const arrResponse = await setupComponent('shallow', UserInfo, history, props, "/phoneBook/user/549963652");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleEdit();
        expect(componentInstance.props.history.location.pathname).toEqual('/phoneBook/user/549963652/edit');
    });

    test("handleDelete on click delete button", async () => {
        const arrResponse = await setupComponent('shallow', UserInfo, history, props, "/phoneBook/user/549963652");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('UserInfo').dive().find('Button').at(2).simulate('click')
        expect(componentInstance.props.history.location.pathname).toEqual('/phoneBook');
    });

    test("handleEdit on click edit button", async () => {
        const arrResponse = await setupComponent('shallow', UserInfo, history, props, "/phoneBook/user/549963652");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('UserInfo').dive().find('Button').at(1).simulate('click')
        expect(componentInstance.props.history.location.pathname).toEqual('/phoneBook/user/549963652/edit');
    });

    test("render with what the user see", async () => {
        const arrResponse = await setupComponent('shallow', UserInfo, history, props, "/phoneBook/user/549963652");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('UserInfo').dive();

        expect(shallowWrapper.find('Modal')).toHaveLength(1);
        expect(shallowWrapper.find('ModalHeader')).toHaveLength(1);
        expect(shallowWrapper.find('ModalHeader').props().children).toEqual(userToDisplay.fullname);
        expect(shallowWrapper.find('ModalContent')).toHaveLength(1);
        expect(shallowWrapper.find('ModalContent').find('Image').props().src).toEqual(userToDisplay.image);
        expect(shallowWrapper.find('p')).toHaveLength(8);
        expect(shallowWrapper.find('p').at(0).props().children[0]).toEqual(strings.phoneBookPageStrings.USER_ID_HEADER);
        expect(shallowWrapper.find('p').at(0).props().children[2]).toEqual(userToDisplay.userId);
        expect(shallowWrapper.find('p').at(1).props().children[0]).toEqual(strings.phoneBookPageStrings.FULLNAME_HEADER);
        expect(shallowWrapper.find('p').at(1).props().children[2]).toEqual(userToDisplay.fullname);
        expect(shallowWrapper.find('p').at(2).props().children[0]).toEqual(strings.phoneBookPageStrings.EMAIL_HEADER);
        expect(shallowWrapper.find('p').at(2).props().children[2]).toEqual(userToDisplay.email);
        expect(shallowWrapper.find('p').at(3).props().children[0]).toEqual(strings.phoneBookPageStrings.MAILBOX_HEADER);
        expect(shallowWrapper.find('p').at(3).props().children[2]).toEqual(userToDisplay.mailbox);
        expect(shallowWrapper.find('p').at(4).props().children[0]).toEqual(strings.phoneBookPageStrings.CELLPHONE_HEADER);
        expect(shallowWrapper.find('p').at(4).props().children[2]).toEqual(userToDisplay.cellphone);
        expect(shallowWrapper.find('p').at(5).props().children[0]).toEqual(strings.phoneBookPageStrings.PHONE_HEADER);
        expect(shallowWrapper.find('p').at(5).props().children[2]).toEqual(userToDisplay.phone);
        expect(shallowWrapper.find('p').at(6).props().children[0]).toEqual(strings.phoneBookPageStrings.BORN_DATE_HEADER);
        expect(shallowWrapper.find('p').at(6).props().children[2]).toEqual("06/11/1964");
        expect(shallowWrapper.find('p').at(7).props().children[0]).toEqual(strings.phoneBookPageStrings.ACTIVE_HEADER);
        expect(shallowWrapper.find('p').at(7).props().children[2]).toEqual("לא");

        expect(shallowWrapper.find('Button').at(0).props().children).toEqual("חדש סיסמא");

        expect(shallowWrapper.find('ModalActions')).toHaveLength(1);
        expect(shallowWrapper.find('Button')).toHaveLength(4);
        expect(shallowWrapper.find('Button').at(1).props().children).toEqual("ערוך");
        expect(shallowWrapper.find('Button').at(1).props().positive).toBeTruthy();
        expect(shallowWrapper.find('Button').at(2).props().children).toEqual("מחק");
        expect(shallowWrapper.find('Button').at(2).props().negative).toBeTruthy();
        expect(shallowWrapper.find('Button').at(3).props().children).toEqual("סגור");
      });
});
