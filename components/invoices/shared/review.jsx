import React from 'react';

import I18nWithScope from '../../../../models/i18n_with_scope';
import PromoCodeSelect from './promo_code_select';
import ContractType from './contract_type';
import CostOverview from './cost_overview';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

const Review = ({
  header,
  invoice,
  promoCodes,
  hideConfirmButton,
  onClearInvoiceClick,
  onContractTypeClick,
  handlePromoCodeSelect,
  BasicDetailsComponent,
}) => (
  <div className="a-clear-invoice">
    {header}
    <ContractType invoice={invoice} onContractTypeClick={onContractTypeClick} />
    {BasicDetailsComponent}
    <PromoCodeSelect
      invoice={invoice}
      promoCodes={promoCodes}
      handlePromoCodeSelect={handlePromoCodeSelect}
    />
    <CostOverview invoice={invoice} forReview />

    {!hideConfirmButton &&
    <button
      className="btn btn-primary a-clear-invoice__confirm"
      onClick={() => onClearInvoiceClick(invoice)}
    >
      {t('clear_invoice_modal.clear_invoice_button')}
    </button>
    }
  </div>
);

Review.propTypes = {
  BasicDetailsComponent: React.PropTypes.object.isRequired,
  handlePromoCodeSelect: React.PropTypes.func.isRequired,
  onClearInvoiceClick: React.PropTypes.func.isRequired,
  onContractTypeClick: React.PropTypes.func.isRequired,
  promoCodes: React.PropTypes.array.isRequired,
  invoice: React.PropTypes.object.isRequired,
  header: React.PropTypes.object.isRequired,
  hideConfirmButton: React.PropTypes.bool,
};

export default Review;
