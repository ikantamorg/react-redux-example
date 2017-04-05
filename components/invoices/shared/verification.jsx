import React, { PropTypes } from 'react';

import I18nWithScope from '../../../../models/i18n_with_scope';
import DocumentUploader from '../../../../shared/components/document_uploader/document_uploader';
import VerificationSelect from './verification_select';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

const Verification = ({ invoice, onChange }) => (
  <div>
    <div className="a-clear-invoice__sublabel-text m-b-sm">
      {t('clear_invoice_modal.invoice_verification')}
    </div>
    <div className="a-clear-invoice__label-text">
      {t('clear_invoice_modal.upload_documentation')}
    </div>

    <VerificationSelect
      value={invoice.verificationType}
      onChange={onChange}
      inputId="invoice-verification-type-uid-id"
    />

    <DocumentUploader
      documentableType="Invoice"
      maxDocuments={3}
    />

  </div>
);

Verification.propTypes = {
  onChange: PropTypes.func,
  invoice: PropTypes.object.isRequired,
};

export default Verification;
