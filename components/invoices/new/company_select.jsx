import React, { PropTypes } from 'react';
import ReactSelect from 'react-select';
import debounce from 'lodash/debounce';

import backendApi from '../../../../models/backend_api';

const mappedCountry = (countryCode) => {
  let country;
  switch (countryCode) {
    case 'CH':
      country = 'switzerland';
      break;
    case 'DE':
      country = 'germany';
      break;
    case 'AT':
      country = 'austria';
      break;
    default:
      country = 'other';
  }
  return country;
};

const mappedCompaniesForSelect = (companies) => (
  companies.map(company => ({
    label: company.name,
    value: company.uid,
  }))
);

class CompanySelect extends React.Component {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    minLength: PropTypes.number,
    debounceValue: PropTypes.number,
  }
  static defaultProps = {
    minLength: 3,
    debounceValue: 400,
  }

  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
    this.getCompanies = this.getCompanies.bind(this);
  }

  onChange(data) {
    return backendApi.getCompany(data.value)
      .then((response) => {
        const company = response.results;

        this.props.onSelect({
          uid: company.uid,
          firmName: company.name,
          address: company.address.address,
          postalcode: company.address.postalCode,
          city: company.address.town,
          country: mappedCountry(company.address.countryCode),
          legalForm: company.canonicalLegalForm,
        });
      });
  }

  getCompanies(input, callback) {
    const { minLength } = this.props;
    if (input.length >= minLength) {
      backendApi
        .getCompanies(input)
        .then((response) => (
          callback(null, { options: mappedCompaniesForSelect(response.results) })
        ));
    } else {
      callback(null, { options: [] });
    }
  }

  render() {
    const { debounceValue } = this.props;
    return (
      <ReactSelect.Async
        cache={false}
        name="companySelect"
        value={this.props.value}
        autoload={false}
        loadOptions={
          debounce(this.getCompanies, debounceValue, { leading: false, trailing: true })
        }
        onChange={this.onChange}
      />
    );
  }
}

export default CompanySelect;
