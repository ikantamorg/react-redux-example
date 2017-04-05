import React from 'react';

const CreditLimitDeclined = () => (
  <div>
    <i
      className="fa fa-tasks a-seller-signup__outcome-icon m-b-md"
      aria-hidden="true"
    />

    <h2 className="a-seller-signup__credit-headline m-b-md">
      Your credit limit is being processed!
    </h2>

    <p className="a-seller-signup__credit-description m-b-md">
      You will receive an email with information about your account
      once it has been reviewed by Advanon.
    </p>
  </div>
);

export default CreditLimitDeclined;
