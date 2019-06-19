import React from 'react';

import {shallow} from "enzyme/build";

import ChoresScreen from "../../screens/choresScreen/ChoresScreen";


describe("Chores screen should", () => {
    let wrapper = null;
    let componentInstance = null;



    // it('match snapshot', async () => {
    //     wrapper = shallow(<AnnouncementsScreen/>);
    //     expect(wrapper).toMatchSnapshot();
    // });


    it("render what the user see", async () => {
        wrapper = shallow(<ChoresScreen/>);
        componentInstance = wrapper.instance();

        expect(wrapper.find('ChoresCalendar')).toHaveLength(1);
    });

});