import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import router, { seller } from '../../../models/router';

import SignupLayout from '../../../shared/layout/sign_up';
import WrappedProvider from '../../../store/provider';
import FormLayout from './layout';
import SignupWith from './signup_with';
import Signup from './signup';
import Details from './details';
import CreditAbility from './credit_ability';

const Onboarding = () => (
  <WrappedProvider>
    <Router history={browserHistory}>
      <Route path={router.rootPath()} component={SignupLayout}>
        <Route path="accounts/seller" component={FormLayout}>
          <Route path={seller.onboarding.index} showLogin component={SignupWith} />
          <Route path={seller.onboarding.signUp} component={Signup} />
          <Route path={seller.onboarding.details} component={Details} />
          <Route path={seller.onboarding.creditAbility} component={CreditAbility} />
        </Route>
      </Route>
    </Router>
  </WrappedProvider>
);

export default Onboarding;
