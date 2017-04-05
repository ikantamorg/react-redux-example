import isObject from 'lodash/isObject';
import noop from 'lodash/noop';
import includes from 'lodash/includes';
import reduce from 'lodash/reduce';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, Field, formValueSelector, SubmissionError } from 'redux-form';

import ReactSelect from '../../../../shared/components/form/react_select';
import Label from '../../../../shared/components/label';
import Input from '../../../../shared/components/form/input';
import CustomerTypePicker from '../../../../shared/components/form/customer_type_picker';

import { setDetails } from '../../../actions/onboarding';
import { getAccount, getAccountCountry } from '../../../../reducers/account';

import { seller } from '../../../../models/router';
import I18nWithScope from '../../../../models/i18n_with_scope';
import * as v from '../../../../helpers/validations';

const i18nWithScope = new I18nWithScope('components.seller_onboarding.details_form');
const t = i18nWithScope.t.bind(i18nWithScope);

const FORM_NAME = 'seller-signup-details-form';

export const getWhenFinancingOptions = (t = noop) => [
  { value: 'immediately', label: t('when_do_you_need_financing_options.immediately') },
  { value: 'in_few_weeks', label: t('when_do_you_need_financing_options.in_few_weeks') },
  { value: 'in_few_months', label: t('when_do_you_need_financing_options.in_few_months') },
  { value: 'not_sure', label: t('when_do_you_need_financing_options.not_sure') },
];

export const getHowDidYouHearOptions = (t = noop) => [
  { value: 'recommendation', label: t('how_did_you_hear_about_us_options.recommendation') },
  { value: 'direct_contact', label: t('how_did_you_hear_about_us_options.direct_contact') },
  { value: 'google', label: t('how_did_you_hear_about_us_options.google') },
  { value: 'social_networks', label: t('how_did_you_hear_about_us_options.social_networks') },
  { value: 'print_online_media', label: t('how_did_you_hear_about_us_options.print_online_media') },
  { value: 'other', label: t('how_did_you_hear_about_us_options.other') },
];

const HOW_DID_YOU_HEAR_CUSTOM = [
  'recommendation',
  'other',
];

const getErrors = t => ({
  yourCustomersAre: t('errors.please_select_customer'),
  howDidYouHearAboutUs: t('errors.please_select_at_least_option'),
  howDidYouHearAboutUsCustom: t('errors.please_specify_how_you_heard_about_us'),
  whenDoYouNeedFinancing: t('errors.please_select_at_least_option'),
  desiredCreditLimit: t('errors.please_enter_credit_limit'),
});

const isCustomValue = (o) => {
  if (!o) {
    return false;
  }
  return includes(HOW_DID_YOU_HEAR_CUSTOM, o.value);
};

const validate = (values) => {
  const {
    howDidYouHearAboutUs,
    howDidYouHearAboutUsCustom,
    whenDoYouNeedFinancing,
    yourCustomersAre,
    desiredCreditLimit,
   } = values;

  const errors = getErrors(t);

  let validations = {};
  if (isCustomValue(howDidYouHearAboutUs)) {
    validations = {
      howDidYouHearAboutUsCustom: v.validate(
        v.hasValue,
        howDidYouHearAboutUsCustom,
        errors.howDidYouHearAboutUsCustom
      ),
    };
  }

  return {
    ...validations,
    yourCustomersAre: v.validate(
      v => v.length > 0,
      yourCustomersAre,
      errors.yourCustomersAre,
    ),
    whenDoYouNeedFinancing: v.validate(
      isObject,
      whenDoYouNeedFinancing,
      errors.whenDoYouNeedFinancing
    ),
    howDidYouHearAboutUs: v.validate(isObject, howDidYouHearAboutUs, errors.howDidYouHearAboutUs),
    desiredCreditLimit: v.validate(v.hasValue, desiredCreditLimit, errors.desiredCreditLimit),
  };
};

class SellerSignupDetailsForm extends React.Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    accountCountry: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    setDetails: PropTypes.func.isRequired,
    howDidYouHearAboutUs: PropTypes.object,
    invalid: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super();

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values) {
    const { setDetails, account, disabled } = this.props;

    const navigate = () =>
      this.context.router.push(seller.onboarding.creditAbility);

    if (disabled) {
      return navigate();
    }

    return setDetails(account, values)
      .then(navigate)
      .catch(errors => {
        throw new SubmissionError({
          ...reduce(Object.keys(errors), (res, key) => {
            res[key] = getErrors(t)[key]; // eslint-disable-line no-param-reassign
            return res;
          }, {}),
        });
      });
  }

  renderCustomValueField() {
    const { howDidYouHearAboutUs, disabled } = this.props;

    if (!isCustomValue(howDidYouHearAboutUs)) {
      return false;
    }

    return (
      <div className="col-sm-7 col-xs-12 m-t">
        <Field
          id="howDidYouHearAboutUsCustom"
          name="howDidYouHearAboutUsCustom"
          component={Input}
          placeholder={t('how_did_you_hear_about_us_custom_placeholder')}
          disabled={disabled}
          renderError
        />
      </div>
    );
  }

  render() {
    const { handleSubmit, invalid, disabled, accountCountry } = this.props;

    return (
      <div className="a-seller-signup__form-container">
        <div className="a-seller-signup__form a-seller-signup__form--wide">
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <div className="row">
              <div className="col-sm-12 m-t">
                <div className="row a-seller-signup__form-row">
                  <div className="col-sm-7 col-xs-12">
                    <Label
                      labelClassName="a-seller-signup__form-label"
                      htmlFor="whenDoYouNeedFinancing"
                      value={`${t('when_do_you_need_financing_label')}*`}
                    >
                      <Field
                        id="whenDoYouNeedFinancing"
                        name="whenDoYouNeedFinancing"
                        component={ReactSelect}
                        options={getWhenFinancingOptions(t)}
                        disabled={disabled}
                        renderError
                      />
                    </Label>
                  </div>
                  <div className="col-sm-5 hidden-xs a-seller-signup__row-description">
                    <h4 className="a-seller-signup__description-title">
                      {t('when_do_you_need_financing_desc_title')}
                    </h4>
                    <p className="a-seller-signup__description-content">
                      {t('when_do_you_need_financing_desc_content')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 m-t">
                <div className="row a-seller-signup__form-row">
                  <div className="col-sm-7 col-xs-12">
                    <Label
                      labelClassName="a-seller-signup__form-label"
                      htmlFor="desiredCreditLimit"
                      value={`${t('desired_credit_limit_label')}*`}
                    >
                      <Field
                        name="desiredCreditLimit"
                        type="number"
                        component={Input}
                        inputAddonContent={t(`desired_credit_limit_currency_${accountCountry}`)}
                        step="1"
                        disabled={disabled}
                        renderError
                      />
                    </Label>
                  </div>
                  <div className="col-sm-5 hidden-xs a-seller-signup__row-description">
                    <h4 className="a-seller-signup__description-title">
                      {t('desired_credit_limit_desc_title')}
                    </h4>
                    <p className="a-seller-signup__description-content">
                      {t('desired_credit_limit_desc_content')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 m-t">
                <div className="row a-seller-signup__form-row a-seller-signup__form-row--block">
                  <div className="col-sm-7 col-xs-12">
                    <Label
                      labelClassName="a-seller-signup__form-label"
                      htmlFor="yourCustomersAre"
                      label={`${t('your_customers_are_label')}&`}
                    >
                      <Field
                        id="yourCustomersAre"
                        name="yourCustomersAre"
                        component={CustomerTypePicker}
                        disabled={disabled}
                      />
                    </Label>
                  </div>
                  <div className="col-sm-5 hidden-xs a-seller-signup__row-description">
                    <h4 className="a-seller-signup__description-title">Customer types</h4>
                    <p className="a-seller-signup__description-content">
                      {t('your_customers_desc_desc')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 m-t">
                <div className="row a-seller-signup__form-row a-seller-signup__form-row--block">
                  <div className="col-sm-7 col-xs-12">
                    <Label
                      labelClassName="a-seller-signup__form-label"
                      htmlFor="howDidYouHearAboutUs"
                      value={`${t('how_did_you_hear_about_us_label')}*`}
                    >
                      <Field
                        id="howDidYouHearAboutUs"
                        name="howDidYouHearAboutUs"
                        component={ReactSelect}
                        options={getHowDidYouHearOptions(t)}
                        disabled={disabled}
                        renderError
                      />
                    </Label>
                  </div>
                  { this.renderCustomValueField() }
                </div>
              </div>

              <div className="col-sm-12 m-t text-center">
                <button
                  disabled={invalid === true}
                  type="submit"
                  className="btn btn-primary a-seller__signup-btn"
                >
                  {t('complete_registration_label')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export const WrappedForm = reduxForm({
  form: FORM_NAME,
  validate,
  destroyOnUnmount: false,
})(SellerSignupDetailsForm);

export default connect(
  state => {
    const valueSelector = formValueSelector(FORM_NAME);
    const selector = key => valueSelector(state, key);

    return {
      account: getAccount(state),
      accountCountry: getAccountCountry(state),
      howDidYouHearAboutUs: selector('howDidYouHearAboutUs'),
    };
  },
  dispatch => bindActionCreators({ setDetails }, dispatch)
)(WrappedForm);
