import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import {createMemoryHistory} from 'history';
import CategoryAdd from "../../../components/announcement/CategoryAdd";
import users from "../../jsons/users";
import serviceProviders from "../../jsons/serviceProviders";
import categories from "../../jsons/categories";
import announcementsStorage from "../../../storage/announcementsStorage";
import answeredAnnouncements from "../../jsons/answeredAnnouncements";
import announcementsRequests from "../../jsons/announcementsRequests";



jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/announcementsStorage");


describe("CategoryAdd should", () => {
    let wrapper = null;
    let componentInstance = null;

    const serProvsWithNames= serviceProviders.filter(s=>s.active).map(item=> {return {serviceProviderId: item.serviceProviderId, userId: item.userId, name: users.filter(u=> u.userId === item.userId)[0].fullname}});
    const catNames= categories.map(c=>c.categoryName);

    const addHistory = createMemoryHistory({
        initialEntries: ['/', '/home', '/announcements', '/announcements/addCategory'],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });
    const editHistory = createMemoryHistory({
        initialEntries: ['/', '/home', '/announcements', '/announcements/updateCategory'],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });

    const addProps = {
        history: addHistory,
        location: {
            pathname: '/announcement/addCategory',
            state: {
                serviceProviderId: "900261801",
                userId: "900261801",
                isUpdate:false,
                serProvsWithNames: serProvsWithNames,
                catNames: catNames,
            }
        },
        match: {
            isExact: true,
            path: '/announcement/addCategory',
            url: '/announcement/addCategory',
        },
        getAnnouncements: () => {return {data:answeredAnnouncements}},
        getAnnouncementsRequests: () => {return {data: announcementsRequests}},
        getCategories: () => {return {data: categories}},
        getAllCategories: () => {return {data: categories}},
    };
    const categoryToUpdate={
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
            pathname: '/announcements/updateCategory',
            state: {
                serviceProviderId: "900261801",
                userId: "900261801",
                isUpdate: {categoryName:'Culture', managers: ['Gannie Gubbins']},
                serProvsWithNames: serProvsWithNames,
                catNames: catNames,
            }
        },
        match: {
            isExact: true,
            path: '/announcements/updateCategory',
            url: '/announcements/updateCategory',
        },
        getAnnouncements: () => {return {data:answeredAnnouncements}},
        getAnnouncementsRequests: () => {return {data: announcementsRequests}},
        getCategories: () => {return {data: categories}},
        getAllCategories: () => {return {data: categories}},
    };

    const mockStore = {
        serviceProviderId: "900261801",
        userId: "900261801",
    };

    store.get.mockImplementation((key) => mockStore[key]);
    announcementsStorage.addCategory.mockResolvedValue({status: 200});
    announcementsStorage.updateCategory.mockResolvedValue({status: 200});


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

    test("renders CategoryAdd for /announcements/addCategory", async () => {
        const arrResponse = await setupComponent('shallow', CategoryAdd, addHistory, addProps, "/announcements/addCategory");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(CategoryAdd)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("renders CategoryAdd for /announcements/updateAnnouncement", async () => {
        const arrResponse = await setupComponent('shallow', CategoryAdd, editHistory, editProps, "/announcements/updateCategory");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(CategoryAdd)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data in add category", async () => {
        const arrResponse = await setupComponent('shallow', CategoryAdd, addHistory, addProps, "/announcements/addCategory");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.isUpdate).toBeDefined();
        expect(componentInstance.isUpdate).toEqual(false);
        expect(componentInstance.serProvsWithNames).toBeDefined();
        expect(componentInstance.serProvsWithNames).toEqual(serProvsWithNames);
        expect(componentInstance.catNames).toBeDefined();
        expect(componentInstance.catNames).toEqual(catNames);
    });

    test("mounted with the right data for update", async () => {
        const arrResponse = await setupComponent('shallow', CategoryAdd, editHistory, editProps, "/announcements/updateCategory");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.isUpdate).toBeDefined();
        expect(componentInstance.isUpdate).toEqual({categoryName:'Culture', managers: ['Gannie Gubbins']});
        expect(componentInstance.serProvsWithNames).toBeDefined();
        expect(componentInstance.serProvsWithNames).toEqual(serProvsWithNames);
        expect(componentInstance.catNames).toBeDefined();
        expect(componentInstance.catNames).toEqual(catNames);
    });



    test("handleSubmit", async () => {
        const arrResponse = await setupComponent('shallow', CategoryAdd, editHistory, editProps, "/announcements/updateCategory");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        categoryToUpdate.categoryName = 'NewCulture';
        await componentInstance.handleSubmit(categoryToUpdate);
        categoryToUpdate.categoryName = 'Sport';

        expect(componentInstance.props.history.location.pathname).toEqual('/announcements');
    });

    test("handleCancel", async () => {
        const arrResponse = await setupComponent('shallow', CategoryAdd, editHistory, addProps, "/announcements/updateCategory");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleCancel({
            preventDefault() {
            }
        });

        wrapper.update();
        expect(componentInstance.props.history.location.pathname).toEqual('/announcements');

    });


    test("render with what the user see on add category", async () => {
        const arrResponse = await setupComponent('mount', CategoryAdd, addHistory, addProps, "/announcements/addCategory");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];


        expect(wrapper.find('CategoryAdd').find('Modal')).toHaveLength(1);
        expect(wrapper.find('CategoryAdd').find('Grid')).toHaveLength(1);
        expect(wrapper.find('CategoryAdd').find('Header')).toHaveLength(1);
        expect(wrapper.find('CategoryAdd').find('Header').props().children).toEqual('קטגוריה חדשה');
        expect(wrapper.find('CategoryAdd').find('CategoryForm')).toHaveLength(1);
    });
    test("render with what the user see on edit category", async () => {
        const arrResponse = await setupComponent('mount', CategoryAdd, editHistory, editProps, "/announcements/updateCategory");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];


        expect(wrapper.find('CategoryAdd').find('Modal')).toHaveLength(1);
        expect(wrapper.find('CategoryAdd').find('Grid')).toHaveLength(1);
        expect(wrapper.find('CategoryAdd').find('Header')).toHaveLength(1);
        expect(wrapper.find('CategoryAdd').find('Header').props().children).toEqual('ערוך קטגוריה');
        expect(wrapper.find('CategoryAdd').find('CategoryForm')).toHaveLength(1);
    });

});
