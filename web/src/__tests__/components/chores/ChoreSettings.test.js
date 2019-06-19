import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import {createMemoryHistory} from 'history';
import ChoreSettings from "../../../components/chores/ChoreSettings";
import choresStorage from "../../../storage/choresStorage";


jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/choresStorage");


describe("ChoreSettings should", () => {
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
        settings:propsSettings,
        onUpdateSettings:jest.fn(),
        onDeleteType:jest.fn(),
    };
    const mockStore = {
        serviceProviderId: "804790549",
        userId: "804790549",
    };

    store.get.mockImplementation((key) => mockStore[key]);
    choresStorage.deleteChoreType.mockResolvedValue({status:200});

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

    test("renders ChoreSettings for /chores", async () => {
        const arrResponse = await setupComponent('shallow', ChoreSettings, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(ChoreSettings)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data", async () => {
        const arrResponse = await setupComponent('shallow', ChoreSettings, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.settings).toBeDefined();
        expect(componentInstance.state.settings).toEqual(propsSettings);


    });

    test("render with what the user see", async () => {
        const arrResponse = await setupComponent('shallow', ChoreSettings, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('ChoreSettings').dive();

        expect(shallowWrapper.find('Modal')).toHaveLength(2);
        expect(shallowWrapper.find('ModalHeader')).toHaveLength(2);
        expect(shallowWrapper.find('ModalHeader').at(0).props().children).toEqual('עריכת פרטי תורנות');
        expect(shallowWrapper.find('ModalHeader').at(1).props().children).toEqual('');
        expect(shallowWrapper.find('ModalContent')).toHaveLength(2);



        expect(shallowWrapper.find('Button')).toHaveLength(4);

        expect(shallowWrapper.find('Button').at(0).props().children).toEqual("מחיקת סוג תורנות");
        expect(shallowWrapper.find('Button').at(1).props().children).toEqual("בטל");
        expect(shallowWrapper.find('Button').at(2).props().children).toEqual("אישור");
        expect(shallowWrapper.find('Button').at(3).props().children).toEqual("חזור");

        expect(shallowWrapper.find('h4')).toHaveLength(7);
        expect(shallowWrapper.find('h4').at(0).props().children).toEqual(["שם התורנות: ", "Food"]);
        expect(shallowWrapper.find('h4').at(1).props().children).toEqual(["ימים: ", ["sunday"]]);
        expect(shallowWrapper.find('h4').at(2).props().children).toEqual(["מספר עובדים בתורנות: ", 4]);
        expect(shallowWrapper.find('h4').at(3).props().children).toEqual(["תדירות : ", 2]);
        expect(shallowWrapper.find('h4').at(4).props().children).toEqual(["שעת התחלה : ", "13:00"]);
        expect(shallowWrapper.find('h4').at(5).props().children).toEqual(["שעת סיום : ", "14:00"]);

      });
});
