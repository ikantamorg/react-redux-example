import * as actions from '../actions';

const INITIAL_STATE = {
  creatingAccount: false,
  details: null,
};

export default function onboardingReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actions.ONBOARDING_CREATE_SELLER_START:
      return {
        ...state,
        creatingAccount: true,
      };
    case actions.ONBOARDING_CREATE_SELLER_SUCCESS:
      return {
        ...state,
        creatingAccount: false,
      };
    case actions.ONBOARDING_SELLER_SET_DETAILS_SUCCESS:
      return {
        ...state,
        details: action.data,
      };
    default:
      return state;
  }
}

export function getDetails(state) {
  return state.seller.onboarding.details;
}
