import React, { PropTypes } from 'react';

import Location from '../../../../models/location';
import { formatMoneyCHF } from '../../../../helpers/number';

const visitDashboard = () =>
  Location.visit('/seller/dashboard/overview');

const CreditLimitVerified = ({ creditLimit }) => (
  <div>
    <i
      className="fa fa-check-circle-o a-seller-signup__outcome-icon m-b-md"
      aria-hidden="true"
    />

    <h2 className="a-seller-signup__credit-headline m-b-md">
      Congratulations! You credit limit is {formatMoneyCHF(creditLimit)}
    </h2>

    <p className="a-seller-signup__credit-description m-b-md">
      You have been accepted on the Advanon platform.
    </p>

    <button
      className="btn btn-primary a-seller__signup-btn"
      onClick={visitDashboard}
    >
      Go to dashboard
    </button>
  </div>
);

CreditLimitVerified.propTypes = {
  creditLimit: PropTypes.string.isRequired,
};

export default CreditLimitVerified;
