export const getEmailVerifyProgress = (state) => state.seller.myProfile.verify.email.verifying;
export const getEmailVerifySuccess = (state) => state.seller.myProfile.verify.email.success;
export const getEmailVerifyError = (state) => state.seller.myProfile.verify.email.error;

export const isSigningContract = (state) => state.seller.myProfile.verify.contract.signing;
