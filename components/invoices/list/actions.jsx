import '!style!css!sass!./actions.scss';

import classnames from 'classnames';
import map from 'lodash/map';

import React, { PropTypes } from 'react';
import { ButtonGroup, Button, DropdownButton, MenuItem } from 'react-bootstrap';

import I18nWithScope from '../../../../models/i18n_with_scope';
import Location from '../../../../models/location';
import router from '../../../../models/router';
import { STATUSES } from '../../../../constants/invoice_status';

const i18nWithScope = new I18nWithScope('invoices.overview.open_invoices');
const t = i18nWithScope.t.bind(i18nWithScope);

export const getDocuments = ({ financedWithTransactionsPaid, status, pdfUrl, receiptPdfUrl }) => {
  const createDocument = (action, path) => ({ action, path });
  const documents = [];

  if (financedWithTransactionsPaid || status === STATUSES.IN_REVIEW) {
    documents.push(createDocument('PDF', pdfUrl));
  }

  if ((status === STATUSES.FINANCED || status === STATUSES.CLOSED) && receiptPdfUrl) {
    documents.push(createDocument(t('receipt'), receiptPdfUrl));
  }

  return documents;
};

export const ActionButton = ({ children, path, primary, ...rest }) => {
  const onClick = () => Location.visit(path);
  const className = classnames('btn btn-sm invoices-table-actions__btn', {
    'btn-primary a-border-left-denim a-buttons-separator': primary === true,
  });

  return (
    <Button onClick={onClick} {...rest} className={className}>
      {children}
    </Button>
  );
};

ActionButton.propTypes = {
  children: PropTypes.any,
  path: PropTypes.string,
  primary: PropTypes.bool,
};

export const ActionsComponent = ({ invoice }) => {
  const documents = getDocuments(invoice);
  let button;

  if (invoice.financedWithTransactionsPaid) {
    button = (
      <ActionButton
        primary
        path={router.checkoutSellerInvoicePath(invoice.id)}
      >
        {t('repay')}
      </ActionButton>
    );
  } else if (invoice.status === STATUSES.IN_REVIEW) {
    button = (
      <ActionButton path={router.editSellerInvoicePath(invoice.id)}>
        {t('edit')}
      </ActionButton>
    );
  } else {
    button = (
      <ActionButton path={invoice.pdfUrl}>PDF</ActionButton>
    );
  }

  return (
    <ButtonGroup className="invoices-table-actions">
      {button}
      <DropdownButton
        title=" "
        id={`dropdown-${invoice.id}`}
        disabled={!documents.length}
        className={classnames('btn btn-sm', {
          'btn-primary a-border-left-denim': invoice.financedWithTransactionsPaid,
        })}
      >
        {
          map(documents, (doc, index) => {
            const onSelect = () => Location.visit(doc.path);
            return (
              <MenuItem
                key={index}
                eventKey={index}
                onSelect={onSelect}
              >
                {doc.action}
              </MenuItem>
            );
          })
        }
      </DropdownButton>
    </ButtonGroup>
  );
};

ActionsComponent.propTypes = {
  invoice: PropTypes.object,
};

export default ActionsComponent;
