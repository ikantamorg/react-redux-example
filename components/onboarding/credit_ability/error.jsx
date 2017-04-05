import React from 'react';

const CreditLimitError = () => (
  <div>
    <i
      className="fa fa-exclamation-circle a-seller-signup__outcome-icon m-b-md"
      aria-hidden="true"
    />

    <h2 className="a-seller-signup__credit-headline m-b-md">
      An error has been encountered while calculating your credit limit.
    </h2>

    <p className="a-seller-signup__credit-description m-b-md">
      Please contact support.
    </p>
  </div>
);

export default CreditLimitError;
