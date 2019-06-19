import React from 'react';

import {shallow} from "enzyme/build";
import DrawerMenu from "../../screens/drawerMenu/DrawerMenu";
import {DrawerActions, NavigationActions} from 'react-navigation';
import strings from "../../shared/strings";
import usersStorage from "../../storage/usersStorage";
import phoneStorage from "react-native-simple-store";
import users from "../jsons/users";

jest.mock("../../storage/serviceProvidersStorage");
jest.mock("../../storage/usersStorage");
jest.mock("react-native-simple-store");
jest.mock("react-navigation");


describe("DrawerMenu should", () => {
    let wrapper = null;
    let componentInstance = null;
    const props = {};
    const userTest = users[2];
    const userIdTest = "972350803";
    const userFullnameTest = "Dion Revance";
    const mockStore = {
        userData: {
            serviceProviderId: "549963652",
            userId: "549963652",
            token: "some token"
        }
    };
    const navigation = {navigate: jest.fn(), dispatch: jest.fn()};

    usersStorage.getUsers = jest.fn().mockResolvedValue(users);
    phoneStorage.get = jest.fn().mockImplementation((key) => Promise.resolve(mockStore[key]));
    phoneStorage.update = jest.fn().mockImplementation((key, value) => Promise.resolve(mockStore[key] = value));

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('match snapshot', async () => {
        wrapper = shallow(<DrawerMenu navigation={navigation}/>);
        expect(wrapper).toMatchSnapshot();
    });

    it("render what the user see", async () => {
        wrapper = await shallow(<DrawerMenu navigation={navigation}/>);
        componentInstance = wrapper.instance();

        await wrapper.update();

        expect(wrapper.find('List')).toHaveLength(1);
        expect(wrapper.find('ListItem')).toHaveLength(8);
        expect(wrapper.find('ListItem').at(1).props().title).toEqual(strings.drawerMenu.MAIN_SCREEN_NAME);
        expect(wrapper.find('ListItem').at(2).props().title).toEqual(strings.drawerMenu.APPOINTMENTS_SCREEN_NAME);
        expect(wrapper.find('ListItem').at(3).props().title).toEqual(strings.drawerMenu.CHORES_SCREEN_NAME);
        expect(wrapper.find('ListItem').at(4).props().title).toEqual(strings.drawerMenu.PhoneBook_SCREEN_NAME);
        expect(wrapper.find('ListItem').at(5).props().title).toEqual(strings.drawerMenu.ANNOUNCEMENTS_SCREEN_NAME);
        expect(wrapper.find('ListItem').at(6).props().title).toEqual(strings.drawerMenu.REPORT);
        expect(wrapper.find('ListItem').at(7).props().title).toEqual(strings.drawerMenu.LOGOUT);
        expect(wrapper.find('UserProfileInfo')).toHaveLength(0);
        expect(wrapper.find('UserProfileForm')).toHaveLength(0);

        expect(componentInstance.state.formModal).toEqual(false);
        expect(componentInstance.state.infoModal).toEqual(false);
        expect(componentInstance.state.userLoggedin).toEqual({});
    });

    it("handle setFormModalVisible", async () => {
        wrapper = shallow(<DrawerMenu navigation={navigation}/>);
        componentInstance = wrapper.instance();

        expect(componentInstance.state.formModal).toEqual(false);
        expect(componentInstance.state.infoModal).toEqual(false);

        await componentInstance.setFormModalVisible();
        expect(componentInstance.state.formModal).toEqual(true);
        expect(componentInstance.state.infoModal).toEqual(false);
    });

    it("handle onLogoutPress", async () => {
        wrapper = shallow(<DrawerMenu navigation={navigation}/>);
        componentInstance = wrapper.instance();

        await componentInstance.onLogoutPress();
        expect(componentInstance.props.navigation.navigate).toHaveBeenCalled();
    });

    xit("navigate To Screen", async () => {
        NavigationActions.navigate = jest.fn();
        DrawerActions.closeDrawer.jest.fn();

        wrapper = shallow(<DrawerMenu navigation={navigation}/>);
        componentInstance = wrapper.instance();

        // await componentInstance.navigateToScreen('AppointmentsScreen');
        await wrapper.find('ListItem').at(2).props().onPress('AppointmentsScreen');
        expect(NavigationActions.navigate).toHaveBeenCalledTimes(1);
        expect(componentInstance.props.navigation.dispatch).toHaveBeenCalledTimes(2);
    });

});
