import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import {createMemoryHistory} from 'history';
import UsersInTypeModal from "../../../components/chores/UsersInTypeModal";
import choresStorage from "../../../storage/choresStorage";


jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/choresStorage");


describe("UsersInTypeModal should", () => {
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
        usersInType:[],
        errorDeleteUserFromChoreType:"",
        isOpenModalUsers:false,
        choreTypeSelected:"",
        deleteUserFromChoreType:jest.fn(),
    };
    const mockStore = {
        serviceProviderId: "804790549",
        userId: "804790549",
    };

    store.get.mockImplementation((key) => mockStore[key]);
    choresStorage.editChoreTypeSetting.mockResolvedValue({status:200,data:[]});
    choresStorage.getUsersNotInType.mockResolvedValue({status:200,data:{uses:[]}});

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

    test("renders UsersInTypeModal for /chores", async () => {
        const arrResponse = await setupComponent('shallow', UsersInTypeModal, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(UsersInTypeModal)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data", async () => {
        const arrResponse = await setupComponent('shallow', UsersInTypeModal, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.usersInType).toBeDefined();
        expect(componentInstance.state.errorDeleteUserFromChoreType).toBeDefined();


        expect(componentInstance.state.usersInType).toEqual([]);
        expect(componentInstance.state.errorDeleteUserFromChoreType).toEqual("");


    });

    test("render with what the user see", async () => {
        const arrResponse = await setupComponent('shallow', UsersInTypeModal, history, props, "/chores");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('UsersInTypeModal').dive();


        expect(shallowWrapper.find('Modal')).toHaveLength(1);
        expect(shallowWrapper.find('ModalHeader')).toHaveLength(1);
        expect(shallowWrapper.find('ModalContent')).toHaveLength(1);
        expect(shallowWrapper.find('p')).toHaveLength(3);

        expect(shallowWrapper.find('p').at(0).props().children).toEqual("");
        expect(shallowWrapper.find('p').at(1).props().children).toEqual("");
        expect(shallowWrapper.find('p').at(2).props().children).toEqual("");




      });
});
