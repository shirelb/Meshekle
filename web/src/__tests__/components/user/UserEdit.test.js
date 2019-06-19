import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import {createMemoryHistory} from 'history';
import UserEdit from "../../../components/user/UserEdit";
import usersStorage from "../../../storage/usersStorage";

jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/serviceProvidersStorage");


describe("UserEdit should", () => {
    let wrapper = null;
    let componentInstance = null;

    const userToUpdate={ "userId": "549963652",
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
        initialEntries: ['/', '/home', '/phoneBook', '/phoneBook/user/549963652/','/phoneBook/user/549963652/edit'],
        initialIndex: 4,
        keyLength: 10,
        getUserConfirmation: null
    });

    const history2 = createMemoryHistory({
        initialEntries: ['/', '/home', '/phoneBook', '/phoneBook/user/549963652/','/phoneBook/user/549963652/edit'],
        initialIndex: 4,
        keyLength: 10,
        getUserConfirmation: null
    });


    const props = {
        history: history,
        location: {
            pathname: '/phoneBook/user/549963652/edit',
            state:{user:userToUpdate},
        },
        match: {
            isExact: true,
            path: '/phoneBook/user/549963652/edit',
            url: '/phoneBook/user/549963652/edit',
        },
    };
    const props2 = {
        history: history2,
        location: {
            pathname: '/phoneBook/user/549963652/edit',
            state:{user:userToUpdate},
        },
        match: {
            isExact: true,
            path: '/phoneBook/user/549963652/edit',
            url: '/phoneBook/user/549963652/edit',
        },
    };

    const mockStore = {
        serviceProviderId: "804790549",
        userId: "804790549",
    };

    store.get.mockImplementation((key) => mockStore[key]);
    usersStorage.getUserByUserID.mockResolvedValue(userToUpdate);
    usersStorage.updateUserById.mockResolvedValue({staus:200});


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
    //
    // test.skip('match snapshot with slotInfo', async () => {
    //     const props = {
    //         location: {
    //             pathname: '/appointments/set',
    //             state: {
    //                 slotInfo: slotInfo
    //             }
    //         },
    //         match: {
    //             isExact: true,
    //             path: '/appointments/set',
    //             url: '/appointments/set',
    //         },
    //         serviceProviderRoles:["appointmentsHairDresser"],
    //     };
    //
    //     const arrResponse = setupComponent('shallow', AppointmentAdd, null, props, "/appointments/set");
    //     wrapper = arrResponse[0];
    //     componentInstance = arrResponse[1];
    //
    //     expect(componentInstance).toMatchSnapshot();
    // });
    //
    // test.skip('match snapshot with appointmentRequestDropped', async () => {
    //     const props = {
    //         location: {
    //             pathname: '/appointments/set',
    //             state: {
    //                 appointmentRequestDropped: appointmentRequestDropped
    //             }
    //         },
    //         match: {
    //             isExact: true,
    //             path: '/appointments/set',
    //             url: '/appointments/set',
    //         },
    //         serviceProviderRoles:["appointmentsHairDresser"],
    //     };
    //
    //     const arrResponse = setupComponent('shallow', AppointmentAdd, null, props, "/appointments/set");
    //     wrapper = arrResponse[0];
    //     componentInstance = arrResponse[1];
    //
    //     expect(componentInstance).toMatchSnapshot();
    // });

    test("renders UserEdit for /phoneBook/user/549963652/edit", async () => {
        const arrResponse = await setupComponent('shallow', UserEdit, history, props, "/phoneBook/user/549963652/edit");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(UserEdit)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data for user in edit user", async () => {
        const arrResponse = await setupComponent('shallow', UserEdit, history, props, "/phoneBook/user/549963652/edit");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.user).toBeDefined();
        expect(componentInstance.state.user).toEqual(userToUpdate);
    });


    test("handleSubmit", async () => {
        const arrResponse = await setupComponent('shallow', UserEdit, history, props, "/phoneBook/user/549963652/edit");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleSubmit(userToUpdate);
        expect(componentInstance.props.history.location.pathname).toEqual('/phoneBook');
    });

    test("handleCancel", async () => {
        const arrResponse = await setupComponent('shallow', UserEdit, history2, props2, "/phoneBook/user/549963652/edit");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleCancel({
            preventDefault() {
            }
        });

        wrapper.update();
        expect(componentInstance.props.history.location.pathname).toEqual('/phoneBook/user/549963652/');

    });


    test("render with what the user see on edit user", async () => {
        const arrResponse = await setupComponent('mount',  UserEdit, history, props, "/phoneBook/user/549963652/edit");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];


        expect(wrapper.find('UserEdit').find('Modal')).toHaveLength(1);
        expect(wrapper.find('UserEdit').find('Grid')).toHaveLength(1);
        expect(wrapper.find('UserEdit').find('Header')).toHaveLength(1);
        expect(wrapper.find('UserEdit').find('Header').props().children).toEqual('ערוך משתמש');
        expect(wrapper.find('UserEdit').find('UserForm')).toHaveLength(1);
    });

});
