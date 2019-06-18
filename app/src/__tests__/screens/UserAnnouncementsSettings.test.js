import React from 'react';
import Button from "../../components/submitButton/Button";

import {shallow} from "enzyme/build";

import UserAnnouncementsSettings from "../../screens/userAnnouncementsSettings/UserAnnouncementsSettings";
import phoneStorage from "react-native-simple-store";
import categories from "../jsons/categories";
import categoriesSubs from "../jsons/categoriesSubs";
import announcementsStorage from "../../storage/announcementsStorage";

jest.mock("../../storage/serviceProvidersStorage");
jest.mock("../../storage/usersStorage");
jest.mock("../../storage/announcementsStorage");
jest.mock("react-native-simple-store");


describe("Announcements settings screen should", () => {
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

    announcementsStorage.getUniqueCategories = jest.fn().mockResolvedValue({data:categories});
    announcementsStorage.getCategoriesSubs = jest.fn().mockResolvedValue({data:categoriesSubs});
    announcementsStorage.updateCategorySub = jest.fn().mockResolvedValue({status:200});


    phoneStorage.get = jest.fn().mockImplementation((key) => Promise.resolve(mockStore[key]));
    phoneStorage.update = jest.fn().mockImplementation((key, value) => Promise.resolve(mockStore[key] = value));

    beforeEach(async() => {
        jest.clearAllMocks();
        wrapper = await shallow(<UserAnnouncementsSettings/>);
        componentInstance = wrapper.instance();
        await wrapper.update();
        componentInstance.setState({categories:categories,categoriesSwitches:[{categoryId:1,switch:false},{categoryId:2,switch:true}]});
    });


    // it('match snapshot', async () => {
    //     wrapper = shallow(<AnnouncementsScreen/>);
    //     expect(wrapper).toMatchSnapshot();
    // });

    it("mounted with the right data", async() => {

        expect(componentInstance.state.categories.length).toEqual(2);
        expect(componentInstance.state.categoriesSwitches.length).toEqual(2);

    });

    it("render what the user see", async () => {
        componentInstance.setState({categories:categories,categoriesSwitches:[{categoryId:1,switch:false},{categoryId:2,switch:true}]});
        expect(wrapper.find('FlatList')).toHaveLength(1);
        expect(wrapper.find('FlatList').props().data).toHaveLength(2);
        expect(wrapper.find('FlatList').props().data[0].categoryId).toEqual(1);
        expect(wrapper.find('FlatList').props().data[0].switch).toEqual(false);
        expect(wrapper.find('FlatList').props().data[1].categoryId).toEqual(2);
        expect(wrapper.find('FlatList').props().data[1].switch).toEqual(true);

        expect(wrapper.find('Button')).toHaveLength(2);
        expect(wrapper.find('Button').at(0).props().label).toEqual('שלח');
        expect(wrapper.find('Button').at(1).props().label).toEqual('בטל');

    });


    it("handle on Announcements send Press", async () => {
        wrapper = shallow(<UserAnnouncementsSettings navigation={navigation}/>);
        componentInstance = wrapper.instance();

        await wrapper.find('Button').at(0).props().onPress();
        expect(componentInstance.props.navigation.navigate).toHaveBeenCalled();
    });

    it("handle on My Announcements cancel Press", async () => {
        wrapper = shallow(<UserAnnouncementsSettings navigation={navigation}/>);
        componentInstance = wrapper.instance();

        await wrapper.find('Button').at(1).props().onPress();
        expect(componentInstance.props.navigation.navigate).toHaveBeenCalled();
    });

});