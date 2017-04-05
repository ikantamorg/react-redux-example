/* global CONFIG */
import moment from 'moment';
import min from 'lodash/min';

import { getConfig } from '../../../models/config';
import invoiceContractType from '../../../constants/invoice_contract_type';
import * as actions from '../../actions/invoices/new';
import { addDays } from '../../../helpers/date';

const DEFAULT_DAYS_ON_PLATFORM = 4;

export const initialState = {
  isLoading: false,
  errors: [],
  extendedModal: false,
  currentStep: 1,
  invoice: {
    amount: '',
    prefinancingAmount: '',
    verificationType: '',
    number: '',
    dueDate: null,
    repaymentDate: null,
    customer: {
      id: '',
      firmName: '',
    },
    file: '',
    visibleOnPlatformUntil: addDays(new Date(), DEFAULT_DAYS_ON_PLATFORM),
    contractType: invoiceContractType.PREFINANCING,
    advanonFee: CONFIG.currentAccount ? CONFIG.currentAccount.advanonFee : 0,
    promoCodeId: '',
    pricesMap: {
      advancement: 0,
      advanonFee: 0,
      fees: 0,
      investmentAsPartOfAmount: 0,
      investorFee: 0,
      isVerificationDocsNeeded: true,
      recommendedPrice: 0,
      selectedPrice: undefined,
      repayment: 0,
    },
  },
  promoCodes: CONFIG.currentAccount ? CONFIG.currentAccount.promoCodes : [],
};

export default function newInvoiceReducer(state = initialState, action) {
  switch (action.type) {
    case actions.NEXT_STEP:
      // If we have a true sale financing and we are on step 3 we need to display HelloSign
      if (state.currentStep === 3) {
        if (state.invoice.contractType === 'true_sale') {
          return {
            ...state,
            currentStep: 4,
            extendedModal: false,
          };
        }
        return {
          ...state,
          currentStep: 5,
          extendedModal: false,
        };
      }

      return {
        ...state,
        currentStep: state.currentStep + 1,
        extendedModal: false,
      };
    case actions.PREVIOUS_STEP:
      return {
        ...state,
        currentStep: state.currentStep - 1,
        extendedModal: false,
      };
    case actions.UPDATE_INVOICE_VALUES: {
      const dueDate = moment(action.values.dueDate, 'DD-MM-YYYY').toDate();
      const repaymentDate = action.values.repaymentDate ?
        moment(action.values.repaymentDate, 'DD-MM-YYYY').toDate() : dueDate;
      const prefinancingAmount = action.values.prefinancingAmount
        || min([
          state.invoice.pricesMap.advancement,
          Number.parseFloat(getConfig('currentAccount.seller.remainingCreditLimit')),
        ]);
      return {
        ...state,
        invoice: {
          verificationType: state.invoice.verificationType,
          pricesMap: state.invoice.pricesMap,
          visibleOnPlatformUntil: state.invoice.visibleOnPlatformUntil,
          contractType: state.invoice.contractType,
          promoCodeId: state.invoice.promoCodeId,
          ...action.values,
          dueDate,
          repaymentDate,
          prefinancingAmount,
          advanonFee: CONFIG.currentAccount.advanonFee,
        },
      };
    }
    case actions.UPDATE_PRICES_MAP:
      return {
        ...state,
        invoice: {
          ...state.invoice,
          prefinancingAmount: state.invoice.prefinancingAmount || min([
            state.invoice.pricesMap.advancement,
            Number.parseFloat(getConfig('currentAccount.seller.remainingCreditLimit')),
          ]),
          pricesMap: action.pricesMap,
        },
      };
    case actions.UPDATE_VISIBLE_ON_PLATFORM_UNTIL:
      return {
        ...state,
        invoice: {
          ...state.invoice,
          visibleOnPlatformUntil: addDays(new Date(), action.daysFromToday),
        },
      };
    case actions.UPDATE_CONTRACT_TYPE:
      return {
        ...state,
        invoice: {
          ...state.invoice,
          contractType: action.contractType,
        },
      };
    case actions.NEW_INVOICE_LOAD_START:
      return {
        ...state,
        isLoading: true,
      };
    case actions.NEW_INVOICE_LOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: [],
      };
    case actions.NEW_INVOICE_LOAD_ERROR:
      return {
        ...state,
        isLoading: false,
        errors: action.error,
      };
    case actions.TOGGLE_EXTENDED_MODAL:
      return {
        ...state,
        extendedModal: !state.extendedModal,
      };
    default:
      return state;
  }
}

export function getInvoice(state) {
  return state.seller.newInvoice.invoice;
}

export function isModalExtended(state) {
  return state.seller.newInvoice.extendedModal;
}

export function getCurrentStep(state) {
  return state.seller.newInvoice.currentStep;
}

export function getPromoCodes(state) {
  return state.seller.newInvoice.promoCodes;
}
