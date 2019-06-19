import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import {createMemoryHistory} from 'history';
import ChoresHistory from "../../../components/chores/ChoresHistory";
import choresStorage from "../../../storage/choresStorage";


jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/choresStorage");


describe("ChoreHistory should", () => {
    let wrapper = null;
    let componentInstance = null;

    const history = createMemoryHistory({
        initialEntries: ['/', '/home', '/chores'],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });
    const props = {
        history: history,
        location: {
            pathname: '/chores',
        },
        match: {
            isExact: true,
            path: '/chores',
            url: '/chores',
            params: {userId:"549963652"}
        },
    };
    const mockStore = {
        serviceProviderId: "804790549",
        userId: "804790549",
    };

    store.get.mockImplementation((key) => mockStore[key]);
    choresStorage.getAllPastUserChores.mockResolvedValue({status:200,data:[]});

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

    test("renders ChoreHistory for /chores", async () => {
        const arrResponse = await setupComponent('shallow', ChoresHistory, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(ChoresHistory)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data", async () => {
        const arrResponse = await setupComponent('shallow', ChoresHistory, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.chores).toBeDefined();
        expect(componentInstance.state.chores).toEqual([]);


    });

    test("render with what the user see", async () => {
        const arrResponse = await setupComponent('shallow', ChoresHistory, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('ChoresHistory').dive();


        expect(shallowWrapper.find('Button')).toHaveLength(1);


        expect(shallowWrapper.find('Page')).toHaveLength(1);
        expect(shallowWrapper.find('Table')).toHaveLength(1);
        expect(shallowWrapper.find('Dropdown')).toHaveLength(2);
        expect(shallowWrapper.find('Icon')).toHaveLength(8);
        expect(shallowWrapper.find('Icon').at(0).props().name).toEqual('file pdf outline');
        expect(shallowWrapper.find('Icon').at(1).props().name).toEqual('filter');
        expect(shallowWrapper.find('Icon').at(2).props().name).toEqual('filter');
        expect(shallowWrapper.find('Icon').at(3).props().name).toEqual('filter');
        expect(shallowWrapper.find('Icon').at(4).props().name).toEqual('x');
        expect(shallowWrapper.find('Icon').at(5).props().name).toEqual('filter');
        expect(shallowWrapper.find('Icon').at(6).props().name).toEqual('x');
        expect(shallowWrapper.find('Icon').at(7).props().name).toEqual('left chevron');
      });
});
