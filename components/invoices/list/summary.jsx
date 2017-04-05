/* global CONFIG */
import React from 'react';

import I18nWithScope from '../../../../models/i18n_with_scope';
import router from '../../../../models/router';

import DateCell from './date_cell';
import MoneyCell from './money_cell';

const i18nWithScope = new I18nWithScope('invoices.overview.open_invoices');
const t = i18nWithScope.t.bind(i18nWithScope);

const i18nWithScopeStatus = new I18nWithScope('invoices.statuses');
const tStatus = i18nWithScopeStatus.t.bind(i18nWithScopeStatus);

const i18nWithScopeStatusDescription = new I18nWithScope('invoices.statuses_description');
const tStatusDescription = i18nWithScopeStatusDescription.t.bind(i18nWithScopeStatusDescription);

const rowTitle = (titlePhrase) =>
  <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2">
    <strong>{titlePhrase}</strong>
  </div>;

const rowContent = (content) =>
  <div className="col-xs-6 col-sm-8 col-md-9 col-lg-10">{content}</div>;

const InvoiceSummaryComponent = ({ invoice }) => {
  const financedAmountPercentage = invoice.financedAmountPercentage * 100;
  const customerContent = (
    <a href={router.editSellerCustomerPath(invoice.customerId)}>
      {invoice.customerFirmName}
    </a>
  );

  return (
    <div>
      <div className="row m-b-xs">
        {rowTitle(t('reference_number'))}
        {rowContent(invoice.referenceNumber)}
      </div>
      <div className="row m-b-xs">
        {rowTitle(t('debtor'))}
        {rowContent(customerContent)}
      </div>
      <div className="row m-b-xs">
        {rowTitle(t('advancement'))}
        {rowContent(
          <MoneyCell
            amount={invoice.minimalAmount}
            percentage={invoice.minimalAmountPercentage}
          />
        )}
      </div>
      <div className="row m-b-xs">
        {rowTitle(t('financed'))}
        {rowContent(`${financedAmountPercentage}%`)}
      </div>
      <div className="row m-b-xs">
        {rowTitle(t('maximum_fee'))}
        {rowContent(
          <MoneyCell
            amount={invoice.maximumFee}
            percentage={invoice.maximumFeePercentage}
          />
        )}
      </div>
      <div className="row m-b-xs">
        {rowTitle(t('duration'))}
        {rowContent(
          <DateCell date={invoice.repaymentDate} />
        )}
      </div>
      <div className="row m-b-xs">
        {rowTitle(t('closing_date'))}
        {rowContent(
          <DateCell date={invoice.finishDate} />
        )}
      </div>
      <div className="row m-b-xs">
        {rowTitle(t('repayment_date'))}
        {rowContent(
          <DateCell date={invoice.investorReceivesRepaymentDate} />
        )}
      </div>
      <div className="row m-b-xs">
        {rowTitle(t('status'))}
        {rowContent(`
          ${tStatus(invoice.status)} (${tStatusDescription(invoice.status)})
        `)}
      </div>
    </div>
  );
};

InvoiceSummaryComponent.propTypes = {
  invoice: React.PropTypes.object.isRequired,
};

export default InvoiceSummaryComponent;
