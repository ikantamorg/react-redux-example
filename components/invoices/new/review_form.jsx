import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import min from 'lodash/min';

import Review from '../shared/review';
import BasicDetails from './basic_details';
import * as v from '../../../../helpers/validations';
import { getConfig } from '../../../../models/config';
import I18nWithScope from '../../../../models/i18n_with_scope';
import invoiceAttributesRanges from '../../../../constants/invoice_attributes_ranges';

import {
  updatePrefinancingAmount,
  updateRepaymentDate,
  usePromoCode,
} from '../../../actions/invoices/new';

import { getPromoCodes } from '../../../reducers/invoices/new';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

const validate = (values, { invoice }) => ({
  prefinancingAmount: v.validate(
    value => (value >= invoiceAttributesRanges.MIN_PREFINANCING_AMOUNT) &&
      (value <= min([
        Number.parseFloat(
          getConfig('currentAccount.seller.remainingCreditLimit')
        ),
        invoice.amount * invoice.pricesMap.investmentAsPartOfAmount,
      ])),
    values.prefinancingAmount,
    t(
      'components.new_invoice.review.errors.prefinancing_amount.possible_range',
      {
        max: min([
          Number.parseFloat(
            getConfig('currentAccount.seller.remainingCreditLimit')
          ),
          invoice.amount * invoice.pricesMap.investmentAsPartOfAmount,
        ]).toFixed(2),
      }
    )
  ),
  repaymentDate: v.validate(
    value => (!!value),
    values.repaymentDate,
    t('components.new_invoice.errors.required')
  ),
});

const InvoiceReview = ({
  header,
  invoice,
  promoCodes,
  usePromoCode,
  handleSubmit,
  submitHandler,
  extendedModal,
  onContractTypeClick,
  onCustomizeFeeClick,
  updateRepaymentDate,
  updatePrefinancingAmount,
}) => (
  <Review
    invoice={invoice}
    promoCodes={promoCodes}
    handlePromoCodeSelect={usePromoCode}
    onClearInvoiceClick={handleSubmit(submitHandler)}
    header={header}
    hideConfirmButton={extendedModal}
    onContractTypeClick={onContractTypeClick}
    BasicDetailsComponent={(
      <BasicDetails
        invoice={invoice}
        onCustomizeFeeClick={onCustomizeFeeClick}
        updatePrefinancingAmount={updatePrefinancingAmount}
        updateRepaymentDate={updateRepaymentDate}
      />
    )}
  />
);

InvoiceReview.propTypes = {
  updatePrefinancingAmount: React.PropTypes.func.isRequired,
  onContractTypeClick: React.PropTypes.func.isRequired,
  updateRepaymentDate: React.PropTypes.func.isRequired,
  onCustomizeFeeClick: React.PropTypes.func.isRequired,
  extendedModal: React.PropTypes.bool.isRequired,
  submitHandler: React.PropTypes.func.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  usePromoCode: React.PropTypes.func.isRequired,
  promoCodes: React.PropTypes.array.isRequired,
  invoice: React.PropTypes.object.isRequired,
  header: React.PropTypes.object.isRequired,
};

export const ReviewForm = reduxForm({
  form: 'newInvoiceReviewForm',
  validate,
})(InvoiceReview);

export default connect(
  state => ({ promoCodes: getPromoCodes(state) }),
  dispatch => bindActionCreators({
    updatePrefinancingAmount,
    updateRepaymentDate,
    usePromoCode,
  }, dispatch),
)(ReviewForm);
