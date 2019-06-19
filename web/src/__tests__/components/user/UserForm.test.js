import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import moment from 'moment';
import {createMemoryHistory} from 'history';
import UserForm from "../../../components/user/UserForm";


jest.mock("store");
jest.mock("../../../storage/usersStorage");


describe("UserForm should", () => {
    let wrapper = null;
    let componentInstance = null;
    const addPath = '/phoneBook/user/add';
    const editPath = '/phoneBook/user/549963652/edit';

    const userToEdit={ "userId": "549963652",
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

    const addHistory = createMemoryHistory({
        initialEntries: ['/', '/home', '/phoneBook', addPath],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });
    const editHistory = createMemoryHistory({
        initialEntries: ['/', '/home', '/phoneBook', editPath],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });

    const addProps = {
        history: addHistory,
        location: {
            pathname: addPath,
        },
        match: {
            isExact: true,
            path: addPath,
            url: addPath,
        },
        handleSubmit: jest.fn().mockResolvedValue({data:{status:200}}),
        submitText:'הוסף',
    };

    const editProps = {
        history: editHistory,
        location: {
            pathname: editPath,
        },
        match: {
            isExact: true,
            path: editPath,
            url: editPath,
        },
        user:userToEdit,
        handleSubmit: jest.fn().mockResolvedValue({data:{status:200}}),
        submitText:'עדכן',
    };

    const mockStore = {
        serviceProviderId: "804790549",
        userId: "804790549",
    };


    store.get.mockImplementation((key) => mockStore[key]);

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
    //     const arrResponse = setupComponent('shallow', AppointmentForm, null, buildProps(null, pathAdd, {
    //         slotInfo: slotInfo,
    //         submitText: "קבע",
    //     }), pathAdd);
    //
    //     wrapper = arrResponse[0];
    //     componentInstance = arrResponse[1];
    //
    //     expect(componentInstance).toMatchSnapshot();
    // });
    //
    // test.skip('match snapshot with appointment', async () => {
    //     const arrResponse = setupComponent('shallow', AppointmentForm, null, buildProps(null, pathEdit, {
    //         appointment: appointmentTest,
    //         submitText: "עדכן"
    //     }), pathEdit);
    //     wrapper = arrResponse[0];
    //     componentInstance = arrResponse[1];
    //
    //     expect(componentInstance).toMatchSnapshot();
    // });
    //
    // test.skip('match snapshot with appointmentRequest', async () => {
    //     const arrResponse = setupComponent('shallow', AppointmentForm, null, buildProps(null, pathAdd, {
    //         appointmentRequestEvent: appointmentRequestTest,
    //         submitText: "קבע",
    //     }), pathAdd);
    //
    //     wrapper = arrResponse[0];
    //     componentInstance = arrResponse[1];
    //
    //     expect(componentInstance).toMatchSnapshot();
    // });

    test("renders UserForm for "+addPath, async () => {
        const arrResponse = await setupComponent('shallow', UserForm, addHistory, addProps, addPath);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(UserForm)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("renders AppointmentForm for "+editPath, async () => {
        const arrResponse = await setupComponent('shallow', UserForm, editHistory, editProps, editPath);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(UserForm)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data for Add user", async () => {
        const arrResponse = await setupComponent('shallow', UserForm, addHistory, addProps, addPath);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.user).toBeDefined();
        expect(componentInstance.state.user.userId).toEqual('');
        expect(componentInstance.state.user.fullname).toEqual('');
        expect(componentInstance.state.user.password).toEqual('');
        expect(componentInstance.state.user.email).toEqual('');
        expect(componentInstance.state.user.mailbox).toEqual(0);
        expect(componentInstance.state.user.cellphone).toEqual('');
        expect(componentInstance.state.user.phone).toEqual('');
        expect(componentInstance.state.user.bornDate).toEqual(null);
        expect(componentInstance.state.user.active).toEqual(true);
        expect(componentInstance.state.user.image).toEqual('');

    });

    test("mounted with the right data for edit user", async () => {
        const arrResponse = await setupComponent('shallow', UserForm, editHistory, editProps, editPath);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.user).toBeDefined();
        expect(componentInstance.state.user.userId).toEqual(userToEdit.userId);
        expect(componentInstance.state.user.fullname).toEqual(userToEdit.fullname);
        expect(componentInstance.state.user.password).toEqual(userToEdit.password);
        expect(componentInstance.state.user.email).toEqual(userToEdit.email);
        expect(componentInstance.state.user.mailbox).toEqual(userToEdit.mailbox);
        expect(componentInstance.state.user.cellphone).toEqual(userToEdit.cellphone);
        expect(componentInstance.state.user.phone).toEqual(userToEdit.phone);
        expect(componentInstance.state.user.bornDate).toEqual(moment(userToEdit.bornDate));
        expect(componentInstance.state.user.active).toEqual(userToEdit.active);
        expect(componentInstance.state.user.image).toEqual(userToEdit.image);

    });
    test("handleSubmit with empty fields", async () => {
        const arrResponse = await setupComponent('mount', UserForm, addHistory, addProps, addPath);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('UserForm').find('FormButton').at(0).props().onClick({
            preventDefault() {
            }
        });
        expect(componentInstance.state.formError).toEqual(true);
    });

    test("handleSubmit in edit mode", async () => {
        const arrResponse = await setupComponent('mount', UserForm, editHistory, editProps, editPath);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('UserForm').find('FormButton').at(0).props().onClick({
            preventDefault() {
            }
        });

        expect(componentInstance.state.user.userId).toEqual("");
    });

    test("handleChange", async () => {
        const handleChangeSpy = jest.spyOn(UserForm.prototype, 'handleChange');
        const arrResponse = await setupComponent('mount', UserForm, addHistory, addProps, addPath);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('UserForm').find('FormInput').at(1).props().onChange(
            {},
            {
                name: 'fullname',
                value: 'newFullname'
            }
        );

        expect(handleChangeSpy).toHaveBeenCalled();
        expect(handleChangeSpy.mock.instances[0].state.user.fullname).toEqual('newFullname');
    });

    test("handleClear", async () => {
        const arrResponse = await setupComponent('mount', UserForm, addHistory, addProps, addPath);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        wrapper.find('UserForm').find('FormButton').at(2).props().onClick({
            preventDefault() {
            }
        });
        expect(componentInstance.state.user.userId).toEqual('');
    });

    test("render with what the user see for "+addPath, async () => {
        const arrResponse = await setupComponent('shallow', UserForm, addHistory, addProps, addPath);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('UserForm').dive();

        expect(shallowWrapper.find('Form')).toHaveLength(1);
        expect(shallowWrapper.find('FormInput')).toHaveLength(9);
        expect(shallowWrapper.find('FormInput').at(0).props().name).toEqual('userId');
        expect(shallowWrapper.find('FormInput').at(0).props().label).toEqual('ת.ז.');
        expect(shallowWrapper.find('FormInput').at(0).props().value).toEqual('');

        expect(shallowWrapper.find('FormInput').at(1).props().name).toEqual('fullname');
        expect(shallowWrapper.find('FormInput').at(1).props().label).toEqual('שם מלא');
        expect(shallowWrapper.find('FormInput').at(1).props().value).toEqual('');

        expect(shallowWrapper.find('FormInput').at(2).props().name).toEqual('email');
        expect(shallowWrapper.find('FormInput').at(2).props().label).toEqual('אימייל');
        expect(shallowWrapper.find('FormInput').at(2).props().value).toEqual('');

        expect(shallowWrapper.find('FormInput').at(3).props().name).toEqual('mailbox');
        expect(shallowWrapper.find('FormInput').at(3).props().label).toEqual('תיבת דואר');
        expect(shallowWrapper.find('FormInput').at(3).props().value).toEqual(0);

        expect(shallowWrapper.find('FormInput').at(4).props().name).toEqual('cellphone');
        expect(shallowWrapper.find('FormInput').at(4).props().label).toEqual('פלאפון');
        expect(shallowWrapper.find('FormInput').at(4).props().value).toEqual('');

        expect(shallowWrapper.find('FormInput').at(5).props().name).toEqual('phone');
        expect(shallowWrapper.find('FormInput').at(5).props().label).toEqual('טלפון');
        expect(shallowWrapper.find('FormInput').at(5).props().value).toEqual('');

        expect(shallowWrapper.find('FormInput').at(6).props().name).toEqual('bornDate');
        expect(shallowWrapper.find('FormInput').at(6).props().label).toEqual('תאריך לידה');
        expect(shallowWrapper.find('FormInput').at(6).find('DateTime').props().value).toEqual(null);

        expect(shallowWrapper.find('FormInput').at(7).props().name).toEqual('image');
        expect(shallowWrapper.find('FormInput').at(7).props().label).toEqual('תמונה');
        expect(shallowWrapper.find('Image')).toHaveLength(0);

        expect(shallowWrapper.find('FormInput').at(8).props().name).toEqual('active');
        expect(shallowWrapper.find('FormInput').at(8).props().label).toEqual('פעיל');
        expect(shallowWrapper.find('FormInput').at(8).find("Checkbox").props().checked).toEqual(true);


        expect(shallowWrapper.find('Message')).toHaveLength(0);

        expect(shallowWrapper.find('FormButton')).toHaveLength(3);
        expect(shallowWrapper.find('FormButton').at(0).props().children).toEqual("הוסף");
        expect(shallowWrapper.find('FormButton').at(0).props().positive).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(0).props().type).toEqual("submit");
        expect(shallowWrapper.find('FormButton').at(1).props().children).toEqual("בטל");
        expect(shallowWrapper.find('FormButton').at(1).props().negative).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(2).props().children).toEqual("נקה הכל");
    });
    test("render with what the user see for "+editPath, async () => {
        const arrResponse = await setupComponent('shallow', UserForm, editHistory, editProps, editPath);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('UserForm').dive();

        expect(shallowWrapper.find('Form')).toHaveLength(1);
        expect(shallowWrapper.find('FormInput')).toHaveLength(9);
        expect(shallowWrapper.find('FormInput').at(0).props().name).toEqual('userId');
        expect(shallowWrapper.find('FormInput').at(0).props().label).toEqual('ת.ז.');
        expect(shallowWrapper.find('FormInput').at(0).props().value).toEqual(userToEdit.userId);

        expect(shallowWrapper.find('FormInput').at(1).props().name).toEqual('fullname');
        expect(shallowWrapper.find('FormInput').at(1).props().label).toEqual('שם מלא');
        expect(shallowWrapper.find('FormInput').at(1).props().value).toEqual(userToEdit.fullname);

        expect(shallowWrapper.find('FormInput').at(2).props().name).toEqual('email');
        expect(shallowWrapper.find('FormInput').at(2).props().label).toEqual('אימייל');
        expect(shallowWrapper.find('FormInput').at(2).props().value).toEqual(userToEdit.email);

        expect(shallowWrapper.find('FormInput').at(3).props().name).toEqual('mailbox');
        expect(shallowWrapper.find('FormInput').at(3).props().label).toEqual('תיבת דואר');
        expect(shallowWrapper.find('FormInput').at(3).props().value).toEqual(userToEdit.mailbox);

        expect(shallowWrapper.find('FormInput').at(4).props().name).toEqual('cellphone');
        expect(shallowWrapper.find('FormInput').at(4).props().label).toEqual('פלאפון');
        expect(shallowWrapper.find('FormInput').at(4).props().value).toEqual(userToEdit.cellphone);

        expect(shallowWrapper.find('FormInput').at(5).props().name).toEqual('phone');
        expect(shallowWrapper.find('FormInput').at(5).props().label).toEqual('טלפון');
        expect(shallowWrapper.find('FormInput').at(5).props().value).toEqual(userToEdit.phone);

        expect(shallowWrapper.find('FormInput').at(6).props().name).toEqual('bornDate');
        expect(shallowWrapper.find('FormInput').at(6).props().label).toEqual('תאריך לידה');
        expect(shallowWrapper.find('FormInput').at(6).find('DateTime').props().value).toEqual(moment(userToEdit.bornDate));

        expect(shallowWrapper.find('FormInput').at(7).props().name).toEqual('image');
        expect(shallowWrapper.find('FormInput').at(7).props().label).toEqual('תמונה');
        expect(shallowWrapper.find('Image')).toHaveLength(1);
        expect(shallowWrapper.find('Image').props().src).toEqual(userToEdit.image);

        expect(shallowWrapper.find('FormInput').at(8).props().name).toEqual('active');
        expect(shallowWrapper.find('FormInput').at(8).props().label).toEqual('פעיל');
        expect(shallowWrapper.find('FormInput').at(8).find("Checkbox").props().checked).toEqual(userToEdit.active);


        expect(shallowWrapper.find('Message')).toHaveLength(0);

        expect(shallowWrapper.find('FormButton')).toHaveLength(3);
        expect(shallowWrapper.find('FormButton').at(0).props().children).toEqual("עדכן");
        expect(shallowWrapper.find('FormButton').at(0).props().positive).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(0).props().type).toEqual("submit");
        expect(shallowWrapper.find('FormButton').at(1).props().children).toEqual("בטל");
        expect(shallowWrapper.find('FormButton').at(1).props().negative).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(2).props().children).toEqual("נקה הכל");
    });


});
