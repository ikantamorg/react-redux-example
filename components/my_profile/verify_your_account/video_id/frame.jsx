import '!style!css!sass!./frame.scss';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getConfig } from '../../../../../models/config';
import { seller } from '../../../../../models/router';
import { isVerifiedByIdNow, isTransactionValid } from '../../../../../reducers/account';

const IDNOW_FRAME = getConfig('idnow_frame');

export class IDNowFrame extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    isVerified: PropTypes.bool.isRequired,
    isTransactionValid: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired,
  }

  componentWillMount() {
    const { router, isVerified, isTransactionValid } = this.props;

    if (isVerified || !isTransactionValid) {
      router.push(seller.myProfile.verifyYourAccount.index);
    }
  }

  render() {
    const { params: { transactionId } } = this.props;
    const URL = `${IDNOW_FRAME}${transactionId}`;

    return (
      <div className="a-iframe__wrapper">
        <iframe
          src={URL}
          width="100%"
          height="800"
          className="a-iframe"
        />
      </div>
    );
  }
}

export default withRouter(
  connect(
    (state, ownProps) => ({
      isVerified: isVerifiedByIdNow(state),
      isTransactionValid: isTransactionValid(state, ownProps.params.transactionId),
    })
  )(IDNowFrame)
);
