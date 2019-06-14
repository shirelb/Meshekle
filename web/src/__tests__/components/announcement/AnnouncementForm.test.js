import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import moment from 'moment';
import {createMemoryHistory} from 'history';
import AnnouncementForm from "../../../components/announcement/AnnouncementForm";
import serviceProvidersStorage from "../../../storage/serviceProvidersStorage";
import announcementsStorage from "../../../storage/announcementsStorage";
import usersStorage from "../../../storage/usersStorage";
import users from "../../jsons/users";
import serviceProviders from "../../jsons/serviceProviders";
import answeredAnnouncements from "../../jsons/answeredAnnouncements";
import categories from "../../jsons/categories";


jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/announcementsStorage");


describe("AnnouncementsForm should", () => {
    let wrapper = null;
    let componentInstance = null;
    const pathAdd = '/announcements/announcementsAdd';
    const pathEdit = '/announcements/updateAnnouncements';

    const addHistory = createMemoryHistory({
        initialEntries: ['/', '/home', '/announcements', pathAdd],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });
    const editHistory = createMemoryHistory({
        initialEntries: ['/', '/home', '/appointments', pathEdit],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });

    const announcementToUpdate={
        "announcementId": 3,
        "serviceProviderId": "900261801",
        "userId": "549963652",
        "categoryId": 2,
        "creationTime": "2020-05-20",
        "title": "third example",
        "content": "announcement example 3",
        "expirationTime": "2019-06-22T",
        "file": "",
        "fileName": "",
        "dateOfEvent": "2020-06-21T",
        "status":"On air",
        "categoryName":"Sport"
    };

    const addProps = {
        history: addHistory,
        location: {
            pathname: '/announcement/addAnnouncement',
        },
        match: {
            isExact: true,
            path: '/announcement/addAnnouncement',
            url: '/announcement/addAnnouncement',
        },
        categories:categories,
        handleSubmit: (announcement) => true,
        submitText:'קבע',

    };

    const editProps = {
        history: editHistory,
        location: {
            pathname: '/announcements/updateAnnouncement',
        },
        match: {
            isExact: true,
            path: '/announcements/updateAnnouncement',
            url: '/announcements/updateAnnouncement',
        },
        announcement:announcementToUpdate,
        categories:categories,
        handleSubmit: (announcement) => true,
        submitText:'קבע',

    };

    const mockStore = {
        serviceProviderId: "900261801",
        userId: "900261801",
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

    test.skip('match snapshot with slotInfo', async () => {
        const arrResponse = setupComponent('shallow', AppointmentForm, null, buildProps(null, pathAdd, {
            slotInfo: slotInfo,
            submitText: "קבע",
        }), pathAdd);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });



    test.skip('match snapshot with add announcement', async () => {
        const arrResponse = await setupComponent('shallow', AnnouncementForm, addHistory,addProps, pathAdd);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test.skip('match snapshot with edit announcement ', async () => {
        const arrResponse = await setupComponent('shallow', AnnouncementForm, editHistory,editProps, pathEdit);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test("renders AnnouncementForm for /announcements/addAnnouncements", async () => {
        const arrResponse = await setupComponent('shallow', AnnouncementForm, addHistory,addProps, pathAdd);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(AnnouncementForm)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("renders AnnouncementForm for /announcements/updateAnnouncement", async () => {
        const arrResponse = await setupComponent('shallow', AnnouncementForm, editHistory,editProps, pathEdit);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(AnnouncementForm)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });


    test("mounted with the right data for Add announcement", async () => {
        const arrResponse = await setupComponent('shallow', AnnouncementForm, addHistory,addProps, pathAdd);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.announcement).toBeDefined();
        expect(componentInstance.state.announcement.title).toEqual('');
        expect(componentInstance.state.announcement.content).toEqual('');
        expect(componentInstance.state.announcement.categoryName).toEqual('');
        expect(componentInstance.state.announcement.expirationTime).toEqual('');
        expect(componentInstance.state.announcement.dateOfEvent).toEqual('');
        expect(componentInstance.state.announcement.file).toEqual('');
        expect(componentInstance.state.announcement.fileName).toEqual('');
    });
    test("mounted with the right data for edit announcement", async () => {
        const arrResponse = await setupComponent('shallow', AnnouncementForm, editHistory,editProps, pathEdit);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.announcement).toBeDefined();
        expect(componentInstance.state.announcement.title).toEqual(announcementToUpdate.title);
        expect(componentInstance.state.announcement.content).toEqual(announcementToUpdate.content);
        expect(componentInstance.state.announcement.categoryName).toEqual(announcementToUpdate.categoryName);
        expect(componentInstance.state.announcement.expirationTime).toEqual(announcementToUpdate.expirationTime.substring(0,announcementToUpdate.expirationTime.indexOf('T')));
        expect(componentInstance.state.announcement.dateOfEvent).toEqual(announcementToUpdate.dateOfEvent.substring(0,announcementToUpdate.dateOfEvent.indexOf('T')));
        expect(componentInstance.state.announcement.file).toEqual(announcementToUpdate.file);
        expect(componentInstance.state.announcement.fileName).toEqual(announcementToUpdate.fileName);
    });

    test("handleSubmit with empty fields", async () => {
        const arrResponse = await setupComponent('mount', AnnouncementForm, addHistory,addProps, pathAdd);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('AnnouncementForm').find('Form').simulate('submit', {
            preventDefault() {
            }
        });
        expect(componentInstance.state.formError).toEqual(true);
    });

    test("handleSubmit in edit announcement", async () => {
        const arrResponse = await setupComponent('mount', AnnouncementForm, editHistory,editProps, pathEdit);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('AnnouncementForm').find('Form').simulate('submit', {
            preventDefault() {
            }
        });
        expect(componentInstance.state.announcement).toEqual({});
    });


    test("handleChange", async () => {
        const handleChangeSpy = jest.spyOn(AnnouncementForm.prototype, 'handleChange');

        const arrResponse = await setupComponent('mount', AnnouncementForm, addHistory,addProps, pathAdd);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];


        await wrapper.find('AnnouncementForm').find('FormField').at(1).props().onChange(
            {},
            {
                name: 'content',
                value: 'this is the new content'
            }
        );

        expect(handleChangeSpy).toHaveBeenCalled();
        expect(handleChangeSpy.mock.instances[0].state.announcement.content).toEqual('this is the new content');
    });

    test("handleClear", async () => {

        const arrResponse = await setupComponent('mount', AnnouncementForm, addHistory,addProps, pathAdd);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];


        wrapper.find('AnnouncementForm').find('FormButton').at(2).props().onClick({
            preventDefault() {
            }
        });
        expect(componentInstance.state.announcement.title).toEqual('');
    });

    test("render with what the user see for /announcements/addAnnouncements", async () => {

        const arrResponse = await setupComponent('shallow', AnnouncementForm, addHistory,addProps, pathAdd);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];


        const shallowWrapper = wrapper.find('AnnouncementForm').dive();

        expect(shallowWrapper.find('Form')).toHaveLength(1);
        expect(shallowWrapper.find('FormField')).toHaveLength(5);
        expect(shallowWrapper.find('FormField').at(0).props().name).toEqual('title');
        expect(shallowWrapper.find('FormField').at(0).props().label).toEqual('כותרת');
        expect(shallowWrapper.find('FormField').at(0).props().value).toEqual('');
        expect(shallowWrapper.find('FormField').at(1).props().name).toEqual('content');
        expect(shallowWrapper.find('FormField').at(1).props().label).toEqual('תוכן');
        expect(shallowWrapper.find('FormField').at(1).props().value).toEqual('');
        expect(shallowWrapper.find('FormField').at(2).props().name).toEqual('categoryName');
        expect(shallowWrapper.find('FormField').at(2).props().label).toEqual('שם קטגוריה');
        expect(shallowWrapper.find('FormField').at(2).props().value).toEqual('');
        expect(shallowWrapper.find('FormField').at(3).props().label).toEqual('תאריך תפוגה');
        expect(shallowWrapper.find('FormField').at(3).props().value).toEqual('');
        expect(shallowWrapper.find('FormField').at(4).props().label).toEqual('תאריך אירוע');
        expect(shallowWrapper.find('FormField').at(4).props().value).toEqual('');


        expect(shallowWrapper.find('Message')).toHaveLength(0);
        expect(shallowWrapper.find('input')).toHaveLength(1);

        expect(shallowWrapper.find('FormButton')).toHaveLength(3);
        expect(shallowWrapper.find('FormButton').at(0).props().children).toEqual("קבע");
        expect(shallowWrapper.find('FormButton').at(0).props().positive).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(0).props().type).toEqual("submit");
        expect(shallowWrapper.find('FormButton').at(1).props().children).toEqual("בטל");
        expect(shallowWrapper.find('FormButton').at(1).props().negative).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(2).props().children).toEqual("נקה הכל");
    });

    test("render with what the user see for /announcements/updateAnnouncements", async () => {

        const arrResponse = await setupComponent('shallow', AnnouncementForm, editHistory,editProps, pathEdit);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];


        const shallowWrapper = wrapper.find('AnnouncementForm').dive();

        expect(shallowWrapper.find('Form')).toHaveLength(1);
        expect(shallowWrapper.find('FormField')).toHaveLength(5);
        expect(shallowWrapper.find('FormField').at(0).props().name).toEqual('title');
        expect(shallowWrapper.find('FormField').at(0).props().label).toEqual('כותרת');
        expect(shallowWrapper.find('FormField').at(0).props().value).toEqual(announcementToUpdate.title);
        expect(shallowWrapper.find('FormField').at(1).props().name).toEqual('content');
        expect(shallowWrapper.find('FormField').at(1).props().label).toEqual('תוכן');
        expect(shallowWrapper.find('FormField').at(1).props().value).toEqual(announcementToUpdate.content);
        expect(shallowWrapper.find('FormField').at(2).props().name).toEqual('categoryName');
        expect(shallowWrapper.find('FormField').at(2).props().label).toEqual('שם קטגוריה');
        expect(shallowWrapper.find('FormField').at(2).props().value).toEqual(announcementToUpdate.categoryName);
        expect(shallowWrapper.find('FormField').at(3).props().label).toEqual('תאריך תפוגה');
        expect(shallowWrapper.find('FormField').at(3).props().value).toEqual(announcementToUpdate.expirationTime.substring(0,announcementToUpdate.expirationTime.indexOf('T')));
        expect(shallowWrapper.find('FormField').at(4).props().label).toEqual('תאריך אירוע');
        expect(shallowWrapper.find('FormField').at(4).props().value).toEqual(announcementToUpdate.dateOfEvent.substring(0,announcementToUpdate.dateOfEvent.indexOf('T')));


        expect(shallowWrapper.find('Message')).toHaveLength(0);
        expect(shallowWrapper.find('input')).toHaveLength(1);

        expect(shallowWrapper.find('FormButton')).toHaveLength(3);
        expect(shallowWrapper.find('FormButton').at(0).props().children).toEqual("קבע");
        expect(shallowWrapper.find('FormButton').at(0).props().positive).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(0).props().type).toEqual("submit");
        expect(shallowWrapper.find('FormButton').at(1).props().children).toEqual("בטל");
        expect(shallowWrapper.find('FormButton').at(1).props().negative).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(2).props().children).toEqual("נקה הכל");
    });


});
