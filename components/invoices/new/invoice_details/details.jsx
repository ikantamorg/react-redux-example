import { get, find } from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import moment from 'moment';

import FormContents from './form';
import { getConfig } from '../../../../../models/config';
import { DEFAULT_OPTION_VALUE } from '../../../../../shared/components/form/select';
import I18nWithScope from '../../../../../models/i18n_with_scope';
import invoiceAttributesRanges from '../../../../../constants/invoice_attributes_ranges';

import { isModalExtended } from '../../../../reducers/invoices/new';

const i18nWithScope = new I18nWithScope('components.new_invoice');
const t = i18nWithScope.t.bind(i18nWithScope);
const i18nWithScopeClean = new I18nWithScope('');
const tt = i18nWithScope.t.bind(i18nWithScopeClean);

const MIN_INVOICE_AMOUNT_RANGE = 1000;
const MAX_INVOICE_AMOUNT_RANGE = 999 * 1000 * 1000;

const validate = (values) => {
  const errors = {};
  const file = get(values, 'file[0]');

  if (!file) {
    errors.file = t('errors.required');
  } else {
    const fileMinSize = 10;
    const fileMaxSize = 20 * 1000 * 1000; // 20MB

    if (file.size < fileMinSize) {
      errors.file = t('form_step.errors.file.min');
    } else if (file.size > fileMaxSize) {
      errors.file = t('form_step.errors.file.max');
    }
  }

  if (!values.number) {
    errors.number = t('errors.required');
  }

  if (!values.amount) {
    errors.amount = t('errors.required');
  } else if (parseFloat(values.amount) < MIN_INVOICE_AMOUNT_RANGE) {
    errors.amount = t('form_step.errors.amount.min', {
      min: MIN_INVOICE_AMOUNT_RANGE,
    });
  } else if (parseFloat(values.amount) > MAX_INVOICE_AMOUNT_RANGE) {
    errors.amount = t('form_step.errors.amount.max', {
      max: MAX_INVOICE_AMOUNT_RANGE,
    });
  }

  if (!values.customer || values.customer === DEFAULT_OPTION_VALUE) {
    errors.customer = t('errors.required');
  }

  if (!values.dueDate) {
    errors.dueDate = t('errors.required');
  } else if (values.dueDate > moment().add(
    invoiceAttributesRanges.MAX_INVOICE_REPAYMENT_DATE, 'days'
  )) {
    errors.dueDate = t('form_step.errors.due_date.max');
  }

  return errors;
};

export class InvoiceDetailsStep extends React.Component {
  static propTypes = {
    updateInvoiceValues: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    nextStep: PropTypes.func.isRequired,
    customers: PropTypes.array.isRequired,
    fetchPricesMap: PropTypes.func.isRequired,
    extendedModal: PropTypes.bool,
  }

  constructor() {
    super();

    this.submitHandler = this.submitHandler.bind(this);
  }

  customerFirmNameById(id) {
    const { customers } = this.props;

    return find(customers, customer => customer.id === parseInt(id, 10)).firmName;
  }

  submitHandler(values) {
    const { updateInvoiceValues, nextStep, fetchPricesMap } = this.props;

    updateInvoiceValues({
      ...values,
      customer: {
        id: values.customer,
        firmName: this.customerFirmNameById(values.customer),
      },
    });

    fetchPricesMap()
      .then(nextStep);
  }

  isFormDisabled() {
    let error;
    if (getConfig('currentAccount.seller.investorsLimitReached', false)) {
      error = tt('seller.flash_messages.invoices.disabled_due_to_investors_limit');
    } else if (getConfig('currentAccount.seller.remainingCreditLimit', 0) <
      invoiceAttributesRanges.MIN_PREFINANCING_AMOUNT) {
      error = tt('seller.flash_messages.invoices.disabled_due_to_low_credit_limit');
    }

    return error;
  }

  render() {
    const { extendedModal } = this.props;
    const error = this.isFormDisabled();

    return (
      <div className="a-clear-invoice">
        <h2 className="a-clear-invoice-header__title">
          {t('form_step.header_title')}
        </h2>
        <form
          onSubmit={this.props.handleSubmit(this.submitHandler)}
          className="new-invoice-form"
        >
          <FormContents customers={this.props.customers} disabledError={error} />
          {!extendedModal &&
            <button
              disabled={!!error}
              className="btn btn-primary a-clear-invoice__confirm"
              type="submit"
            >
              {t('next')}
            </button>
          }
        </form>
      </div>
    );
  }
}

export const InvoiceForm = reduxForm({
  form: 'newInvoiceForm',
  validate,
  destroyOnUnmount: false,
})(InvoiceDetailsStep);

export default connect(
  state => ({ extendedModal: isModalExtended(state) }),
)(InvoiceForm);
