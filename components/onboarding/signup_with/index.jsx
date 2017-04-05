import '!style!css!sass!./index.scss';

import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';

import { getConfig } from '../../../../models/config';
import { seller } from '../../../../models/router';
import I18nWithScope from '../../../../models/i18n_with_scope';
import { formatMoneyCHF } from '../../../../helpers/number';

import OrDivider from '../../../../shared/components/or_divider';
import BexioButton from './bexio_button';

const i18nWithScope = new I18nWithScope('components.seller_onboarding.sign_up_with');
const t = i18nWithScope.t.bind(i18nWithScope);

const RANDOM_FINANCED_AMOUNTS = [
  12500,
  15300,
  17800,
  18900,
  22150,
  26990,
  33000,
  48500,
  82000,
];

const FINANCED_AMOUNT_INTERVAL = 10000;

export class SignupWith extends React.Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
  }

  constructor() {
    super();

    this.state = {
      amount: this.getRandomFinancedAmount(),
    };
  }

  componentWillMount() {
    // Skip the step-0 for now.
    this.props.router.push(seller.onboarding.signUp);
    // // If Bexio toggle is not active then redirect to step-1 (form)
    // if (!getConfig('features.bexio', false)) {
    //   this.props.router.push(seller.onboarding.signUp);
    //   return;
    // }
    //
    // this.interval = setInterval(() => {
    //   this.setState({
    //     amount: this.getRandomFinancedAmount(),
    //   });
    // }, FINANCED_AMOUNT_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getRandomFinancedAmount() {
    return RANDOM_FINANCED_AMOUNTS[Math.floor(Math.random() * RANDOM_FINANCED_AMOUNTS.length)];
  }

  render() {
    const { router } = this.props;
    const { amount } = this.state;

    return (
      <div className="a-seller-signup-with">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 text-center">
              <h1 className="a-seller-signup-with__heading">
                {t('just_financed', { currencyAmount: formatMoneyCHF(amount) })}
              </h1>
            </div>
          </div>
          <div className="row m-t-xl">
            <div className="col-xs-12 text-center a-seller-signup-with__options-container">
              <div className="a-seller-signup-with__options">
                <button
                  data-email-signup
                  type="button"
                  className="btn btn-primary a-seller-signup-with__btn"
                  onClick={() => router.push(seller.onboarding.signUp)}
                >
                  {t('sign_up_with_email')}
                </button>
                { getConfig('features.bexio', false) &&
                  <div>
                    <OrDivider />
                    <BexioButton />
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SignupWith);
