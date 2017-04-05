import React, { PropTypes } from 'react';

import I18nWithScope from '../../../../models/i18n_with_scope';
import { formatDate, getDiff } from '../../../../helpers/date';

const i18nWithScopeDate = new I18nWithScope('investor.invoices.overview_table.sale_table');
const tDays = i18nWithScopeDate.t.bind(i18nWithScopeDate);

export const DateCellComponent = ({ date }) => {
  const daysCount = getDiff(date);

  return (
    <div>
      <span className="text-nowrap">
        {formatDate(date)}
      </span>
      <br />
      <span className="text-muted text-nowrap">
        ({tDays('days', { count: daysCount > 0 ? daysCount : 0 })})
      </span>
    </div>
  );
};

DateCellComponent.propTypes = {
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
};

export default DateCellComponent;
