/* global CONFIG */
import React from 'react';
import min from 'lodash/min';

import Review from '../shared/review';
import Confirmation from './confirmation';
import BasicDetails from './basic_details';
import Congratulations from '../shared/congratulations';
import Fee from '../shared/fee';
import Header from '../shared/header';
import { addDays } from '../../../../helpers/date';
import backendApi from '../../../../models/backend_api';
import { getConfig } from '../../../../models/config';
import I18nWithScope from '../../../../models/i18n_with_scope';
import { ExtendedStepWrapper } from '../shared/extended_step_wrapper';
import invoiceContractType from '../../../../constants/invoice_contract_type';
import invoiceAttributesRanges from '../../../../constants/invoice_attributes_ranges';
import invoicePricesCalculations from '../../../../models/invoice_prices_calculations';
import CompactStepsProgress from '../../../../shared/components/compact_steps_progress';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

const STEPS = {
  INVOICE_REVIEW: 1,
  INVOICE_CONFIRMATION: 2,
  INVOICE_CONGRATULATIONS: 3,
};

const isPrefinancingAmountValid = (invoice, prefinancingAmount) => (
  prefinancingAmount >= invoiceAttributesRanges.MIN_PREFINANCING_AMOUNT &&
    prefinancingAmount <= min([
      Number.parseFloat(getConfig('currentAccount.seller.remainingCreditLimit')),
      invoice.amount * invoice.pricesMap.investmentAsPartOfAmount,
    ])
);

class Stepper extends React.Component {
  static propTypes = {
    extendedModal: React.PropTypes.bool,
    invoice: React.PropTypes.object.isRequired,
    showExtendedModal: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      invoice: {
        ...props.invoice,
        promoCodeId: '',
        contractType: invoiceContractType.PREFINANCING,
        repaymentDate: props.invoice.dueDate,
        prefinancingAmount: min([
          Number.parseFloat(getConfig('currentAccount.seller.remainingCreditLimit')),
          props.invoice.pricesMap.advancement,
        ]),
      },
      promoCodes: CONFIG.currentAccount ? CONFIG.currentAccount.promoCodes : [],
      currentStep: STEPS.INVOICE_REVIEW,
    };
  }

  clearInvoice = (invoice) => {
    if (isPrefinancingAmountValid(invoice, invoice.prefinancingAmount)) {
      this.props.showExtendedModal(false);
      this.setState({
        invoice,
        currentStep: STEPS.INVOICE_CONFIRMATION,
      });
    }
  }

  changeToCongratulations = () => {
    this.setState({
      currentStep: STEPS.INVOICE_CONGRATULATIONS,
    });
  }

  changeVerificationType = (verificationType) => {
    this.setState({
      invoice: {
        ...this.state.invoice,
        verificationType,
      },
    });
  }

  changeContractType = (contractType) => {
    this.setState({
      invoice: {
        ...this.state.invoice,
        contractType,
      },
    });
  }

  back = () => {
    this.setState({ currentStep: STEPS.INVOICE_REVIEW });
  }

  changeDaysNumber = (daysNumber) => {
    this.setState({
      invoice: {
        ...this.state.invoice,
        visibleOnPlatformUntil: addDays(new Date(), daysNumber),
      },
    });
  }

  changeRecommendedFee = (feePercentage) => {
    const { invoice, promoCodes } = this.state;
    const promoCode = promoCodes.find(promoCode => promoCode.id === invoice.promoCodeId);

    this.setState({
      invoice: {
        ...invoice,
        pricesMap: {
          ...invoicePricesCalculations.calculateAll(
            invoice.amount,
            1,
            invoice.advanonFee,
            feePercentage,
            invoice.prefinancingAmount,
            promoCode ? promoCode.discount : 0,
          ),
          recommendedPrice: invoice.pricesMap.recommendedPrice,
          investmentAsPartOfAmount: invoice.pricesMap.investmentAsPartOfAmount,
        },
      },
    });
  }

  changeRepaymentDate = (repaymentDate) => {
    const { invoice, promoCodes } = this.state;
    const promoCode = promoCodes.find(promoCode => promoCode.id === invoice.promoCodeId);
    const discout = invoicePricesCalculations.discountAmount(
      invoice.pricesMap.advanonFee,
      promoCode ? promoCode.discount : 0,
    );

    backendApi.getInvoiceRecommendedFee({
      ...invoice,
      repaymentDate: repaymentDate.toDate(),
    }).then((response) => {
      this.setState({
        invoice: {
          ...invoice,
          repaymentDate: repaymentDate.toDate(),
          pricesMap: {
            ...response.recommendedFees,
            fees: response.recommendedFees.fees - discout,
            repayment: response.recommendedFees.repayment - discout,
            discount: discout,
            investmentAsPartOfAmount: invoice.pricesMap.investmentAsPartOfAmount,
          },
        },
      });
    });
  }

  changePrefinancingAmount = (event) => {
    const prefinancingAmount = event.target.value;
    const { invoice, promoCodes } = this.state;
    const promoCode = promoCodes.find(promoCode => promoCode.id === invoice.promoCodeId);

    if (isPrefinancingAmountValid(invoice, prefinancingAmount)) {
      this.setState({
        invoice: {
          ...invoice,
          prefinancingAmount,
          pricesMap: {
            ...invoicePricesCalculations.calculateAll(
              prefinancingAmount,
              1,
              invoice.advanonFee,
              invoice.pricesMap.multiplier * 100,
              prefinancingAmount,
              promoCode ? promoCode.discount : 0,
            ),
            recommendedPrice: invoice.pricesMap.recommendedPrice,
            investmentAsPartOfAmount: invoice.pricesMap.investmentAsPartOfAmount,
          },
        },
        errors: {
          prefinancingAmount: '',
        },
      });
    } else {
      this.setState({
        invoice: {
          ...this.state.invoice,
          prefinancingAmount,
        },
        errors: {
          prefinancingAmount: t(
            'components.new_invoice.review.errors.prefinancing_amount.possible_range',
            {
              max: min([
                Number.parseFloat(getConfig('currentAccount.seller.remainingCreditLimit')),
                invoice.amount * invoice.pricesMap.investmentAsPartOfAmount,
              ]).toFixed(2),
            }
          ),
        },
      });
    }
  }

  handlePromoCodeSelect = (promoCodeId) => {
    const { invoice, promoCodes } = this.state;
    const promoCode = promoCodes.find(promoCode => promoCode.id === promoCodeId);

    this.setState({
      invoice: {
        ...invoice,
        promoCodeId,
        pricesMap: {
          ...invoicePricesCalculations.calculateAll(
            invoice.amount,
            1,
            invoice.advanonFee,
            invoice.pricesMap.multiplier * 100,
            invoice.prefinancingAmount,
            promoCode ? promoCode.discount : 0,
          ),
          recommendedPrice: invoice.pricesMap.recommendedPrice,
          investmentAsPartOfAmount: invoice.pricesMap.investmentAsPartOfAmount,
        },
      },
    });
  }

  reviewHeader = () => (
    <div>
      <Header
        title={t('clear_invoice_modal.clear_invoice')}
        invoice={this.state.invoice}
      />
      <div className="aside-modal__progress">
        <CompactStepsProgress
          steps={[{ step: 1 }, { step: 2 }]}
          step={1}
          type="wider"
        />
      </div>
    </div>
  )

  render() {
    const { invoice, currentStep, errors, promoCodes } = this.state;
    const { extendedModal, showExtendedModal } = this.props;

    const components = {
      [STEPS.INVOICE_REVIEW]: () => (
        <ExtendedStepWrapper
          extendedModal={extendedModal}
          mainStep={(
            <Review
              invoice={invoice}
              promoCodes={promoCodes}
              header={this.reviewHeader()}
              hideConfirmButton={extendedModal}
              onClearInvoiceClick={this.clearInvoice}
              onContractTypeClick={this.changeContractType}
              handlePromoCodeSelect={this.handlePromoCodeSelect}
              BasicDetailsComponent={(
                <BasicDetails
                  errors={errors}
                  invoice={invoice}
                  onRepaymentDateChange={this.changeRepaymentDate}
                  onCustomizeFeeClick={() => showExtendedModal(true)}
                  onPrefinancingAmountChange={this.changePrefinancingAmount}
                />
              )}
            />
          )}
          additionalStep={
            <Fee
              invoice={invoice}
              back={() => showExtendedModal(false)}
              onChangeRecommendedFee={this.changeRecommendedFee}
              onChangeDaysNumber={this.changeDaysNumber}
            />
          }
        />
      ),
      [STEPS.INVOICE_CONFIRMATION]: () => (
        <Confirmation
          invoice={invoice}
          onClearInvoice={this.changeToCongratulations}
          onVerificationTypeChange={this.changeVerificationType}
          back={this.back}
        />
      ),
      [STEPS.INVOICE_CONGRATULATIONS]: () => (
        <Congratulations isCleared />
      ),
    };

    return (
      <div>{components[currentStep]()}</div>
    );
  }
}

export default Stepper;
