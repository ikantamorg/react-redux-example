import React from 'react';
import { Router, browserHistory } from 'react-router';

import WrappedProvider from '../../../store/provider';
import routes from './routes';

const Onboarding = () => (
  <WrappedProvider>
    <Router
      history={browserHistory}
      routes={routes}
    />
  </WrappedProvider>
);

export default Onboarding;
