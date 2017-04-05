import React from 'react';
import moment from 'moment';
import { Field } from 'redux-form';

import { decimalToPercent } from '../../../../utils';
import Input from '../../../../shared/components/form/input';
import I18nWithScope from '../../../../models/i18n_with_scope';
import invoiceContractType from '../../../../constants/invoice_contract_type';
import DatePickerInput from '../../../../shared/components/form/date_picker_input';
import invoiceAttributesRanges from '../../../../constants/invoice_attributes_ranges';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

const BasicDetails = ({
  invoice,
  onCustomizeFeeClick,
  updateRepaymentDate,
  updatePrefinancingAmount,
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
      <Field
        name="prefinancingAmount"
        component={Input}
        inputAddonContent={'CHF'}
        type={'number'}
        onInputChange={updatePrefinancingAmount}
        renderError
      />
    </div>

    <div className="a-invoice-basic-details__flex-row">
      <div className="m-b a-invoice-basic-details__repayment-date-input">
        <div className="a-clear-invoice__label-text">
          {t('clear_invoice_modal.repayment_date')}
        </div>
        <span className="a-clear-invoice__sublabel-text">
          <Field
            name="repaymentDate"
            component={DatePickerInput}
            placeholder="DD/MM/YYYY"
            minDate={
              moment().add(invoiceAttributesRanges.MIN_INVOICE_REPAYMENT_DATE, 'days')
            }
            maxDate={
              moment().add(invoiceAttributesRanges.MAX_INVOICE_REPAYMENT_DATE, 'days')
            }
            onInputChange={updateRepaymentDate}
            renderError
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
  updatePrefinancingAmount: React.PropTypes.func.isRequired,
  updateRepaymentDate: React.PropTypes.func.isRequired,
  onCustomizeFeeClick: React.PropTypes.func.isRequired,
  invoice: React.PropTypes.object.isRequired,
};

export default BasicDetails;
