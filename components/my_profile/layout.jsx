import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';

import Breadcrumbs from '../../../shared/components/breadcrumbs';
import Wrapper from '../../../shared/components/wrapper';

const SellerSignupLayout = ({ children, router, routes, location, params }) => (
  <Wrapper>
    <Breadcrumbs
      router={router}
      routes={routes}
      location={location}
      params={params}
    />
    { children }
  </Wrapper>
);

SellerSignupLayout.propTypes = {
  children: PropTypes.any,
  routes: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

export default withRouter(SellerSignupLayout);
