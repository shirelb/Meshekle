import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import moment from 'moment';
import {createMemoryHistory} from 'history';
import ServiceProviderEdit from "../../../components/serviceProvider/ServiceProviderEdit";
import serviceProvidersStorage from "../../../storage/serviceProvidersStorage";
import usersStorage from "../../../storage/usersStorage";
import users from "../../jsons/users";
import serviceProviders from "../../jsons/serviceProviders";
import AnnouncementAdd from "../../../components/announcement/AnnouncementAdd";

jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/serviceProvidersStorage");


describe("ServiceProviderEdit should", () => {
    let wrapper = null;
    let componentInstance = null;

    const serviceProviderToUpdate= {
        "serviceProviderId": "990927574",
        "fullname": "Valle Edgin",
        "role": "appointmentsDentist",
        "userId": "990927574",
        "operationTime": "[{\"day\":\"Sunday\",\"hours\":[{\"startHour\":\"3:45\",\"endHour\":\"23:49\"},{\"startHour\":\"11:43\",\"endHour\":\"12:35\"}]},{\"day\":\"Saturday\",\"hours\":[{\"startHour\":\"6:03\",\"endHour\":\"12:32\"},{\"startHour\":\"10:59\",\"endHour\":\"15:54\"}]}]",
        "phoneNumber": "0594328989",
        "appointmentWayType": "Slots",
        "subjects": "[\"שיננית\", \"יישור שיניים\", \"עקירה\", \"ניקוי\"]",
        "active": true,
    };

    const userDetails = {
        "userId": "990927574",
        "fullname": "Valle Edgin",
        "password": "0878efd4feafce4d8bbe412bf0343468a589d33a2148a72fcfeee9db8498bde8482db4f6339048e41885761659050555def2673591a55faeab898dc56462eabe",
        "email": "vedgin5@etsy.com",
        "mailbox": 6,
        "cellphone": "0561681889",
        "phone": "049590143",
        "bornDate": "1991-05-22T19:24:15.000Z",
        "active": true,
        "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAINSURBVDjLY/j//z8DPlxYWFgAxA9ANDZ5BiIMeASlH5BswPz58+uampo2kuUCkGYgPg/EQvgsweZk5rlz5zYSoxnDAKBmprq6umONjY1vsmdeamvd9Pzc1N2vv/Zse/k0a/6jZWGT7hWGTLhrEdR7hwOrAfPmzWtob29/XlRc9qdjw8P76fMeTU2c9WBi5LQH7UB6ftS0B9MDe+7k+XfeCvRpu6Xr1XJTEMPP2TMvlkzZ8fhn9JSb+ujO9e+6ZebbcSvMu/Wmm2fzDSv3hmuGsHh+BAptkJ9Llj3e2LDu2SVcfvZqucHm0XhD163+mplLzVVtjHgGar7asO75bXSNRyLkKg748j3c48Tyb6cr86MNnsJNDhVXVDFSWuO6Z/c6Nj//jKI5XK78YrHFz+9be///u7bj/9cVRf9PZ+v+2enMlofhxKKlj89M2PHiP9CvxjCxnS7Md78BNf+f5Pv/f7ng//9tiv9fdzn8B4rfwzAgfuaDjZN2vvrv2XIjByYGcva/s+v+I4P39RL/QeIYBni33GycuOPl/8DeW0vgLnBlfvxlbvL//0BNP8oY/r8D4ocZzP+B4k8wDABGjXf7puf/8xY/euZYcYUNJHY4XKrhZIrq72fliv9fVbL+v5vC+H+vL8ufHa7MVRgGAKNGqHLV0z8Vqx7/ty29FIgISNkKoI33obHwGKQZJA4AVQ2j4x4gIJMAAAAASUVORK5CYII=",
    };

        const history = createMemoryHistory({
        initialEntries: ['/', '/home', '/phoneBook', '/phoneBook/serviceProvider/549963652/','/phoneBook/serviceProvider/549963652/edit'],
        initialIndex: 4,
        keyLength: 10,
        getUserConfirmation: null
    });

    const history2 = createMemoryHistory({
        initialEntries: ['/', '/home', '/phoneBook', '/phoneBook/serviceProvider/549963652/','/phoneBook/serviceProvider/549963652/edit'],
        initialIndex: 4,
        keyLength: 10,
        getUserConfirmation: null
    });


    const props = {
        history: history,
        location: {
            pathname: '/phoneBook/serviceProvider/549963652/edit',
            state:{
                serviceProvider:serviceProviderToUpdate,
                dropdownRoles: [],
                serviceProvidersFound: []
            },
        },
        match: {
            isExact: true,
            path: '/phoneBook/serviceProvider/549963652/edit',
            url: '/phoneBook/serviceProvider/549963652/edit',
        },
    };
    const props2 = {
        history: history2,
        location: {
            pathname: '/phoneBook/serviceProvider/549963652/edit',
            state:{
                serviceProvider:serviceProviderToUpdate,
                dropdownRoles: [],
                serviceProvidersFound: []
            },
        },
        match: {
            isExact: true,
            path: '/phoneBook/serviceProvider/549963652/edit',
            url: '/phoneBook/serviceProvider/549963652/edit',
        },
    };

    const mockStore = {
        serviceProviderId: "804790549",
        userId: "804790549",
    };

    store.get.mockImplementation((key) => mockStore[key]);
    serviceProvidersStorage.getServiceProviderById.mockResolvedValue(serviceProviderToUpdate);
    serviceProvidersStorage.getServiceProviderUserDetails.mockResolvedValue(userDetails);
    serviceProvidersStorage.updateServiceProviderById.mockResolvedValue({staus:200});
    usersStorage.getUsers.mockResolvedValue(users);

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

    // test.skip('match snapshot with slotInfo', async () => {
    //     const props = {
    //         location: {
    //             pathname: '/appointments/set',
    //             state: {
    //                 slotInfo: slotInfo
    //             }
    //         },
    //         match: {
    //             isExact: true,
    //             path: '/appointments/set',
    //             url: '/appointments/set',
    //         },
    //         serviceProviderRoles:["appointmentsHairDresser"],
    //     };
    //
    //     const arrResponse = setupComponent('shallow', AppointmentAdd, null, props, "/appointments/set");
    //     wrapper = arrResponse[0];
    //     componentInstance = arrResponse[1];
    //
    //     expect(componentInstance).toMatchSnapshot();
    // });
    //
    // test.skip('match snapshot with appointmentRequestDropped', async () => {
    //     const props = {
    //         location: {
    //             pathname: '/appointments/set',
    //             state: {
    //                 appointmentRequestDropped: appointmentRequestDropped
    //             }
    //         },
    //         match: {
    //             isExact: true,
    //             path: '/appointments/set',
    //             url: '/appointments/set',
    //         },
    //         serviceProviderRoles:["appointmentsHairDresser"],
    //     };
    //
    //     const arrResponse = setupComponent('shallow', AppointmentAdd, null, props, "/appointments/set");
    //     wrapper = arrResponse[0];
    //     componentInstance = arrResponse[1];
    //
    //     expect(componentInstance).toMatchSnapshot();
    // });

    test("renders ServiceProviderEdit for /phoneBook/serviceProvider/549963652/edit", async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderEdit, history, props, "/phoneBook/serviceProvider/549963652/edit");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(ServiceProviderEdit)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data for user in edit service provider", async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderEdit, history, props, "/phoneBook/serviceProvider/549963652/edit");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.serviceProvider).toBeDefined();
        expect(componentInstance.state.serviceProvider).toEqual(serviceProviderToUpdate);
        expect(componentInstance.state.dropdownRoles).toBeDefined();
        expect(componentInstance.state.dropdownRoles).toEqual([]);
        expect(componentInstance.state.serviceProvidersFound).toBeDefined();
        expect(componentInstance.state.serviceProvidersFound).toEqual([]);
    });


    test("handleSubmit", async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderEdit, history, props, "/phoneBook/serviceProvider/549963652/edit");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleSubmit(serviceProviderToUpdate);
        expect(componentInstance.props.history.location.pathname).toEqual('/phoneBook');
    });

    test("handleCancel", async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderEdit, history2, props2, "/phoneBook/serviceProvider/549963652/edit");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleCancel({
            preventDefault() {
            }
        });

        wrapper.update();
        expect(componentInstance.props.history.location.pathname).toEqual('/phoneBook/serviceProvider/549963652/');

    });

    test("render with what the user see on edit service provider", async () => {
        const arrResponse = await setupComponent('mount',  ServiceProviderEdit, history, props, "/phoneBook/serviceProvider/549963652/edit");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];


        expect(wrapper.find('ServiceProviderEdit').find('Modal')).toHaveLength(1);
        expect(wrapper.find('ServiceProviderEdit').find('Header').first().props().children).toEqual('ערוך נותן שירות');
        expect(wrapper.find('ServiceProviderEdit').find('ServiceProviderForm')).toHaveLength(1);
    });

});
