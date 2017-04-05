import React from 'react';

import router from '../../../../models/router';
import I18nWithScope from '../../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('components.seller_onboarding.register_as_investor');
const t = i18nWithScope.t.bind(i18nWithScope);

const RegisterAsInvestor = () => (
  <div className="text-center">
    <a
      className="btn btn-primary"
      data-no-turbolink="true"
      href={router.investorSignUpPath()}
    >
      {t('sign_up')}
    </a>
  </div>
);

export default RegisterAsInvestor;
