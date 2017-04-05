import '!style!css!sass!./invoice_details.scss';

import React, { PropTypes } from 'react';
import { formatMoneyCHF } from '../../../../helpers/number';
import { formatDate } from '../../../../helpers/date';
import I18nWithScope from '../../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('components.responsio.invoice_details');
const t = i18nWithScope.t.bind(i18nWithScope);

const InvoiceDetails = ({ invoice, isSeller }) => {
  const repaymentDate = isSeller ? invoice.repaymentDate : invoice.investorReceivesRepaymentDate;

  return (
    <div className="invoice-chat__details">
      <h2>{t('invoice')} {invoice.invoiceNumber} {t('of')} {invoice.customerFirmName}</h2>

      <div className="m-b">
        <h4 className="invoice-chat__amount m-b">
          {t('amount')}: <span className="invoice-chat__amount-value">
            {formatMoneyCHF(invoice.amount)}
          </span>
          <span> | </span>
          {t('repayment_date')}: <span className="invoice-chat__repayment-date">
            {formatDate(repaymentDate)}
          </span>
        </h4>
        <div>
          <h4 className="invoice-chat__explanation">{t('explanation')}</h4>
          <h5>{t('beta')}</h5>
        </div>
      </div>
    </div>
  );
};

InvoiceDetails.propTypes = {
  invoice: PropTypes.object.isRequired,
  isSeller: PropTypes.bool.isRequired,
};

export default InvoiceDetails;
