import React from 'react';

import {Modal,TouchableOpacity,TextInput} from "react-native";
import { Icon, Text} from "react-native-elements";
import {shallow} from "enzyme/build";
import UserProfileInfo from "../../../components/userProfile/UserProfileInfo";
import phoneStorage from "react-native-simple-store";
import users from "../../jsons/users";


jest.mock("../../../storage/serviceProvidersStorage");
jest.mock("../../../storage/usersStorage");
jest.mock("react-native-simple-store");


describe("UserProfileInfo should", () => {
    let wrapper = null;
    let componentInstance = null;
    const userTest = users[users.length-1];

    const props = {
        modalVisible: true,
        user: userTest,
        openedFrom: 'DrawerMenu',
        setFormModalVisible: jest.fn(),
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

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // it('match snapshot', async () => {
    //     wrapper = shallow(<AppointmentRequestInfo {...props} />);
    //     expect(wrapper).toMatchSnapshot();
    // });

    it("render what the user see", async () => {
        wrapper = await shallow(<UserProfileInfo {...props} />);
        componentInstance = wrapper.instance();

        await wrapper.update();

        expect(wrapper.find(Modal)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(6);
        expect(wrapper.find(TouchableOpacity)).toHaveLength(5);
        expect(wrapper.find(TextInput)).toHaveLength(1);
        expect(wrapper.find(Icon)).toHaveLength(8);

        expect(wrapper.find(Text).at(0).props().children).toEqual(userTest.fullname);
        expect(wrapper.find(Text).at(1).props().children).toEqual(userTest.cellphone);
        expect(wrapper.find(Text).at(2).props().children).toEqual(userTest.phone);
        expect(wrapper.find(Text).at(3).props().children).toEqual(userTest.email);
        expect(wrapper.find(Text).at(4).props().children).toEqual(userTest.mailbox);
        expect(wrapper.find(Text).at(5).props().children).toEqual("23/05");

        expect(wrapper.find(Icon).at(0).props().name).toEqual("arrow-forward");
        expect(wrapper.find(Icon).at(1).props().name).toEqual("edit");
        expect(wrapper.find(Icon).at(2).props().name).toEqual("lock");
        expect(wrapper.find(Icon).at(3).props().name).toEqual("phone-android");
        expect(wrapper.find(Icon).at(4).props().name).toEqual("phone");
        expect(wrapper.find(Icon).at(5).props().name).toEqual("mail-outline");
        expect(wrapper.find(Icon).at(6).props().name).toEqual("envelope-square");
        expect(wrapper.find(Icon).at(7).props().name).toEqual("cake");

    });

    it("mounted with the right data", async () => {
        wrapper = shallow(<UserProfileInfo {...props} />);
        componentInstance = wrapper.instance();
        expect(componentInstance.state.modalVisible).toEqual(true);
        expect(componentInstance.state.user).toEqual(userTest);
        expect(componentInstance.state.roles).toEqual([]);
        expect(componentInstance.state.openedFrom).toEqual('DrawerMenu');
    });

    it("handle click on back arrow", async () => {
        wrapper = shallow(<UserProfileInfo {...props} />);
        componentInstance = wrapper.instance();

        expect(componentInstance.state.modalVisible).toEqual(true);
        wrapper.find('TouchableOpacity').at(0).props().onPress();
        expect(componentInstance.state.modalVisible).toEqual(false);
        expect(componentInstance.state.user).toEqual({});
    });
    it("handle click on edit icon", async () => {
        wrapper = shallow(<UserProfileInfo {...props} />);
        componentInstance = wrapper.instance();

        expect(componentInstance.state.modalVisible).toEqual(true);
        wrapper.find('TouchableOpacity').at(1).props().onPress();
        expect(componentInstance.state.modalVisible).toEqual(false);
        expect(componentInstance.state.user).toEqual({});
    });


});