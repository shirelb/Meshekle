import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import {createMemoryHistory} from 'history';
import CreateNewChoreType from "../../../components/chores/CreateNewChoreType";
import choresStorage from "../../../storage/choresStorage";


jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/choresStorage");


describe("CreateNewChoreType should", () => {
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
        openModalRequest:jest.fn(),
        onCreateChoreType:jest.fn(),
    };
    const mockStore = {
        serviceProviderId: "804790549",
        userId: "804790549",
    };

    store.get.mockImplementation((key) => mockStore[key]);
    choresStorage.createNewChoreType.mockResolvedValue({status:200,data:[]});

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

    test("renders CreateNewChoreType for /chores", async () => {
        const arrResponse = await setupComponent('shallow', CreateNewChoreType, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(CreateNewChoreType)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data", async () => {
        const arrResponse = await setupComponent('shallow', CreateNewChoreType, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.settings).toBeDefined();
        expect(componentInstance.state.newSettings).toBeDefined();
        expect(componentInstance.state.settings).toEqual({"choreTypeName": "", "color": "", "days": "", "endTime": "", "frequency": "", "numberOfWorkers": "", "serviceProviderId": "", "startTime": ""});
        expect(componentInstance.state.newSettings).toEqual({"choreTypeName": "", "color": "", "days": "", "endTime": "", "frequency": "", "numberOfWorkers": "", "serviceProviderId": "", "startTime": ""});


    });

    test("render with what the user see", async () => {
        const arrResponse = await setupComponent('shallow', CreateNewChoreType, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('CreateNewChoreType').dive();


        expect(shallowWrapper.find('Form')).toHaveLength(1);
        expect(shallowWrapper.find('FormField')).toHaveLength(5);
        expect(shallowWrapper.find('label')).toHaveLength(6);
        expect(shallowWrapper.find('Input')).toHaveLength(2);
        expect(shallowWrapper.find('h4')).toHaveLength(1);
        expect(shallowWrapper.find('DaysTags')).toHaveLength(1);
        expect(shallowWrapper.find('NumericInput')).toHaveLength(1);
        expect(shallowWrapper.find('FormGroup')).toHaveLength(2);

        expect(shallowWrapper.find('FormField').at(0).props().children[0].props.children).toEqual(" שם התורנות: ");
        expect(shallowWrapper.find('FormField').at(1).props().children[0].props.children).toEqual(" מספר עובדים");
        expect(shallowWrapper.find('FormField').at(2).props().children[0].props.children).toEqual(" תדירות");


        expect(shallowWrapper.find('label').at(0).props().children).toEqual(" שם התורנות: ");
        expect(shallowWrapper.find('label').at(1).props().children).toEqual(" מספר עובדים");
        expect(shallowWrapper.find('label').at(2).props().children).toEqual("");
        expect(shallowWrapper.find('label').at(3).props().children).toEqual(" תדירות");
        expect(shallowWrapper.find('label').at(4).props().children).toEqual("שעת התחלה");
        expect(shallowWrapper.find('label').at(5).props().children).toEqual("שעת סיום");


        expect(shallowWrapper.find('h4').at(0).props().children).toEqual("ימים:");



      });
});
