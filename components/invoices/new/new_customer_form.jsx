import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  reduxForm,
  formValueSelector,
  SubmissionError,
  initialize,
} from 'redux-form';
import _ from 'lodash';

import BackButton from '../shared/back_button';
import NewCustomerFormContents from './new_customer_form_contents';
import I18nWithScope from '../../../../models/i18n_with_scope';
import { toggleExtendedModal } from '../../../actions/invoices/new';
import { createCustomer } from '../../../actions/customers';
import CompanySelect from './company_select';
import Label from '../../../../shared/components/label';

const i18nWithScope = new I18nWithScope('components.new_invoice');
const t = i18nWithScope.t.bind(i18nWithScope);

const customerI18nWithScope = new I18nWithScope('seller.customers.form_fields');
const ct = i18nWithScope.t.bind(customerI18nWithScope);

const validate = (values) => {
  const errors = {};

  if (!values.uid) {
    errors.uid = t('errors.required');
  } else if (!values.uid.match(/^.{3}-\d{3}\.\d{3}\.\d{3}$/)) {
    errors.uid = t('add_customer.errors.uid.format');
  }
  if (!values.firmName) { errors.firmName = t('errors.required'); }
  if (!values.address) { errors.address = t('errors.required'); }
  if (!values.postalcode) { errors.postalcode = t('errors.required'); }
  if (!values.city) { errors.city = t('errors.required'); }
  if (!values.country) { errors.country = t('errors.required'); }
  if (!values.legalForm) { errors.legalForm = t('errors.required'); }
  if (!values.personName) { errors.personName = t('errors.required'); }
  if (!values.email) {
    errors.email = t('errors.required');
  } else if (!values.email.match(/@/)) {
    errors.email = t('add_customer.errors.email.invalid');
  }
  if (!values.phone) { errors.phone = t('errors.required'); }

  return errors;
};

export class NewCustomerForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    toggleExtendedModal: PropTypes.func.isRequired,
    createCustomer: PropTypes.func.isRequired,
    currentCountry: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  }

  constructor() {
    super();

    this.submitHandler = this.submitHandler.bind(this);
    this.updateSelectedCompany = this.updateSelectedCompany.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.state = {
      selectedCompany: {
        label: '',
        value: '',
      },
    };
  }

  onSelect(company) {
    this.props.dispatch(initialize('newInvoiceNewCustomerForm', company));
    this.updateSelectedCompany(company);
  }

  updateSelectedCompany(company) {
    this.setState({
      selectedCompany: {
        label: company.firmName,
        value: company.uid,
      },
    });
  }

  submitHandler(values) {
    const { createCustomer, toggleExtendedModal } = this.props;
    const errors = validate(values);

    if (Object.keys(errors).length > 0) { throw new SubmissionError(errors); }

    return createCustomer(values)
      .then(toggleExtendedModal)
      .catch((error) => {
        const errors = error.responseJSON.errors;
        const formattedErrors = _.mapValues(errors, (val) => (val[0]));

        throw new SubmissionError(formattedErrors);
      });
  }

  render() {
    const { handleSubmit, currentCountry } = this.props;

    return (
      <div className="a-clear-invoice">
        <BackButton onClick={this.props.toggleExtendedModal} />
        <h2 className="a-clear-invoice-header__title">
          {t('add_customer.title')}
        </h2>

        <div className="new-invoice-form">
          <Label
            htmlFor="company-name-or-uid-id"
            value={ct('company_name_or_uid')}
            className="new-invoice-form__label-wrapper"
          >
            <CompanySelect
              value={this.state.selectedCompany}
              onSelect={this.onSelect}
              inputId="company-name-or-uid-id"
            />
          </Label>

          <form
            onSubmit={handleSubmit(this.submitHandler)}
          >
            <NewCustomerFormContents
              currentCountry={currentCountry}
            />
            <div className="m-t-md text-right">
              <button
                className="btn btn-primary"
                type="submit"
              >
                {t('next')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export const WrappedNewCustomerForm = reduxForm({
  form: 'newInvoiceNewCustomerForm',
  validate,
})(NewCustomerForm);

const selector = formValueSelector('newInvoiceNewCustomerForm');
export default connect(
  state => ({ currentCountry: selector(state, 'country') }),
  dispatch => bindActionCreators({
    toggleExtendedModal,
    createCustomer,
  }, dispatch)
)(WrappedNewCustomerForm);
