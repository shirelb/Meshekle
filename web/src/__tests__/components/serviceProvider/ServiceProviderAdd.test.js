import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import moment from 'moment';
import {createMemoryHistory} from 'history';
import ServiceProviderAdd from "../../../components/serviceProvider/ServiceProviderAdd";
import serviceProvidersStorage from "../../../storage/serviceProvidersStorage";
import usersStorage from "../../../storage/usersStorage";
import users from "../../jsons/users";
import serviceProviders from "../../jsons/serviceProviders";
import ServiceProviderForm from "../../../components/serviceProvider/ServiceProviderForm";

jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/serviceProvidersStorage");


describe("ServiceProviderAdd should", () => {
    let wrapper = null;
    let componentInstance = null;


    const history = createMemoryHistory({
        initialEntries: ['/', '/home', '/phoneBook', '/phoneBook/serviceProvider/add'],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });

    const history2 = createMemoryHistory({
        initialEntries: ['/', '/home', '/phoneBook', '/phoneBook/serviceProvider/add'],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });


    const props = {
        history: history,
        location: {
            pathname: '/phoneBook/serviceProvider/add',
            state: {
                users: users,
            },
        },
        match: {
            isExact: true,
            path: '/phoneBook/serviceProvider/add',
            url: '/phoneBook/serviceProvider/add',
        },

    };
    const props2 = {
        history: history2,
        location: {
            pathname: '/phoneBook/serviceProvider/add',
            state: {
                users: users,
            },
        },
        match: {
            isExact: true,
            path: '/phoneBook/serviceProvider/add',
            url: '/phoneBook/serviceProvider/add',
        },
    };


    const mockStore = {
        serviceProviderId: "804790549",
        userId: "804790549",
    };

    const serviceProviderToAdd = {
        "serviceProviderId": "990927574",
        "role": "appointmentsDentist",
        "userId": "990927574",
        "operationTime": "[{\"day\":\"Sunday\",\"hours\":[{\"startHour\":\"3:45\",\"endHour\":\"23:49\"},{\"startHour\":\"11:43\",\"endHour\":\"12:35\"}]},{\"day\":\"Saturday\",\"hours\":[{\"startHour\":\"6:03\",\"endHour\":\"12:32\"},{\"startHour\":\"10:59\",\"endHour\":\"15:54\"}]}]",
        "phoneNumber": "0594328989",
        "appointmentWayType": "Slots",
        "subjects": "[\"שיננית\", \"יישור שיניים\", \"עקירה\", \"ניקוי\"]",
        "active": true,
        "createdAt": "2019-05-20T20:06:34.619Z",
        "updatedAt": "2019-05-20T20:06:34.619Z"
    };

    store.get.mockImplementation((key) => mockStore[key]);
    serviceProvidersStorage.createServiceProvider.mockResolvedValue({staus:200});
    serviceProvidersStorage.getServiceProviderById.mockResolvedValue({staus:200});

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

    test.skip('match snapshot with slotInfo', async () => {
        const props = {
            location: {
                pathname: '/appointments/set',
                state: {
                    slotInfo: slotInfo
                }
            },
            match: {
                isExact: true,
                path: '/appointments/set',
                url: '/appointments/set',
            },
            serviceProviderRoles:["appointmentsHairDresser"],
        };

        const arrResponse = setupComponent('shallow', AppointmentAdd, null, props, "/appointments/set");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test.skip('match snapshot with appointmentRequestDropped', async () => {
        const props = {
            location: {
                pathname: '/appointments/set',
                state: {
                    appointmentRequestDropped: appointmentRequestDropped
                }
            },
            match: {
                isExact: true,
                path: '/appointments/set',
                url: '/appointments/set',
            },
            serviceProviderRoles:["appointmentsHairDresser"],
        };

        const arrResponse = setupComponent('shallow', AppointmentAdd, null, props, "/appointments/set");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test("renders ServiceProviderAdd for /phoneBook/serviceProvider/add", async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderAdd, history, props, "/phoneBook/serviceProvider/add");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(ServiceProviderAdd)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });


    test("handleSubmit", async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderAdd, history, props, "/phoneBook/serviceProvider/add");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleSubmit(serviceProviderToAdd);
        expect(componentInstance.props.history.location.pathname).toEqual('/phoneBook');
    });

    test("handleCancel", async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderAdd, history2, props2, "/phoneBook/serviceProvider/add");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleCancel({
            preventDefault() {
            }
        });

        wrapper.update();
        expect(componentInstance.props.history.location.pathname).toEqual('/phoneBook');

    });

    test("render with what the user see on add announcement", async () => {
        const arrResponse = await setupComponent('mount',  ServiceProviderAdd, history, props, "/phoneBook/serviceProvider/add");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];


        expect(wrapper.find('ServiceProviderAdd').find('Modal')).toHaveLength(1);
        expect(wrapper.find('ServiceProviderAdd').find('Grid')).toHaveLength(1);
        expect(wrapper.find('ServiceProviderAdd').find('Header').first().props().children).toEqual('נותן שירות חדש');
        expect(wrapper.find('ServiceProviderAdd').find('ServiceProviderForm')).toHaveLength(1);
    });

});
