import '!style!css!sass!./contract.scss';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getConfig } from '../../../../models/config';

import { startSignProcedure, cancelSignProcedure, signContract } from '../../../actions/my_profile';
import { isContractSigned } from '../../../../reducers/account';
import { isSigningContract } from '../../../reducers/my_profile/selectors';

import Pill from '../../../../shared/components/pill';
import Loading from '../../../../shared/components/loading';
import Button from '../../../../shared/components/button';
import HellosignContract from '../../../../shared/components/hellosign_contract';

const HELLO_SIGN_CLIENT_ID = getConfig('hellosignClientId');
const LOCALE = getConfig('locale');

export const Contract = ({
  isSigned,
  isSigning,
  startSignProcedure,
  cancelSignProcedure,
  sign,
}) => (
  <div className="a-my-profile__verify-contract">
    <div className="m-r-md">
      <h4>Contract</h4>
      <p>
        Please sign the contract via HelloSign.
        You can directly sign the contract via your mouse or trackpad.
      </p>
    </div>
    <div>
      { isSigned ?
        <Pill>Done</Pill> :
        <Button
          className="a-my-profile__button text-uppercase"
          onClick={startSignProcedure}
          disabled={isSigning}
        >
          { isSigning ? <Loading /> : 'Sign' }
        </Button>
      }
      { isSigning &&
        <HellosignContract
          language={LOCALE}
          clientId={HELLO_SIGN_CLIENT_ID}
          onSign={sign}
          onCancel={cancelSignProcedure}
        />
      }
    </div>
  </div>
);

Contract.propTypes = {
  isSigned: PropTypes.bool.isRequired,
  isSigning: PropTypes.bool.isRequired,
  startSignProcedure: PropTypes.func.isRequired,
  cancelSignProcedure: PropTypes.func.isRequired,
  sign: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    isSigned: isContractSigned(state),
    isSigning: isSigningContract(state),
  }),
  dispatch => bindActionCreators({
    startSignProcedure,
    cancelSignProcedure,
    sign: signContract,
  }, dispatch),
)(Contract);
