import '!style!css!sass!./verification_select.scss';

import React, { PropTypes } from 'react';
import map from 'lodash/map';
import ReactSelect from 'react-select';
import I18nWithScope from '../../../../models/i18n_with_scope';
import { getConfig } from '../../../../models/config';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);
const verificationOptions = getConfig('invoice.verificationOptions', null);

const mappedVerificationTypesForSelect = (verificationTypes) => (
  map(verificationTypes, (attributes, type) => ({
    label: t(`invoices.new_invoice.verification_options.${type}`),
    value: type,
  }))
);

class VerificationSelect extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    showTypes: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  };
  static defaultProps = {
    showTypes: true,
    value: null,
  };

  getVerificationTypes = (input, callback) => {
    callback(null, {
      options: mappedVerificationTypesForSelect(verificationOptions),
      complete: true,
    });
  }

  render() {
    let types = null;
    const { showTypes, value, onChange } = this.props;

    if (showTypes && value) {
      const listItems = (
        map(t(`invoices.new_invoice.verification_options.${value}_criterias`), (type, index) => (
          <li key={index}>{type}</li>
        ))
      );

      if (listItems.length) {
        types = (
          <div className="panel panel-default verification_select__types">
            <div className="panel-body">
              <h4>{t('clear_invoice_modal.verification_type_placeholder')}:</h4>
              <ul>{listItems}</ul>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="verification_select__container">
        <ReactSelect.Async
          placeholder={t('invoices.new_invoice.choose_verification_option')}
          name="verificationTypeSelect"
          clearable={false}
          scrollMenuIntoView={false}
          value={value}
          loadOptions={this.getVerificationTypes}
          onChange={(value) => (onChange(value.value))}
        />
        {types}
      </div>
    );
  }
}

export default VerificationSelect;
