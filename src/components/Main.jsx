import React from 'react';
import cookie from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.css';

import Tabs from './Tabs';

const Main = () => (
  <div className="container">
    <h1>Simple App for Tests</h1>
    <Tabs storage={cookie} />
  </div>
);

export default Main;
