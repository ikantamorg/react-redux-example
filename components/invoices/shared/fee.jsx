import '!style!css!sass!./fee.scss';

import React from 'react';
import InputRange from 'react-input-range';

import I18nWithScope from '../../../../models/i18n_with_scope';
import { formatDate } from '../../../../utils';
import buildDayButtonClasses from './build_day_button_classes';
import invoicePricesCalculations from '../../../../models/invoice_prices_calculations';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

const Fee = ({ invoice, back, onChangeRecommendedFee, onChangeDaysNumber }) => {
  const MIN_POSSIBLE_FEE_PERCENTAGE = invoicePricesCalculations.minimalPossibleFee(
    invoice.advanonFee
  );
  const MAX_POSSIBLE_FEE_PERCENTAGE = invoicePricesCalculations.maximalPossibleFee(
    invoice.pricesMap.recommendedPrice,
    invoice.advanonFee,
  );
  const feeValue = Number(parseFloat(
    invoice.pricesMap.selectedPrice || invoice.pricesMap.recommendedPrice
  ).toFixed(2));
  const recommendedPrice = parseFloat(invoice.pricesMap.recommendedPrice);

  const onFeeChange = (event) => {
    let feePercentage = event.target.value || MIN_POSSIBLE_FEE_PERCENTAGE;

    if (feePercentage < MIN_POSSIBLE_FEE_PERCENTAGE) {
      feePercentage = MIN_POSSIBLE_FEE_PERCENTAGE;
    } else if (feePercentage > MAX_POSSIBLE_FEE_PERCENTAGE) {
      feePercentage = MAX_POSSIBLE_FEE_PERCENTAGE;
    }

    onChangeRecommendedFee(feePercentage, invoice.promoCodeId);
  };

  const daysButton = (days) => (
    <button
      className={buildDayButtonClasses(days, invoice.visibleOnPlatformUntil)}
      onClick={() => onChangeDaysNumber(days)}
    >
      <span>{days} {t('general.days')}</span>
    </button>
  );

  const selectedFeeDescription = () => {
    if (feeValue > recommendedPrice) {
      return (
        <p className="a-clear-invoice-fee__high-fee-text">
          {t('clear_invoice_modal.high_fee_selected') }
        </p>
      );
    }
    if (feeValue < recommendedPrice) {
      return (
        <p className="a-clear-invoice-fee__low-fee-text">
          {t('clear_invoice_modal.low_fee_selected') }
        </p>
      );
    }
    return (
      <p className="a-clear-invoice-fee__recommended-fee-text">
        {t('clear_invoice_modal.recommended_fee_selected') }
      </p>
    );
  };

  return (
    <div className="a-clear-invoice">
      <div className="m-b">
        <button
          className="btn btn-link a-clear-invoice__back"
          onClick={back}
        >
          {t('clear_invoice_modal.back')}
        </button>
      </div>
      <h2 className="a-clear-invoice-header__title m-b-lg">
        {t('invoices.new_invoice.offering')}
      </h2>
      <div className="a-clear-invoice-fee">
        <div className="a-clear-invoice__label-text">
          {t('clear_invoice_modal.fee_you_are_willing_to_pay')}
        </div>
        <div className="a-fee__slider-input m-t m-b-lg">
          <InputRange
            step={0.01}
            maxValue={MAX_POSSIBLE_FEE_PERCENTAGE}
            minValue={MIN_POSSIBLE_FEE_PERCENTAGE}
            value={feeValue}
            onChange={value => onChangeRecommendedFee(value, invoice.promoCodeId)}
          />
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-5 m-b">
            <label htmlFor="fee_percentage" className="a-clear-invoice__label-text text-center">
              {t('clear_invoice_modal.fee')}
            </label>
            <div className="input-group">
              <input
                type="number"
                id="fee_percentage"
                className="form-control a-clear-invoice-fee__fee-input"
                step="0.01"
                value={feeValue.toFixed(2)}
                onChange={event => onChangeRecommendedFee(event.target.value, invoice.promoCodeId)}
                onBlur={onFeeChange}
              />
              <span className="input-group-addon a-clear-invoice-fee__fee-input-icon">%</span>
            </div>
            {feeValue === recommendedPrice &&
              <h4 className="text-uppercase a-clear-invoice-fee__recommended-fee-text">
                {t('clear_invoice_modal.recommended_price')}
              </h4>
            }
          </div>
          <div className="col-xs-12 col-sm-5 col-sm-offset-1">
            <label htmlFor="amount" className="a-clear-invoice__label-text text-center">
              {t('activerecord.attributes.invoice.amount')}
            </label>
            <div className="input-group">
              <input
                id="amount"
                className="form-control a-clear-invoice-fee__fee-input"
                value={Number.parseFloat(invoice.pricesMap.fees).toFixed(2)}
                readOnly="true"
              />
              <span
                className={'input-group-addon a-clear-invoice-fee__disabled-amount \n' +
                  'a-clear-invoice-fee__fee-input-icon'}
              >
                CHF
              </span>
            </div>
          </div>
        </div>
        <div className="m-b">
          {selectedFeeDescription()}
          <p>
            {t('clear_invoice_modal.recommended_fee_description_1')}
            <b>&nbsp;{recommendedPrice.toFixed(2)}&nbsp;</b>
            {t('clear_invoice_modal.recommended_fee_description_2')}
          </p>
        </div>
        <div className="a-clear-invoice__label-text m-t-xl">
          {t('invoices.new_invoice.finish_date_label')}
        </div>
        <div className="a-clear-invoice-fee__days-buttons text-center m-b">
          {daysButton(2)}
          {daysButton(3)}
          {daysButton(4)}
          {daysButton(5)}
        </div>
        <p>
          {t('invoices.new_invoice.finish_date_hint_start')}
          <b>&nbsp;{formatDate(invoice.visibleOnPlatformUntil)}</b>.&nbsp;
          {t('invoices.new_invoice.finish_date_hint_end')}
        </p>
      </div>
      <button
        className="btn btn-primary a-clear-invoice__confirm"
        onClick={back}
      >
        {t('clear_invoice_modal.done')}
      </button>
    </div>
  );
};

Fee.propTypes = {
  invoice: React.PropTypes.object.isRequired,
  onChangeRecommendedFee: React.PropTypes.func.isRequired,
  onChangeDaysNumber: React.PropTypes.func.isRequired,
  back: React.PropTypes.func.isRequired,
};

export default Fee;
