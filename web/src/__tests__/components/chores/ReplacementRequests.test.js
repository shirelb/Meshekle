import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import {createMemoryHistory} from 'history';
import ReplacementRequests from "../../../components/chores/ReplacementRequests";
import choresStorage from "../../../storage/choresStorage";


jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/choresStorage");


describe("ReplacementRequests should", () => {
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
        serviceProviderId:'804790549',
        serviceProviderHeaders:'',
        requestsReplaced:'',
        choreType:'Food',
    };
    const mockStore = {
        serviceProviderId: "804790549",
        userId: "804790549",
    };

    store.get.mockImplementation((key) => mockStore[key]);
    choresStorage.getReplacementRequests.mockResolvedValue({status:200});

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

    test("renders ReplacementRequests for /chores", async () => {

        const setPageSpy = jest.spyOn(ReplacementRequests.prototype, 'getRequests');
        setPageSpy.mockResolvedValue({});
        const arrResponse = await setupComponent('shallow', ReplacementRequests, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(ReplacementRequests)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data", async () => {
        const setPageSpy = jest.spyOn(ReplacementRequests.prototype, 'getRequests');
        setPageSpy.mockResolvedValue({});
        const arrResponse = await setupComponent('shallow', ReplacementRequests, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.status).toEqual('requested');
        expect(componentInstance.state.choreType).toEqual('Food');
        expect(componentInstance.state.requests).toEqual([]);


    });

    test("render with what the user see", async () => {
        const setPageSpy = jest.spyOn(ReplacementRequests.prototype, 'getRequests');
        setPageSpy.mockResolvedValue({});
        const arrResponse = await setupComponent('shallow', ReplacementRequests, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('ReplacementRequests').dive();

        expect(shallowWrapper.find('label')).toHaveLength(2);
        expect(shallowWrapper.find('label').at(0).props().children).toEqual('חודש');
        expect(shallowWrapper.find('label').at(1).props().children).toEqual('');
        expect(shallowWrapper.find('NumericInput')).toHaveLength(1);

      });
});
