import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import {createMemoryHistory} from 'history';
import ServiceProviderInfo from "../../../components/serviceProvider/ServiceProviderInfo";
import serviceProvidersStorage from "../../../storage/serviceProvidersStorage";
import strings from "../../../shared/strings";


jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/serviceProvidersStorage");


describe("ServiceProviderInfo should", () => {
    let wrapper = null;
    let componentInstance = null;
    const serviceProviderToDisplay={
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

    const history = createMemoryHistory({
        initialEntries: ['/', '/home', '/phoneBook', '/phoneBook/serviceProvider/549963652'],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });
    const props = {
        history: history,
        location: {
            pathname: '/phoneBook/serviceProvider/549963652',
            state: {
                serviceProvider:serviceProviderToDisplay,
            }
        },
        match: {
            isExact: true,
            path: '/phoneBook/serviceProvider/549963652',
            url: '/phoneBook/serviceProvider/549963652',
            params: {serviceProviderId:"549963652"}
        },
        hasPhoneBookPermissions:true,
    };
    const mockStore = {
        serviceProviderId: "804790549",
        userId: "804790549",
    };

    store.get.mockImplementation((key) => mockStore[key]);
    serviceProvidersStorage.getServiceProviderById.mockResolvedValue(serviceProviderToDisplay);
    serviceProvidersStorage.deleteServiceProviderById.mockResolvedValue({status:200});
    serviceProvidersStorage.renewUserPassword.mockResolvedValue({status:200});

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

    test("renders ServiceProviderInfo for /phoneBook/serviceProvider/549963652", async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderInfo, history, props, "/phoneBook/serviceProvider/549963652");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(ServiceProviderInfo)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data", async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderInfo, history, props, "/phoneBook/serviceProvider/549963652");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.serviceProvider).toBeDefined();
        expect(componentInstance.state.serviceProvider.serviceProviderId).toEqual(serviceProviderToDisplay.serviceProviderId);
        expect(componentInstance.state.serviceProvider.role).toEqual(serviceProviderToDisplay.role);
        expect(componentInstance.state.serviceProvider.userId).toEqual(serviceProviderToDisplay.userId);
        expect(componentInstance.state.serviceProvider.operationTime).toEqual(serviceProviderToDisplay.operationTime);
        expect(componentInstance.state.serviceProvider.phoneNumber).toEqual(serviceProviderToDisplay.phoneNumber);
        expect(componentInstance.state.serviceProvider.appointmentWayType).toEqual(serviceProviderToDisplay.appointmentWayType);
        expect(componentInstance.state.serviceProvider.subjects).toEqual(serviceProviderToDisplay.subjects);
        expect(componentInstance.state.serviceProvider.active).toEqual(serviceProviderToDisplay.active);


    });

    test("handleDelete", async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderInfo, history, props, "/phoneBook/serviceProvider/549963652");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleDelete();
        expect(componentInstance.props.history.location.pathname).toEqual('/phoneBook');
    });

    test("handleEdit", async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderInfo, history, props, "/phoneBook/serviceProvider/549963652");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await componentInstance.handleEdit();
        expect(componentInstance.props.history.location.pathname).toEqual('/phoneBook/serviceProvider/549963652/edit');
    });

    test("handleDelete on click delete button", async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderInfo, history, props, "/phoneBook/serviceProvider/549963652");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('ServiceProviderInfo').dive().find('Button').at(2).simulate('click')
        expect(componentInstance.props.history.location.pathname).toEqual('/phoneBook');
    });

    test("handleEdit on click edit button", async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderInfo, history, props, "/phoneBook/serviceProvider/549963652");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('ServiceProviderInfo').dive().find('Button').at(1).simulate('click')
        expect(componentInstance.props.history.location.pathname).toEqual('/phoneBook/serviceProvider/549963652/edit');
    });

    test("render with what the user see", async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderInfo, history, props, "/phoneBook/serviceProvider/549963652");
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('ServiceProviderInfo').dive();

        expect(shallowWrapper.find('Modal')).toHaveLength(1);
        expect(shallowWrapper.find('ModalHeader')).toHaveLength(1);
        expect(shallowWrapper.find('ModalHeader').props().children).toEqual(serviceProviderToDisplay.fullname);
        expect(shallowWrapper.find('ModalContent')).toHaveLength(1);
        expect(shallowWrapper.find('ModalContent').find('Image').props().src).toEqual('https://user-images.githubusercontent.com/30195/34457818-8f7d8c76-ed82-11e7-8474-3825118a776d.png');
        expect(shallowWrapper.find('p')).toHaveLength(6);
        expect(shallowWrapper.find('p').at(0).props().children[0]).toEqual(strings.phoneBookPageStrings.SERVICE_PROVIDER_ID_HEADER);
        expect(shallowWrapper.find('p').at(0).props().children[2]).toEqual(serviceProviderToDisplay.serviceProviderId);
        expect(shallowWrapper.find('p').at(1).props().children[0]).toEqual(strings.phoneBookPageStrings.FULLNAME_HEADER);
        expect(shallowWrapper.find('p').at(1).props().children[2]).toEqual(serviceProviderToDisplay.fullname);
        expect(shallowWrapper.find('p').at(2).props().children[0]).toEqual(strings.phoneBookPageStrings.SERVICE_PROVIDER_ROLE_HEADER);
        expect(shallowWrapper.find('p').at(2).props().children[2]).toEqual('מרפאת שיניים');
        expect(shallowWrapper.find('p').at(3).props().children[0]).toEqual(strings.phoneBookPageStrings.PHONE_HEADER);
        expect(shallowWrapper.find('p').at(3).props().children[2]).toEqual(serviceProviderToDisplay.phoneNumber);
        expect(shallowWrapper.find('p').at(4).props().children[0]).toEqual(strings.phoneBookPageStrings.SERVICE_PROVIDER_APPOINTMENT_WAY_TYPE_HEADER);
        expect(shallowWrapper.find('p').at(4).props().children[2]).toEqual('חלונות זמן');
        expect(shallowWrapper.find('p').at(5).props().children[0]).toEqual(strings.phoneBookPageStrings.ACTIVE_HEADER);
        expect(shallowWrapper.find('p').at(5).props().children[2]).toEqual('כן');


        expect(shallowWrapper.find('Button').at(0).props().children).toEqual("חדש סיסמא");

        expect(shallowWrapper.find('ModalActions')).toHaveLength(1);
        expect(shallowWrapper.find('Button')).toHaveLength(4);
        expect(shallowWrapper.find('Button').at(1).props().children).toEqual("ערוך");
        expect(shallowWrapper.find('Button').at(1).props().positive).toBeTruthy();
        expect(shallowWrapper.find('Button').at(2).props().children).toEqual("מחק");
        expect(shallowWrapper.find('Button').at(2).props().negative).toBeTruthy();
        expect(shallowWrapper.find('Button').at(3).props().children).toEqual("סגור");
    });
});
