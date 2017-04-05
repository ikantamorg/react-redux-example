import React from 'react';
import backendApi from '../../../models/backend_api';

import I18nWithScope from '../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

const onButtonClicked = (id, onSelect) => () => {
  backendApi.setPromoCodeSelectedTime(id)
    .then(() => onSelect(id));
};

const PromoCodeStatus = ({ onSelect, promoCode }) => {
  let content;

  if (promoCode.used) {
    content = (
      <p className="text-muted">
        {t('seller.referral_program.promo_codes.code_redeemed')} {promoCode.used_at}
      </p>
    );
  } else if (promoCode.expired) {
    content = (
      <p className="text-muted">
        {t('seller.referral_program.promo_codes.code_expired')}
      </p>
    );
  } else {
    content = (
      <p>
        {t('seller.referral_program.promo_codes.active')}
      </p>
    );
  }

  return (
    <div className="a-promo-code-status">{content}</div>
  );
};

export default PromoCodeStatus;
