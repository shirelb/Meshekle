import React from 'react';

import {shallow} from "enzyme/build";

import AuthLoadingScreen from "../../screens/authLoadingScreen/AuthLoadingScreen";
import phoneStorage from "react-native-simple-store";
import usersStorage from "../../storage/usersStorage";


jest.mock("../../storage/usersStorage");
jest.mock("react-native-simple-store");


describe("AuthLoadingScreen should", () => {
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


    phoneStorage.get = jest.fn().mockImplementation((key) => Promise.resolve(mockStore[key]));
    phoneStorage.update = jest.fn().mockImplementation((key, value) => Promise.resolve(mockStore[key] = value));

    beforeEach(async() => {
        jest.clearAllMocks();
        wrapper = await shallow(<AuthLoadingScreen/>);
        componentInstance = wrapper.instance();
        await wrapper.update();
    });


    // it('match snapshot', async () => {
    //     wrapper = shallow(<AnnouncementsScreen/>);
    //     expect(wrapper).toMatchSnapshot();
    // });



    it("render what the user see", async () => {
        wrapper = shallow(<AuthLoadingScreen/>);
        componentInstance = wrapper.instance();

        expect(wrapper.find('StatusBar')).toHaveLength(1);

    });

});