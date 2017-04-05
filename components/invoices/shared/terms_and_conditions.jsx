import React from 'react';
import I18nWithScope from '../../../../models/i18n_with_scope';
import router from '../../../../models/router';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

const TermsAndConditions = () => (
  <div className="m-b">
    <span>
      {t('clear_invoice_modal.by_continuing_you_agree.before_agree_and_upload')}
      <i> {t('clear_invoice_modal.by_continuing_you_agree.agree_and_upload')} </i>
      {t('clear_invoice_modal.by_continuing_you_agree.after_agree_and_upload')}
    </span>
    <a
      href={router.termsAndConditionsPath()}
      rel="noopener noreferrer"
      target="_blank"
    > {t('clear_invoice_modal.terms_and_conditions')}</a>
  </div>
);

export default TermsAndConditions;
