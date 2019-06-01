import React from 'react';
import {shallow} from "enzyme/build";
import {setupComponent} from "../../testHelpers";
import PageNotFound from "../../../pages/pageNotFound404/PageNotFound";
import store from 'store';
import moment from 'moment';
import {createMemoryHistory} from 'history';
import AppointmentForm from "../../../components/appointment/AppointmentForm";
import serviceProvidersStorage from "../../../storage/serviceProvidersStorage";
import appointmentsStorage from "../../../storage/appointmentsStorage";
import usersStorage from "../../../storage/usersStorage";
import users from "../../jsons/users";
import serviceProviders from "../../jsons/serviceProviders";
import appointmentsOf549963652 from "../../jsons/appointmentsServiceProvider549963652";

const appointmentRequestsOf549963652 = require("../../jsons/appointmentRequestsServiceProvider549963652");

jest.mock("store");
jest.mock("../../../storage/usersStorage");
jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/appointmentsStorage");


describe("AppointmentForm should", () => {
    let wrapper = null;
    let componentInstance = null;
    const pathAdd = '/appointments/set';
    const pathEdit = '/appointments/428/edit';
    let appointmentTest = appointmentsOf549963652[0];
    appointmentTest.clientName = "Padget Creaser";
    let appointmentRequestTest = {
        allDay: false,
        appointmentRequest: appointmentRequestsOf549963652[1],
        end: moment(),
        id: 985,
        start: moment(),
        title: "Catherina Blackmuir"
    };
    appointmentRequestTest.appointmentRequest.optionalTimes = JSON.parse(appointmentRequestTest.appointmentRequest.optionalTimes);
    appointmentRequestTest.appointmentRequest.clientName = "Padget Creaser";
    const historyAdd = createMemoryHistory({
        initialEntries: ['/', '/home', '/appointments', pathAdd],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });
    const historyEdit = createMemoryHistory({
        initialEntries: ['/', '/home', '/appointments', pathEdit],
        initialIndex: 3,
        keyLength: 10,
        getUserConfirmation: null
    });
    const slotInfo = {
        end: moment(),
        start: moment(),
    };
    const buildProps = (history, path, locationState) => {
        return Object.assign({}, {
            history: history,
            location: {
                pathname: path,
            },
            match: {
                isExact: true,
                path: path,
                url: path,
            },
            serviceProviderRoles: ["appointmentsHairDresser"],
            userOptions: [{
                key: '580624494',
                text: "Padget Creaser",
                value: "Padget Creaser"
            }],
        }, locationState)
    };

    const mockStore = {
        serviceProviderId: "549963652",
        userId: "549963652",
    };

    store.get.mockImplementation((key) => mockStore[key]);
    usersStorage.getUsers.mockResolvedValue(users);
    usersStorage.getUserByUserID.mockImplementation((userId) => Promise.resolve(users.filter(user => user.userId === userId)[0]));
    serviceProvidersStorage.getServiceProviderUserDetails.mockImplementation((serviceProviderId) => Promise.resolve({data: users.filter(user => user.userId === serviceProviderId)[0]}));
    serviceProvidersStorage.getServiceProviderById.mockImplementation((serviceProviderId) => Promise.resolve(serviceProviders.filter(provider =>
        provider.serviceProviderId === serviceProviderId)));
    serviceProvidersStorage.getRolesOfServiceProvider.mockResolvedValue(["appointmentsHairDresser"]);
    serviceProvidersStorage.getServiceProviderById.mockResolvedValue("[\"החלקה\", \"גוונים\", \"צבע\", \"תספורת\"]");
    appointmentsStorage.setAppointment.mockResolvedValue({});
    appointmentsStorage.getServiceProviderAppointments.mockResolvedValue({data: appointmentsOf549963652});
    appointmentsStorage.getServiceProviderAppointmentRequests.mockImplementation(() => Promise.resolve({data: JSON.parse(JSON.stringify(appointmentRequestsOf549963652))}));
    appointmentsStorage.updateAppointment.mockResolvedValue({});
    appointmentsStorage.getAppointmentByAppointmentID.mockResolvedValue({data: appointmentsOf549963652[0]});
    appointmentsStorage.cancelAppointmentById.mockResolvedValue({});

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

    test('match snapshot with slotInfo', async () => {
        const arrResponse = setupComponent('shallow', AppointmentForm, null, buildProps(null, pathAdd, {
            slotInfo: slotInfo,
            submitText: "קבע",
        }), pathAdd);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test('match snapshot with appointment', async () => {
        const arrResponse = setupComponent('shallow', AppointmentForm, null, buildProps(null, pathEdit, {
            appointment: appointmentTest,
            submitText: "עדכן"
        }), pathEdit);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test('match snapshot with appointmentRequest', async () => {
        const arrResponse = setupComponent('shallow', AppointmentForm, null, buildProps(null, pathAdd, {
            appointmentRequestEvent: appointmentRequestTest,
            submitText: "קבע",
        }), pathAdd);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance).toMatchSnapshot();
    });

    test("renders AppointmentForm for /appointments/set", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentForm, historyAdd, buildProps(historyAdd, pathAdd, {
            slotInfo: slotInfo,
            submitText: "קבע",
        }), pathAdd);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(AppointmentForm)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("renders AppointmentForm for /appointments/428/edit", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentForm, historyEdit, buildProps(historyEdit, pathEdit, {
            appointment: appointmentTest,
            submitText: "עדכן"
        }), pathEdit);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(wrapper.find(AppointmentForm)).toHaveLength(1);
        expect(wrapper.find(PageNotFound)).toHaveLength(0);
    });

    test("mounted with the right data for Add with slotInfo", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentForm, historyAdd, buildProps(historyAdd, pathAdd, {
            slotInfo: slotInfo,
            submitText: "קבע",
        }), pathAdd);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.appointment).toBeDefined();
        expect(componentInstance.state.appointment.clientName).toEqual("");
        expect(componentInstance.state.appointment.role).toEqual('');
        expect(componentInstance.state.appointment.subject).toEqual([]);
        expect(componentInstance.state.appointment.date).toEqual(moment(slotInfo.start).format('YYYY-MM-DD'));
        expect(componentInstance.state.appointment.startTime).toEqual(moment(slotInfo.start).format("HH:mm"));
        expect(componentInstance.state.appointment.endTime).toEqual(moment(slotInfo.end).format("HH:mm"));
    });

    test("mounted with the right data for Add with appointmentRequestEvent", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentForm, historyAdd, buildProps(historyAdd, pathAdd, {
            appointmentRequestEvent: appointmentRequestTest,
            submitText: "קבע",
        }), pathAdd);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.appointment).toBeDefined();
        expect(componentInstance.state.appointment.date).toEqual(moment(appointmentRequestTest.start).format("YYYY-MM-DD"));
        expect(componentInstance.state.appointment.startTime).toEqual(moment(appointmentRequestTest.start).format("HH:mm"));
        expect(componentInstance.state.appointment.endTime).toEqual(moment(appointmentRequestTest.end).format("HH:mm"));
        expect(componentInstance.state.appointment.role).toEqual(appointmentRequestTest.appointmentRequest.AppointmentDetail.role);
        expect(componentInstance.state.appointment.subject).toEqual(JSON.parse(appointmentRequestTest.appointmentRequest.AppointmentDetail.subject));
        expect(componentInstance.state.appointment.clientName).toEqual(appointmentRequestTest.appointmentRequest.clientName);
        expect(componentInstance.state.appointment.remarks).toEqual(appointmentRequestTest.appointmentRequest.notes);
    });

    test("mounted with the right data for Edit with appointment", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentForm, historyEdit, buildProps(historyEdit, pathEdit, {
            appointment: appointmentTest,
            submitText: "עדכן"
        }), pathEdit);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        expect(componentInstance.state.appointment).toBeDefined();
        expect(componentInstance.state.appointment.date).toEqual(moment(appointmentTest.startDateAndTime).format("YYYY-MM-DD"));
        expect(componentInstance.state.appointment.startTime).toEqual(moment(appointmentTest.startDateAndTime).format("HH:mm"));
        expect(componentInstance.state.appointment.endTime).toEqual(moment(appointmentTest.endDateAndTime).format("HH:mm"));
        expect(componentInstance.state.appointment.role).toEqual(appointmentTest.AppointmentDetail.role);
        expect(componentInstance.state.appointment.subject).toEqual(JSON.parse(appointmentTest.AppointmentDetail.subject));
        expect(componentInstance.state.appointment.clientName).toEqual(appointmentTest.clientName);
        expect(componentInstance.state.appointment.remarks).toEqual(appointmentTest.remarks);
    });

    test("handleSubmit with empty fields", async () => {
        const arrResponse = await setupComponent('mount', AppointmentForm, historyAdd, buildProps(historyAdd, pathAdd, {
            slotInfo: slotInfo,
            submitText: "קבע",
        }), pathAdd);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('AppointmentForm').find('Form').simulate('submit', {
            preventDefault() {
            }
        });
        expect(componentInstance.state.formError).toEqual(true);
    });

    test("handleSubmit in edit mode", async () => {
        const arrResponse = await setupComponent('mount', AppointmentForm, historyEdit, buildProps(historyEdit, pathEdit, {
            appointment: appointmentTest,
            submitText: "עדכן",
            handleSubmit: jest.fn(),
        }), pathEdit);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('AppointmentForm').find('Form').simulate('submit', {
            preventDefault() {
            }
        });
        expect(componentInstance.state.appointment).toEqual({});
    });

    test("handleChange", async () => {
        const handleChangeSpy = jest.spyOn(AppointmentForm.prototype, 'handleChange');

        const arrResponse = await setupComponent('mount', AppointmentForm, historyAdd, buildProps(historyAdd, pathAdd, {
            appointmentRequestEvent: appointmentRequestTest,
            submitText: "קבע",
        }), pathAdd);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        await wrapper.find('AppointmentForm').find('FormField').at(3).props().onChange({
            target: {
                name: 'remarks',
                value: 'this is the remarks'
            },
        });

        expect(handleChangeSpy).toHaveBeenCalled();
        expect(handleChangeSpy.mock.instances[0].state.appointment.remarks).toEqual('this is the remarks');
    });

    test("handleClear", async () => {
        const arrResponse = await setupComponent('mount', AppointmentForm, historyAdd, buildProps(historyAdd, pathAdd, {
            appointmentRequestEvent: appointmentRequestTest,
            submitText: "קבע",
        }), pathAdd);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        wrapper.find('AppointmentForm').find('FormButton').at(2).props().onClick({
            preventDefault() {
            }
        });
        expect(componentInstance.state.appointment.date).toEqual('');
    });

    test("render with what the user see for /appointments/set", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentForm, historyAdd, buildProps(historyAdd, pathAdd, {
            slotInfo: slotInfo,
            submitText: "קבע",
        }), pathAdd);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('AppointmentForm').dive();

        expect(shallowWrapper.find('Form')).toHaveLength(1);
        expect(shallowWrapper.find('FormField')).toHaveLength(6);
        expect(shallowWrapper.find('FormField').at(0).props().name).toEqual('clientName');
        expect(shallowWrapper.find('FormField').at(0).props().label).toEqual('שם לקוח');
        expect(shallowWrapper.find('FormField').at(0).props().value).toEqual('');
        expect(shallowWrapper.find('FormField').at(1).props().name).toEqual('role');
        expect(shallowWrapper.find('FormField').at(1).props().label).toEqual('ענף');
        expect(shallowWrapper.find('FormField').at(1).props().value).toEqual('');
        expect(shallowWrapper.find('FormField').at(2).props().name).toEqual('remarks');
        expect(shallowWrapper.find('FormField').at(2).props().label).toEqual('הערות');
        expect(shallowWrapper.find('FormField').at(2).props().value).toEqual('');
        expect(shallowWrapper.find('FormField').at(3).props().label).toEqual('תאריך');
        expect(shallowWrapper.find('FormField').at(3).props().value).toEqual(moment(slotInfo.start).format("YYYY-MM-DD"));
        expect(shallowWrapper.find('FormField').at(4).props().label).toEqual('שעת התחלה');
        expect(shallowWrapper.find('FormField').at(4).props().value).toEqual(moment(slotInfo.start).format("HH:mm"));
        expect(shallowWrapper.find('FormField').at(5).props().label).toEqual('שעת סיום');
        expect(shallowWrapper.find('FormField').at(5).props().value).toEqual(moment(slotInfo.end).format("HH:mm"));

        expect(shallowWrapper.find('Message')).toHaveLength(0);
        expect(shallowWrapper.find('Modal')).toHaveLength(0);

        expect(shallowWrapper.find('FormButton')).toHaveLength(3);
        expect(shallowWrapper.find('FormButton').at(0).props().children).toEqual("קבע");
        expect(shallowWrapper.find('FormButton').at(0).props().positive).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(0).props().type).toEqual("submit");
        expect(shallowWrapper.find('FormButton').at(1).props().children).toEqual("בטל");
        expect(shallowWrapper.find('FormButton').at(1).props().negative).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(2).props().children).toEqual("נקה הכל");
    });

    test("render with what the user see for /appointments/set with request", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentForm, historyAdd, buildProps(historyAdd, pathAdd, {
            appointmentRequestEvent: appointmentRequestTest,
            submitText: "קבע",
        }), pathAdd);

        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('AppointmentForm').dive();

        expect(shallowWrapper.find('Form')).toHaveLength(1);
        expect(shallowWrapper.find('FormField')).toHaveLength(7);
        expect(shallowWrapper.find('FormField').at(0).props().name).toEqual('clientName');
        expect(shallowWrapper.find('FormField').at(0).props().label).toEqual('שם לקוח');
        expect(shallowWrapper.find('FormField').at(0).props().value).toEqual(appointmentRequestTest.appointmentRequest.clientName);
        expect(shallowWrapper.find('FormField').at(1).props().name).toEqual('role');
        expect(shallowWrapper.find('FormField').at(1).props().label).toEqual('ענף');
        expect(shallowWrapper.find('FormField').at(1).props().value).toEqual(appointmentRequestTest.appointmentRequest.AppointmentDetail.role);
        expect(shallowWrapper.find('FormField').at(2).props().name).toEqual('subject');
        expect(shallowWrapper.find('FormField').at(2).props().label).toEqual('נושא');
        expect(shallowWrapper.find('FormField').at(2).props().value).toEqual(JSON.parse(appointmentRequestTest.appointmentRequest.AppointmentDetail.subject));
        expect(shallowWrapper.find('FormField').at(3).props().name).toEqual('remarks');
        expect(shallowWrapper.find('FormField').at(3).props().label).toEqual('הערות');
        expect(shallowWrapper.find('FormField').at(3).props().value).toEqual(appointmentRequestTest.appointmentRequest.notes);
        expect(shallowWrapper.find('FormField').at(4).props().label).toEqual('תאריך');
        expect(shallowWrapper.find('FormField').at(4).props().value).toEqual(moment(appointmentRequestTest.start).format("YYYY-MM-DD"));
        expect(shallowWrapper.find('FormField').at(5).props().label).toEqual('שעת התחלה');
        expect(shallowWrapper.find('FormField').at(5).props().value).toEqual(moment(appointmentRequestTest.start).format("HH:mm"));
        expect(shallowWrapper.find('FormField').at(6).props().label).toEqual('שעת סיום');
        expect(shallowWrapper.find('FormField').at(6).props().value).toEqual(moment(appointmentRequestTest.end).format("HH:mm"));

        expect(shallowWrapper.find('Message')).toHaveLength(2);
        expect(shallowWrapper.find('Modal')).toHaveLength(1);

        expect(shallowWrapper.find('FormButton')).toHaveLength(3);
        expect(shallowWrapper.find('FormButton').at(0).props().children).toEqual("קבע");
        expect(shallowWrapper.find('FormButton').at(0).props().positive).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(0).props().type).toEqual("submit");
        expect(shallowWrapper.find('FormButton').at(1).props().children).toEqual("בטל");
        expect(shallowWrapper.find('FormButton').at(1).props().negative).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(2).props().children).toEqual("נקה הכל");
    });

    test("render with what the user see for /appointments/428/edit", async () => {
        const arrResponse = await setupComponent('shallow', AppointmentForm, historyEdit, buildProps(historyEdit, pathEdit, {
            appointment: appointmentTest,
            submitText: "עדכן"
        }), pathEdit);
        wrapper = arrResponse[0];
        componentInstance = arrResponse[1];

        const shallowWrapper = wrapper.find('AppointmentForm').dive();

        expect(shallowWrapper.find('Form')).toHaveLength(1);
        expect(shallowWrapper.find('FormField')).toHaveLength(7);
        expect(shallowWrapper.find('FormField').at(0).props().name).toEqual('clientName');
        expect(shallowWrapper.find('FormField').at(0).props().label).toEqual('שם לקוח');
        expect(shallowWrapper.find('FormField').at(0).props().value).toEqual(appointmentTest.clientName);
        expect(shallowWrapper.find('FormField').at(1).props().name).toEqual('role');
        expect(shallowWrapper.find('FormField').at(1).props().label).toEqual('ענף');
        expect(shallowWrapper.find('FormField').at(1).props().value).toEqual(appointmentTest.AppointmentDetail.role);
        expect(shallowWrapper.find('FormField').at(2).props().name).toEqual('subject');
        expect(shallowWrapper.find('FormField').at(2).props().label).toEqual('נושא');
        expect(shallowWrapper.find('FormField').at(2).props().value).toEqual(JSON.parse(appointmentTest.AppointmentDetail.subject));
        expect(shallowWrapper.find('FormField').at(3).props().name).toEqual('remarks');
        expect(shallowWrapper.find('FormField').at(3).props().label).toEqual('הערות');
        expect(shallowWrapper.find('FormField').at(3).props().value).toEqual(appointmentTest.remarks);
        expect(shallowWrapper.find('FormField').at(4).props().label).toEqual('תאריך');
        expect(shallowWrapper.find('FormField').at(4).props().value).toEqual(moment(appointmentTest.startDateAndTime).format("YYYY-MM-DD"));
        expect(shallowWrapper.find('FormField').at(5).props().label).toEqual('שעת התחלה');
        expect(shallowWrapper.find('FormField').at(5).props().value).toEqual(moment(appointmentTest.startDateAndTime).format("HH:mm"));
        expect(shallowWrapper.find('FormField').at(6).props().label).toEqual('שעת סיום');
        expect(shallowWrapper.find('FormField').at(6).props().value).toEqual(moment(appointmentTest.endDateAndTime).format("HH:mm"));

        expect(shallowWrapper.find('Message')).toHaveLength(0);
        expect(shallowWrapper.find('Modal')).toHaveLength(0);

        expect(shallowWrapper.find('FormButton')).toHaveLength(3);
        expect(shallowWrapper.find('FormButton').at(0).props().children).toEqual("עדכן");
        expect(shallowWrapper.find('FormButton').at(0).props().positive).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(0).props().type).toEqual("submit");
        expect(shallowWrapper.find('FormButton').at(1).props().children).toEqual("בטל");
        expect(shallowWrapper.find('FormButton').at(1).props().negative).toBeTruthy();
        expect(shallowWrapper.find('FormButton').at(2).props().children).toEqual("נקה הכל");
    });
});
