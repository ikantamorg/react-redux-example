import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AddNewCustomer from './new_customer_form';
import InvoiceDetails from './invoice_details/details';
import Overview from './cost_overview/overview';
import StepWrapper from '../shared/extended_step_wrapper';
import I18nWithScope from '../../../../models/i18n_with_scope';
import backendApi from '../../../../models/backend_api';
import TrueSale from './truesale/sign-contract';

import Header from '../shared/header';
import Review from './review_form';
import Fee from '../shared/fee';
import BackButton from '../shared/back_button';
import Congratulations from '../shared/congratulations';
import CompactStepsProgress from '../../../../shared/components/compact_steps_progress';
import { loadCustomers } from '../../../actions/customers';
import {
  nextStep,
  previousStep,
  updateInvoiceValues,
  fetchPricesMap,
  updateVisibleOnPlatformUntil,
  updateContractType,
  recalculatePricesMap,
  toggleExtendedModal,
} from '../../../actions/invoices/new';

import {
  getInvoice,
  isModalExtended,
  getCurrentStep,
} from '../../../reducers/invoices/new';

import { getCustomers } from '../../../reducers/customers';

const i18nWithScope = new I18nWithScope('components.new_invoice');
const t = i18nWithScope.t.bind(i18nWithScope);

const DEFAULT_COUNTRY = 'switzerland';

export class NewInvoiceSteps extends React.Component {
  static propTypes = {
    updateInvoiceValues: PropTypes.func.isRequired,
    updateVisibleOnPlatformUntil: PropTypes.func.isRequired,
    updateContractType: PropTypes.func.isRequired,
    recalculatePricesMap: PropTypes.func.isRequired,
    currentStep: PropTypes.number.isRequired,
    customers: PropTypes.array.isRequired,
    nextStep: PropTypes.func.isRequired,
    previousStep: PropTypes.func.isRequired,
    loadCustomers: PropTypes.func.isRequired,
    fetchPricesMap: PropTypes.func.isRequired,
    toggleExtendedModal: PropTypes.func.isRequired,
    invoice: PropTypes.object.isRequired,
    extendedModal: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      invoice: this.props.invoice,
      loading: false,
    };
  }

  componentWillMount() {
    this.props.loadCustomers();
  }

  componentWillReceiveProps(props) {
    this.setState({ invoice: props.invoice });
  }

  onInvoiceUpload = () => {
    const invoice = this.state.invoice;
    const { nextStep } = this.props;

    this.setState({
      loading: true,
    });

    backendApi.createInvoice({
      verificationOption: invoice.verificationType,
      amount: invoice.amount,
      minimalAmount: invoice.prefinancingAmount,
      customerId: invoice.customer.id,
      repaymentDate: invoice.repaymentDate,
      dueDate: invoice.dueDate,
      maximumFee: invoice.pricesMap.fees,
      invoiceNumber: invoice.number,
      promoCodeId: invoice.promoCodeId,
      visibleOnPlatformUntil: invoice.visibleOnPlatformUntil,
      contractType: invoice.contractType,
      file: invoice.file[0],
    })
      .then((response) => {
        this.setState({
          loading: false,
          invoiceID: response.invoice.id,
        });
        return nextStep();
      })
      .catch((jqXHR) => {
        this.setState({
          loading: false,
          errors: jqXHR.responseJSON.errors,
        });
      });
  }

  onNextStep = () => {
    const { updateInvoiceValues, nextStep } = this.props;
    updateInvoiceValues(this.state.invoice);
    nextStep();
  }

  onPreviousStep = () => {
    const { updateInvoiceValues, previousStep } = this.props;
    updateInvoiceValues(this.state.invoice);
    previousStep();
  }

  onVerificationTypeChange = (value) => {
    this.setState({
      invoice: {
        ...this.state.invoice,
        verificationType: value,
      },
    });
  }

  reviewHeader = () => (
    <div>
      <BackButton onClick={this.onPreviousStep} />
      <Header
        title={t('form_step.header_title')}
        invoice={this.state.invoice}
      />
      <div className="aside-modal__progress">
        <CompactStepsProgress
          steps={[{ step: 1 }, { step: 2 }, { step: 3 }]}
          step={2}
          type="wider"
        />
      </div>
      <h3 className="aside-modal__subtitle text-center">{t('your_offer')}</h3>
    </div>
  )

  stepToRender(currentStep) {
    const { loading } = this.state;
    const {
      customers,
      updateInvoiceValues,
      fetchPricesMap,
      toggleExtendedModal,
      recalculatePricesMap,
      updateVisibleOnPlatformUntil,
      updateContractType,
      extendedModal,
    } = this.props;

    switch (currentStep) {
      case 1:
        return (
          <StepWrapper
            key="invoiceDetailsStep"
            mainStep={(
              <InvoiceDetails
                customers={customers}
                updateInvoiceValues={updateInvoiceValues}
                fetchPricesMap={fetchPricesMap}
                nextStep={this.onNextStep}
              />
            )}
            additionalStep={
              <AddNewCustomer
                initialValues={{
                  country: DEFAULT_COUNTRY,
                }}
              />
            }
          />
        );
      case 2:
        return (
          <StepWrapper
            key="newInvoiceReviewStep"
            mainStep={(
              <Review
                invoice={this.state.invoice}
                onContractTypeClick={updateContractType}
                onCustomizeFeeClick={toggleExtendedModal}
                submitHandler={this.onNextStep}
                header={this.reviewHeader()}
                extendedModal={extendedModal}
                initialValues={{
                  repaymentDate: this.state.invoice.repaymentDate,
                  prefinancingAmount: this.state.invoice.prefinancingAmount,
                }}
              />
            )}
            additionalStep={(
              <Fee
                invoice={this.state.invoice}
                back={toggleExtendedModal}
                onChangeRecommendedFee={recalculatePricesMap}
                onChangeDaysNumber={updateVisibleOnPlatformUntil}
              />
            )}
          />
        );
      case 3:
        return (
          <Overview
            loading={loading}
            key="newInvoiceOverviewStep"
            goBack={this.onPreviousStep}
            invoice={this.state.invoice}
            onVerificationTypeChange={this.onVerificationTypeChange}
            onConfirm={this.onInvoiceUpload}
            errors={this.state && this.state.errors}
          />
        );
      case 4:
        return (
          <TrueSale
            loading={loading}
            key="newInvoiceHelloSignContractStep"
            goBack={this.onPreviousStep}
            nextStep={this.onNextStep}
            invoiceID={this.state.invoiceID}
          />
        );
      case 5:
        return (
          <Congratulations key="newInvoiceCongratulations" />
        );
      default:
        return null;
    }
  }

  render() {
    const { currentStep } = this.props;
    return (
      <div>{this.stepToRender(currentStep)}</div>
    );
  }
}

export default connect(
  (state) => ({
    currentStep: getCurrentStep(state),
    invoice: getInvoice(state),
    customers: getCustomers(state),
    extendedModal: isModalExtended(state),
  }),
  dispatch => bindActionCreators({
    nextStep,
    previousStep,
    updateInvoiceValues,
    updateContractType,
    loadCustomers,
    fetchPricesMap,
    updateVisibleOnPlatformUntil,
    recalculatePricesMap,
    toggleExtendedModal,
  }, dispatch)
)(NewInvoiceSteps);
