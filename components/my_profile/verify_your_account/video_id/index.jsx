import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Form from './form';
import { getGenderOption } from '../../../../../shared/components/form/gender_select';

import { getByIsoCode } from '../../../../../models/country';
import { getPersonalData, isVerifiedByIdNow } from '../../../../../reducers/account';

const ID = ({ personalData, isVerified }) => (
  <Form
    isVerified={isVerified}
    initialValues={{
      ...personalData,
      gender: getGenderOption(personalData.gender),
      nationality: getByIsoCode(personalData.nationality),
      country: getByIsoCode(personalData.country),
    }}
  />
);

ID.propTypes = {
  personalData: PropTypes.object.isRequired,
  isVerified: PropTypes.bool.isRequired,
};

export default connect(
  state => ({
    personalData: getPersonalData(state),
    isVerified: isVerifiedByIdNow(state),
  }),
)(ID);
