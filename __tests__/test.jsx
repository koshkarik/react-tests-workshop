import React from 'react';
import { mount } from 'enzyme';
import cookie from 'js-cookie';

import App from '../src/components/Main';

jest.mock('js-cookie');

const CONTROL_TABS = '[data-test="tab-control"] > li';
const CONTENT_TABS = '[data-test="tab-content"] > div';
const ADD_BUTTON = '[data-test="add-tab-btn"]';
const ARIA_SELECTED = '[aria-selected="true"]';

export default class Page {
  constructor(wrapper) {
    this.wrapper = wrapper;
  }

  getControlTabs = () => this.wrapper.find(CONTROL_TABS)

  getControlTabAt = ind => this.getControlTabs().at(ind)

  getRemoveButtonAtTab = ind => this.getControlTabAt(ind).find('button');

  getAddButton = () => this.wrapper.find(ADD_BUTTON)
}

describe('snapshot', () => {
  it('should change tab', () => {
    const wrapper = mount(<App />);
    const page = new Page(wrapper);
    const testIndex = 1;
    const secondTab = page.getControlTabAt(testIndex);

    expect(secondTab).not.toMatchSelector(ARIA_SELECTED);
    secondTab.simulate('click');

    expect(new Page(wrapper).getControlTabAt(testIndex))
      .toMatchSelector(ARIA_SELECTED);
  });
});

describe('without snapshot', () => {
  it('should add new tab', () => {
    const wrapper = mount(<App />);
    const tabsAmount = 2;
    const page = new Page(wrapper);

    expect(wrapper).toContainMatchingElements(tabsAmount, CONTROL_TABS);
    expect(wrapper).toContainMatchingElements(tabsAmount, CONTENT_TABS);
    const addButton = page.getAddButton();
    addButton.simulate('click');

    const tabsAmountAfterAdd = tabsAmount + 1;

    expect(wrapper).toContainMatchingElements(tabsAmountAfterAdd, CONTROL_TABS);
    expect(wrapper).toContainMatchingElements(tabsAmountAfterAdd, CONTENT_TABS);
  });

  it('shoud remove tab', () => {
    const wrapper = mount(<App />);
    const tabsAmount = 2;
    const page = new Page(wrapper);

    expect(wrapper).toContainMatchingElements(tabsAmount, CONTROL_TABS);
    expect(wrapper).toContainMatchingElements(tabsAmount, CONTENT_TABS);

    const removeBtn = page.getRemoveButtonAtTab(0);
    removeBtn.simulate('click');

    const tabsAmountAfterRemove = tabsAmount - 1;

    expect(wrapper).toContainMatchingElements(tabsAmountAfterRemove, CONTROL_TABS);
    expect(wrapper).toContainMatchingElements(tabsAmountAfterRemove, CONTENT_TABS);
  });

  it('should save active tab on reload', () => {
    const wrapper = mount(<App />);
    const page = new Page(wrapper);
    const testIndex = 1;
    const secondTab = page.getControlTabAt(testIndex);

    const getCookiesStub = () => {
      let selectedTab;
      return {
        get: () => selectedTab,
        set: (ind) => {
          selectedTab = ind;
        },
      };
    };

    const cookies = getCookiesStub();
    cookie.set.mockImplementation((s, i) => cookies.set(i));
    cookie.get.mockImplementation(() => cookies.get());

    expect(secondTab).not.toMatchSelector(ARIA_SELECTED);
    secondTab.simulate('click');

    expect(new Page(wrapper).getControlTabAt(testIndex))
      .toMatchSelector(ARIA_SELECTED);

    const wrapper2 = mount(<App />);

    expect(new Page(wrapper2).getControlTabAt(testIndex))
      .toMatchSelector(ARIA_SELECTED);
  });
});
