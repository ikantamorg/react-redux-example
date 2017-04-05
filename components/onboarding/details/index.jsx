import get from 'lodash/get';
import map from 'lodash/map';
import find from 'lodash/find';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Form, { getHowDidYouHearOptions, getWhenFinancingOptions } from './form';

import { getDetails } from '../../../reducers/onboarding';
import I18nWithScope from '../../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('components.seller_onboarding');
const t = i18nWithScope.t.bind(i18nWithScope);

const formI18nWithScope = new I18nWithScope('components.seller_onboarding.details_form');
const ft = i18nWithScope.t.bind(formI18nWithScope);

export const SellerSignupDetails = ({ details }) => {
  const yourCustomersAre = map(
    get(details, 'yourCustomersAre', []),
    customer => ({ label: customer, value: customer }),
  );

  const howDidYouHearAboutUs = find(getHowDidYouHearOptions(ft), {
    value: get(details, 'howDidYouHearAboutUs'),
  });

  const whenDoYouNeedFinancing = find(getWhenFinancingOptions(ft), {
    value: get(details, 'whenDoYouNeedFinancing'),
  });

  const disabled = get(details, 'id', false) !== false;

  return (
    <div>
      <div className="row">
        <div className="col-sm-12 text-center">
          <h1 className="a-seller-onboarding__heading">
            {t('get_started')}
          </h1>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12">
          <Form
            disabled={disabled}
            initialValues={{
              ...details,
              yourCustomersAre,
              howDidYouHearAboutUs,
              whenDoYouNeedFinancing,
            }}
          />
        </div>
      </div>
    </div>
  );
};

SellerSignupDetails.propTypes = {
  details: PropTypes.object,
};

SellerSignupDetails.defaultProps = {
  details: null,
};

export default connect(
  state => ({ details: getDetails(state) })
)(SellerSignupDetails);
