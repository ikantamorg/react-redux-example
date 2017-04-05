import React from 'react';
import I18nWithScope from '../../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

const BackButton = ({ onClick }) => (
  <div className="m-b">
    <button
      className="btn btn-link a-clear-invoice__back"
      type="button"
      onClick={onClick}
    >
      {t('clear_invoice_modal.back')}
    </button>
  </div>
);

BackButton.propTypes = {
  onClick: React.PropTypes.func.isRequired,
};

export default BackButton;
