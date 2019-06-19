import React from 'react';

import {FlatList} from 'react-native';
import {List} from 'react-native-elements';

import {shallow} from "enzyme/build";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import usersStorage from "../../storage/usersStorage";
import users from "../jsons/users";
import serviceProviders from "../jsons/serviceProviders";
import PhoneBookScreen from "../../screens/phoneBookScreen/PhoneBookScreen";
import phoneStorage from "react-native-simple-store";
import UserProfileInfo from "../../components/userProfile/UserProfileInfo";

jest.mock("react-native-simple-store");
jest.mock("../../storage/usersStorage");
jest.mock("../../storage/serviceProvidersStorage");

const flushPromises = () => new Promise(setImmediate);

describe("PhoneBookScreen should", () => {
    let wrapper = null;
    let componentInstance = null;
    const props = {};
    const userTest = users[41];
    const mockStore = {
        userData: {
            serviceProviderId: "549963652",
            userId: "549963652",
            token: "some token"
        }
    };

    phoneStorage.get = jest.fn().mockImplementation((key) => Promise.resolve(mockStore[key]));
    usersStorage.getUsers = jest.fn().mockImplementation(()=>Promise.resolve(users));
    usersStorage.getUserByUserID = jest.fn().mockImplementation((userId) => Promise.resolve(users.filter(user => user.userId === userId)[0]));
    serviceProvidersStorage.getServiceProviders = jest.fn().mockResolvedValue(serviceProviders);
    serviceProvidersStorage.getServiceProviderUserDetails = jest.fn().mockImplementation((serviceProviderId) => Promise.resolve({data: users.filter(user => user.userId === serviceProviderId)[0]}));
    serviceProvidersStorage.getServiceProviderById = jest.fn().mockImplementation((serviceProviderId) => Promise.resolve(serviceProviders.filter(provider =>
        provider.serviceProviderId === serviceProviderId)));

    beforeAll(() => {
    });

    afterAll(() => {
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
    });

    it('match snapshot', async () => {
        wrapper = shallow(<PhoneBookScreen/>);
        expect(wrapper).toMatchSnapshot();
    });

    it("mounted with the right data", async () => {
        wrapper = await shallow(<PhoneBookScreen/>);
        componentInstance = wrapper.instance();

        await wrapper.update();

        expect(componentInstance.state.users.length).toEqual(513);
        expect(componentInstance.state.infoModal).toEqual(false);
        expect(componentInstance.state.userSelected).toEqual({});
        expect(componentInstance.state.noUserFound).toEqual(false);
    });

    it("render with what the user see", async () => {
        wrapper = shallow(<PhoneBookScreen/>);
        componentInstance = wrapper.instance();

        expect(wrapper.find(List)).toHaveLength(1);
        expect(wrapper.find(UserProfileInfo)).toHaveLength(1);
        expect(wrapper.find(FlatList)).toHaveLength(1);
    });

    it("search for users with name that has ra", async () => {
        wrapper = await shallow(<PhoneBookScreen/>);
        componentInstance = wrapper.instance();

        await wrapper.update();
        const updateSearchSpy = jest.spyOn(componentInstance, 'updateSearch');

        await componentInstance.updateSearch('ra');

        expect(updateSearchSpy).toHaveBeenCalled();
        expect(componentInstance.state.users.length).toEqual(39);
    });

    it("search for users with role מספרה", async () => {
        wrapper = await shallow(<PhoneBookScreen/>);
        componentInstance = wrapper.instance();

        await wrapper.update();

        const updateSearchSpy = jest.spyOn(componentInstance, 'updateSearch');

        await componentInstance.updateSearch('מספרה');

        expect(updateSearchSpy).toHaveBeenCalled();
        expect(componentInstance.state.users.length).toEqual(45);
    });

    it("open UserProfileInfo on click user", async () => {
        wrapper = shallow(<PhoneBookScreen/>);
        componentInstance = wrapper.instance();

        const openUserInfoSpy = jest.spyOn(componentInstance, 'openUserInfo');

        componentInstance.openUserInfo(userTest);

        expect(openUserInfoSpy).toHaveBeenCalled();
        expect(openUserInfoSpy).toHaveBeenCalledWith(userTest);
    });

});
