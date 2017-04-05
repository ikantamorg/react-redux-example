import React from 'react';
import classnames from 'classnames';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import I18nWithScope from '../../../../models/i18n_with_scope';
import invoiceContractType from '../../../../constants/invoice_contract_type';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

const ContractType = ({ invoice, onContractTypeClick }) => {
  const sellInvoiceTooltip = (
    <Tooltip id="sell-invoice-tooltip" placement="top">
      {t('clear_invoice_modal.sell_invoice_tooltip')}
    </Tooltip>
  );

  const getPrefinancingTooltip = (
    <Tooltip id="get-prefinancing-tooltip" placement="top">
      {t('clear_invoice_modal.get_prefinancing_tooltip')}
    </Tooltip>
  );

  return (
    <div>
      <div className="a-clear-invoice__label-text">
        {t('clear_invoice_modal.contract_type')}
      </div>
      <div className="m-b a-contract-type">
        <btn
          className={classnames('m-b a-contract-type__option prefinancing-test', {
            'a-contract-type__option--selected': invoice.contractType === invoiceContractType.PREFINANCING,
          })}
          onClick={() => onContractTypeClick(invoiceContractType.PREFINANCING)}
        >
          <div className="a-contract-type__option-content">
            <div className="a-contract-type__get-prefinancing-icon" />
            <div className="a-contract-type__option-name">
              {t('clear_invoice_modal.get_prefinancing')}
            </div>
          </div>
          <div className="a-contract-type__option-tooltip">
            <OverlayTrigger placement="bottom" overlay={getPrefinancingTooltip}>
              <i className="fa fa-info-circle" />
            </OverlayTrigger>
          </div>
        </btn>
        <btn
          className={classnames('a-contract-type__option true-sale-test', {
            'a-contract-type__option--selected': invoice.contractType === invoiceContractType.TRUE_SALE,
          })}
          onClick={() => onContractTypeClick(invoiceContractType.TRUE_SALE)}
        >
          <div className="a-contract-type__option-content">
            <div className="a-contract-type__sell-invoice-icon" />
            <div className="a-contract-type__option-name">
              {t('clear_invoice_modal.sell_invoice')}
            </div>
          </div>
          <div className="a-contract-type__option-tooltip">
            <OverlayTrigger placement="bottom" overlay={sellInvoiceTooltip}>
              <i className="fa fa-info-circle" />
            </OverlayTrigger>
          </div>
        </btn>
      </div>
    </div>
  );
};

ContractType.propTypes = {
  onContractTypeClick: React.PropTypes.func.isRequired,
  invoice: React.PropTypes.object.isRequired,
};

export default ContractType;
