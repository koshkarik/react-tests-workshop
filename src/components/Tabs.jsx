import React from 'react';
import _ from 'lodash';
import uuid from 'uuid';
import cookies from 'js-cookie';
// import 'react-lumberjack';
import {
  Tab,
  Tabs,
  TabList,
  TabPanel,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const addButtonStyle = {
  marginTop: 20,
  padding: 8,
};

export default class MyTabs extends React.Component {
  constructor(props) {
    super(props);
    const activeTabIndex = Number(cookies.get('activeTabIndex')) || 0;

    this.state = {
      activeTabIndex,
      tabs: [
        {
          title: 'Tab 1',
          description: 'content 1',
          id: uuid(),
        },
        {
          title: 'Tab 2',
          description: 'content 2',
          id: uuid(),
        },
      ],
    };
  }

  onRemove = id => () => {
    this.setState(prevState => ({
      tabs: _.reject(prevState.tabs, { id }),
    }));
  }

  onCreateTab = () => {
    const newTab = {
      title: `title ${Math.random()}`,
      description: `description ${Math.random()}`,
      id: uuid(),
    };

    this.setState(prevState => ({
      tabs: [...prevState.tabs, newTab],
    }));
  }

  onSelectTab = (tabIndex) => {
    this.setState({
      activeTabIndex: tabIndex,
    });
    cookies.set('activeTabIndex', tabIndex);
  }

  renderRemoveButton = id => (
    <button type="button" onClick={this.onRemove(id)}>X</button>
  )

  renderTabs = () => {
    const { tabs } = this.state;
    return tabs.map(({ id, title }) => (
      <Tab key={id} data-test="tab-control">
        {title}
        {this.renderRemoveButton(id)}
      </Tab>
    ));
  }

  renderTabPanels = () => {
    const { tabs } = this.state;
    return tabs.map(({ id, description }) => (
      <TabPanel key={id} data-test="tab-content">
        {description}
      </TabPanel>
    ));
  }

  render() {
    const { activeTabIndex } = this.state;
    return (
      <React.Fragment>
        <Tabs data-test="tabs-container" selectedIndex={activeTabIndex} onSelect={this.onSelectTab}>
          <TabList>
            {this.renderTabs()}
          </TabList>
          {this.renderTabPanels()}
        </Tabs>
        <button
          data-test="add-tab-btn"
          style={addButtonStyle}
          type="button"
          onClick={this.onCreateTab}
        >
          {'Add new Tab'}
        </button>
      </React.Fragment>
    );
  }
}
