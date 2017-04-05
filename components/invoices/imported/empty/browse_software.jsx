import '!style!css!sass!./browse_software.scss';

import capitalize from 'lodash/capitalize';
import React, { PropTypes } from 'react';
import { Alert } from 'react-bootstrap';

import I18nWithScope from '../../../../../models/i18n_with_scope';
import backendApi from '../../../../../models/backend_api';
import { OAUTH_TYPES } from '../../../../../constants/account';

import Header from '../../shared/header';
import Item from './browse_software_item';

const i18nWithScope = new I18nWithScope('components.invoices.imported.browse_software');
const t = i18nWithScope.t.bind(i18nWithScope);

export default class BrowseSoftware extends React.Component {
  static propTypes = {
    currentSeller: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      preferredOAuth: props.currentSeller.preferred_oauth,
    };
  }

  getItems() {
    const { currentSeller } = this.props;

    return [
      {
        title: t('bexio.title'),
        description: t('bexio.description'),
        enabled: true,
        logoClassName: 'a-software-box__item-logo--bexio',
        onClick: () => {
          backendApi.setSellerPreferredOauth(currentSeller.id, OAUTH_TYPES.BEXIO)
            .then(() => this.setState({ preferredOAuth: OAUTH_TYPES.BEXIO }));
        },
        selected: this.isItemSelected(OAUTH_TYPES.BEXIO),
      },
      {
        title: t('sage.title'),
        description: t('sage.description'),
        logoClassName: 'a-software-box__item-logo--sage',
        selected: this.isItemSelected(OAUTH_TYPES.SAGE),
      },
      {
        title: t('run_my_accounts.title'),
        description: t('run_my_accounts.description'),
        logoClassName: 'a-software-box__item-logo--rma',
        selected: this.isItemSelected(OAUTH_TYPES.RUN_MY_ACCOUNTS),
      },
    ];
  }

  isItemSelected(oAuth) {
    return this.state.preferredOAuth === oAuth;
  }

  render() {
    const { preferredOAuth } = this.state;

    return (
      <div className="a-imported-software">
        <Header title={t('title')} />
        <p className="a-imported-software__desc">
          {t('description')}
        </p>

        { preferredOAuth &&
          <Alert bsStyle="success" className="m-t-md">
            {t('selected_description', { preferred_oauth: capitalize(preferredOAuth) })}
          </Alert>
        }

        <div className="a-software-box">
          {this.getItems().map((item, index) => (
            <Item
              key={index}
              {...item}
            />
          ))}
        </div>
      </div>
    );
  }
}
