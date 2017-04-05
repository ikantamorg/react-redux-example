import React from 'react';

import Loading from '../../../../shared/components/loading';
import I18nWithScope from '../../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('components.seller_onboarding.credit_ability');
const t = i18nWithScope.t.bind(i18nWithScope);

const CreditLimitVerifying = () => (
  <div>
    <h3 className="a-seller-signup__credit-headline m-b-md">
      {t('please_wait_calculating')}
    </h3>
    <Loading size="lg" />
  </div>
);

export default CreditLimitVerifying;
