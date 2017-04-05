import React from 'react';
import Select from 'react-select';

import I18nWithScope from '../../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

const PromoCodeSelect = ({ invoice, promoCodes, handlePromoCodeSelect }) => {
  const noPromoCodeOption = {
    value: 'noPromoCode',
    label: t('clear_invoice_modal.no_promo_code_option'),
  };

  const promoCodeOptions = () => [
    noPromoCodeOption,
    ...promoCodes.map(promoCode => ({
      value: promoCode.id,
      label: t(`seller.referral_program.promo_codes.${promoCode.name}_desc`),
    })),
  ];

  const handlePromoCodeSelectHelper = (option) => (
    option.value === noPromoCodeOption.value ? handlePromoCodeSelect(null) :
      handlePromoCodeSelect(option.value)
  );

  let promoCodesContent = (
    <p><i>{t('clear_invoice_modal.no_promo_codes')}</i></p>
  );
  if (promoCodes.length > 0) {
    promoCodesContent = (
      <Select
        clearable={false}
        value={invoice.promoCodeId === null ? noPromoCodeOption.value : invoice.promoCodeId}
        options={promoCodeOptions()}
        name="verificationTypeSelect"
        placeholder={t('clear_invoice_modal.choose_promo_code')}
        onChange={handlePromoCodeSelectHelper}
      />
    );
  }

  return (
    <div className="m-b-lg promo-code-select-test">
      <div className="a-clear-invoice__label-text">
        {t('clear_invoice_modal.apply_promo_code')}
      </div>
      {promoCodesContent}
    </div>
  );
};

PromoCodeSelect.propTypes = {
  invoice: React.PropTypes.object.isRequired,
  promoCodes: React.PropTypes.array.isRequired,
  handlePromoCodeSelect: React.PropTypes.func.isRequired,
};

export default PromoCodeSelect;
