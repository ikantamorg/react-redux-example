import React, { PropTypes } from 'react';
import I18nWithScope from '../../../../../models/i18n_with_scope';

import Header from '../../shared/header';
import Alerts from '../../../../../shared/components/alerts';
import Loading from '../../../../../shared/components/loading';
import BackButton from '../../shared/back_button';
import CostOverview from '../../shared/cost_overview';
import Verification from '../../shared/verification';
import TermsAndConditions from '../../shared/terms_and_conditions';
import HolidayNotification from '../../shared/holiday_notification';
import CompactStepsProgress from '../../../../../shared/components/compact_steps_progress';

const i18nWithScope = new I18nWithScope('components.new_invoice');
const t = i18nWithScope.t.bind(i18nWithScope);

const OverviewStep = ({
  invoice,
  goBack,
  errors,
  onConfirm,
  onVerificationTypeChange,
  loading,
}) => (
  <div className="a-clear-invoice">
    <BackButton onClick={goBack} />
    <Header
      title={t('form_step.header_title')}
      invoice={invoice}
    />
    <div className="aside-modal__progress">
      <CompactStepsProgress
        steps={[{ step: 1 }, { step: 2 }, { step: 3 }]}
        step={3}
        type="wider"
      />
    </div>
    <h3 className="aside-modal__subtitle text-center">{t('cost_overview')}</h3>
    {errors && <Alerts errors={errors} />}
    <CostOverview invoice={invoice} forReview />
    <HolidayNotification invoice={invoice} />
    <Verification
      invoice={invoice}
      onChange={onVerificationTypeChange}
    />
    <TermsAndConditions />

    <button
      disabled={loading}
      className="btn btn-primary a-clear-invoice__confirm"
      onClick={onConfirm}
    >
      {loading &&
        <div className="a-clear-invoice__confirm__spinner">
          <Loading size="md" />
        </div>
      }
      <span className={loading ? 'a-clear-invoice__confirm__text loading' : 'a-clear-invoice__confirm__text'}>
        {t('agree_and_upload')}
      </span>
    </button>
  </div>
);

OverviewStep.propTypes = {
  invoice: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onVerificationTypeChange: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  errors: PropTypes.object,
  loading: PropTypes.bool,
};

export default OverviewStep;
