import '!style!css!sass!./email.scss';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { isAccountConfirmed, getAccountEmail } from '../../../../reducers/account';
import {
  getEmailVerifyProgress,
  getEmailVerifySuccess,
  getEmailVerifyError,
} from '../../../reducers/my_profile/selectors';
import { resendEmailVerification } from '../../../actions/my_profile';

import Pill from '../../../../shared/components/pill';
import Button from '../../../../shared/components/button';
import Loading from '../../../../shared/components/loading';

export const Email = ({
  isConfirmed,
  accountEmail,
  resendEmailVerification,
  verifying,
  success,
  error,
}) => (
  <div className="a-my-profile__verify-email">
    <div className="m-r-md">
      <h4>Email</h4>
      <p>
        We have sent you an email, in which you must click “Verify Email” to complete this step.
      </p>
      { success &&
        <p className="alert alert-success a-my-profile__alert">Email has been resent to {accountEmail}</p>
      }
      { error &&
        <p className="alert alert-warning a-my-profile__alert">
          An error has been encountered while sending email to {accountEmail}.
          Please contact support.
        </p>
      }
    </div>
    <div>
      { isConfirmed ?
        <Pill>Done</Pill> :
        <Button
          className="a-my-profile__button text-uppercase"
          onClick={() => resendEmailVerification(accountEmail)}
          disabled={verifying}
        >
          { verifying ? <Loading /> : 'Resend' }
        </Button>
      }
    </div>
  </div>
);

Email.propTypes = {
  isConfirmed: PropTypes.bool.isRequired,
  accountEmail: PropTypes.string.isRequired,
  resendEmailVerification: PropTypes.func.isRequired,
  verifying: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
};

export default connect(
  state => ({
    isConfirmed: isAccountConfirmed(state),
    accountEmail: getAccountEmail(state),
    verifying: getEmailVerifyProgress(state),
    success: getEmailVerifySuccess(state),
    error: getEmailVerifyError(state),
  }),
  dispatch => bindActionCreators({ resendEmailVerification }, dispatch),
)(Email);
