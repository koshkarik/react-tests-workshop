import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Tabs from '../src/components/Tabs';
import tabs from '../src/tabs';

Enzyme.configure({ adapter: new Adapter() });

test('example', () => {
  const wrapper = mount(<Tabs tabs={tabs} />);
  expect(wrapper.render()).toMatchSnapshot();

  const tab1 = wrapper.find('[data-testid="tab_0"] > li');
  const tab2 = wrapper.find('[data-testid="tab_1"] > li');
  const tab3 = wrapper.find('[data-testid="tab_2"] > li');

  console.log(tab1.debug({ ignoreProps: true }));

  tab1.simulate('click');
  expect(wrapper.render()).toMatchSnapshot();

  tab2.simulate('click');
  expect(wrapper.render()).toMatchSnapshot();

  tab3.simulate('click');
  expect(wrapper.render()).toMatchSnapshot();
});
