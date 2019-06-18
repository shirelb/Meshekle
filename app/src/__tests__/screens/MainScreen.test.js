import React from 'react';

import {shallow} from "enzyme/build";

import MainScreen from "../../screens/mainScreen/MainScreen";
import phoneStorage from "react-native-simple-store";

import {connectToServerSocket} from "../../shared/constants";

jest.mock("../../storage/serviceProvidersStorage");
jest.mock("../../storage/usersStorage");
jest.mock("../../storage/announcementsStorage");
jest.mock("react-native-simple-store");


describe("MainScreen should", () => {
    let wrapper = null;
    let componentInstance = null;

    const userIdTest = "972350803";
    const userFullnameTest = "Dion Revance";

    const mockStore = {
        userData: {
            token: "some token",
            userId: userIdTest,
            userFullname: userFullnameTest,
        }
    };

    connectToServerSocket = jest.fn().mockResolvedValue();


    phoneStorage.get = jest.fn().mockImplementation((key) => Promise.resolve(mockStore[key]));
    phoneStorage.update = jest.fn().mockImplementation((key, value) => Promise.resolve(mockStore[key] = value));

    beforeEach(async() => {
        jest.clearAllMocks();
        wrapper = await shallow(<MainScreen/>);
        componentInstance = wrapper.instance();
        await wrapper.update();
    });


    // it('match snapshot', async () => {
    //     wrapper = shallow(<AnnouncementsScreen/>);
    //     expect(wrapper).toMatchSnapshot();
    // });

    it("mounted with the right data", async() => {

        expect(componentInstance.state.userId).toEqual(userIdTest);
        expect(componentInstance.state.userFullname).toEqual(userFullnameTest);

    });


    it("render what the user see", async () => {
        wrapper = shallow(<AnnouncementsScreen/>);
        componentInstance = wrapper.instance();

        expect(wrapper.find('Text')).toHaveLength(3);
        expect(wrapper.find('Icon').at(0).props().name).toEqual('ברוכים הבאים ');
        expect(wrapper.find('Icon').at(1).props().name).toEqual('userFullnameTest');
        expect(wrapper.find('Icon').at(2).props().name).toEqual('האירועים שלי');
        expect(wrapper.find('AgendaCalendar')).toHaveLength(1);
    });

});