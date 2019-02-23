import React from 'react';
import { mount } from 'enzyme';

import App from '../src/components/Main';

const getControlTabs = wrapper => wrapper.find('[data-test="tab-control"] > li');

describe('snapshot', () => {
  it('should change tab', () => {
    const wrapper = mount(<App />);
    const tabs = getControlTabs(wrapper);
    const testIndex = 1;

    expect(tabs.at(testIndex)).not.toMatchSelector('[aria-selected="true"]');
    tabs.at(testIndex).simulate('click');

    expect(getControlTabs(wrapper).at(testIndex)).toMatchSelector('[aria-selected="true"]');
  });
});

describe('without snapshot', () => {
  it('should add new tab', () => {
    const wrapper = mount(<App />);
    const tabsAmount = 2;

    expect(wrapper).toContainMatchingElements(tabsAmount, '[data-test="tab-control"] > li');
    expect(wrapper).toContainMatchingElements(tabsAmount, '[data-test="tab-content"] > div');
    const addButton = wrapper.find('[data-test="add-tab-btn"]');
    addButton.simulate('click');

    const tabsAmountAfterAdd = tabsAmount + 1;

    expect(wrapper).toContainMatchingElements(tabsAmountAfterAdd, '[data-test="tab-control"] > li');
    expect(wrapper).toContainMatchingElements(tabsAmountAfterAdd, '[data-test="tab-content"] > div');
  });

  it('shoud remove tab', () => {
    const wrapper = mount(<App />);
    const tabsAmount = 2;

    expect(wrapper).toContainMatchingElements(tabsAmount, '[data-test="tab-control"] > li');
    expect(wrapper).toContainMatchingElements(tabsAmount, '[data-test="tab-content"] > div');

    const removeBtn = getControlTabs(wrapper).at(0).find('button');
    removeBtn.simulate('click');

    const tabsAmountAfterAdd = tabsAmount - 1;

    expect(wrapper).toContainMatchingElements(tabsAmountAfterAdd, '[data-test="tab-control"] > li');
    expect(wrapper).toContainMatchingElements(tabsAmountAfterAdd, '[data-test="tab-content"] > div');
  });
});
