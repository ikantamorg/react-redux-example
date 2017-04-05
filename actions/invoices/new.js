/* global CONFIG */
import backendApi from '../../../models/backend_api';
import invoicePricesCalculations from '../../../models/invoice_prices_calculations';
import { getInvoice, getPromoCodes } from '../../reducers/invoices/new';

export const NEXT_STEP = 'NEXT_STEP';
export const PREVIOUS_STEP = 'PREVIOUS_STEP';
export const UPDATE_INVOICE_VALUES = 'UPDATE_INVOICE_VALUES';
export const UPDATE_PRICES_MAP = 'UPDATE_PRICES_MAP';
export const UPDATE_CONTRACT_TYPE = 'UPDATE_CONTRACT_TYPE';
export const UPDATE_VISIBLE_ON_PLATFORM_UNTIL = 'UPDATE_VISIBLE_ON_PLATFORM_UNTIL';
export const NEW_INVOICE_LOAD_START = 'NEW_INVOICE_LOAD_START';
export const NEW_INVOICE_LOAD_SUCCESS = 'NEW_INVOICE_LOAD_SUCCESS';
export const NEW_INVOICE_LOAD_ERROR = 'NEW_INVOICE_LOAD_ERROR';
export const TOGGLE_EXTENDED_MODAL = 'TOGGLE_EXTENDED_MODAL';

export function nextStep() {
  return { type: NEXT_STEP };
}

export function previousStep() {
  return { type: PREVIOUS_STEP };
}

export function updateInvoiceValues(values) {
  return {
    type: UPDATE_INVOICE_VALUES,
    values,
  };
}

export function updateVisibleOnPlatformUntil(daysFromToday) {
  return {
    type: UPDATE_VISIBLE_ON_PLATFORM_UNTIL,
    daysFromToday,
  };
}

export function updateContractType(contractType) {
  return {
    type: UPDATE_CONTRACT_TYPE,
    contractType,
  };
}

export function updatePricesMap(pricesMap) {
  return {
    type: UPDATE_PRICES_MAP,
    pricesMap,
  };
}

function calculateInvoiceDiscount(invoice, promoCode) {
  return invoicePricesCalculations.discountAmount(
    invoice.pricesMap.advanonFee,
    promoCode ? promoCode.discount : 0,
  );
}

export function updateRepaymentDate(repaymentDate) {
  return (dispatch, getState) => {
    const invoice = getInvoice(getState());

    return backendApi.getInvoiceRecommendedFee({
      ...invoice,
      repaymentDate: repaymentDate.toString(),
    }).then((response) => {
      const promoCodes = getPromoCodes(getState());
      const promoCode = promoCodes.find(promoCode => promoCode.id === invoice.promoCodeId);
      const discount = calculateInvoiceDiscount(invoice, promoCode);

      dispatch(updateInvoiceValues({
        ...invoice,
        repaymentDate,
        pricesMap: {
          ...response.recommendedFees,
          fees: response.recommendedFees.fees - discount,
          repayment: response.recommendedFees.repayment - discount,
          discount,
          investmentAsPartOfAmount: invoice.pricesMap.investmentAsPartOfAmount,
        },
      }));
    });
  };
}

export function updatePrefinancingAmount(prefinancingAmount) {
  return (dispatch, getState) => {
    const invoice = getInvoice(getState());
    const advanonFee = CONFIG.currentAccount.advanonFee;
    const promoCodes = getPromoCodes(getState());
    const promoCode = promoCodes.find(promoCode => promoCode.id === invoice.promoCodeId);

    const newPricesMap = {
      ...invoicePricesCalculations.calculateAll(
        invoice.amount,
        1,
        advanonFee,
        invoice.pricesMap.multiplier * 100,
        prefinancingAmount,
        promoCode ? promoCode.discount : 0,
      ),
      recommendedPrice: invoice.pricesMap.recommendedPrice,
      investmentAsPartOfAmount: invoice.pricesMap.investmentAsPartOfAmount,
    };

    dispatch(updateInvoiceValues({
      ...invoice,
      pricesMap: newPricesMap,
      prefinancingAmount: newPricesMap.advancement,
    }));
  };
}

export function recalculatePricesMap(feePercentage, promoCodeId = null) {
  return (dispatch, getState) => {
    const invoice = getInvoice(getState());
    const advanonFee = CONFIG.currentAccount.advanonFee;
    const promoCodes = getPromoCodes(getState());
    const promoCode = promoCodes.find(promoCode => promoCode.id === promoCodeId);

    const newPricesMap = {
      ...invoicePricesCalculations.calculateAll(
        invoice.amount,
        1,
        advanonFee,
        feePercentage,
        invoice.prefinancingAmount,
        promoCode ? promoCode.discount : 0,
      ),
      recommendedPrice: invoice.pricesMap.recommendedPrice,
      investmentAsPartOfAmount: invoice.pricesMap.investmentAsPartOfAmount,
    };

    dispatch(updatePricesMap(newPricesMap));
  };
}

export function loadStart() {
  return { type: NEW_INVOICE_LOAD_START };
}

export function loadSuccess() {
  return { type: NEW_INVOICE_LOAD_SUCCESS };
}

export function loadError(error) {
  return {
    type: NEW_INVOICE_LOAD_ERROR,
    error,
  };
}

export function fetchPricesMap() {
  return (dispatch, getState) => {
    const invoice = getInvoice(getState());
    dispatch(loadStart());

    return backendApi.getInvoiceRecommendedFee(invoice)
      .then((response) => {
        const pricesMap = response.recommendedFees;

        if (invoice.promoCodeId) {
          const promoCodes = getPromoCodes(getState());
          const promoCode = promoCodes.find(promoCode => promoCode.id === invoice.promoCodeId);
          const discount = calculateInvoiceDiscount(invoice, promoCode);

          pricesMap.fees -= discount;
          pricesMap.repayment -= discount;
          pricesMap.discount = discount;
        }
        dispatch(loadSuccess());
        dispatch(updatePricesMap(pricesMap));
      }).catch((error) => {
        dispatch(loadError(error));
      });
  };
}

export function toggleExtendedModal() {
  return {
    type: TOGGLE_EXTENDED_MODAL,
  };
}

export function usePromoCode(promoCodeId) {
  return (dispatch, getState) => {
    const invoice = getInvoice(getState());

    dispatch(updateInvoiceValues({
      ...invoice,
      promoCodeId,
    }));
    dispatch(recalculatePricesMap(invoice.pricesMap.multiplier * 100, promoCodeId));
  };
}
