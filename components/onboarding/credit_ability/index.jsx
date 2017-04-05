import '!style!css!sass!./index.scss';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Ibox from '../../../../shared/components/ibox';

import Verified from './verified';
import Verifying from './verifying';
import Declined from './declined';
import Error from './error';

import { getAccount } from '../../../../reducers/account';
import { getDetails } from '../../../reducers/onboarding';
import backendApi from '../../../../models/backend_api';
import { seller } from '../../../../models/router';
import Location from '../../../../models/location';

const INITIAL_STATE = {
  isVerifying: false,
  isVerified: false,
  isError: false,
  creditLimit: 0,
};

// const ENABLED = 'enabled';
const FAKE_VERIFY_TIMEOUT = 2500;
const INDIVIDUALS = 'individuals';

const goToConfirmEmail = () =>
  Location.visit(seller.onboarding.legacy.confirmEmail);

class SellerSignupCreditAbility extends React.Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    details: PropTypes.object.isRequired,
  }

  state = {
    ...INITIAL_STATE,
    isVerifying: true,
  }

  componentWillMount() {
    const { account, details: { yourCustomersAre } } = this.props;
    const individualsCustomersOnly = yourCustomersAre.indexOf(INDIVIDUALS) >= 0;

    if (yourCustomersAre.length === 1 && individualsCustomersOnly) {
      setTimeout(() => {
        // this.setState({
        //   ...INITIAL_STATE,
        //   isVerified: false,
        // });
        goToConfirmEmail();
      }, FAKE_VERIFY_TIMEOUT);

      return;
    }

    backendApi.getSellerCreditAssessment(account)
      .then(result => { // eslint-disable-line
        // const { creditLimit, enableRecomendation } = result;

        // this.setState({
        //   ...INITIAL_STATE,
        //   isVerified: enableRecomendation === ENABLED,
        //   creditLimit,
        // });
        goToConfirmEmail();
      })
      .catch(() => {
        // this.setState({
        //   ...INITIAL_STATE,
        //   isError: true,
        // });

        goToConfirmEmail();
      });
  }

  renderContents() {
    const { isVerifying, isVerified, isError, creditLimit } = this.state;

    if (isError) {
      return (<Error />);
    }

    if (isVerifying) {
      return (<Verifying />);
    }

    if (isVerified) {
      return (<Verified creditLimit={creditLimit} />);
    }

    return (<Declined />);
  }

  render() {
    return (
      <Ibox className="a-seller-signup__credit">
        { this.renderContents() }
      </Ibox>
    );
  }
}

export default connect(
  state => ({
    account: getAccount(state),
    details: getDetails(state),
  })
)(SellerSignupCreditAbility);
