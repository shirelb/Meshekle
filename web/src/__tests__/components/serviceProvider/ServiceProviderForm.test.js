import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import {createMemoryHistory} from 'history';
import ServiceProviderForm from "../../../components/serviceProvider/ServiceProviderForm";
import usersStorage from "../../../storage/usersStorage";
import serviceProvidersStorage from "../../../storage/serviceProvidersStorage";
import users from "../../jsons/users";


jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/serviceProvidersStorage");


describe("ServiceProviderForm should", () => {
    let wrapper = null;
    let componentInstance = null;
    const addPath = '/phoneBook/serviceProvider/add';
    const editPath = '/phoneBook/serviceProvider/549963652/edit';

    const serviceProviderToEdit= {
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


    const addHistory = createMemoryHistory({
        initialEntries: ['/', '/home', '/phoneBook', addPath],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });
    const editHistory = createMemoryHistory({
        initialEntries: ['/', '/home', '/phoneBook', editPath],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });

    const addProps = {
        history: addHistory,
        location: {
            pathname: addPath,
        },
        match: {
            isExact: true,
            path: addPath,
            url: addPath,
        },
        handleSubmit: jest.fn().mockResolvedValue({data:{status:200}}),
        submitText:'הוסף',
    };

    const editProps = {
        history: editHistory,
        location: {
            pathname: editPath,
        },
        match: {
            isExact: true,
            path: editPath,
            url: editPath,
        },
        serviceProvider:serviceProviderToEdit,
        handleSubmit: jest.fn().mockResolvedValue({data:{status:200}}),
        submitText:'עדכן',
    };

    const mockStore = {
        serviceProviderId: "804790549",
        userId: "804790549",
    };


    store.get.mockImplementation((key) => mockStore[key]);
    serviceProvidersStorage.getServiceProviderById.mockResolvedValue(serviceProviderToEdit);
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
    //
    // test.skip('match snapshot with slotInfo', async () => {
    //     const arrResponse = setupComponent('shallow', AppointmentForm, null, buildProps(null, pathAdd, {
    //         slotInfo: slotInfo,
    //         submitText: "קבע",
    //     }), pathAdd);
    //
    //     wrapper = arrResponse[0];
    //     componentInstance = arrResponse[1];
    //
    //     expect(componentInstance).toMatchSnapshot();
    // });
    //
    // test.skip('match snapshot with appointment', async () => {
    //     const arrResponse = setupComponent('shallow', AppointmentForm, null, buildProps(null, pathEdit, {
    //         appointment: appointmentTest,
    //         submitText: "עדכן"
    //     }), pathEdit);
    //     wrapper = arrResponse[0];
    //     componentInstance = arrResponse[1];
    //
    //     expect(componentInstance).toMatchSnapshot();
    // });
    //
    // test.skip('match snapshot with appointmentRequest', async () => {
    //     const arrResponse = setupComponent('shallow', AppointmentForm, null, buildProps(null, pathAdd, {
    //         appointmentRequestEvent: appointmentRequestTest,
    //         submitText: "קבע",
    //     }), pathAdd);
    //
    //     wrapper = arrResponse[0];
    //     componentInstance = arrResponse[1];
    //
    //     expect(componentInstance).toMatchSnapshot();
    // });

    test("renders ServiceProviderForm for "+addPath, async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderForm, addHistory, addProps, addPath);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(ServiceProviderForm)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("renders ServiceProviderForm for "+editPath, async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderForm, editHistory, editProps, editPath);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(ServiceProviderForm)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data for Add Service Provider", async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderForm, addHistory, addProps, addPath);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.serviceProvider).toBeDefined();
        expect(componentInstance.state.serviceProvider.role).toEqual('');
        expect(componentInstance.state.serviceProvider.userId).toEqual('');
        expect(componentInstance.state.serviceProvider.phoneNumber).toEqual('');
        expect(componentInstance.state.serviceProvider.appointmentWayType).toEqual('');
        expect(componentInstance.state.serviceProvider.subjects).toEqual([]);
        expect(componentInstance.state.serviceProvider.active).toEqual(false);


    });

    test("mounted with the right data for edit Service Provider", async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderForm, editHistory, editProps, editPath);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.serviceProvider).toBeDefined();
        expect(componentInstance.state.serviceProvider.role).toEqual(serviceProviderToEdit.role);
        expect(componentInstance.state.serviceProvider.userId).toEqual(serviceProviderToEdit.userId);
        expect(componentInstance.state.serviceProvider.phoneNumber).toEqual(serviceProviderToEdit.phoneNumber);
        expect(componentInstance.state.serviceProvider.appointmentWayType).toEqual(serviceProviderToEdit.appointmentWayType);
        expect(componentInstance.state.serviceProvider.subjects).toEqual(JSON.parse(serviceProviderToEdit.subjects));
        expect(componentInstance.state.serviceProvider.active).toEqual(serviceProviderToEdit.active);
    });

    test("handleSubmit with empty fields", async () => {
        const arrResponse = await setupComponent('mount', ServiceProviderForm, addHistory, addProps, addPath);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('ServiceProviderForm').find('Form').find('FormButton').at(0).props().onClick({
            preventDefault() {
            }
        });
        expect(componentInstance.state.formError).toEqual(true);
    });


    test("handleSubmit in edit mode", async () => {
        const arrResponse = await setupComponent('mount', ServiceProviderForm, editHistory, editProps, editPath);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('ServiceProviderForm').find('Form').find('FormButton').at(0).props().onClick({
            preventDefault() {
            }
        });
        expect(componentInstance.state.serviceProvider.userId).toEqual("");
    });

    test("handleChange", async () => {
        const handleChangeSpy = jest.spyOn(ServiceProviderForm.prototype, 'handleChange');
        const arrResponse = await setupComponent('mount', ServiceProviderForm, addHistory, addProps, addPath);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('ServiceProviderForm').find('FormInput').at(0).props().onChange(
            {},
            {
                name: 'phoneNumber',
                value: 'newphoneNumber'
            }
        );

        expect(handleChangeSpy).toHaveBeenCalled();
        expect(handleChangeSpy.mock.instances[0].state.serviceProvider.phoneNumber).toEqual('newphoneNumber');
    });

    test("handleClear", async () => {
        const arrResponse = await setupComponent('mount', ServiceProviderForm, addHistory, addProps, addPath);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        wrapper.find('ServiceProviderForm').find('FormButton').at(2).props().onClick({
            preventDefault() {
            }
        });
        expect(componentInstance.state.serviceProvider.phoneNumber).toEqual('');
    });

    test("render with what the user see for "+addPath, async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderForm, addHistory, addProps, addPath);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('ServiceProviderForm').dive();

        expect(shallowWrapper.find('Form')).toHaveLength(1);
        expect(shallowWrapper.find('FormInput')).toHaveLength(2);
        expect(shallowWrapper.find('FormField')).toHaveLength(2);
        expect(shallowWrapper.find('FormInput').at(0).props().name).toEqual('phoneNumber');
        expect(shallowWrapper.find('FormInput').at(0).props().label).toEqual('טלפון');
        expect(shallowWrapper.find('FormInput').at(0).props().value).toEqual('');

        expect(shallowWrapper.find('FormInput').at(1).props().name).toEqual('active');
        expect(shallowWrapper.find('FormInput').at(1).props().label).toEqual('פעיל');


        expect(shallowWrapper.find('FormField').at(0).props().name).toEqual('userId');
        expect(shallowWrapper.find('FormField').at(0).props().label).toEqual('משתמש');
        expect(shallowWrapper.find('FormField').at(0).props().value).toEqual('');

        expect(shallowWrapper.find('FormField').at(1).find('label').at(0).props().children).toEqual('תפקיד');


        expect(shallowWrapper.find('Message')).toHaveLength(0);

        expect(shallowWrapper.find('FormButton')).toHaveLength(3);
        expect(shallowWrapper.find('FormButton').at(0).props().children).toEqual("הוסף");
        expect(shallowWrapper.find('FormButton').at(0).props().positive).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(0).props().type).toEqual("submit");
        expect(shallowWrapper.find('FormButton').at(1).props().children).toEqual("בטל");
        expect(shallowWrapper.find('FormButton').at(1).props().negative).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(2).props().children).toEqual("נקה הכל");
    });



    test("render with what the user see for "+editPath, async () => {
        const arrResponse = await setupComponent('shallow', ServiceProviderForm, editHistory, editProps, editPath);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('ServiceProviderForm').dive();

        expect(shallowWrapper.find('Form')).toHaveLength(1);
        expect(shallowWrapper.find('FormInput')).toHaveLength(3);
        expect(shallowWrapper.find('FormInput').at(0).props().name).toEqual('phoneNumber');
        expect(shallowWrapper.find('FormInput').at(0).props().label).toEqual('טלפון');
        expect(shallowWrapper.find('FormInput').at(0).props().value).toEqual(serviceProviderToEdit.phoneNumber);

        expect(shallowWrapper.find('FormInput').at(1).props().name).toEqual('active');
        expect(shallowWrapper.find('FormInput').at(1).props().label).toEqual('פעיל');

        expect(shallowWrapper.find('FormInput').at(2).props().name).toEqual('operationTime');
        expect(shallowWrapper.find('FormInput').at(2).props().label).toEqual('זמן פעילות');



        expect(shallowWrapper.find('FormField')).toHaveLength(4);
        expect(shallowWrapper.find('FormField').at(0).props().name).toEqual('userId');
        expect(shallowWrapper.find('FormField').at(0).props().label).toEqual('משתמש');
        expect(shallowWrapper.find('FormField').at(0).props().value).toEqual(serviceProviderToEdit.userId);

        expect(shallowWrapper.find('FormField').at(1).find('label').at(0).props().children).toEqual('תפקיד');

        expect(shallowWrapper.find('FormField').at(2).props().children[0].props.children).toEqual('דרך הצגת התורים');


        expect(shallowWrapper.find('Message')).toHaveLength(0);

        expect(shallowWrapper.find('FormButton')).toHaveLength(3);
        expect(shallowWrapper.find('FormButton').at(0).props().children).toEqual("עדכן");
        expect(shallowWrapper.find('FormButton').at(0).props().positive).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(0).props().type).toEqual("submit");
        expect(shallowWrapper.find('FormButton').at(1).props().children).toEqual("בטל");
        expect(shallowWrapper.find('FormButton').at(1).props().negative).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(2).props().children).toEqual("נקה הכל");
    });


});
