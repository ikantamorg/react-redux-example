import React from 'react';

import I18nWithScope from '../../../../models/i18n_with_scope';
import backendApi from '../../../../models/backend_api';

import Header from '../shared/header';
import BackButton from '../shared/back_button';
import CostOverview from '../shared/cost_overview';
import Verification from '../shared/verification';
import Alerts from '../../../../shared/components/alerts';
import Loading from '../../../../shared/components/loading';
import TermsAndConditions from '../shared/terms_and_conditions';
import HolidayNotification from '../shared/holiday_notification';
import CompactStepsProgress from '../../../../shared/components/compact_steps_progress';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

class Confirmation extends React.Component {
  static propTypes = {
    onClearInvoice: React.PropTypes.func.isRequired,
    onVerificationTypeChange: React.PropTypes.func.isRequired,
    invoice: React.PropTypes.object.isRequired,
    back: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  onClearInvoice = () => {
    const { invoice } = this.props;

    this.setState({
      loading: true,
    });

    backendApi.createInvoice({
      importedInvoiceId: invoice.id,
      promoCodeId: invoice.promoCodeId,
      maximumFee: invoice.pricesMap.fees,
      repaymentDate: invoice.repaymentDate,
      minimalAmount: invoice.prefinancingAmount,
      verificationOption: invoice.verificationType,
      visibleOnPlatformUntil: invoice.visibleOnPlatformUntil,
      contractType: invoice.contractType,
    })
    .then(() => {
      this.setState({
        loading: false
      });
      return this.props.onClearInvoice();
    })
    .catch((jqXHR) => {
      this.setState({
        loading: false,
        errors: jqXHR.responseJSON.errors,
      });
    });
  }

  render() {
    const { loading } = this.state;
    const { invoice, back, onVerificationTypeChange } = this.props;

    const errors = this.state && this.state.errors;
    return (
      <div className="a-clear-invoice">
        <BackButton onClick={back} />
        <Header
          title={t('clear_invoice_modal.clear_invoice')}
          invoice={invoice}
        />
        <div className="aside-modal__progress">
          <CompactStepsProgress
            steps={[{ step: 1 }, { step: 2 }]}
            step={2}
            type="wider"
          />
        </div>
        <Alerts errors={errors} />
        <CostOverview invoice={invoice} />
        <HolidayNotification invoice={invoice} />
        <Verification
          invoice={invoice}
          onChange={onVerificationTypeChange}
        />
        <TermsAndConditions />

        <button
          disabled={loading}
          className="btn btn-primary a-clear-invoice__confirm"
          onClick={this.onClearInvoice}
        >
          {loading &&
            <div className="a-clear-invoice__confirm__spinner">
              <Loading size="md" />
            </div>
          }
          <span className={loading ? 'a-clear-invoice__confirm__text loading' : 'a-clear-invoice__confirm__text'}>
            {t('clear_invoice_modal.confirm_clear_invoice_button')}
          </span>
        </button>
      </div>
    );
  }
}

export default Confirmation;
