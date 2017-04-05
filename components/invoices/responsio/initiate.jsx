import '!style!css!sass!./initiate.scss';

import noop from 'lodash/noop';
import classnames from 'classnames';
import React, { PropTypes } from 'react';

import AsideModal from '../../../../shared/components/aside_modal';

import Chat from './chat';

export default class InitiateChat extends React.Component {
  static propTypes = {
    currentAccountId: PropTypes.number.isRequired,
    currentAccountType: PropTypes.string.isRequired,
    invoice: PropTypes.object.isRequired,
    clearInvoiceUnreadMessagesCount: PropTypes.func,
  }

  static defaultProps = {
    clearInvoiceUnreadMessagesCount: noop,
  }

  state = {
    isModalOpen: false,
  }

  openModal = () =>
    this.setState({ isModalOpen: true })

  hideModal = () =>
    this.setState({ isModalOpen: false })

  render() {
    const {
      invoice,
      currentAccountId,
      currentAccountType,
      clearInvoiceUnreadMessagesCount,
    } = this.props;
    const { isModalOpen } = this.state;

    const { conversationUnreadMessagesCount } = invoice;

    const className = classnames('glyphicon glyphicon-comment invoice-chat__messages-icon', {
      'invoice-chat__messages-icon--unread': conversationUnreadMessagesCount > 0,
    });

    return (
      <div>
        <button
          onClick={this.openModal}
          className="btn btn-link btn-sm"
        >
          <div className={className}>
            { conversationUnreadMessagesCount > 0 &&
              <span className="badge invoice-chat__messages-unread-count">
                { conversationUnreadMessagesCount }
              </span>
            }
          </div>
        </button>

        <AsideModal show={isModalOpen} onHide={this.hideModal} bodyClassName="invoice-chat__modal">
          <Chat
            currentAccountId={currentAccountId}
            currentAccountType={currentAccountType}
            invoice={invoice}
            clearInvoiceUnreadMessagesCount={clearInvoiceUnreadMessagesCount}
          />
        </AsideModal>
      </div>
    );
  }
}
