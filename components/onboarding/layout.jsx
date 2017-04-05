import '!style!css!sass!./layout.scss';

import React, { PropTypes } from 'react';

const SellerOnboardingLayout = ({ children }) => (
  <div className="a-seller-onboarding">
    { children }
  </div>
);

SellerOnboardingLayout.propTypes = {
  children: PropTypes.any,
};

export default SellerOnboardingLayout;
