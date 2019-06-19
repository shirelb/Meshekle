import React from 'react';

import {Modal} from "react-native";
import {List} from "react-native-paper";
import {shallow} from "enzyme/build";
import AppointmentsDayInfo from "../../../components/appointments/AppointmentsDayInfo";
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


describe("AppointmentsDayInfo should", () => {
    let wrapper = null;
    let componentInstance = null;

    const props = {
        dateModalVisible: true,
        selectedDate: "2019-07-02",
        markedDates: {
            "2019-05-05": {
                "marked": true,
                "selected": false,
                "appointments": [
                    {
                        "appointmentId": 57,
                        "startDateAndTime": "2019-05-04T22:33:13.000Z",
                        "endDateAndTime": "2019-05-05T01:26:35.000Z",
                        "remarks": "a odio in hac habitasse platea",
                        "status": "set",
                        "createdAt": "2019-06-03T20:41:32.581Z",
                        "updatedAt": "2019-06-03T20:41:32.581Z",
                        "AppointmentDetail": {
                            "appointmentId": 57,
                            "clientId": "052957237",
                            "serviceProviderId": 468254910,
                            "role": "appointmentsDentist",
                            "subject": "[\"שיננית\", \"טיפול שורש\", \"עקירה\", \"יישור שיניים\"]",
                            "createdAt": "2019-06-03T20:41:32.543Z",
                            "updatedAt": "2019-06-03T20:41:32.543Z",
                            "userId": null
                        }
                    }
                ]
            },
            "2019-07-02": {
                "marked": true,
                "selected": true,
                "appointments": [
                    {
                        "appointmentId": 223,
                        "startDateAndTime": "2019-07-02T16:03:23.000Z",
                        "endDateAndTime": "2019-07-02T01:34:14.000Z",
                        "remarks": "sapien quis libero nullam sit amet turpis elementum",
                        "status": "set",
                        "createdAt": "2019-06-03T20:41:32.581Z",
                        "updatedAt": "2019-06-03T20:41:32.581Z",
                        "AppointmentDetail": {
                            "appointmentId": 223,
                            "clientId": "052957237",
                            "serviceProviderId": 229971094,
                            "role": "appointmentsDentist",
                            "subject": "[\"יישור שיניים\", \"ניקוי\", \"עקירה\", \"טיפול שורש\"]",
                            "createdAt": "2019-06-03T20:41:32.543Z",
                            "updatedAt": "2019-06-03T20:41:32.543Z",
                            "userId": null
                        },
                        "serviceProviderFullname": "Ronda Cail"
                    }
                ],
                "color": "blue"
            }
        },
        expanded: false,
        loadAppointments: jest.fn(),
        afterCloseModalShowSelectDay: jest.fn(),
        onAppointmentRequestPress: jest.fn(),
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
    appointmentsStorage.cancelAppointmentById = jest.fn().mockImplementation(() => Promise.resolve());

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('match snapshot', async () => {
        wrapper = shallow(<AppointmentsDayInfo {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("render what the user see", async () => {
        wrapper = await shallow(<AppointmentsDayInfo {...props} />);
        componentInstance = wrapper.instance();

        await wrapper.update();

        expect(wrapper.find(Modal)).toHaveLength(1);
        expect(wrapper.find(List.Section)).toHaveLength(1);
        expect(wrapper.find(List.Accordion)).toHaveLength(1);
        expect(wrapper.find(List.Item)).toHaveLength(1);
        expect(wrapper.find('Button')).toHaveLength(2);
        expect(wrapper.find('Button').at(0).props().label).toEqual('חזור');
        expect(wrapper.find('Button').at(1).props().label).toEqual('בקש תור חדש');
    });

    it("mounted with the right data", async () => {
        expect(componentInstance.state.dateModalVisible).toEqual(true);
        expect(componentInstance.state.selectedDate).toEqual("2019-07-02");
    });

    it("handle cancelAppointment", async () => {
        wrapper = shallow(<AppointmentsDayInfo {...props} />);
        componentInstance = wrapper.instance();

        await componentInstance.cancelAppointment();
        expect(appointmentsStorage.cancelAppointmentById).toHaveBeenCalled();
    });

});