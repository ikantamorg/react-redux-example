import React from 'react';
import I18nWithScope from '../../../../models/i18n_with_scope';
import { isWeekend } from '../../../../helpers/date';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

const HolidayNotification = ({ invoice }) => {
  let holidayInfo = (
    <p data-test-holidays>{t('invoices.new_invoice.warn_about_holidays')}</p>
  );

  if (isWeekend(invoice.dueDate)) {
    holidayInfo = (
      <p data-test-weekend className="a-clear_invoice__important-text">
        {t('invoices.new_invoice.warn_about_weekend')}
      </p>
    );
  }

  return (
    <div className="m-b">
      {holidayInfo}
    </div>
  );
};

HolidayNotification.propTypes = {
  invoice: React.PropTypes.object.isRequired,
};

export default HolidayNotification;
