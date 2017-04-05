import React from 'react';

import PromoCodeStatus from './promo_code_status';
import I18nWithScope from '../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

const PromoCode = ({ onSelect, promoCode }) => {
  const promoCodeState = (promoCode.expired || promoCode.used) ? 'disabled' : 'active';

  return (
    <div className="a-promo-code">
      <div className="a-promo-code-label">
        <div
          className={
            `a-promo-code-label__percentage a-promo-code-label__percentage--${promoCodeState}`
          }
        >
          <span>{promoCode.discount}%</span>
        </div>
        <div
          className={
            `a-promo-code-label__description a-promo-code-label__description--${promoCodeState}`
          }
        >
          <span>{t('seller.referral_program.promo_codes.off_service_fee')}</span>
        </div>
      </div>
      <div className="a-promo-code__text-part">
        <h3 className="a-promo-code__title">
          {promoCode.discount}% {t('seller.referral_program.promo_codes.off_service_fee')}
        </h3>
        <div className="text-muted a-promo-code__description">
          {t(`seller.referral_program.promo_codes.${promoCode.name}_desc`)}
        </div>
        <br />
        <PromoCodeStatus promoCode={promoCode} onSelect={onSelect} />
      </div>
    </div>
  );
};

export default PromoCode;
