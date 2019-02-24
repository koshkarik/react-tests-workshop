import React from 'react';
import { mount } from 'enzyme';
import cookie from 'js-cookie';
import nock from 'nock';
import delay from 'delay';

import feed from '../__fixtures__/feed';
import App from '../src/components/Main';

jest.mock('js-cookie');

const CONTROL_TABS = '[data-test="tab-control"] > li';
const CONTENT_TABS = '[data-test="tab-content"] > div';
const ADD_BUTTON = '[data-test="add-tab-btn"]';
const OPEN_DIALOG_BUTTON = '[data-test="add-tab-from-feed"]';
const FETCH_FEED_BUTTON = '[data-test="fetch-feed"]';
const INPUT_FIELD = '[data-test="input-field"]';
const ARIA_SELECTED = 'aria-selected';
const FORM = '[data-test="form"]';

export default class Page {
  constructor(wrapper) {
    this.wrapper = wrapper;
  }

  getControlTabs = () => this.wrapper.find(CONTROL_TABS)

  getControlTabAt = ind => this.getControlTabs().at(ind)

  getRemoveButtonAtTab = ind => this.getControlTabAt(ind).find('button');

  getAddButton = () => this.wrapper.find(ADD_BUTTON)

  getOpenDialogButton = () => this.wrapper.find(OPEN_DIALOG_BUTTON)

  getRequestButton = () => this.wrapper.find(FETCH_FEED_BUTTON)

  getInputField = () => this.wrapper.find(INPUT_FIELD)

  getForm = () => this.wrapper.find(FORM)
}

describe('change tab', () => {
  it('should change tab', () => {
    const wrapper = mount(<App />);
    const page = new Page(wrapper);
    const testIndex = 1;
    const secondTab = page.getControlTabAt(testIndex);

    expect(secondTab).not.toHaveProp(ARIA_SELECTED, 'true');
    secondTab.simulate('click');

    expect(page.getControlTabAt(testIndex)).toHaveProp(ARIA_SELECTED, 'true');
  });
});

describe('tabs crud', () => {
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

    expect(secondTab).not.toHaveProp(ARIA_SELECTED, 'true');
    secondTab.simulate('click');

    expect(new Page(wrapper).getControlTabAt(testIndex))
      .toHaveProp(ARIA_SELECTED, 'true');

    const wrapper2 = mount(<App />);

    expect(new Page(wrapper2).getControlTabAt(testIndex))
      .toHaveProp(ARIA_SELECTED, 'true');
  });

  it('shoul add tab from rss feed', async () => {
    const host = 'https://cors-anywhere.herokuapp.com/';
    const url = 'http://get-something.go';
    nock.disableNetConnect();
    nock(host)
      .get(`/${url}`)
      .reply(200, feed);

    const wrapper = mount(<App />);
    const page = new Page(wrapper);

    expect(wrapper).toContainMatchingElements(2, CONTROL_TABS);

    page.getOpenDialogButton().simulate('click');
    const inputField = page.getInputField();

    inputField.simulate('change', { target: { value: url } });

    const form = page.getForm();
    form.simulate('submit');

    await delay(100);
    wrapper.update();

    expect(wrapper).toContainMatchingElements(3, CONTROL_TABS);
    const addedTab = page.getControlTabAt(2);
    expect(addedTab).toHaveProp(ARIA_SELECTED, 'true');
    expect(addedTab).toIncludeText(url);
  });
});
