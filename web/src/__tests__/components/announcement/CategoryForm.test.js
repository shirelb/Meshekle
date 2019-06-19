import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import {createMemoryHistory} from 'history';
import CategoryForm from "../../../components/announcement/CategoryForm";
import users from "../../jsons/users";
import serviceProviders from "../../jsons/serviceProviders";


jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/announcementsStorage");


describe("CategoryForm should", () => {
    let wrapper = null;
    let componentInstance = null;
    const pathAdd = '/announcements/addCategory';
    const pathEdit = '/announcements/updateCategory';
    const serProvsWithNames= serviceProviders.filter(s=>s.active).map(item=> {return {serviceProviderId: item.serviceProviderId, userId: item.userId, name: users.filter(u=> u.userId === item.userId)[0].fullname}});

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
        "categoryName":"Sport",
        "managers": ['Gannie Gubbins']
    };

    const addProps = {
        history: addHistory,
        location: {
            pathname: '/announcement/addCategory',
        },
        match: {
            isExact: true,
            path: '/announcement/addCategory',
            url: '/announcement/addCategory',
        },
        handleSubmit: (category) => true,
        handleCancel: (category) => true,
        submitText:'קבע',
        serProvsWithNames:serProvsWithNames,
    };

    const editProps = {
        history: editHistory,
        location: {
            pathname: '/announcements/updateCategory',
        },
        match: {
            isExact: true,
            path: '/announcements/updateCategory',
            url: '/announcements/updateCategory',
        },
        handleSubmit: (category) => true,
        handleCancel: (category) => true,
        submitText:'קבע',
        serProvsWithNames:serProvsWithNames,
        category:categoryToUpdate,

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
    //
    //
    // test.skip('match snapshot with add announcement', async () => {
    //     const arrResponse = await setupComponent('shallow', AnnouncementForm, addHistory,addProps, pathAdd);
    //     wrapper = arrResponse[0];
    //     componentInstance = arrResponse[1];
    //
    //     expect(componentInstance).toMatchSnapshot();
    // });
    //
    // test.skip('match snapshot with edit announcement ', async () => {
    //     const arrResponse = await setupComponent('shallow', AnnouncementForm, editHistory,editProps, pathEdit);
    //     wrapper = arrResponse[0];
    //     componentInstance = arrResponse[1];
    //
    //     expect(componentInstance).toMatchSnapshot();
    // });

    test("renders AnnouncementForm for /announcements/addCategory", async () => {
        const arrResponse = await setupComponent('shallow', CategoryForm, addHistory,addProps, pathAdd);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(CategoryForm)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("renders AnnouncementForm for /announcements/updateCategory", async () => {
        const arrResponse = await setupComponent('shallow', CategoryForm, editHistory,editProps, pathEdit);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(CategoryForm)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });


    test("mounted with the right data for Add category", async () => {
        const arrResponse = await setupComponent('shallow', CategoryForm, addHistory,addProps, pathAdd);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.category).toBeDefined();
        expect(componentInstance.state.category.categoryName).toEqual('');
        expect(componentInstance.state.category.managers).toEqual([]);
        expect(componentInstance.state.category.categoryOldName).toEqual('');

    });
    test("mounted with the right data for edit category", async () => {
        const arrResponse = await setupComponent('shallow', CategoryForm, editHistory,editProps, pathEdit);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.category).toBeDefined();
        expect(componentInstance.state.category.categoryName).toEqual(categoryToUpdate.categoryName);
        expect(componentInstance.state.category.managers).toEqual(categoryToUpdate.managers);
        expect(componentInstance.state.category.categoryOldName).toEqual(categoryToUpdate.categoryName);

    });

    test("handleSubmit with empty fields", async () => {
        const arrResponse = await setupComponent('mount', CategoryForm, addHistory,addProps, pathAdd);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('CategoryForm').find('Form').simulate('submit', {
            preventDefault() {
            }
        });
        expect(componentInstance.state.formError).toEqual(true);
    });

    test("handleSubmit in edit announcement", async () => {
        const arrResponse = await setupComponent('mount', CategoryForm, editHistory,editProps, pathEdit);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('CategoryForm').find('Form').simulate('submit', {
            preventDefault() {
            }
        });
        expect(componentInstance.state.category).toEqual({});
    });


    test("handleChange", async () => {
        const handleChangeSpy = jest.spyOn(CategoryForm.prototype, 'handleChange');

        const arrResponse = await setupComponent('mount', CategoryForm, addHistory,addProps, pathAdd);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];


        await wrapper.find('CategoryForm').find('FormField').at(0).props().onChange(
            {},
            {
                name: 'categoryName',
                value: 'newCulture'
            }
        );

        expect(handleChangeSpy).toHaveBeenCalled();
        expect(handleChangeSpy.mock.instances[0].state.category.categoryName).toEqual('newCulture');
    });

    test("handleClear", async () => {

        const arrResponse = await setupComponent('mount', CategoryForm, addHistory,addProps, pathAdd);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];


        wrapper.find('CategoryForm').find('FormButton').at(2).props().onClick({
            preventDefault() {
            }
        });
        expect(componentInstance.state.category.categoryName).toEqual('');
    });

    test("render with what the user see for /announcements/addCategory", async () => {

        const arrResponse = await setupComponent('shallow', CategoryForm, addHistory,addProps, pathAdd);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];


        const shallowWrapper = wrapper.find('CategoryForm').dive();

        expect(shallowWrapper.find('Form')).toHaveLength(1);
        expect(shallowWrapper.find('FormField')).toHaveLength(2);
        expect(shallowWrapper.find('FormField').at(0).props().name).toEqual('categoryName');
        expect(shallowWrapper.find('FormField').at(0).props().label).toEqual('שם');
        expect(shallowWrapper.find('FormField').at(0).props().value).toEqual('');
        expect(shallowWrapper.find('FormField').at(1).props().name).toEqual('managers');
        expect(shallowWrapper.find('FormField').at(1).props().label).toEqual('אחראי קטגוריה');
        expect(shallowWrapper.find('FormField').at(1).props().value).toEqual([]);


        expect(shallowWrapper.find('Message')).toHaveLength(0);

        expect(shallowWrapper.find('FormButton')).toHaveLength(3);
        expect(shallowWrapper.find('FormButton').at(0).props().children).toEqual("קבע");
        expect(shallowWrapper.find('FormButton').at(0).props().positive).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(0).props().type).toEqual("submit");
        expect(shallowWrapper.find('FormButton').at(1).props().children).toEqual("בטל");
        expect(shallowWrapper.find('FormButton').at(1).props().negative).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(2).props().children).toEqual("נקה הכל");
    });

    test("render with what the user see for /announcements/updateCategory", async () => {

        const arrResponse = await setupComponent('shallow', CategoryForm, editHistory,editProps, pathEdit);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];


        const shallowWrapper = wrapper.find('CategoryForm').dive();

        expect(shallowWrapper.find('Form')).toHaveLength(1);
        expect(shallowWrapper.find('FormField')).toHaveLength(2);
        expect(shallowWrapper.find('FormField').at(0).props().name).toEqual('categoryName');
        expect(shallowWrapper.find('FormField').at(0).props().label).toEqual('שם');
        expect(shallowWrapper.find('FormField').at(0).props().value).toEqual('Sport');
        expect(shallowWrapper.find('FormField').at(1).props().name).toEqual('managers');
        expect(shallowWrapper.find('FormField').at(1).props().label).toEqual('אחראי קטגוריה');
        expect(shallowWrapper.find('FormField').at(1).props().value).toEqual(["Gannie Gubbins"]);


        expect(shallowWrapper.find('Message')).toHaveLength(0);

        expect(shallowWrapper.find('FormButton')).toHaveLength(3);
        expect(shallowWrapper.find('FormButton').at(0).props().children).toEqual("קבע");
        expect(shallowWrapper.find('FormButton').at(0).props().positive).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(0).props().type).toEqual("submit");
        expect(shallowWrapper.find('FormButton').at(1).props().children).toEqual("בטל");
        expect(shallowWrapper.find('FormButton').at(1).props().negative).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(2).props().children).toEqual("נקה הכל");
    });

});
