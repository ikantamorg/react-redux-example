import React from 'react';

import I18nWithScope from '../../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('components.responsio.no_messages');
const t = i18nWithScope.t.bind(i18nWithScope);

const NoMessages = () => (
  <div className="invoice-chat__no-messages">
    <div className="p-lg text-center">
      <h2 className="color-solitude-light gutter-1x">
        <i className="fa fa-2x fa-inbox" />
      </h2>
      <h3>
        {t('no_messages_label')}
      </h3>
    </div>
  </div>
);

export default NoMessages;
