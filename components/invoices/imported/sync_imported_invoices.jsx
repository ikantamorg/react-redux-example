import React from 'react';

import backendApi from '../../../../models/backend_api';
import I18nWithScope from '../../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('components.invoices.imported.sync_imported_invoices');
const t = i18nWithScope.t.bind(i18nWithScope);

const SyncImportedInvoices = ({
  currentSellerId,
  onClick,
  beforeImport,
  buttonContent,
  buttonClassName,
}) => {
  let content = buttonContent;
  const syncImportedInvoices = () => {
    if (beforeImport) {
      beforeImport();
    }
    backendApi.updateImportedInvoices(currentSellerId)
      .then(onClick);
  };
  if (!content) {
    content = (
      <span>
        <i className="fa fa-refresh a-sync-imported-invoices__icon" aria-hidden="true" />
        <strong className="m-l-xs">{t('sync_now')}</strong>
      </span>
    );
  }

  return (
    <div className="a-sync-imported-invoices">
      <button
        onClick={syncImportedInvoices}
        className={buttonClassName}
      >
        {content}
      </button>
    </div>
  );
};

SyncImportedInvoices.propTypes = {
  currentSellerId: React.PropTypes.number.isRequired,
  onClick: React.PropTypes.func.isRequired,
  beforeImport: React.PropTypes.func,
  buttonContent: React.PropTypes.object,
  buttonClassName: React.PropTypes.string,
};
SyncImportedInvoices.defaultProps = {
  buttonClassName: 'btn btn-link a-sync-imported-invoices__btn',
};

export default SyncImportedInvoices;
