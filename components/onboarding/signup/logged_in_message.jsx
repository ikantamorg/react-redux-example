import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';

import { seller } from '../../../../models/router';
import I18nWithScope from '../../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('components.seller_onboarding.logged_in');
const t = i18nWithScope.t.bind(i18nWithScope);

export const LoggedInMessage = ({ router }) => (
  <div className="text-center">
    <button
      className="btn btn-primary a-seller__signup-btn"
      onClick={() => router.push(seller.onboarding.details)}
    >
      {t('continue_with_registration')}
    </button>
  </div>
);

LoggedInMessage.propTypes = {
  router: PropTypes.object.isRequired,
};

export default withRouter(LoggedInMessage);
