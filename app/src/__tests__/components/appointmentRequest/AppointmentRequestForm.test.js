import React from 'react';

import {Modal} from "react-native";
import {CheckBox, FormInput, FormLabel, FormValidationMessage, Text} from "react-native-elements";
import {List} from "react-native-paper";
import {shallow} from "enzyme/build";
import AppointmentRequestForm from "../../../components/appointmentRequest/AppointmentRequestForm";
import usersStorage from "../../../storage/usersStorage";
import phoneStorage from "react-native-simple-store";
import users from "../../jsons/users";
import serviceProvidersStorage from "../../../storage/serviceProvidersStorage";
import serviceProviders from "../../jsons/serviceProviders";
import appointmentsStorage from "../../../storage/appointmentsStorage";
import user013637605AppointmentRequests from "../../jsons/user013637605AppointmentRequests";

jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/usersStorage");
jest.mock("react-native-simple-store");


describe("AppointmentRequestForm should", () => {
    let wrapper = null;
    let componentInstance = null;
    const serviceProviderTest = serviceProviders[0];
    const props = {
        modalVisible: true,
        serviceProvider: serviceProviderTest,
        closeAppointmentRequestForm: jest.fn(),
    };
    const mockStore = {
        userData: {
            serviceProviderId: "549963652",
            userId: "549963652",
            token: "some token"
        }
    };
    const navigation = {navigate: jest.fn(), dispatch: jest.fn()};

    phoneStorage.get = jest.fn().mockImplementation((key) => Promise.resolve(mockStore[key]));
    phoneStorage.update = jest.fn().mockImplementation((key, value) => Promise.resolve(mockStore[key] = value));
    usersStorage.getUsers = jest.fn().mockImplementation(() => Promise.resolve(users));
    usersStorage.getUserByUserID = jest.fn().mockImplementation((userId) => Promise.resolve(users.filter(user => user.userId === userId)[0]));
    serviceProvidersStorage.getServiceProviders = jest.fn().mockResolvedValue(serviceProviders);
    serviceProvidersStorage.getServiceProviderUserDetails = jest.fn().mockImplementation((serviceProviderId) => Promise.resolve({data: users.filter(user => user.userId === serviceProviderId)[0]}));
    serviceProvidersStorage.getServiceProviderById = jest.fn().mockImplementation((serviceProviderId) => Promise.resolve(serviceProviders.filter(provider =>
        provider.serviceProviderId === serviceProviderId)));
    appointmentsStorage.getUserAppointmentRequests = jest.fn().mockImplementation(() => Promise.resolve(user013637605AppointmentRequests));
    appointmentsStorage.postUserAppointmentRequest = jest.fn().mockImplementation(() => Promise.resolve());

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // xit('match snapshot', async () => {
    //     wrapper = shallow(<AppointmentRequestForm {...props} />);
    //     expect(wrapper).toMatchSnapshot();
    // });

    it("render what the user see", async () => {
        wrapper = await shallow(<AppointmentRequestForm {...props} />);
        componentInstance = wrapper.instance();

        await wrapper.update();

        expect(wrapper.find(Modal)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(7);
        expect(wrapper.find(Text).at(0).props().children).toEqual('בקשת תור');
        expect(wrapper.find(Text).at(1).props().children).toEqual(serviceProviderTest.fullname);
        expect(wrapper.find(Text).at(2).props().children).toEqual(serviceProviderTest.role);
        expect(wrapper.find('FormLabel')).toHaveLength(6);
        expect(wrapper.find('FormLabel').at(0).props().children).toEqual('*נותן שירות');
        expect(wrapper.find('FormLabel').at(1).props().children).toEqual(" *ענף");
        expect(wrapper.find('FormLabel').at(2).props().children).toEqual(' *שעות פעילות');
        expect(wrapper.find('FormLabel').at(3).props().children).toEqual(' *תאריכים ושעות אופציונאליים');
        expect(wrapper.find('FormLabel').at(4).props().children).toEqual("*נושא");
        expect(wrapper.find('FormLabel').at(5).props().children).toEqual('הערות');
        expect(wrapper.find(List.Section)).toHaveLength(1);
        expect(wrapper.find(List.Accordion)).toHaveLength(0);
        expect(wrapper.find(List.Item)).toHaveLength(0);
        expect(wrapper.find('CheckBox')).toHaveLength(1);
        expect(wrapper.find('CheckBox').props().title).toEqual('הוסף תאריך ושעות');
        expect(wrapper.find('SelectMultipleGroupButton')).toHaveLength(1);
        expect(wrapper.find('FormInput')).toHaveLength(1);
        expect(wrapper.find('FormValidationMessage')).toHaveLength(0);
        expect(wrapper.find('Button')).toHaveLength(2);
        expect(wrapper.find('Button').at(0).props().label).toEqual('שלח');
        expect(wrapper.find('Button').at(1).props().label).toEqual('חזור');
    });

    it("mounted with the right data", async () => {
        expect(componentInstance.state.modalVisible).toEqual(true);
        expect(componentInstance.state.subjectSelected).toEqual([]);
        expect(componentInstance.state.subjectText).toEqual('');
        expect(componentInstance.state.displaySubjectList).toEqual(false);
        expect(componentInstance.state.notes).toEqual('');
        expect(componentInstance.state.isDateTimePickerVisible).toEqual(false);
        expect(componentInstance.state.isStartDateTimePickerVisible).toEqual(false);
        expect(componentInstance.state.isEndDateTimePickerVisible).toEqual(false);
        expect(componentInstance.state.startTimeClicked).toEqual('');
        expect(componentInstance.state.endTimeClicked).toEqual('');
        expect(componentInstance.state.errorMsg).toEqual('');
        expect(componentInstance.state.errorVisible).toEqual(false);
    });

    it("handle setModalVisible", async () => {
        wrapper = shallow(<AppointmentRequestForm {...props} />);
        componentInstance = wrapper.instance();

        expect(componentInstance.state.modalVisible).toEqual(true);

        await componentInstance.setModalVisible(false);
        expect(componentInstance.state.modalVisible).toEqual(false);
    });

    it("handle groupButtonOnSelectedValuesChange", async () => {
        wrapper = shallow(<AppointmentRequestForm {...props} />);
        componentInstance = wrapper.instance();

        await componentInstance.groupButtonOnSelectedValuesChange(["פן"]);
        expect(componentInstance.state.subjectSelected).toEqual(["פן"]);
        expect(componentInstance.state.errorVisible).toEqual(false);
    });

    it("delete Hours Selected", async () => {
        wrapper = shallow(<AppointmentRequestForm {...props} />);
        componentInstance = wrapper.instance();

        await componentInstance.setState({
            datesAndHoursSelected: [{
                'date': "2019-04-03",
                'hours': [{startHour: "14:44", endHour: "18:33"}, {startHour: "12:33", endHour: "14:44"}],
                'expanded': false,
            }],
        });

        await componentInstance.deleteHoursSelected({},0,0);
        expect(componentInstance.state.datesAndHoursSelected.length).toEqual(1);
        expect(componentInstance.state.datesAndHoursSelected[0].hours.length).toEqual(1);
    });

    it("not send Appointment Request with empty subjects", async () => {
        wrapper = shallow(<AppointmentRequestForm {...props} />);
        componentInstance = wrapper.instance();

        await componentInstance.setState({
            datesAndHoursSelected: [{
                'date': "2019-04-03",
                'hours': [{startHour: "14:44", endHour: "18:33"}, {startHour: "12:33", endHour: "14:44"}],
                'expanded': false,
            }],
            subjectSelected:[]
        });

        await wrapper.find('Button').at(0).props().onPress();
        expect(componentInstance.state.errorMsg).toEqual('ישנו מידע חסר, השלם שדות חובה (שדות עם *)');
        expect(componentInstance.state.errorVisible).toEqual(true);
    });

    it("not send Appointment Request", async () => {
        wrapper = shallow(<AppointmentRequestForm {...props} />);
        componentInstance = wrapper.instance();

        await componentInstance.setState({
            datesAndHoursSelected: [{
                'date': "2019-04-03",
                'hours': [{startHour: "14:44", endHour: "18:33"}, {startHour: "12:33", endHour: "14:44"}],
                'expanded': false,
            }],
            subjectSelected:["פן"]
        });

        await wrapper.find('Button').at(0).props().onPress();
        expect(appointmentsStorage.postUserAppointmentRequest).toHaveBeenCalledTimes(1);
    });

});
