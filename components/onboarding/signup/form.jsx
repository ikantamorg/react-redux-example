import '!style!css!sass!./form.scss';

import get from 'lodash/get';
import isObject from 'lodash/isObject';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, Field, SubmissionError, formValueSelector } from 'redux-form';

import Label from '../../../../shared/components/label';
import Input from '../../../../shared/components/form/input';
import InputPassword from '../../../../shared/components/form/input_password';
import CompanySelect from '../../../../shared/components/form/company_select';
import FieldContainer from '../../../../shared/components/form/field_container';
import ReactSelect from '../../../../shared/components/form/react_select';
import CountryPicker from '../../../../shared/components/country_picker/picker';

import I18nWithScope from '../../../../models/i18n_with_scope';
import backendApi from '../../../../models/backend_api';
import router, { seller } from '../../../../models/router';
import { TYPES } from '../../../../constants/account';
import { createSeller } from '../../../actions/onboarding';
import * as v from '../../../../helpers/validations';

const i18nWithScope = new I18nWithScope('components.seller_onboarding.sign_up_form');
const t = i18nWithScope.t.bind(i18nWithScope);

const i18nWithScopeGender = new I18nWithScope('activerecord.attributes.account.genders');
const tGender = i18nWithScope.t.bind(i18nWithScopeGender);

const FORM_NAME = 'seller-signup-form';

const validate = (values) => ({
  gender: v.validate(isObject, values.gender, t('errors.gender')),
  first_name: v.validate(v.hasValue, values.first_name, t('errors.required')),
  last_name: v.validate(v.hasValue, values.last_name, t('errors.required')),
  email: v.validate(v.email, values.email, t('errors.email')),
  password: v.validate(v.hasMinLength(8), values.password, t('errors.password')),
  telephone: v.validate(v.hasValue, values.telephone, t('errors.telephone')),
  company: v.validate(isObject, values.company, t('errors.company')),
});

const asyncValidate = ({ promoCode, country }) =>
  new Promise((resolve, reject) => {
    if (!promoCode) {
      resolve();
      return;
    }

    backendApi.getPromoCodeGenre(promoCode, country)
      .then(() => resolve())
      .catch(error => reject({ promoCode: error.responseJSON.errors }));
  });

export class SellerSignupForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    createSeller: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,

    countryValue: PropTypes.string.isRequired,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super();

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values) {
    const { createSeller } = this.props;

    return createSeller({
      account: {
        account_type: TYPES.SELLER,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        registration_referral_code: values.promoCode,
        gender: values.gender.value,
        personal_phone: values.telephone,
        seller_attributes: {
          company_name: get(values, 'company.firmName'),
          country: values.country,
          vat: get(values, 'company.uid'),
          nectar_id: get(values, 'company.nectarId'),
        },
      },
    })
    .then(() => this.context.router.push(seller.onboarding.details))
    .catch(errors => {
      throw new SubmissionError(errors);
    });
  }

  render() {
    const { handleSubmit, invalid, submitting, countryValue } = this.props;

    return (
      <div className="a-seller-signup__form-container">
        <div className="a-seller-signup__form">
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <div className="row">
              <FieldContainer>
                <Label
                  labelClassName="a-seller-signup__form-label"
                  htmlFor="country-picker"
                  value={`${t('select_country')}*`}
                >
                  <Field
                    name="country"
                    component={({ input }) => (
                      <CountryPicker
                        id="country-picker"
                        onSelect={country => input.onChange(country.value)}
                        value={input.value}
                      />
                    )}
                  />
                </Label>
              </FieldContainer>
              <FieldContainer>
                <Label
                  labelClassName="a-seller-signup__form-label"
                  htmlFor="company-select"
                  value={`${t('company_name_or_uid')}*`}
                >
                  <Field
                    name="company"
                    component={CompanySelect}
                    country={countryValue}
                    renderError
                  />
                </Label>
              </FieldContainer>
              <FieldContainer cols={3} className="p-r-none">
                <Label
                  labelClassName="a-seller-signup__form-label"
                  htmlFor="gender"
                  value={`${t('name_label')}*`}
                >
                  <Field
                    className="a-react-select--34"
                    id="gender"
                    name="gender"
                    component={ReactSelect}
                    clearable={false}
                    deleteRemoves={false}
                    placeholder=" "
                    options={[
                      { label: tGender('male'), value: 0 },
                      { label: tGender('female'), value: 1 },
                    ]}
                    renderError
                  />
                </Label>
              </FieldContainer>
              <FieldContainer cols={9} className="a-seller-signup__form-fullname">
                <FieldContainer cols={6} className="p-l-none">
                  <Label htmlFor="first_name" offsetLabel>
                    <Field
                      id="first_name"
                      name="first_name"
                      component={Input}
                      placeholder={t('first_name_placeholder')}
                      renderError
                    />
                  </Label>
                </FieldContainer>
                <FieldContainer cols={6} className="p-l-none">
                  <Label htmlFor="last_name" offsetLabel>
                    <Field
                      id="last_name"
                      name="last_name"
                      component={Input}
                      placeholder={t('last_name_placeholder')}
                      renderError
                    />
                  </Label>
                </FieldContainer>
              </FieldContainer>
              <FieldContainer>
                <Label
                  labelClassName="a-seller-signup__form-label"
                  htmlFor="telephone"
                  value={`${t('phone_number_label')}*`}
                >
                  <Field
                    id="telephone"
                    name="telephone"
                    component={Input}
                    placeholder={t(`phone_number_placeholder_${countryValue}`)}
                    renderError
                  />
                </Label>
              </FieldContainer>
              <FieldContainer>
                <Label
                  labelClassName="a-seller-signup__form-label"
                  htmlFor="email"
                  value={`${t('email_label')}*`}
                >
                  <Field
                    name="email"
                    type="email"
                    component={Input}
                    placeholder={t('email_placeholder')}
                    renderError
                  />
                </Label>
              </FieldContainer>
              <FieldContainer>
                <Label
                  labelClassName="a-seller-signup__form-label"
                  htmlFor="password"
                  value={`${t('password_label')}*`}
                >
                  <Field
                    name="password"
                    component={InputPassword}
                    renderError
                  />
                </Label>
              </FieldContainer>
              <FieldContainer offsetTop={false}>
                <Label
                  labelClassName="a-seller-signup__form-label"
                  htmlFor="promoCode"
                  value={t('promo_code_label')}
                >
                  <Field
                    name="promoCode"
                    component={Input}
                    placeholder={t('promo_code_placeholder')}
                    renderError
                  />
                </Label>
              </FieldContainer>
              <FieldContainer className="text-center">
                {t('terms_by_continuing')}&nbsp;
                <a
                  href={router.termsAndConditionsPath()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('terms_and_conditions')}
                </a>
              </FieldContainer>
              <FieldContainer className="text-right">
                <button
                  disabled={invalid || submitting}
                  type="submit"
                  className="btn btn-primary a-seller__signup-btn"
                >
                  { submitting ?
                    <span className="animated bounceInLeft">
                      <i className="fa fa-spinner fa-pulse" />
                    </span>
                    :
                    t('next_button_label')
                  }
                </button>
              </FieldContainer>
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
  asyncValidate,
  asyncBlurFields: ['promoCode'],
})(SellerSignupForm);

export default connect(
  (state, ownProps) => {
    const valueSelector = formValueSelector(FORM_NAME);
    const selector = key => valueSelector(state, key);

    return {
      countryValue: selector('country') || ownProps.initialValues.country,
    };
  },
  dispatch => bindActionCreators({ createSeller }, dispatch)
)(WrappedForm);
