import '!style!css!sass!./message.scss';

import classnames from 'classnames';

import React, { PropTypes } from 'react';

import { TYPES } from '../../../../constants/account';
import { formatDate } from '../../../../helpers/date';
import I18nWithScope from '../../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('components.responsio.message');
const t = i18nWithScope.t.bind(i18nWithScope);

const MESSAGE_DATE_FORMAT = 'HH:mm (DD.MM.YYYY)';

const Message = ({ message, currentAccountId }) => {
  const { account } = message;

  const isSeller = account.accountType === TYPES.SELLER;
  const isInvestor = account.accountType === TYPES.INVESTOR;
  const label = isSeller ? t('seller_account') : t('investor_account');

  const className = classnames('invoice-chat__message', {
    'invoice-chat__message--odd': isSeller,
  });

  const textClassName = classnames('invoice-chat__message-text', {
    'invoice-chat__message-text--odd': isSeller,
    'invoice-chat__message-text--highlighted': currentAccountId !== account.id,
  });

  const authorClassName = classnames('invoice-chat__message-author', {
    'pull-left': isInvestor,
    'pull-right': isSeller,
  });

  const dateClassName = classnames('invoice-chat__message-date', {
    'pull-left': isSeller,
    'pull-right': isInvestor,
  });

  return (
    <div className={className}>
      <div className={authorClassName}>
        <strong>{label}</strong>: {account.firstName} {account.lastName}
      </div>
      <div className={dateClassName}>
        <small>{formatDate(message.createdAt, MESSAGE_DATE_FORMAT)}</small>
      </div>
      <div className={textClassName}>
        {message.body}
      </div>
    </div>
  );
};

Message.propTypes = {
  currentAccountId: PropTypes.number.isRequired,
  message: PropTypes.object.isRequired,
};

export default Message;
