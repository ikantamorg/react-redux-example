import * as actions from '../actions/customers';

export const initialState = {
  isLoading: true,
  errors: [],
  data: [],
};

export default function customersReducer(state = initialState, action) {
  switch (action.type) {
    case actions.CUSTOMERS_LOAD_START:
      return {
        ...state,
        isLoading: true,
      };
    case actions.CUSTOMERS_LOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: [],
        data: action.data,
      };
    case actions.CUSTOMERS_LOAD_ERROR:
      return {
        ...state,
        isLoading: false,
        errors: action.error,
      };
    case actions.CUSTOMERS_ADD_CUSTOMER:
      return {
        ...state,
        data: [...state.data, action.customer],
      };
    default:
      return state;
  }
}

export function getCustomers(state) {
  return state.seller.customers.data;
}
