import React, { PropTypes } from 'react';

import { formatMoneyCHF } from '../../../../helpers/number';

export const MoneyCellComponent = ({ amount, percentage }) => (
  <div>
    <span className="text-nowrap">
      {formatMoneyCHF(amount)}
    </span>
    <br />
    <span className="text-muted text-nowrap">
      ({(percentage * 100).toFixed(2)}%)
    </span>
  </div>
);

MoneyCellComponent.propTypes = {
  amount: PropTypes.string,
  percentage: PropTypes.number,
};

export default MoneyCellComponent;
