import classnames from 'classnames';

import { formatDate } from '../../../../utils';
import { addDays } from '../../../../helpers/date';

const buildDayButtonClasses = (days, visibleOnPlatformUntil) => {
  const selected = formatDate(addDays(new Date(), days)) === formatDate(visibleOnPlatformUntil);

  return classnames('btn btn-link gutter-0x a-clear-invoice-fee__day-text a-clear-invoice-fee__day', {
    'a-clear-invoice-fee__day--selected': selected,
  });
};

export default buildDayButtonClasses;
