/* global CONFIG */
import React, { Component, PropTypes } from 'react';
import { Field } from 'redux-form';

import Label from '../../../../shared/components/label';
import Input from '../../../../shared/components/form/input';
import Select from '../../../../shared/components/form/select';
import I18nWithScope from '../../../../models/i18n_with_scope';

const i18nLegalForms = new I18nWithScope('activerecord.attributes.customer.legal_forms');
const lft = i18nLegalForms.t.bind(i18nLegalForms);

const i18nWithScope = new I18nWithScope('seller.customers.form_fields');
const t = i18nWithScope.t.bind(i18nWithScope);

class NewCustomerFormContents extends Component {
  static propTypes = {
    currentCountry: PropTypes.string,
  }

  mapCountriesForSelect(countries) {
    return countries.map(country => ({
      label: country[0],
      value: country[1],
    }));
  }

  mapLegalFormsForSelect(currentCountry) {
    const legalForms = CONFIG.customerLegalForms;

    return (legalForms[currentCountry] || []).map(legalForm => ({
      label: lft(legalForm),
      value: legalForm,
    }));
  }

  render() {
    const { currentCountry } = this.props;
    const countries = this.mapCountriesForSelect(CONFIG.customerCountries);
    const legalForms = this.mapLegalFormsForSelect(currentCountry);

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <Label
              htmlFor="uid"
              value={t('uid')}
              className="new-invoice-form__label-wrapper"
            >
              <Field
                name="uid"
                component={Input}
                renderError
              />
            </Label>

            <Label
              htmlFor="firmName"
              value={t('firm_name')}
              className="new-invoice-form__label-wrapper"
            >
              <Field
                name="firmName"
                component={Input}
                renderError
              />
            </Label>

            <Label
              htmlFor="address"
              value={t('address')}
              className="new-invoice-form__label-wrapper"
            >
              <Field
                name="address"
                component={Input}
                renderError
              />
            </Label>

            <Label
              htmlFor="postalcode"
              value={t('postalcode')}
              className="new-invoice-form__label-wrapper"
            >
              <Field
                name="postalcode"
                component={Input}
                renderError
              />
            </Label>

            <Label
              htmlFor="city"
              value={t('city')}
              className="new-invoice-form__label-wrapper"
            >
              <Field
                name="city"
                component={Input}
                renderError
              />
            </Label>

            <Label
              htmlFor="country"
              value={t('country')}
              className="new-invoice-form__label-wrapper"
            >
              <Field
                name="country"
                component={Select}
                defaultOption=""
                options={countries}
                renderError
              />
            </Label>

            <Label
              htmlFor="legalForm"
              value={t('legal_form')}
              className="new-invoice-form__label-wrapper"
            >
              <Field
                name="legalForm"
                component={Select}
                defaultOption=""
                options={legalForms}
                renderError
              />
            </Label>

            <Label
              htmlFor="personName"
              value={t('person_name')}
              className="new-invoice-form__label-wrapper"
            >
              <Field
                name="personName"
                component={Input}
              />
            </Label>

            <Label
              htmlFor="email"
              value={t('email')}
              className="new-invoice-form__label-wrapper"
            >
              <Field
                name="email"
                component={Input}
                renderError
              />
            </Label>

            <Label
              htmlFor="phone"
              value={t('phone')}
              className="new-invoice-form__label-wrapper"
            >
              <Field
                name="phone"
                component={Input}
                renderError
              />
            </Label>
          </div>
        </div>
      </div>
    );
  }
}

export default NewCustomerFormContents;
