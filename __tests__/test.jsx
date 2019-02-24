import React from 'react';
import { mount } from 'enzyme';

import App from '../src/components/Main';

const createPage = wrapper => ({
  getControlTabs: wrapper.find('[data-test="tab-control"] > li'),
  getControlTabAt(ind) {
    return this.getControlTabs.at(ind);
  },
  getRemoveButtonAtTab(ind) {
    return this.getControlTabAt(ind).find('button');
  },
  getAddButton: wrapper.find('[data-test="add-tab-btn"]'),
});

describe('snapshot', () => {
  it('should change tab', () => {
    const wrapper = mount(<App />);
    const page = createPage(wrapper);
    const testIndex = 1;
    const secondTab = page.getControlTabAt(testIndex);

    expect(secondTab).not.toMatchSelector('[aria-selected="true"]');
    secondTab.simulate('click');

    expect(createPage(wrapper).getControlTabAt(testIndex))
      .toMatchSelector('[aria-selected="true"]');
  });
});

describe('without snapshot', () => {
  it('should add new tab', () => {
    const wrapper = mount(<App />);
    const tabsAmount = 2;
    const page = createPage(wrapper);

    expect(wrapper).toContainMatchingElements(tabsAmount, '[data-test="tab-control"] > li');
    expect(wrapper).toContainMatchingElements(tabsAmount, '[data-test="tab-content"] > div');
    const addButton = page.getAddButton;
    addButton.simulate('click');

    const tabsAmountAfterAdd = tabsAmount + 1;

    expect(wrapper).toContainMatchingElements(tabsAmountAfterAdd, '[data-test="tab-control"] > li');
    expect(wrapper).toContainMatchingElements(tabsAmountAfterAdd, '[data-test="tab-content"] > div');
  });

  it('shoud remove tab', () => {
    const wrapper = mount(<App />);
    const tabsAmount = 2;
    const page = createPage(wrapper);

    expect(wrapper).toContainMatchingElements(tabsAmount, '[data-test="tab-control"] > li');
    expect(wrapper).toContainMatchingElements(tabsAmount, '[data-test="tab-content"] > div');

    const removeBtn = page.getRemoveButtonAtTab(0);
    removeBtn.simulate('click');

    const tabsAmountAfterRemove = tabsAmount - 1;

    expect(wrapper).toContainMatchingElements(tabsAmountAfterRemove, '[data-test="tab-control"] > li');
    expect(wrapper).toContainMatchingElements(tabsAmountAfterRemove, '[data-test="tab-content"] > div');
  });

  it('should save active tab on reload', () => {
    const wrapper = mount(<App />);
    const page = createPage(wrapper);
    const testIndex = 1;
    const secondTab = page.getControlTabAt(testIndex);

    expect(secondTab).not.toMatchSelector('[aria-selected="true"]');
    secondTab.simulate('click');

    expect(createPage(wrapper).getControlTabAt(testIndex))
      .toMatchSelector('[aria-selected="true"]');

    wrapper.unmount().mount();

    expect(createPage(wrapper).getControlTabAt(testIndex))
      .toMatchSelector('[aria-selected="true"]');
  });
});
