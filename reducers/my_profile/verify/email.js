import {
  MY_PROFILE_SEND_EMAIL_VERIFICATION_START,
  MY_PROFILE_SEND_EMAIL_VERIFICATION_SUCCESS,
  MY_PROFILE_SEND_EMAIL_VERIFICATION_ERROR,
} from '../../../actions/my_profile';

export const INITIAL_STATE = {
  verifying: false,
  error: false,
  success: false,
};

export default function veryEmailReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case MY_PROFILE_SEND_EMAIL_VERIFICATION_START:
      return {
        ...INITIAL_STATE,
        verifying: true,
      };
    case MY_PROFILE_SEND_EMAIL_VERIFICATION_SUCCESS:
      return {
        ...INITIAL_STATE,
        success: true,
      };
    case MY_PROFILE_SEND_EMAIL_VERIFICATION_ERROR:
      return {
        ...INITIAL_STATE,
        error: true,
      };
    default:
      return state;
  }
}
