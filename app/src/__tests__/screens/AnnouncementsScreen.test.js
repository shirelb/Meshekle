import React from 'react';

import {shallow} from "enzyme/build";

import AnnouncementsScreen from "../../screens/announcementsScreen/AnnouncementsScreen";
import usersStorage from "../../storage/usersStorage";
import phoneStorage from "react-native-simple-store";
import users from "../jsons/users";
import announcements from "../jsons/announcements";
import categories from "../jsons/categories";
import announcementsStorage from "../../storage/announcementsStorage";

jest.mock("../../storage/serviceProvidersStorage");
jest.mock("../../storage/usersStorage");
jest.mock("../../storage/announcementsStorage");
jest.mock("react-native-simple-store");


describe("Announcements screen should", () => {
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

    const navigation = {navigate: jest.fn()};
    announcementsStorage.getOnAirAnnouncements = jest.fn().mockResolvedValue({data:announcements.filter(ann => ann.status==='On air')});
    usersStorage.getUsers = jest.fn().mockResolvedValue({data:users});
    announcementsStorage.getUniqueCategories = jest.fn().mockResolvedValue({data:categories});
    announcementsStorage.getCategories = jest.fn().mockResolvedValue({data:categories});



    phoneStorage.get = jest.fn().mockImplementation((key) => Promise.resolve(mockStore[key]));
    phoneStorage.update = jest.fn().mockImplementation((key, value) => Promise.resolve(mockStore[key] = value));

    beforeEach(async() => {
        jest.clearAllMocks();
        wrapper = await shallow(<AnnouncementsScreen/>);
        componentInstance = wrapper.instance();
        await wrapper.update();
        componentInstance.setState({announcements:announcements,filteredAnnouncements:announcements,
            categories:categories,allCategories:categories,users:users,categoriesDisplay:categories,settingsModal:false});
    });


    // it('match snapshot', async () => {
    //     wrapper = shallow(<AnnouncementsScreen/>);
    //     expect(wrapper).toMatchSnapshot();
    // });

    it("mounted with the right data", async() => {

        expect(componentInstance.state.announcements.length).toEqual(3);
        expect(componentInstance.state.filteredAnnouncements.length).toEqual(3);
        expect(componentInstance.state.categories.length).toEqual(2);
        expect(componentInstance.state.allCategories.length).toEqual(2);
        expect(componentInstance.state.categoriesDisplay.length).toEqual(3);
        expect(componentInstance.state.settingsModal).toEqual(false);
    });


    it("render what the user see", async () => {
        wrapper = shallow(<AnnouncementsScreen/>);
        componentInstance = wrapper.instance();

        expect(wrapper.find('Icon')).toHaveLength(3);
        expect(wrapper.find('Icon').at(0).props().name).toEqual('settings');
        expect(wrapper.find('Icon').at(1).props().name).toEqual('add-circle');
        expect(wrapper.find('Icon').at(2).props().name).toEqual('history');
        expect(wrapper.find('Accordion')).toHaveLength(1);
    });

    it("handle on Announcements setting Press", async () => {
        wrapper = shallow(<AnnouncementsScreen navigation={navigation}/>);
        componentInstance = wrapper.instance();

        await wrapper.find('Icon').at(0).props().onPress();
        expect(componentInstance.props.navigation.navigate).toHaveBeenCalled();
    });

    it("handle on My Announcements Request Press", async () => {
        wrapper = shallow(<AnnouncementsScreen navigation={navigation}/>);
        componentInstance = wrapper.instance();

        await wrapper.find('Icon').at(1).props().onPress();
        expect(componentInstance.props.navigation.navigate).toHaveBeenCalled();
    });

    it("handle on My Announcements Requests history Press", async () => {
        wrapper = shallow(<AnnouncementsScreen navigation={navigation}/>);
        componentInstance = wrapper.instance();

        await wrapper.find('Icon').at(2).props().onPress();
        expect(componentInstance.props.navigation.navigate).toHaveBeenCalled();
    });
});