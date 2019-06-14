import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import moment from 'moment';
import {createMemoryHistory} from 'history';
import AnnouncementAdd from "../../../components/announcement/AnnouncementAdd";
import serviceProvidersStorage from "../../../storage/serviceProvidersStorage";
import usersStorage from "../../../storage/usersStorage";
import users from "../../jsons/users";
import serviceProviders from "../../jsons/serviceProviders";
import categories from "../../jsons/categories";
import announcementsStorage from "../../../storage/announcementsStorage";
import answeredAnnouncements from "../../jsons/answeredAnnouncements";



jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/announcementsStorage");


describe("AnnouncementAdd should", () => {
    let wrapper = null;
    let componentInstance = null;


    const addHistory = createMemoryHistory({
        initialEntries: ['/', '/home', '/announcements', '/announcements/addAnnouncement'],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });
    const editHistory = createMemoryHistory({
        initialEntries: ['/', '/home', '/announcements', '/announcements/updateAnnouncement'],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });

    const addProps = {
        history: addHistory,
        location: {
            pathname: '/announcement/addAnnouncement',
            state: {
                serviceProviderId: "900261801",
                userId: "900261801",
                isUpdate:false
            }
        },
        match: {
            isExact: true,
            path: '/announcement/addAnnouncement',
            url: '/announcement/addAnnouncement',
        },
        getAnnouncements: () => {return {data:answeredAnnouncements}}
    };
    const announcementToUpdate={
        "announcementId": 3,
        "serviceProviderId": "900261801",
        "userId": "549963652",
        "categoryId": 2,
        "creationTime": "2020-05-20",
        "title": "third example",
        "content": "announcement example 3",
        "expirationTime": "2019-06-22",
        "file": "",
        "fileName": "",
        "dateOfEvent": "2020-06-21",
        "status":"On air",
        "categoryName":"Sport"
    };
    const editProps = {
        history: editHistory,
        location: {
            pathname: '/announcements/updateAnnouncement',
            state: {
                serviceProviderId: "900261801",
                userId: "900261801",
                isUpdate: announcementToUpdate
            }
        },
        match: {
            isExact: true,
            path: '/announcements/updateAnnouncement',
            url: '/announcements/updateAnnouncement',
        },
        getAnnouncements: () => {return {data:answeredAnnouncements}}

    };

    const mockStore = {
        serviceProviderId: "900261801",
        userId: "900261801",
    };

    store.get.mockImplementation((key) => mockStore[key]);
    announcementsStorage.getCategoriesByServiceProviderId.mockResolvedValue({data:categories});
    announcementsStorage.addAnnouncement.mockResolvedValue({status: 200});
    announcementsStorage.updateAnnouncement.mockResolvedValue({status: 200});


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
        const props = {
            location: {
                pathname: '/appointments/set',
                state: {
                    slotInfo: slotInfo
                }
            },
            match: {
                isExact: true,
                path: '/appointments/set',
                url: '/appointments/set',
            },
            serviceProviderRoles:["appointmentsHairDresser"],
        };

        const arrResponse = setupComponent('shallow', AppointmentAdd, null, props, "/appointments/set");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test.skip('match snapshot with appointmentRequestDropped', async () => {
        const props = {
            location: {
                pathname: '/appointments/set',
                state: {
                    appointmentRequestDropped: appointmentRequestDropped
                }
            },
            match: {
                isExact: true,
                path: '/appointments/set',
                url: '/appointments/set',
            },
            serviceProviderRoles:["appointmentsHairDresser"],
        };

        const arrResponse = setupComponent('shallow', AppointmentAdd, null, props, "/appointments/set");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test("renders AnnouncementAdd for /announcements/addAnnouncement", async () => {
        const arrResponse = await setupComponent('shallow', AnnouncementAdd, addHistory, addProps, "/announcements/addAnnouncement");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(AnnouncementAdd)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("renders AnnouncementAdd for /announcements/updateAnnouncement", async () => {
        const arrResponse = await setupComponent('shallow', AnnouncementAdd, editHistory, editProps, "/announcements/updateAnnouncement");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(AnnouncementAdd)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data for isUpdate in add announcement", async () => {
        const arrResponse = await setupComponent('shallow', AnnouncementAdd, addHistory, addProps, "/announcements/addAnnouncement");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.isUpdate).toBeDefined();
        expect(componentInstance.isUpdate).toEqual(false);
    });

    test("mounted with the right data for isUpdate update", async () => {
        const arrResponse = await setupComponent('shallow', AnnouncementAdd, editHistory, editProps, "/announcements/updateAnnouncement");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.isUpdate).toBeDefined();
        expect(componentInstance.isUpdate).toEqual(announcementToUpdate);
    });



    test("handleSubmit", async () => {
        const arrResponse = await setupComponent('shallow', AnnouncementAdd, editHistory, editProps, "/announcements/updateAnnouncement");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleSubmit(announcementToUpdate);
        expect(componentInstance.props.history.location.pathname).toEqual('/announcements');
    });

    test("handleCancel", async () => {
        const arrResponse = await setupComponent('shallow', AnnouncementAdd, editHistory, addProps, "/announcements/updateAnnouncement");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleCancel({
            preventDefault() {
            }
        });

        wrapper.update();
        expect(componentInstance.props.history.location.pathname).toEqual('/announcements');

    });


    test("render with what the user see on add announcement", async () => {
        const arrResponse = await setupComponent('mount', AnnouncementAdd, addHistory, addProps, "/announcements/addAnnouncement");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];


        expect(wrapper.find('AnnouncementAdd').find('Modal')).toHaveLength(1);
        expect(wrapper.find('AnnouncementAdd').find('Grid')).toHaveLength(1);
        expect(wrapper.find('AnnouncementAdd').find('Header')).toHaveLength(1);
        expect(wrapper.find('AnnouncementAdd').find('Header').props().children).toEqual('מודעה חדשה');
        expect(wrapper.find('AnnouncementAdd').find('AnnouncementForm')).toHaveLength(1);
    });

    test("render with what the user see  on edit announcement", async () => {
        const arrResponse = await setupComponent('mount', AnnouncementAdd, editHistory, editProps, "/announcements/updateAnnouncement");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find('AnnouncementAdd').find('Modal')).toHaveLength(1);
        expect(wrapper.find('AnnouncementAdd').find('Grid')).toHaveLength(1);
        expect(wrapper.find('AnnouncementAdd').find('Header')).toHaveLength(1);
        expect(wrapper.find('AnnouncementAdd').find('Header').props().children).toEqual('ערוך מודעה');
        expect(wrapper.find('AnnouncementAdd').find('AnnouncementForm')).toHaveLength(1);
    });
});
