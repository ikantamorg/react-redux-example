import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import OpenModalButton from '../shared/open_modal_button';
import I18nWithScope from '../../../../models/i18n_with_scope';

import Steps from './steps';

import { isModalExtended } from '../../../reducers/invoices/new';

const i18nWithScope = new I18nWithScope('layouts.app');
const t = i18nWithScope.t.bind(i18nWithScope);

const CreateInvoiceModal = (props) => {
  const buttonText = classnames('+', {
    [` ${t('menu_pre_financing').toUpperCase()}`]: !props.minimized,
  });

  return (
    <OpenModalButton
      buttonText={buttonText}
      extended={props.extendedModal}
      customButton={props.customButton}
    >
      <Steps />
    </OpenModalButton>
  );
};

CreateInvoiceModal.propTypes = {
  minimized: React.PropTypes.bool.isRequired,
  extendedModal: React.PropTypes.bool.isRequired,
  customButton: React.PropTypes.element,
};

export default connect(
  state => ({ extendedModal: isModalExtended(state) }),
)(CreateInvoiceModal);
