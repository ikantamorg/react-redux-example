import delay from 'lodash/delay';
import backendApi from '../../models/backend_api';

import { setContractSigned } from '../../actions/account';

const DELAY_CLOSING_HS_MODAL = 2000;

export const MY_PROFILE_SEND_EMAIL_VERIFICATION_START = 'MY_PROFILE_SEND_EMAIL_VERIFICATION_START';
export const MY_PROFILE_SEND_EMAIL_VERIFICATION_SUCCESS = 'MY_PROFILE_SEND_EMAIL_VERIFICATION_SUCCESS';
export const MY_PROFILE_SEND_EMAIL_VERIFICATION_ERROR = 'MY_PROFILE_SEND_EMAIL_VERIFICATION_ERROR';

export function loadStart() {
  return { type: MY_PROFILE_SEND_EMAIL_VERIFICATION_START };
}

export function loadSuccess() {
  return { type: MY_PROFILE_SEND_EMAIL_VERIFICATION_SUCCESS };
}

export function loadError() {
  return { type: MY_PROFILE_SEND_EMAIL_VERIFICATION_ERROR };
}

export function resendEmailVerification(accountEmail) {
  return dispatch => {
    dispatch(loadStart());

    return backendApi.resendAccountVerificationEmail(accountEmail)
      .then(() => dispatch(loadSuccess()))
      .catch(() => dispatch(loadError()));
  };
}

export const MY_PROFILE_SIGN_CONTRACT_START = 'MY_PROFILE_SIGN_CONTRACT_START';
export const MY_PROFILE_SIGN_CONTRACT_SUCCESS = 'MY_PROFILE_SIGN_CONTRACT_SUCCESS';
export const MY_PROFILE_SIGN_CONTRACT_CANCEL = 'MY_PROFILE_SIGN_CONTRACT_CANCEL';

export function signContractStart() {
  return { type: MY_PROFILE_SIGN_CONTRACT_START };
}

export function signContractSuccess() {
  return { type: MY_PROFILE_SIGN_CONTRACT_SUCCESS };
}

export function signContractCancel() {
  return { type: MY_PROFILE_SIGN_CONTRACT_CANCEL };
}

export function startSignProcedure() {
  return dispatch => dispatch(signContractStart());
}

export function cancelSignProcedure() {
  return dispatch => dispatch(signContractCancel());
}

export function signContract(closeAfter = DELAY_CLOSING_HS_MODAL) {
  return dispatch =>
    backendApi.signHellosignContract()
      .then(() => {
        dispatch(setContractSigned());
        delay(() => dispatch(signContractSuccess()), closeAfter);
      });
}
