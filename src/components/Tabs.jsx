import React from 'react';
import _ from 'lodash';
import uuid from 'uuid';
import cookies from 'js-cookie';
import Modal from 'react-responsive-modal';
import RssParser from 'rss-parser';
import 'bootstrap/dist/css/bootstrap.css';
// import 'react-lumberjack';
import {
  Tab,
  Tabs,
  TabList,
  TabPanel,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const parser = new RssParser();

const proxyCorsServer = 'https://cors-anywhere.herokuapp.com/';

const modalStyle = {
  modal: {
    minWidth: '400px !important',
  },
};

export default class MyTabs extends React.Component {
  constructor(props) {
    super(props);
    const activeTabIndex = Number(cookies.get('activeTabIndex')) || 0;

    this.state = {
      activeTabIndex,
      rssModalOpen: false,
      isRssFetching: false,
      error: null,
      rssUrl: 'http://feeds.bbci.co.uk/news/world/rss.xml',
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

  getRss = async (url) => {
    const rssUrl = `${proxyCorsServer}${url}`;
    const feed = await parser.parseURL(rssUrl);
    return feed.items.map(item => item.title);
  }

  handleRssUrlChange = (event) => {
    const { value } = event.target;

    this.setState({
      rssUrl: value,
    });
  }

  onRemove = id => () => {
    this.setState(prevState => ({
      tabs: _.reject(prevState.tabs, { id }),
    }));
  }

  onRssSubmit = (e) => {
    const { rssUrl } = this.state;

    e.preventDefault();
    this.setState({
      isRssFetching: true,
      error: null,
    }, async () => {
      try {
        const rss = await this.getRss(rssUrl);
        const newTab = {
          title: rssUrl,
          description: rss.join('\n'),
          id: uuid(),
        };
        this.setState(prevState => ({
          tabs: [...prevState.tabs, newTab],
        }));
        this.onCloseRssModal();
      } catch (err) {
        this.setState({
          error: 'Failed to load rss from that url',
          isRssFetching: false,
        });
      }
    });
  }

  onRemoveError = () => {
    this.setState({
      error: null,
    });
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


  onOpenRssModal = () => {
    this.setState({
      rssModalOpen: true,
    });
  }

  onCloseRssModal = () => {
    this.setState({
      rssModalOpen: false,
      isRssFetching: false,
      rssUrl: '',
      error: null,
    });
  }

  renderRemoveButton = id => (
    <button type="button" className="btn btn-outline-dark ml-2" onClick={this.onRemove(id)}>X</button>
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

  renderError = () => {
    const { error } = this.state;
    return (
      <div className="alert alert-danger" role="alert">
        {error}
        <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.onRemoveError}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }

  renderRssModal = () => {
    const { rssModalOpen, error } = this.state;
    if (!rssModalOpen) {
      return null;
    }

    return (
      <Modal open styles={modalStyle} onClose={this.onCloseRssModal} center>
        <h4>Add tab from Rss</h4>
        {this.renderRssForm()}
        {error && this.renderError()}
      </Modal>
    );
  }

  renderSpinner = () => (
    <div className="spinner-border ml-2" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );

  renderRssForm = () => {
    const { isRssFetching, rssUrl } = this.state;
    return (
      <form onSubmit={this.onRssSubmit}>
        <div className="input-group mt-4 mb-4">
          <input
            type="text"
            className="form-control"
            value={rssUrl}
            onChange={this.handleRssUrlChange}
            placeholder="Enter rss url"
            aria-label="Recipient's username"
            aria-describedby="button-addon2"
          />
          <div className="input-group-append">
            <button
              disabled={isRssFetching}
              className="btn btn-secondary"
              type="submit"
              id="button-addon2"
            >
              {'Add'}
            </button>
            {isRssFetching && this.renderSpinner()}
          </div>
        </div>
      </form>
    );
  }

  render() {
    const { activeTabIndex } = this.state;
    return (
      <div className="mt-5">
        <button
          data-test="add-tab-btn"
          className="btn btn-primary"
          type="button"
          onClick={this.onCreateTab}
        >
          {'Add new fake Tab'}
        </button>
        <button
          data-test="add-tab-btn"
          className="btn btn-success ml-4"
          type="button"
          onClick={this.onOpenRssModal}
        >
          {'Add new RSS tab'}
        </button>
        <div className="mt-5">
          <Tabs data-test="tabs-container" selectedIndex={activeTabIndex} onSelect={this.onSelectTab}>
            <TabList>
              {this.renderTabs()}
            </TabList>
            {this.renderTabPanels()}
          </Tabs>
        </div>
        {this.renderRssModal()}
      </div>
    );
  }
}
