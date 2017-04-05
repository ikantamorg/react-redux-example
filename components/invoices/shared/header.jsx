import React from 'react';

import { formatMoneyCHF } from '../../../../helpers/number';

const Header = ({ invoice, title, titleClassName }) => (
  <div className="m-b-xl">
    <h2 className={titleClassName}>
      {title}
    </h2>
    {invoice &&
    <h3 className="text-muted">
      #{invoice.number || invoice.id}
      <span> | </span>
      {formatMoneyCHF(invoice.amount)}
      <span> | </span>
      {invoice.customer.firmName}
    </h3>
    }
  </div>
);

Header.propTypes = {
  invoice: React.PropTypes.object,
  title: React.PropTypes.string,
  titleClassName: React.PropTypes.string,
};

Header.defaultProps = {
  titleClassName: 'a-clear-invoice-header__title',
};

export default Header;
