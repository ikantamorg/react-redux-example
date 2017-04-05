import React from 'react';
import moment from 'moment';

import { decimalToPercent } from '../../../../utils';
import Input from '../../../../shared/components/form/input';
import I18nWithScope from '../../../../models/i18n_with_scope';
import invoiceContractType from '../../../../constants/invoice_contract_type';
import DatePickerInput from '../../../../shared/components/form/date_picker_input';
import invoiceAttributesRanges from '../../../../constants/invoice_attributes_ranges';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

const BasicDetails = ({
  errors,
  invoice,
  onCustomizeFeeClick,
  onRepaymentDateChange,
  onPrefinancingAmountChange,
}) => (
  <div className="a-invoice-basic-details">
    <div className="m-b a-invoice-basic-details__prefinancing-input">
      <label htmlFor="prefinancingAmount" className="a-clear-invoice__label-text text-center">
        {
          invoice.contractType === invoiceContractType.TRUE_SALE ?
            t('clear_invoice_modal.financing_amount') :
            t('clear_invoice_modal.prefinancing_amount')
        }
      </label>
      <Input
        inputAddonContent={'CHF'}
        type={'number'}
        input={{
          onChange: onPrefinancingAmountChange,
          value: invoice.prefinancingAmount,
          id: 'prefinancingAmount',
        }}
        meta={{
          touched: true,
          invalid: errors && errors.prefinancingAmount,
          error: errors ? errors.prefinancingAmount : '',
        }}
        renderError
      />
    </div>

    <div className="a-invoice-basic-details__flex-row">
      <div className="m-b a-invoice-basic-details__repayment-date-input">
        <div className="a-clear-invoice__label-text">
          {t('clear_invoice_modal.repayment_date')}
        </div>
        <span className="a-clear-invoice__sublabel-text">
          <DatePickerInput
            input={{
              onChange: onRepaymentDateChange,
              value: moment(invoice.repaymentDate),
              minDate: moment().add(
                invoiceAttributesRanges.MIN_INVOICE_REPAYMENT_DATE, 'days'
              ),
              maxDate: moment().add(
                invoiceAttributesRanges.MAX_INVOICE_REPAYMENT_DATE, 'days'
              ),
            }}
            meta={{
              touched: true,
              invalid: false,
            }}
          />
        </span>
      </div>

      <div>
        <div className="a-clear-invoice__label-text">{t('clear_invoice_modal.your_offer')}</div>
        <span className="a-clear-invoice__sublabel-text">
          {decimalToPercent(invoice.pricesMap.multiplier)}
        </span>
        <button
          onClick={onCustomizeFeeClick}
          className="btn btn-link a-clear-invoice__pencil"
        >
          <i className="fa fa-pencil" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
);

BasicDetails.propTypes = {
  onCustomizeFeeClick: React.PropTypes.func.isRequired,
  onRepaymentDateChange: React.PropTypes.func.isRequired,
  onPrefinancingAmountChange: React.PropTypes.func.isRequired,
  invoice: React.PropTypes.object.isRequired,
  errors: React.PropTypes.object,
};

export default BasicDetails;
