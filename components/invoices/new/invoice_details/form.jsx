import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import moment from 'moment';

import Label from '../../../../../shared/components/label';
import Input from '../../../../../shared/components/form/input';
import CompactStepsProgress from '../../../../../shared/components/compact_steps_progress';
import Select from '../../../../../shared/components/form/select';
import DatePickerInput from '../../../../../shared/components/form/date_picker_input';
import I18nWithScope from '../../../../../models/i18n_with_scope';
import { toggleExtendedModal } from '../../../../actions/invoices/new';
import invoiceAttributesRanges from '../../../../../constants/invoice_attributes_ranges';

const i18nWithScope = new I18nWithScope('components.new_invoice.form_step.form_contents');
const t = i18nWithScope.t.bind(i18nWithScope);

class FormContents extends React.Component {
  static propTypes = {
    disabledError: PropTypes.string,
    customers: PropTypes.array.isRequired,
    toggleExtendedModal: PropTypes.func.isRequired,
  }

  mapCustomersForSelect(customers) {
    return customers.map(customer => ({
      label: customer.firmName,
      value: customer.id,
    }));
  }

  render() {
    const { customers, disabledError } = this.props;
    const disabled = !!disabledError;
    const mappedCustomers = this.mapCustomersForSelect(customers);

    return (
      <div>
        <div className="aside-modal__progress">
          <CompactStepsProgress
            steps={[{ step: 1 }, { step: 2 }, { step: 3 }]}
            step={1}
            type="wider"
          />
        </div>
        <h3 className="aside-modal__subtitle text-center">{t('title')}</h3>
        {disabledError &&
          <Alert bsStyle="warning" className="m-t m-b-lg">
            {disabledError}
          </Alert>
        }
        <div className="row">
          <div className="col-xs-12">
            <Label
              htmlFor="file"
              value={t('file.label')}
              className="new-invoice-form__label-wrapper"
            >
              <Field
                name="file"
                type="file"
                accept=".pdf"
                component={Input}
                disabled={disabled}
                renderError
              />
              <small className="text-muted">{t('file.helper')}</small>
            </Label>

            <Label
              htmlFor="amount"
              value={t('amount.label')}
              className="new-invoice-form__label-wrapper"
            >
              <Field
                name="amount"
                type="number"
                placeholder={t('amount.placeholder')}
                component={Input}
                inputAddonContent="CHF"
                step="0.01"
                disabled={disabled}
                renderError
              />
            </Label>

            <Label
              htmlFor="number"
              value={t('invoice_number.label')}
              className="new-invoice-form__label-wrapper"
            >
              <Field
                name="number"
                type="text"
                component={Input}
                disabled={disabled}
                renderError
              />
              <small className="text-muted">{t('invoice_number.helper')}</small>
            </Label>

            <Label
              htmlFor="dueDate"
              value={t('due_date.label')}
              className="new-invoice-form__label-wrapper"
            >
              <Field
                name="dueDate"
                component={DatePickerInput}
                placeholder="DD/MM/YYYY"
                minDate={
                  moment().add(invoiceAttributesRanges.MIN_INVOICE_DUE_DATE, 'days')
                }
                maxDate={
                  moment().add(invoiceAttributesRanges.MAX_INVOICE_DUE_DATE, 'days')
                }
                disabled={disabled}
                renderError
              />
              <small className="text-muted">{t('due_date.helper')}</small>
            </Label>

            <Label
              htmlFor="customer"
              value={t('customer.label')}
              className="new-invoice-form__label-wrapper"
            >
              <Field
                name="customer"
                component={Select}
                defaultOption={t('customer.placeholder')}
                options={mappedCustomers}
                disabled={disabled}
                renderError
              />
            </Label>
          </div>
        </div>
        <div className="text-center">
          <button
            type="button"
            disabled={disabled}
            className="btn btn-primary"
            onClick={this.props.toggleExtendedModal}
          >
            {t('customer.new')}
          </button>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  dispatch => bindActionCreators({
    toggleExtendedModal,
  }, dispatch)
)(FormContents);
