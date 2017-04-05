import '!style!css!sass!./form.scss';

import React, { PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Panel, Alert } from 'react-bootstrap';
import { withRouter } from 'react-router';
import isObject from 'lodash/isObject';

import Label from '../../../../../shared/components/label';
import Input from '../../../../../shared/components/form/input';
import DatePickerInput from '../../../../../shared/components/form/date_picker_input';
import CountriesSelect from '../../../../../shared/components/form/countries_select';
import FieldContainer from '../../../../../shared/components/form/field_container';
import Loading from '../../../../../shared/components/loading';
import GenderSelect from '../../../../../shared/components/form/gender_select';

import backendApi from '../../../../../models/backend_api';
import I18nWithScope from '../../../../../models/i18n_with_scope';
import { seller } from '../../../../../models/router';
import * as v from '../../../../../helpers/validations';

// TODO: Localize with new my_profile section
const i18nWithScope = new I18nWithScope('components.seller_onboarding.sign_up_form');
const t = i18nWithScope.t.bind(i18nWithScope);

const validate = (values) => ({
  gender: v.validate(isObject, values.gender, 'Please select your gender.'),
  firstName: v.validate(v.hasValue, values.firstName, 'Please input your first name.'),
  lastName: v.validate(v.hasValue, values.lastName, 'Please input your last name.'),
  email: v.validate(v.email, values.email, 'Please input your email.'),
  mobilePhone: v.validate(v.telephone, values.mobilePhone, 'Please input your telephone number.'),
  birthdate: v.validate(v.hasValue, values.birthdate, 'Please select your birthbay.'),
  country: v.validate(isObject, values.country, 'Please select your country.'),
  street: v.validate(v.hasValue, values.street, 'Please input your street.'),
  streetNumber: v.validate(v.isNumber, values.streetNumber, 'Please input a valid street number'),
  postalCode: v.validate(v.isNumber, values.postalCode, 'Please input a valid postal code'),
  city: v.validate(v.hasValue, values.city, 'Please input your city.'),
  placeOfBirth: v.validate(v.hasValue, values.placeOfBirth, 'Please input your place of birth'),
  nationality: v.validate(isObject, values.nationality, 'Please select your nationality.'),
});

const verifyRoute = seller.myProfile.verifyYourAccount;

class IDNowForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    isVerified: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values) {
    const { router, isVerified } = this.props;

    if (isVerified) {
      return false;
    }

    const personalData = {
      street: values.street,
      streetNumber: values.streetNumber,
      postalCode: values.postalCode,
      city: values.city,
      country: values.country.isoCode,
      mobilePhone: values.mobilePhone,
      birthdate: values.birthdate,
      placeOfBirth: values.placeOfBirth,
      nationality: values.nationality.isoCode,
      gender: values.gender.value,
    };

    return backendApi.idnowSubmit({ personalData })
      .then(({ transactionnumber }) =>
        router.push(
          verifyRoute.id_frame.replace(':transactionId', transactionnumber)
        ),
      );
  }

  render() {
    const { handleSubmit, submitting, invalid, isVerified } = this.props;

    const buttonLabel = submitting ? (<Loading />) : 'NEXT';

    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="a-idnow-form__wrapper">
            {isVerified &&
              <Alert bsStyle="success" className="m-t">
                Your ID has been successfully verified.
              </Alert>
            }

            <form
              onSubmit={handleSubmit(this.onSubmit)}
              className="a-idnow__form"
            >
              <div className="row">
                <div className="col-xs-12">
                  <h2>Personal Information</h2>
                </div>
              </div>

              <Panel>
                <div className="row">
                  <FieldContainer cols={2} className="p-r-none">
                    <Label htmlFor="gender" value={`${'Gender'}*`}>
                      <Field
                        id="gender"
                        name="gender"
                        component={GenderSelect}
                        renderError
                        disabled={isVerified}
                      />
                    </Label>
                  </FieldContainer>
                  <FieldContainer cols={10} className="a-idnow__form-fullname">
                    <FieldContainer cols={6} className="p-l-none">
                      <Label htmlFor="firstName" value={`${'First Name'}*`}>
                        <Field
                          id="firstName"
                          name="firstName"
                          component={Input}
                          placeholder={t('first_name_placeholder')}
                          renderError
                          disabled={isVerified}
                        />
                      </Label>
                    </FieldContainer>
                    <FieldContainer cols={6} className="p-l-none">
                      <Label htmlFor="lastName" value={`${'Last Name'}*`}>
                        <Field
                          id="lastName"
                          name="lastName"
                          component={Input}
                          placeholder={t('last_name_placeholder')}
                          renderError
                          disabled={isVerified}
                        />
                      </Label>
                    </FieldContainer>
                  </FieldContainer>
                  <FieldContainer>
                    <Label htmlFor="mobilePhone" value={`${'Phone Number'}*`}>
                      <Field
                        id="mobilePhone"
                        name="mobilePhone"
                        component={Input}
                        placeholder={t('phone_number_placeholder')}
                        renderError
                        disabled={isVerified}
                      />
                    </Label>
                  </FieldContainer>
                  <FieldContainer>
                    <Label htmlFor="email" value={`${'Email'}*`}>
                      <Field
                        name="email"
                        type="email"
                        component={Input}
                        placeholder={t('email_placeholder')}
                        renderError
                        disabled={isVerified}
                      />
                    </Label>
                  </FieldContainer>
                  <FieldContainer>
                    <FieldContainer cols={4} className="p-l-none">
                      <Label htmlFor="birthdate" value={`${'Date of Birth'}*`}>
                        <Field
                          id="birthdate"
                          name="birthdate"
                          component={DatePickerInput}
                          placeholder="YYYY-MM-DD"
                          dateFormat="YYYY-MM-DD"
                          momentType="YYYY-MM-DD"
                          showYearDropdown
                          scrollableYearDropdown
                          renderError
                          disabled={isVerified}
                        />
                      </Label>
                    </FieldContainer>
                    <FieldContainer cols={4} className="p-l-none p-r-none">
                      <Label htmlFor="placeOfBirth" value={`${'Place of Birth'}*`}>
                        <Field
                          name="placeOfBirth"
                          type="placeOfBirth"
                          component={Input}
                          placeholder="Place of birth"
                          renderError
                          disabled={isVerified}
                        />
                      </Label>
                    </FieldContainer>
                    <FieldContainer cols={4} className="p-r-none">
                      <Label htmlFor="nationality" value={`${'Nationality'}*`}>
                        <Field
                          id="nationality"
                          name="nationality"
                          component={CountriesSelect}
                          placeholder="Nationality"
                          renderError
                          disabled={isVerified}
                        />
                      </Label>
                    </FieldContainer>
                  </FieldContainer>
                </div>
              </Panel>

              <div className="row">
                <div className="col-xs-12">
                  <h2>Address</h2>
                </div>
              </div>

              <Panel>
                <div className="row">
                  <FieldContainer cols={8}>
                    <Label htmlFor="street" value={`${'Street'}*`}>
                      <Field
                        id="street"
                        name="street"
                        component={Input}
                        placeholder="Street"
                        renderError
                        disabled={isVerified}
                      />
                    </Label>
                  </FieldContainer>
                  <FieldContainer cols={4} className="p-l-none">
                    <Label htmlFor="streetNumber" value={`${'Street Number'}*`}>
                      <Field
                        id="streetNumber"
                        name="streetNumber"
                        component={Input}
                        placeholder="Street No."
                        renderError
                        disabled={isVerified}
                      />
                    </Label>
                  </FieldContainer>
                  <FieldContainer cols={4}>
                    <Label htmlFor="postalCode" value={`${'Postal Code'}*`}>
                      <Field
                        id="postalCode"
                        name="postalCode"
                        component={Input}
                        placeholder="Postal Code"
                        renderError
                        disabled={isVerified}
                      />
                    </Label>
                  </FieldContainer>
                  <FieldContainer cols={4} className="p-l-none">
                    <Label htmlFor="city" value={`${'City'}*`}>
                      <Field
                        id="city"
                        name="city"
                        component={Input}
                        placeholder="City"
                        renderError
                        disabled={isVerified}
                      />
                    </Label>
                  </FieldContainer>
                  <FieldContainer cols={4} className="p-l-none">
                    <Label htmlFor="country" value={`${'Country'}*`}>
                      <Field
                        id="country"
                        name="country"
                        component={CountriesSelect}
                        placeholder="Country"
                        renderError
                        disabled={isVerified}
                      />
                    </Label>
                  </FieldContainer>
                </div>
              </Panel>
              {!isVerified &&
                <div className="a-idnow-button__wrapper">
                  <button
                    type="submit"
                    className="btn btn-primary a-idnow-button"
                    disabled={invalid || submitting}
                  >
                    {buttonLabel}
                  </button>
                </div>
              }
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export const WithReduxForm = reduxForm({
  form: 'seller-idnow-form',
  validate,
  destroyOnUnmount: false,
})(IDNowForm);

export default withRouter(WithReduxForm);
