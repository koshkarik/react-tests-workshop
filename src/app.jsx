import React from 'react';
import ReactDOM from 'react-dom';
import TabsWrapper from './components/Tabs';
import tabs from './tabs';

export default () => {
  ReactDOM.render(
    <TabsWrapper tabs={tabs} />,
    document.getElementById('root'),
  );
};
