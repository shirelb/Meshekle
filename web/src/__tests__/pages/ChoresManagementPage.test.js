import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../testHelpers";
import PageNotFound from "../../pages/pageNotFound404/PageNotFound";
import ChoresManagementPage from '../../pages/choresManagementPage/ChoresManagementPage.js';
import store from 'store';
import {createMemoryHistory} from 'history';
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import choresStorage from "../../storage/choresStorage";
import serviceProviders from "../jsons/serviceProviders";


jest.mock("../../shared/helpers");
jest.mock("store");
jest.mock("../../storage/usersStorage");
jest.mock("../../storage/serviceProvidersStorage");
jest.mock("../../storage/choresStorage");


describe("ChoresManagementPage should", () => {
    let wrapper = null;
    let componentInstance = null;
    const history = createMemoryHistory({
        initialEntries: ['/', '/home', '/chores'],
        initialIndex: 2,
        keyLength: 10,
        getUserConfirmation: null
    });
    const props = {
        history: history,
        location: {
            pathname: '/chores'
        },
        match: {
            isExact: true,
            path: '/chores',
            url: '/chores',
        }
    };
    const mockStore = {
        serviceProviderId: "900261801",
        userId: "900261801",
    };
    store.get.mockImplementation((key) => mockStore[key]);


    serviceProvidersStorage.getServiceProviders.mockResolvedValue(serviceProviders);
    choresStorage.getAllChoreTypes.mockResolvedValue([{choreTypeName:'בישול'}]);
    choresStorage.getChoreTypeSetting.mockResolvedValue([{choreTypeName:'בישול'}]);
    choresStorage.getUserChoresForType.mockResolvedValue({status:200});
    choresStorage.getUsersForChoreType.mockResolvedValue({status:200});

    choresStorage.getReplacementRequests.mockResolvedValue({status:200});
    // choresStorage.getReplacementRequests.mockResolvedValue({data:categories.filter(cat=>cat.serviceProviderId===mockStore.serviceProviderId)});
    choresStorage.createNewUserChore.mockResolvedValue({status:200});
    choresStorage.createUserchoreEvent.mockResolvedValue({status:200});
    choresStorage.deleteUserChore.mockResolvedValue({status:200});
    choresStorage.deleteUserFromChoreType.mockResolvedValue({status:200});



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
                pathname: '/chores'
            },
            match: {
                isExact: true,
                path: '/chores',
                url: '/chores',
            }
        };

        const arrResponse = setupComponent('shallow', ChoresManagementPage, null, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test("renders ChoresManagementPage for /chores", async () => {
        const arrResponse = await setupComponent('shallow', ChoresManagementPage, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(ChoresManagementPage)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data", async () => {
        const arrResponse = await setupComponent('shallow', ChoresManagementPage, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];
        expect(componentInstance.state.choreTypesOptions.length).toEqual(1);
    });

    test("push /newChore on new chore click", async () => {
        const arrResponse = await setupComponent('mount', ChoresManagementPage, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];
        const newChore = wrapper.find('ChoresManagementPage').find('Button').at(0);
        await newChore.simulate('click', { button: 0 });
        expect(componentInstance.props.history.location.pathname).toEqual('/chores/newChoreType');

    });


    test("render with what the user see", async () => {
        const arrResponse = await setupComponent('mount', ChoresManagementPage, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const mountWrapper = wrapper.find('ChoresManagementPage');

        expect(mountWrapper.find('Modal')).toHaveLength(1);

        expect(mountWrapper.find('Button')).toHaveLength(3);
        expect(mountWrapper.find('Button').at(0).get(0).props.children[1]).toEqual("  צור סוג תורנות חדש  ");
        expect(mountWrapper.find('Button').at(1).get(0).props.children[1]).toEqual("  היסטורית תורנויות  ");
        expect(mountWrapper.find('Button').at(2).get(0).props.children[1]).toEqual(" ");

        expect(mountWrapper.find('Page')).toHaveLength(1);


        expect(mountWrapper.find('input')).toHaveLength(1);
    });


});
