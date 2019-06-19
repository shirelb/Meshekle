import React from 'react';

import {Modal,TouchableOpacity,TextInput} from "react-native";
import { Text,FormLabel,Avatar} from "react-native-elements";
import {shallow} from "enzyme/build";
import DateTimePicker from 'react-native-modal-datetime-picker';
import Button from "../../../components/submitButton/Button";

import usersStorage from "../../../storage/usersStorage";
import phoneStorage from "react-native-simple-store";
import users from "../../jsons/users";
import UserProfileForm from "../../../components/userProfile/UserProfileForm";


jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/usersStorage");
jest.mock("react-native-simple-store");


describe("UserProfileForm should", () => {
    let wrapper = null;
    let componentInstance = null;
    const userTest = users[users.length-1];

    const props = {
        modalVisible: true,
        user: userTest,
        loadUser: jest.fn(),
    };
    const mockStore = {
        userData: {
            serviceProviderId: "549963652",
            userId: "549963652",
            token: "some token"
        }
    };

    phoneStorage.get = jest.fn().mockImplementation((key) => Promise.resolve(mockStore[key]));
    phoneStorage.update = jest.fn().mockImplementation((key, value) => Promise.resolve(mockStore[key] = value));

    usersStorage.updateUserById = jest.fn().mockResolvedValue({status:200});


    beforeEach(() => {
        jest.clearAllMocks();
    });

    // it('match snapshot', async () => {
    //     wrapper = shallow(<AppointmentRequestInfo {...props} />);
    //     expect(wrapper).toMatchSnapshot();
    // });

    it("render what the user see", async () => {
        wrapper = await shallow(<UserProfileForm {...props} />);
        componentInstance = wrapper.instance();

        await wrapper.update();

        expect(wrapper.find(Modal)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(2);
        expect(wrapper.find(TouchableOpacity)).toHaveLength(1);
        expect(wrapper.find(FormLabel)).toHaveLength(9);
        expect(wrapper.find(Avatar)).toHaveLength(1);
        expect(wrapper.find(TextInput)).toHaveLength(8);
        expect(wrapper.find(DateTimePicker)).toHaveLength(1);
        expect(wrapper.find(Button)).toHaveLength(2);

        expect(wrapper.find(Text).at(0).props().children).toEqual("עריכת פרופיל");
        expect(wrapper.find(Text).at(1).props().children).toEqual("בעת עדכון סיסמא עלייך למלא את שלושת השדות הבאים:");

        expect(wrapper.find("FormLabel").at(0).props().children).toEqual("תמונה");
        expect(wrapper.find("FormLabel").at(1).props().children).toEqual("סיסמא ישנה");
        expect(wrapper.find("FormLabel").at(2).props().children).toEqual("סיסמא חדשה");
        expect(wrapper.find("FormLabel").at(3).props().children).toEqual(" סיסמא חדשה שוב");
        expect(wrapper.find("FormLabel").at(4).props().children).toEqual("אימייל");
        expect(wrapper.find("FormLabel").at(5).props().children).toEqual(" תיבת דואר");
        expect(wrapper.find("FormLabel").at(6).props().children).toEqual("פלאפון");
        expect(wrapper.find("FormLabel").at(7).props().children).toEqual(" טלפון");
        expect(wrapper.find("FormLabel").at(8).props().children).toEqual(" תאריך לידה");

        expect(wrapper.find("TextInput").at(0).props().value).toEqual("");
        expect(wrapper.find("TextInput").at(1).props().value).toEqual("");
        expect(wrapper.find("TextInput").at(2).props().value).toEqual("");
        expect(wrapper.find("TextInput").at(3).props().value).toEqual("clerr@bloglines.com");
        expect(wrapper.find("TextInput").at(4).props().value).toEqual("1000");
        expect(wrapper.find("TextInput").at(5).props().value).toEqual("0547841372");
        expect(wrapper.find("TextInput").at(6).props().value).toEqual("041783531");
        expect(wrapper.find("TextInput").at(7).props().value).toEqual("23/05/1967");
        expect(wrapper.find("Button").at(0).props().label).toEqual('שלח');
        expect(wrapper.find("Button").at(1).props().label).toEqual('חזור');


    });

    it("mounted with the right data", async () => {
        wrapper = shallow(<UserProfileForm {...props} />);
        componentInstance = wrapper.instance();
        expect(componentInstance.state.modalVisible).toEqual(true);
        expect(componentInstance.state.user).toEqual(userTest);
    });

    it("handle click on back button", async () => {
        wrapper = shallow(<UserProfileForm {...props} />);
        componentInstance = wrapper.instance();

        expect(componentInstance.state.modalVisible).toEqual(true);
        await wrapper.find('Button').at(0).props().onPress();
        expect(componentInstance.state.modalVisible).toEqual(false);
    });

    it("handle click on send button", async () => {
        wrapper = shallow(<UserProfileForm {...props} />);
        componentInstance = wrapper.instance();

        expect(componentInstance.state.modalVisible).toEqual(true);
        wrapper.find('Button').at(1).props().onPress();
        expect(componentInstance.state.modalVisible).toEqual(false);
    });


});