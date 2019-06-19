import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import {createMemoryHistory} from 'history';
import UserAdd from "../../../components/user/UserAdd";
import usersStorage from "../../../storage/usersStorage";

jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/serviceProvidersStorage");


describe("UserAdd should", () => {
    let wrapper = null;
    let componentInstance = null;


    const history = createMemoryHistory({
        initialEntries: ['/', '/home', '/phoneBook', '/phoneBook/user/add'],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });

    const history2 = createMemoryHistory({
        initialEntries: ['/', '/home', '/phoneBook', '/phoneBook/user/add'],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });


    const props = {
        history: history,
        location: {
            pathname: '/phoneBook/user/add',
        },
        match: {
            isExact: true,
            path: '/phoneBook/user/add',
            url: '/phoneBook/user/add',
        },
    };
    const props2 = {
        history: history2,
        location: {
            pathname: '/phoneBook/user/add',
        },
        match: {
            isExact: true,
            path: '/phoneBook/user/add',
            url: '/phoneBook/user/add',
        },
    };


    const mockStore = {
        serviceProviderId: "804790549",
        userId: "804790549",
    };

    const userToAdd ={
        "userId": "123123123",
        "fullname": "Glynn Krabbe",
        "password": "0878efd4feafce4d8bbe412bf0343468a589d33a2148a72fcfeee9db8498bde8482db4f6339048e41885761659050555def2673591a55faeab898dc56462eabe",
        "email": "gkrabbe1@shop-pro.jp",
        "mailbox": 2,
        "cellphone": "0594026350",
        "phone": "046919171",
        "bornDate": "1960-03-01T07:22:02.000Z",
        "active": false,
        "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJOSURBVDjLlZLdTxJQGMa96K4/oPUHdFfrpntyZrXsoq25tlbroi6qi7ZuYsuZ0UXRWiv72NS0gjIgDQ1LS0wkwU/UVEREUkEIBBFE+V48ve/ZICza7OLZOTt739/znHPeEgAlhZpyB8+MLa58HHL63H2zy4muycVku8UZahl2TNJ688/6wsbd31yBLps3BNdqFCvrMYRjSURIvOdzzdAcmozWhTaLc+8WADXvHHb6RhYCEdEU2kiIJu/aBtwEywE3k2lQKjz8NB7Sjs7vygPMDu9ddogmUliNxsWaSGfwM5sViqcy+BHeFCl4r6YkzwzTnXlA9/SSh924md25qFDszMnmfGuga4pEd3QjiTxAN/49xY0c10MgjsuOuSssBdfh8IdBSUG1AibTDmbzAHrhZab6IzHQq6N3xo3+LyqY+1phMmig/9AISolm8yyMdo9IcKtt6HcC+h653uoScTsJ0K65jw5yYrWOOISrol6Kht4pcUV+g0efJwx5ADXtUA3a7aMLflHQoa0VzfTSoHMBUClqwL9EM4Lrb01JOt+zZQ7ob/c/N1qDDGEHBugKxO6mOS+qWswZRb/t9F+DxCLHAzQovsfdEyAYXn6d4cHBa7r7NXU/brwbiCpNtsNFJzEnaqp4KjufblDU4XbtJVTJL+BqjQynyvZl6e8P/nOUC1UtvehWNr+BUqlGXX0T7j14gpMVZcFitUUB0ivnBvQ9PQgEgrBYxvBC8QqVxyXz2wboVfKzlSeOxsrLD2VLSyXZY0ck8feN1Ze3Dfgf/QJBCig+4GhFlwAAAABJRU5ErkJggg==",
    };

    store.get.mockImplementation((key) => mockStore[key]);
    usersStorage.createUser.mockResolvedValue({staus:200});


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

    test("renders UserAdd for /phoneBook/user/add", async () => {
        const arrResponse = await setupComponent('shallow', UserAdd, history, props, "/phoneBook/user/add");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(UserAdd)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });


    test("handleSubmit", async () => {
        const arrResponse = await setupComponent('shallow', UserAdd, history, props, "/phoneBook/user/add");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleSubmit(userToAdd);
        expect(componentInstance.props.history.location.pathname).toEqual('/phoneBook');
    });

    test("handleCancel", async () => {
        const arrResponse = await setupComponent('shallow', UserAdd, history2, props2, "/phoneBook/user/add");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleCancel({
            preventDefault() {
            }
        });

        wrapper.update();
        expect(componentInstance.props.history.location.pathname).toEqual('/phoneBook');

    });


    test("render with what the user see on add announcement", async () => {
        const arrResponse = await setupComponent('mount',  UserAdd, history, props, "/phoneBook/user/add");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];


        expect(wrapper.find('UserAdd').find('Modal')).toHaveLength(1);
        expect(wrapper.find('UserAdd').find('Grid')).toHaveLength(1);
        expect(wrapper.find('UserAdd').find('Header')).toHaveLength(1);
        expect(wrapper.find('UserAdd').find('Header').props().children).toEqual('משתמש חדש');
        expect(wrapper.find('UserAdd').find('UserForm')).toHaveLength(1);
    });

});
