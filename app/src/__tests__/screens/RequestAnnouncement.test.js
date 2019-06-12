import React from 'react';

import {shallow} from "enzyme/build";

import RequestAnnouncement from "../../screens/requestAnnouncement/RequestAnnouncement";
import phoneStorage from "react-native-simple-store";

import categories from "../jsons/categories";
import announcementsStorage from "../../storage/announcementsStorage";
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';

jest.mock("../../storage/serviceProvidersStorage");
jest.mock("../../storage/usersStorage");
jest.mock("../../storage/announcementsStorage");
jest.mock("react-native-simple-store");


//TODO: FIX THE IMPORT PROBLEM

describe("Request announcements screen should", () => {
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
    announcementsStorage.addAnnouncement = jest.fn().mockResolvedValue({status:200});
    announcementsStorage.getUniqueCategories = jest.fn().mockResolvedValue({data:categories});
    DocumentPicker.show= jest.fn();
    DocumentPickerUtil.allFiles= jest.fn();

    phoneStorage.get = jest.fn().mockImplementation((key) => Promise.resolve(mockStore[key]));
    phoneStorage.update = jest.fn().mockImplementation((key, value) => Promise.resolve(mockStore[key] = value));

    beforeEach(async() => {
        jest.clearAllMocks();
        wrapper = await shallow(<RequestAnnouncement/>);
        componentInstance = wrapper.instance();
        await wrapper.update();
        // componentInstance.setState({announcements:announcements,filteredAnnouncements:announcements,
        //     categories:categories,allCategories:categories,users:users,categoriesDisplay:categories,settingsModal:false});
    });


    // it('match snapshot', async () => {
    //     wrapper = shallow(<AnnouncementsScreen/>);
    //     expect(wrapper).toMatchSnapshot();
    // });

    it("mounted with the right data", async() => {

        expect(componentInstance.state.categoryNameFilter).toEqual('---');
        expect(componentInstance.state.categoriesDisplay.length).toEqual(3);
        expect(componentInstance.state.categories.length).toEqual(3);
        expect(componentInstance.state.value).toEqual({});
    });


    it("render what the user see", async () => {
        wrapper = shallow(<RequestAnnouncement/>);
        componentInstance = wrapper.instance();

        expect(wrapper.find('Form')).toHaveLength(1);
        expect(wrapper.find('Button')).toHaveLength(4);
        expect(wrapper.find('Text')).toHaveLength(1);
        expect(wrapper.find('Divider')).toHaveLength(1);

    });


    it("handle on Announcements request send Press", async () => {
        wrapper = shallow(<RequestAnnouncement navigation={navigation}/>);
        componentInstance = wrapper.instance();

        await wrapper.find('Button').at(1).props().onPress();
        expect(componentInstance.props.navigation.navigate).toHaveBeenCalled();
    });

    it("handle on My Announcements Request clear form Press", async () => {
        wrapper = shallow(<RequestAnnouncement/>);
        componentInstance = wrapper.instance();

        await wrapper.find('Button').at(2).props().onPress();
        expect(componentInstance.state.value).toEqual({});
        expect(componentInstance.state.categoryNameFilter).toEqual('---');
    });

    it("handle on My Announcements Request cancel form Press", async () => {
        wrapper = shallow(<RequestAnnouncement navigation={navigation}/>);
        componentInstance = wrapper.instance();

        await wrapper.find('Button').at(3).props().onPress();
        expect(componentInstance.props.navigation.navigate).toHaveBeenCalled();
    });

});