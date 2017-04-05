/* global CONFIG */
import React from 'react';

import I18nWithScope from '../../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('invoices.imported.table');
const t = i18nWithScope.t.bind(i18nWithScope);

const rowTitle = (titlePhrase) =>
  <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2">
    <strong>{titlePhrase}</strong>
  </div>;

const rowContent = (content) =>
  <div className="col-xs-6 col-sm-8 col-md-9 col-lg-10">{content}</div>;

const ImportedInvoiceExpandedRow = ({ invoice }) => {
  const customerContent = (
    <a
      href={CONFIG.routes.editSellerCustomerPath.replace('${id}', invoice.customer.id)}
    >
      {invoice.customer.firmName}
    </a>
  );

  return (
    <div>
      <div className="row">
        {rowTitle(t('invoice_number'))}
        {rowContent(invoice.id)}
      </div>
      <div className="row">
        {rowTitle(t('debtor'))}
        {rowContent(customerContent)}
      </div>
      <div className="row">
        {rowTitle(t('imported_from'))}
        {rowContent(invoice.backofficeName)}
      </div>
    </div>
  );
};

ImportedInvoiceExpandedRow.propTypes = {
  invoice: React.PropTypes.object.isRequired,
};

export default ImportedInvoiceExpandedRow;
