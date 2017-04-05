import '!style!css!sass!./bexio_button.scss';

import React from 'react';

import router from '../../../../models/router';
import I18nWithScope from '../../../../models/i18n_with_scope';
import BexioLogo from '../../../../../images/onboarding/bexio2.png';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

const BexioButton = () => (
  <a
    className="btn btn-primary a-btn-bexio"
    data-no-turbolink="true"
    href={router.bexioSamlInitPath()}
  >
    {t('devise.sign_up.create_an_account')}&nbsp;&nbsp;
    <img
      height="21"
      src={BexioLogo}
      alt="Bexio"
    />
  </a>
);

export default BexioButton;
