import React from 'react';

import invoicePricesCalculations from '../../../../models/invoice_prices_calculations';
import invoiceContractType from '../../../../constants/invoice_contract_type';
import I18nWithScope from '../../../../models/i18n_with_scope';
import { formatMoneyCHF } from '../../../../helpers/number';
import { formatDate } from '../../../../utils';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

const CostOverview = ({ invoice, forReview }) => {
  let extraContent;
  let firstPaymentLabel = t('clear_invoice_modal.you_will_receive');
  let secondPaymentLabel = t('clear_invoice_modal.total_repayment');
  let secondPaymentValue = formatMoneyCHF(invoice.pricesMap.repayment);

  if (forReview) {
    extraContent = (
      <div>
        <span className="a-clear_invoice__important-text">
          {t('clear_invoice_modal.important')}
        </span>
        <span>&nbsp;</span>
        <span
          className={'a-invoice-cost-overview__simple-text ' +
            'a-invoice-cost-overview__simple-text--muted'}
        >
          {t('clear_invoice_modal.once_invoice_financed')}
        </span>
      </div>
    );
  }

  if (invoice.contractType === invoiceContractType.TRUE_SALE) {
    firstPaymentLabel = t('clear_invoice_modal.first_payment');
    secondPaymentLabel = t('clear_invoice_modal.second_payment');
    secondPaymentValue = formatMoneyCHF(invoicePricesCalculations.secondPaymentForTrueSale(
      invoice.amount,
      invoice.pricesMap.advancement,
      invoice.pricesMap.fees
    ));
  }

  return (
    <div>
      <div className="a-clear-invoice__label-text">{t('clear_invoice_modal.cost_overview')}</div>
      <div className="panel panel-default a-invoice-cost-overview">
        <div className="panel-body">
          <div className="m-b">
            <div className="a-invoice-cost-overview__fees">
              <p>{t('clear_invoice_modal.investor_fee')}</p>
              <p>{formatMoneyCHF(invoice.pricesMap.investorFee)}</p>
            </div>
            <div className="a-invoice-cost-overview__fees">
              <p>{t('clear_invoice_modal.advanon_fee')}</p>
              <p>{formatMoneyCHF(invoice.pricesMap.advanonFee)}</p>
            </div>
            {invoice.promoCodeId &&
              <div className="a-invoice-cost-overview__fees a-invoice-cost-overview__discount">
                <p><b>{t('clear_invoice_modal.discount')}</b></p>
                <p><b>- {formatMoneyCHF(invoice.pricesMap.discount)}</b></p>
              </div>
            }
            <div className="a-invoice-cost-overview__fees">
              <p className="a-invoice-cost-overview__emphasized-text">
                {t('clear_invoice_modal.full_fee')}
              </p>
              <p className="a-invoice-cost-overview__emphasized-text pull-right">
                {formatMoneyCHF(invoice.pricesMap.fees)}
              </p>
            </div>
          </div>

          <div className="a-invoice-cost-overview__inner-panel m-b">
            <div className="a-invoice-cost-overview__payment">
              <p
                className={'a-invoice-cost-overview__simple-text ' +
                  'a-invoice-cost-overview__simple-text--white'}
              >
                {firstPaymentLabel}
              </p>
              <p
                className={'a-invoice-cost-overview__emphasized-resp-text ' +
                  'a-invoice-cost-overview__emphasized-resp-text--white'}
              >
                {formatMoneyCHF(invoice.pricesMap.advancement)}
              </p>
              <p
                className="a-invoice-cost-overview__muted-text"
              >
                {t('clear_invoice_modal.before')}: {formatDate(invoice.visibleOnPlatformUntil)}
              </p>
            </div>
            <div className="a-invoice-cost-overview__repayment pull-right">
              <p
                className={'a-invoice-cost-overview__simple-text ' +
                  'a-invoice-cost-overview__simple-text--white ' +
                  'text-right'}
              >
                {secondPaymentLabel}
              </p>
              <p
                className={'a-invoice-cost-overview__emphasized-resp-text ' +
                  'a-invoice-cost-overview__emphasized-resp-text--white ' +
                  'text-right'}
              >
                {secondPaymentValue}
              </p>
              <p
                className="a-invoice-cost-overview__light-muted-text text-right"
              >
                {t('clear_invoice_modal.after')}: {
                  invoice.repaymentDate ? formatDate(invoice.repaymentDate) :
                    formatDate(invoice.dueDate)
                }
              </p>
            </div>
            <div className="a-invoice-cost-overview__arrow-circle" />
            <div className="a-invoice-cost-overview__arrow-image" />
          </div>

          {extraContent}
        </div>
      </div>
    </div>
  );
};

CostOverview.propTypes = {
  invoice: React.PropTypes.object.isRequired,
  forReview: React.PropTypes.bool,
};

export default CostOverview;
