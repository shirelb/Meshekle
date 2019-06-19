import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../testHelpers";
import PageNotFound from "../../pages/pageNotFound404/PageNotFound";
import AnnouncementsManagementPage from '../../pages/announcementsManagementPage/AnnouncementsManagementPage';
import store from 'store';
import {createMemoryHistory} from 'history';
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import announcementsStorage from "../../storage/announcementsStorage";
import users from "../jsons/users";
import serviceProviders from "../jsons/serviceProviders";
import categories from "../jsons/categories";
import announcementsRequests from "../jsons/announcementsRequests";
import answeredAnnouncements from "../jsons/answeredAnnouncements";

jest.mock("../../shared/helpers");
jest.mock("store");
jest.mock("../../storage/usersStorage");
jest.mock("../../storage/serviceProvidersStorage");
jest.mock("../../storage/announcementsStorage");


describe("AnnouncementsManagementPage should", () => {
    let wrapper = null;
    let componentInstance = null;
    const history = createMemoryHistory({
        initialEntries: ['/', '/home', '/announcements'],
        initialIndex: 2,
        keyLength: 10,
        getUserConfirmation: null
    });
    const props = {
        history: history,
        location: {
            pathname: '/announcements'
        },
        match: {
            isExact: true,
            path: '/announcements',
            url: '/announcements',
        }
    };
    const mockStore = {
        serviceProviderId: "900261801",
        userId: "900261801",
    };
    store.get.mockImplementation((key) => mockStore[key]);


    serviceProvidersStorage.getServiceProviders.mockResolvedValue(serviceProviders);
    announcementsStorage.getUsers.mockResolvedValue({data:users});
    announcementsStorage.getCategories.mockResolvedValue({data:categories});
    announcementsStorage.getAnnouncementsRequests.mockResolvedValue({data:announcementsRequests});
    announcementsStorage.getAnsweredAnnouncements.mockResolvedValue({data:answeredAnnouncements});

    announcementsStorage.getCategoriesByServiceProviderId.mockResolvedValue({data:categories.filter(cat=>cat.serviceProviderId===mockStore.serviceProviderId)});
    announcementsStorage.updateAnnouncement.mockResolvedValue({status:200});
    announcementsStorage.removeAnnouncement.mockResolvedValue({status:200});
    announcementsStorage.removeCategory.mockResolvedValue({status:200});



    beforeAll(async (done) => {
        done();
    });

    afterAll(() => {
    });

    beforeEach(async (done) => {
        await jest.clearAllMocks();
        done();
    });

    afterEach(() => {
    });

    test.skip('match snapshot', async () => {
        const props = {
            location: {
                pathname: '/announcements'
            },
            match: {
                isExact: true,
                path: '/announcements',
                url: '/announcements',
            }
        };

        const arrResponse = setupComponent('shallow', AnnouncementsManagementPage, null, props, "/announcements");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test("renders AnnouncementsManagementPage for /announcements", async () => {
        const arrResponse = await setupComponent('shallow', AnnouncementsManagementPage, history, props, "/announcements");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(AnnouncementsManagementPage)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data", async () => {
        expect(componentInstance.state.announcementsRequests.length).toEqual(announcementsRequests.length);
        expect(componentInstance.state.announcementsRequests).toEqual(announcementsRequests);

        expect(componentInstance.state.serviceProviders.length).toEqual(serviceProviders.length);

        expect(componentInstance.state.filteredAnnouncementsRequests.length).toEqual(announcementsRequests.length);

        expect(componentInstance.state.filteredAnnouncements.length).toEqual(answeredAnnouncements.length);
        expect(componentInstance.state.categories.length).toEqual(categories.length);
        expect(componentInstance.state.categories).toEqual(categories);
        expect(componentInstance.state.users.length).toEqual(users.length);

    });

    test("Title search on requested announcements", async () => {
        const arrResponse = await setupComponent('mount', AnnouncementsManagementPage, history, props, "/announcements");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const filterAnnouncementRequestLength=componentInstance.state.filteredAnnouncementsRequests.length;
        expect(filterAnnouncementRequestLength).toEqual(announcementsRequests.length);

        const searchBarRequests = wrapper.find('AnnouncementsManagementPage').find('input').first();
        await searchBarRequests.simulate('change', {
            target: { value: 'first' }
        });

        expect(componentInstance.state.filteredAnnouncementsRequests.length).toEqual(1);
        await searchBarRequests.simulate('change', {
            target: { value: '' }
        });

        expect(componentInstance.state.filteredAnnouncementsRequests.length).toEqual(filterAnnouncementRequestLength);

    });
    test("Title search on answered announcements", async () => {
        const arrResponse = await setupComponent('mount', AnnouncementsManagementPage, history, props, "/announcements");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const filterAnnouncementLength=componentInstance.state.filteredAnnouncements.length;
        expect(filterAnnouncementLength).toEqual(answeredAnnouncements.length);

        const searchBarRequests = wrapper.find('AnnouncementsManagementPage').find('input').at(1);
        await searchBarRequests.simulate('change', {
            target: { value: 'third' }
        });

        expect(componentInstance.state.filteredAnnouncements.length).toEqual(1);
        await searchBarRequests.simulate('change', {
            target: { value: '' }
        });

        expect(componentInstance.state.filteredAnnouncements.length).toEqual(filterAnnouncementLength);

    });

    test("Click on approve announcement request", async () => {
        const arrResponse = await setupComponent('mount', AnnouncementsManagementPage, history, props, "/announcements");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];
        const handleApproveSpy = jest.spyOn(componentInstance, 'handleApproveButton');

        const announcementRequestLength=componentInstance.state.announcementsRequests.length;
        expect(announcementRequestLength).toEqual(announcementsRequests.length);
        const announcementsLength=componentInstance.state.announcements.length;
        expect(announcementsLength).toEqual(answeredAnnouncements.length);

        const approvedButton = wrapper.find('AnnouncementsManagementPage').find('TableBody').at(0).find('TableRow').at(0).find('TableCell').at(8).find('button').at(0);
        await approvedButton.simulate('click', { button: 0 });
        expect(handleApproveSpy).toHaveBeenCalledWith(1);

        expect(componentInstance.state.announcementsRequests.length).toEqual(announcementRequestLength-1);
        expect(componentInstance.state.announcements.length).toEqual(announcementsLength+1);

    });

    test("Click on cancel announcement request", async () => {
        const arrResponse = await setupComponent('mount', AnnouncementsManagementPage, history, props, "/announcements");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];
        const handleCancelSpy = jest.spyOn(componentInstance, 'handleCancelButton');

        const announcementRequestLength=componentInstance.state.announcementsRequests.length;
        expect(announcementRequestLength).toEqual(announcementsRequests.length);
        const announcementsLength=componentInstance.state.announcements.length;
        expect(announcementsLength).toEqual(answeredAnnouncements.length);

        const cancelButton = wrapper.find('AnnouncementsManagementPage').find('TableBody').at(0).find('TableRow').at(0).find('TableCell').at(8).find('button').at(1);
        await cancelButton.simulate('click', { button: 0 });
        expect(handleCancelSpy).toHaveBeenCalledWith(1);

        expect(componentInstance.state.announcementsRequests.length).toEqual(announcementRequestLength-1);
        expect(componentInstance.state.announcements.length).toEqual(announcementsLength+1);

    });


    test("Click on remove announcement ", async () => {
        const arrResponse = await setupComponent('mount', AnnouncementsManagementPage, history, props, "/announcements");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];
        const handleRemoveSpy = jest.spyOn(componentInstance, 'handleRemoveButton');

        const announcementsLength=componentInstance.state.announcements.length;
        expect(announcementsLength).toEqual(answeredAnnouncements.length);

        const removeButton = wrapper.find('AnnouncementsManagementPage').find('TableBody').at(1).find('TableRow').at(0).find('TableCell').at(9).find('button').at(1);
        await removeButton.simulate('click', { button: 0 });
        expect(handleRemoveSpy).toHaveBeenCalledWith(3);

        expect(componentInstance.state.announcements.length).toEqual(announcementsLength-1);

    });


    test("push /updateAnnouncement on edit announcement click", async () => {
        const arrResponse = await setupComponent('mount', AnnouncementsManagementPage, history, props, "/announcements");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];
        const editAnnouncementButton = wrapper.find('AnnouncementsManagementPage').find('TableBody').at(1).find('TableRow').at(0).find('TableCell').at(9).find('button').at(0);
        await editAnnouncementButton.simulate('click', { button: 0 });
        expect(componentInstance.props.history.location.pathname).toEqual('/announcements/updateAnnouncement');

    });


    test("push /updateCategory on edit category click", async () => {
        const arrResponse = await setupComponent('mount', AnnouncementsManagementPage, history, props, "/announcements");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];
        const editCategoryButton = wrapper.find('AnnouncementsManagementPage').find('TableBody').at(2).find('TableRow').at(0).find('TableCell').at(3).find('button').at(0);
        await editCategoryButton.simulate('click', { button: 0 });
        expect(componentInstance.props.history.location.pathname).toEqual('/announcements/updateCategory');

    });

    test("push /addAnnouncement on edit announcement click", async () => {
        const arrResponse = await setupComponent('mount', AnnouncementsManagementPage, history, props, "/announcements");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];
        const addAnnouncementButton = wrapper.find('AnnouncementsManagementPage').find('Button').at(0);
        await addAnnouncementButton.simulate('click', { button: 0 });
        expect(componentInstance.props.history.location.pathname).toEqual('/announcements/addAnnouncement');

    });
    test("push /addCategory on add category click", async () => {
        const arrResponse = await setupComponent('mount', AnnouncementsManagementPage, history, props, "/announcements");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];
        const addAnnouncementButton = wrapper.find('AnnouncementsManagementPage').find('Button').at(1);
        await addAnnouncementButton.simulate('click', { button: 0 });
        expect(componentInstance.props.history.location.pathname).toEqual('/announcements/addCategory');

    });


    test("render with what the user see", async () => {
        const arrResponse = await setupComponent('mount', AnnouncementsManagementPage, history, props, "/announcements");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const mountWrapper = wrapper.find('AnnouncementsManagementPage');

        expect(mountWrapper.find('Table')).toHaveLength(3);

        expect(mountWrapper.find('Modal')).toHaveLength(1);

        expect(mountWrapper.find('Button')).toHaveLength(3);
        expect(mountWrapper.find('Button').at(0).get(0).props.children).toEqual("פרסם מודעה חדשה");
        expect(mountWrapper.find('Button').at(1).get(0).props.children).toEqual("קטגוריה חדשה");
        expect(mountWrapper.find('Button').at(2).get(0).props.children).toEqual("סגור");

        expect(mountWrapper.find('Page')).toHaveLength(3);
        expect(mountWrapper.find('Page').at(0).get(0).props.title).toEqual("מודעות המחכות לאישור");
        expect(mountWrapper.find('Page').at(1).get(0).props.title).toEqual("מודעות באחריותך");
        expect(mountWrapper.find('Page').at(2).get(0).props.title).toEqual("קטגוריות");

        expect(mountWrapper.find('input')).toHaveLength(2);
        expect(mountWrapper.find('input').at(0).get(0).props.placeholder).toEqual("חיפוש לפי נושא...");
        expect(mountWrapper.find('input').at(1).get(0).props.placeholder).toEqual("חיפוש לפי נושא...");

        const firstHeaderCells = mountWrapper.find('Table').at(0).find('TableHeader').find('TableRow').find('TableHeaderCell');
        const firstHeaderExpectedTitles = ['מספר מודעה', 'שם המפרסם' , 'קטגוריה', 'נושא', 'תוכן', 'תאריך תפוגה','תאריך אירוע', 'קובץ מצורף', 'אפשרויות'];
        for(let i=0; i<8; i++)
            expect(firstHeaderCells.get(i).props.children).toEqual(firstHeaderExpectedTitles[i]);

        const secondHeaderCells = mountWrapper.find('Table').at(1).find('TableHeader').find('TableRow').find('TableHeaderCell');
        const secondHeaderExpectedTitles = ['מספר מודעה', 'שם המפרסם' , 'קטגוריה', 'נושא', 'תוכן', 'תאריך תפוגה','תאריך אירוע', 'סטטוס','קובץ מצורף', 'אפשרויות'];
        for(let i=0; i<9; i++)
            expect(secondHeaderCells.get(i).props.children).toEqual(secondHeaderExpectedTitles[i]);

        const thirdHeaderCells = mountWrapper.find('Table').at(2).find('TableHeader').find('TableRow').find('TableHeaderCell');
        const thirdHeaderExpectedTitles = ['מספר הקטגוריה', 'שם הקטגוריה' , 'מנהלי הקטגוריה', 'אפשרויות'];
        for(let i=0; i<4; i++)
            expect(thirdHeaderCells.get(i).props.children).toEqual(thirdHeaderExpectedTitles[i]);
    });

    test("Click on remove category ", async () => {
        const arrResponse = await setupComponent('mount', AnnouncementsManagementPage, history, props, "/announcements");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];
        const handleCancelCategorySpy = jest.spyOn(componentInstance, 'handleCancelCategoryButton');

        const categoriesLength=componentInstance.state.categories.length;
        expect(categoriesLength).toEqual(categories.length);

        const removeButton = wrapper.find('AnnouncementsManagementPage').find('TableBody').at(2).find('TableRow').at(0).find('TableCell').at(3).find('button').at(1);
        await removeButton.simulate('click', { button: 0 });
        expect(handleCancelCategorySpy).toHaveBeenCalledWith('Culture');

    });

    test("Click on show announcement content ", async () => {
        const arrResponse = await setupComponent('mount', AnnouncementsManagementPage, history, props, "/announcements");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];
        const openModalSpy = jest.spyOn(componentInstance, 'openModal');
        const closeModalSpy = jest.spyOn(componentInstance, 'closeModal');

        const showContentRef = wrapper.find('AnnouncementsManagementPage').find('TableBody').at(0).find('TableRow').at(0).find('TableCell').at(4).find('a').at(0);
        await showContentRef.simulate('click', { button: 0 });
        expect(componentInstance.state.content).toEqual('announcement example');
        expect(componentInstance.state.visible).toEqual(true);
        expect(openModalSpy).toHaveBeenCalledWith('announcement example');

        const closeModalButton = wrapper.find('AnnouncementsManagementPage').find('Button').at(2);
        await closeModalButton.simulate('click', { button: 0 });
        expect(componentInstance.state.content).toEqual('');
        expect(componentInstance.state.visible).toEqual(false);
        expect(closeModalSpy).toHaveBeenCalledWith();

    });


});
