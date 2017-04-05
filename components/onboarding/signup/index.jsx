import get from 'lodash/get';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Form from './form';
import LoggedInMessage from './logged_in_message';

import I18nWithScope from '../../../../models/i18n_with_scope';
import { getAccount } from '../../../../reducers/account';

const i18nWithScope = new I18nWithScope('components.seller_onboarding');
const t = i18nWithScope.t.bind(i18nWithScope);

const SWITZERLAND = 'switzerland';

export const SellerSignup = ({ account }) => {
  let content;
  const loggedIn = get(account, 'id', false) !== false;

  if (loggedIn) {
    content = (<LoggedInMessage />);
  } else {
    content = (
      <div className="col-sm-12 m-t">
        <Form
          initialValues={{
            country: SWITZERLAND,
          }}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12 text-center">
          <h1 className="a-seller-onboarding__heading">
            {t('get_started')}
          </h1>
        </div>
      </div>
      <div className="row">
        {content}
      </div>
    </div>
  );
};

SellerSignup.propTypes = {
  account: PropTypes.object,
};

SellerSignup.defaultProps = {
  account: null,
};

export default connect(
  state => ({ account: getAccount(state) })
)(SellerSignup);
