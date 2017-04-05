import React from 'react';

import I18nWithScope from '../../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('components.responsio.loading_messages');
const t = i18nWithScope.t.bind(i18nWithScope);

const LoadingMessages = () => (
  <div className="invoice-chat__loading">
    <div className="p-lg text-center">
      <h2 className="color-solitude-light gutter-1x">
        <i className="fa fa-spinner fa-pulse fa-2x fa-fw" />
      </h2>
      <h3>
        {t('loading_label')}
      </h3>
    </div>
  </div>
);

export default LoadingMessages;
