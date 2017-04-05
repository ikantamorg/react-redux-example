import React from 'react';
import { Provider } from 'react-redux';

import CreateInvoiceModal from './create_invoice';

import configureStore from '../../../../store/configure';

const store = configureStore();

const NewInvoiceButton = ({ minimized, customButton }) => (
  <Provider store={store}>
    <CreateInvoiceModal
      minimized={minimized}
      customButton={customButton}
    />
  </Provider>
);

NewInvoiceButton.propTypes = {
  minimized: React.PropTypes.bool.isRequired,
  customButton: React.PropTypes.element,
};

export default NewInvoiceButton;
