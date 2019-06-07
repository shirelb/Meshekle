import React from 'react';

import {mount, shallow} from "enzyme/build";
import {MemoryRouter} from "react-router-dom";

const flushPromises = () => new Promise(setImmediate);


const setupComponent = async (renderType, Component, history, props, path) => {
    let wrapper = null;
    let componentInstance = null;

    renderType === 'shallow' ?
        wrapper = shallow(
            <MemoryRouter initialEntries={[path]} history={history}>
                <Component {...props}/>
            </MemoryRouter>
        )
        :
        wrapper = mount(
            <MemoryRouter initialEntries={[path]} history={history}>
                <Component {...props}/>
            </MemoryRouter>
        );

    renderType === 'shallow' ?
        componentInstance = wrapper.find(Component).dive().instance()
        :
        componentInstance = wrapper.find(Component).instance();

    await flushPromises();
    wrapper.update();

    return [wrapper, componentInstance];
};

export {flushPromises, setupComponent,}