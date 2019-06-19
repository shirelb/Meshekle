import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import {createMemoryHistory} from 'history';
import DaysTags from "../../../components/chores/DaysTags";
import { WithContext as ReactTags } from 'react-tag-input';



jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/choresStorage");


describe("DaysTags should", () => {
    let wrapper = null;
    let componentInstance = null;
    const days={settings:{days:['רביעי','ראשון']}};

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
        settings:days.settings,
        onChange:jest.fn()
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

    test("renders DaysTags for /chore", async () => {
        const arrResponse = await setupComponent('shallow', DaysTags, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(DaysTags)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data", async () => {
        const arrResponse = await setupComponent('shallow', DaysTags, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.tags).toBeDefined();
        expect(componentInstance.state.unchoosedTags).toBeDefined();
        expect(componentInstance.state.days).toBeDefined();
        expect(componentInstance.state.tags).toEqual([{"id": 1, "text": "ראשון"}, {"id": 4, "text": "רביעי"}]);
        expect(componentInstance.state.unchoosedTags).toEqual([{"id": 2, "text": "שני"}, {"id": 3, "text": "שלישי"}, {"id": 5, "text": "חמישי"}, {"id": 6, "text": "שישי"}, {"id": 7, "text": "שבת"}]);
        expect(componentInstance.state.tags).toEqual([{"id": 1, "text": "ראשון"}, {"id": 4, "text": "רביעי"}]);


    });


    test("render with what the user see", async () => {
        const arrResponse = await setupComponent('shallow', DaysTags, history, props, "/phoneBook/user/549963652");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('DaysTags').dive();

        expect(shallowWrapper.find(ReactTags)).toHaveLength(2);

        expect(shallowWrapper.find('h4')).toHaveLength(2);
        expect(shallowWrapper.find('h4').at(0).props().children).toEqual('ימים שנבחרו:');
        expect(shallowWrapper.find('h4').at(1).props().children).toEqual('הוסף לימים:');

      });
});
