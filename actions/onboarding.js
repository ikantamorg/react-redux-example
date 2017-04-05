import ck from 'camelcase-keys';
import get from 'lodash/get';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import * as actions from './index';
import { setAccount } from '../../actions/account';
import backendApi from '../../models/backend_api';

export function receiveStart() {
  return {
    type: actions.ONBOARDING_CREATE_SELLER_START,
  };
}

export function receive() {
  return { type: actions.ONBOARDING_CREATE_SELLER_SUCCESS };
}

export function receiveDetails(data) {
  return {
    type: actions.ONBOARDING_SELLER_SET_DETAILS_SUCCESS,
    data,
  };
}

const errorsAsKeyVal = errors =>
  reduce(errors,
    (res, error, key) => {
      res[key] = error[0]; //eslint-disable-line
      return res;
    }, {}
  );

export function createSeller(data) {
  return dispatch => {
    dispatch(receiveStart());

    return new Promise((resolve, reject) =>
      backendApi.createSeller(data)
        .then(result => {
          dispatch(receive());
          dispatch(setAccount(result));
          resolve(result);
        })
        .catch(error => {
          const errors = errorsAsKeyVal(
            get(error, 'responseJSON.errors', {})
          );

          reject(errors);
        })
    );
  };
}

const detailsToBackend = (details) => ({
  ...details,
  howDidYouHearAboutUs: details.howDidYouHearAboutUs.value,
  howDidYouHearAboutUsCustom: get(details, 'howDidYouHearAboutUsCustom', null),
  whenDoYouNeedFinancing: details.whenDoYouNeedFinancing.value,
  yourCustomersAre: map(details.yourCustomersAre, 'value'),
});

export function setDetails(account, details) {
  return dispatch =>
    new Promise((resolve, reject) =>
      backendApi.updateSellerSurvey(account, detailsToBackend(details))
        .then(({ signupSurvey }) => {
          dispatch(receiveDetails({
            ...details,
            id: signupSurvey.id,
          }));
          resolve(details);
        })
        .catch(error => {
          const errors = errorsAsKeyVal(
            get(error, 'responseJSON.errors', {})
          );

          reject(ck(errors));
        })
      );
}
