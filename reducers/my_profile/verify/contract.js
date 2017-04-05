import {
  MY_PROFILE_SIGN_CONTRACT_START,
  MY_PROFILE_SIGN_CONTRACT_SUCCESS,
  MY_PROFILE_SIGN_CONTRACT_CANCEL,
} from '../../../actions/my_profile';

export const INITIAL_STATE = {
  signing: false,
  success: false,
};

export default function signContractReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case MY_PROFILE_SIGN_CONTRACT_START:
      return {
        ...INITIAL_STATE,
        signing: true,
      };
    case MY_PROFILE_SIGN_CONTRACT_SUCCESS:
      return {
        ...INITIAL_STATE,
        success: true,
      };
    case MY_PROFILE_SIGN_CONTRACT_CANCEL:
      return INITIAL_STATE;
    default:
      return state;
  }
}
