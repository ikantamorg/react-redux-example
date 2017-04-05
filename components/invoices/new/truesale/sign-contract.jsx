import React, { PropTypes } from 'react';
import '!style!css!sass!./styles.scss';
import I18nWithScope from '../../../../../models/i18n_with_scope';

import Loading from '../../../../../shared/components/loading';
import BackButton from '../../shared/back_button';
import TrueSaleContract from '../../../../../shared/components/truesale_contract';
import contractIcon from './contract2x.png';

const i18nWithScope = new I18nWithScope('components.new_invoice');
const t = i18nWithScope.t.bind(i18nWithScope);

class TrueSale extends React.Component {
  static propTypes = {
    invoiceID: React.PropTypes.number.isRequired,
    goBack: React.PropTypes.func.isRequired,
    nextStep: React.PropTypes.func.isRequired,
  };

  state = { isSigning: false, cancelled: false };

  onCancel = () => {
    this.setState({ cancelled: true, isSigning: false });
  };

  onSigned = () => {
    this.setState({ isSigning: false });
    this.props.nextStep();
  };

  showContract = () => {
    this.setState({ isSigning: true });
  };

  render() {
    const { invoiceID, goBack } = this.props;

    return (
      <div className="new-invoice__contract-sign">
        <BackButton onClick={goBack} />
        <h2>{t('form_step.header_title')}</h2>
        <img src={contractIcon} alt="Contract" className="center-block" />
        <p className="need-signature text-center">{t('form_step.true_sale.need_signature')}</p>
        <p className="financing-choice text-center center-block">{t('form_step.true_sale.financing_choice')}</p>
        <p className="fine-prints text-center center-block">{t('form_step.true_sale.fine_prints')}</p>
        {this.state.isSigning &&
        <TrueSaleContract
          onCancel={this.onCancel}
          onSign={this.onSigned}
          params={{ invoiceID }}
        />
        }

        {this.state.cancelled &&
        <span className="cancelled">{t('form_step.true_sale.cancelled')}</span>
        }
        <button
          disabled={this.state.isSigning}
          className="btn btn-primary center-block sign-contract"
          onClick={this.showContract}
        >
          {this.state.isSigning ?
            <div className="a-clear-invoice__confirm__spinner">
              <Loading size="md" />
            </div>
            : t('form_step.true_sale.sign_button')
          }
        </button>
      </div>
    );
  }
}

export default TrueSale;
