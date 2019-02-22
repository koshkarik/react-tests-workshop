import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Tab,
  Tabs,
  TabList,
  TabPanel,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export default class TabsWrapper extends PureComponent {
  static propTypes = {
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        content: PropTypes.string,
        label: PropTypes.string,
      }),
    ).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedTabInd: 0,
    };
  }

  onSelectTab = (ind) => {
    this.setState({
      selectedTabInd: ind,
    });
  }

  renderTabs = () => {
    const { tabs } = this.props;
    return tabs.map(tab => (
      <Tab key={tab.key} data-testid={`tab_${tab.key}`}>
        {tab.label}
      </Tab>
    ));
  }

  renderTabPanels = () => {
    const { tabs } = this.props;
    return tabs.map(tab => (
      <TabPanel key={tab.key}>
        {tab.content}
      </TabPanel>
    ));
  }

  render() {
    const { selectedTabInd } = this.state;

    return (
      <React.Fragment>
        <Tabs onSelect={this.onSelectTab} selectedIndex={selectedTabInd}>
          <TabList>
            {this.renderTabs()}
          </TabList>
          {this.renderTabPanels()}
        </Tabs>
      </React.Fragment>
    );
  }
}
