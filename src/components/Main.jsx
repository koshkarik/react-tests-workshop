import React from 'react';
import cookie from 'js-cookie';

import Tabs from './Tabs';

const Main = () => (
  <React.Fragment>
    <h1>Hello World</h1>
    <Tabs storage={cookie} />
  </React.Fragment>
);

export default Main;
