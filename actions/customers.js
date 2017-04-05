/* global CONFIG */
import backendApi from '../../models/backend_api';

export const CUSTOMERS_LOAD_START = 'CUSTOMERS_LOAD_START';
export const CUSTOMERS_LOAD_SUCCESS = 'CUSTOMERS_LOAD_SUCCESS';
export const CUSTOMERS_LOAD_ERROR = 'CUSTOMERS_LOAD_ERROR';
export const CUSTOMERS_ADD_CUSTOMER = 'CUSTOMERS_ADD_CUSTOMER';

export function loadStart() {
  return { type: CUSTOMERS_LOAD_START };
}

export function loadSuccess(data = {}) {
  return {
    type: CUSTOMERS_LOAD_SUCCESS,
    data,
  };
}

export function loadError(error) {
  return {
    type: CUSTOMERS_LOAD_ERROR,
    error,
  };
}

export function loadCustomers() {
  const accountId = CONFIG.currentAccount.id;
  return (dispatch) => {
    dispatch(loadStart());

    return backendApi.getCustomers(accountId)
      .then((response) => {
        dispatch(loadSuccess(response.customers));
      }).catch((error) => {
        dispatch(loadError(error));
      });
  };
}

export function addCustomer(customer) {
  return {
    type: CUSTOMERS_ADD_CUSTOMER,
    customer,
  };
}

export function createCustomer(data) {
  const accountId = CONFIG.currentAccount.id;
  return (dispatch) => (
    backendApi.createCustomer(accountId, data)
      .then((response) => {
        dispatch(addCustomer(response.customer));
      })
  );
}
