/* global CONFIG */
import '!style!css!sass!./congratulations.scss';

import React from 'react';

import router from '../../../../models/router';
import Location from '../../../../models/location';
import I18nWithScope from '../../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('components.invoice_congratulations');
const t = i18nWithScope.t.bind(i18nWithScope);

const Congratulations = ({ isCleared = false }) => (
  <div className="a-invoice-upload-congratulations text-center">
    <div className="a-invoice-upload-congratulations__icon" />
    <h2 className="a-invoice-upload-congratulations__header">
      {t('title')}
    </h2>
    <h3 className="a-invoice-upload-congratulations__sub-header text-muted m-b-lg">
      {isCleared ? t('invoice_cleared') : t('invoice_uploaded')}
    </h3>
    <p className="a-invoice-upload-congratulations__description m-b-xl">
      <span>{t('description_before_email')}</span>
      <span className="text-navy">&nbsp;{CONFIG.advanonContactEmail}&nbsp;</span>
      <span>{t('description_after_email')}</span>
    </p>
    <button
      className="btn btn-primary text-uppercase"
      onClick={() => Location.visit(router.importedSellerInvoicesPath())}
    >
      {t('to_my_invoices')}
    </button>
  </div>
);

Congratulations.propTypes = {
  isCleared: React.PropTypes.bool,
};

export default Congratulations;
