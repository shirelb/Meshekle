import React from 'react';
import Button from "../../components/submitButton/Button";

import {shallow} from "enzyme/build";

import UserAnnouncementsRequests from "../../screens/userAnnouncementsRequests/UserAnnouncementsRequests";
import phoneStorage from "react-native-simple-store";
import categories from "../jsons/categories";
import announcements from "../jsons/announcements";
import announcementsStorage from "../../storage/announcementsStorage";

jest.mock("../../storage/serviceProvidersStorage");
jest.mock("../../storage/usersStorage");
jest.mock("../../storage/announcementsStorage");
jest.mock("react-native-simple-store");


describe("Announcements requests screen should", () => {
    let wrapper = null;
    let componentInstance = null;

    const userIdTest = "900261801";
    const userFullnameTest = "Gannie Gubbins";

    const mockStore = {
        userData: {
            token: "some token",
            userId: userIdTest,
            userFullname: userFullnameTest,
        }
    };

    const navigation = {navigate: jest.fn()};

    announcementsStorage.getUserAnnouncements = jest.fn().mockResolvedValue({data:announcements.filter(ann=>ann.userId===userIdTest)});
    announcementsStorage.getCategories = jest.fn().mockResolvedValue({data:categories});



    phoneStorage.get = jest.fn().mockImplementation((key) => Promise.resolve(mockStore[key]));
    phoneStorage.update = jest.fn().mockImplementation((key, value) => Promise.resolve(mockStore[key] = value));

    beforeEach(async () => {
        jest.clearAllMocks();
        wrapper = await shallow(<UserAnnouncementsRequests/>);
        componentInstance = wrapper.instance();
        await wrapper.update();
    });


    // it('match snapshot', async () => {
    //     wrapper = shallow(<AnnouncementsScreen/>);
    //     expect(wrapper).toMatchSnapshot();
    // });

    it("mounted with the right data", async() => {
        expect(componentInstance.state.announcements.length).toEqual(1);
        expect(componentInstance.state.allCategories.length).toEqual(2);
    });

    it("render what the user see", async () => {
        expect(wrapper.find('Accordion')).toHaveLength(1);
        expect(wrapper.find('Accordion').props().sections).toHaveLength(1);
        expect(wrapper.find('Accordion').props().sections[0].announcementId).toEqual(5);
        expect(wrapper.find('Accordion').props().sections[0].userId).toEqual('900261801');
        expect(wrapper.find('Button')).toHaveLength(1);
        expect(wrapper.find('Button').at(0).props().label).toEqual('חזור');
    });

    it("handle on back button send Press", async () => {
        wrapper = shallow(<UserAnnouncementsRequests navigation={navigation}/>);
        componentInstance = wrapper.instance();

        await wrapper.find('Button').at(0).props().onPress();
        expect(componentInstance.props.navigation.navigate).toHaveBeenCalled();
    });

});