import React from 'react';

import OpenModalButton from '../shared/open_modal_button';
import Stepper from './stepper';
import I18nWithScope from '../../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

class ClearInvoiceButton extends React.Component {
  state = { extendedModal: false }

  showExtendedModal = (extendedModal) => {
    this.setState({ extendedModal });
  }

  render() {
    const buttonText = t('clear_invoice_modal.clear_invoice');

    return (
      <OpenModalButton buttonText={buttonText} extended={this.state.extendedModal}>
        <Stepper
          invoice={this.props.invoice}
          extendedModal={this.state.extendedModal}
          showExtendedModal={this.showExtendedModal}
        />
      </OpenModalButton>
    );
  }
}

ClearInvoiceButton.propTypes = { invoice: React.PropTypes.object.isRequired };

export default ClearInvoiceButton;
