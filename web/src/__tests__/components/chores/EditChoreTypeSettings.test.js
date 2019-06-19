import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import {createMemoryHistory} from 'history';
import EditChoreTypeSettings from "../../../components/chores/EditChoreTypeSettings";
import choresStorage from "../../../storage/choresStorage";


jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/choresStorage");


describe("EditChoreTypeSettings should", () => {
    let wrapper = null;
    let componentInstance = null;
    const propsSettings={choreTypeName:'Food',days:['sunday'],numberOfWorkers:4,frequency:2,startTime:"13:00",endTime:"14:00",color:"black"};


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
        onClose:jest.fn(),
        settings: propsSettings,
    };
    const mockStore = {
        serviceProviderId: "804790549",
        userId: "804790549",
    };

    store.get.mockImplementation((key) => mockStore[key]);
    choresStorage.editChoreTypeSetting.mockResolvedValue({status:200,data:[]});

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

    test("renders EditChoreTypeSettings for /chores", async () => {
        const arrResponse = await setupComponent('shallow', EditChoreTypeSettings, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(EditChoreTypeSettings)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data", async () => {
        const arrResponse = await setupComponent('shallow', EditChoreTypeSettings, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.deviation).toBeDefined();
        expect(componentInstance.state.newSettings).toBeDefined();
        expect(componentInstance.state.editErrorMessage).toBeDefined();
        expect(componentInstance.state.deviation).toEqual(false);
        expect(componentInstance.state.newSettings).toEqual({"choreTypeName": "Food", "color": "black", "days": ["sunday"], "endTime": "14:00", "frequency": 2, "numberOfWorkers": 4, "startTime": "13:00"});
        expect(componentInstance.state.editErrorMessage).toEqual("");


    });

    test("render with what the user see", async () => {
        const arrResponse = await setupComponent('shallow', EditChoreTypeSettings, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('EditChoreTypeSettings').dive();


        expect(shallowWrapper.find('Form')).toHaveLength(1);
        expect(shallowWrapper.find('FormField')).toHaveLength(4);
        expect(shallowWrapper.find('FormButton')).toHaveLength(2);
        expect(shallowWrapper.find('label')).toHaveLength(5);
        expect(shallowWrapper.find('Input')).toHaveLength(1);
        expect(shallowWrapper.find('FormGroup')).toHaveLength(2);

        expect(shallowWrapper.find('FormField').at(0).props().children[0].props.children).toEqual(" מספר עובדים");
        expect(shallowWrapper.find('FormField').at(1).props().children[0].props.children).toEqual(" תדירות");


        expect(shallowWrapper.find('label').at(0).props().children).toEqual(" מספר עובדים");
        expect(shallowWrapper.find('label').at(1).props().children).toEqual("");
        expect(shallowWrapper.find('label').at(2).props().children).toEqual(" תדירות");
        expect(shallowWrapper.find('label').at(3).props().children).toEqual("שעת התחלה");
        expect(shallowWrapper.find('label').at(4).props().children).toEqual("שעת סיום");





      });
});
