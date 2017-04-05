import '!style!css!sass!./chat.scss';

import React, { PropTypes } from 'react';

import backendApi from '../../../../models/backend_api';

import Alerts from '../../../../shared/components/alerts';
import InvoiceDetails from './invoice_details';
import Messages from './messages';
import NewMessage from './new_message';

import { TYPES } from '../../../../constants/account';

const MESSAGE_FETCH_INTERVAL = 2500;

export default class InvoiceChat extends React.Component {
  static propTypes = {
    currentAccountId: PropTypes.number.isRequired,
    currentAccountType: PropTypes.string.isRequired,
    invoice: PropTypes.object.isRequired,
    clearInvoiceUnreadMessagesCount: PropTypes.func.isRequired,
  }

  state = {
    messages: [],
    loadingErrors: [],
    isLoading: true,
  }

  componentWillMount() {
    const {
      invoice: { id, conversationId },
      clearInvoiceUnreadMessagesCount,
    } = this.props;

    this.messageFetchInterval = setInterval(() => {
      backendApi.getInvoiceMessages(id, conversationId)
        .then(response =>
          this.setState({
            messages: response.messages,
          })
        );
    }, MESSAGE_FETCH_INTERVAL);

    backendApi.getInvoiceMessages(id, conversationId)
      .then(response =>
        this.setState({
          messages: response.messages || [],
          isLoading: false,
        }, this.scrollToBottom)
      )
      .then(() => backendApi.readConversationMessages(id, conversationId))
      .then(clearInvoiceUnreadMessagesCount)
      .catch(response =>
        this.setState({
          loadingErrors: response.responseJSON.errors,
          isLoading: false,
        })
      );
  }

  componentWillUnmount() {
    clearInterval(this.messageFetchInterval);
  }

  createMessage = body => {
    const { invoice, currentAccountId } = this.props;

    backendApi.createInvoiceMessage({
      body,
      accountId: currentAccountId,
      invoiceId: invoice.id,
      conversationId: invoice.conversationId,
    })
    .then(response => {
      this.setState(state => ({
        messages: [
          ...state.messages,
          response.message,
        ],
      }), this.scrollToBottom);
    });
  }

  scrollToBottom = () => {
    this.messages.scrollTop = this.messages.scrollHeight;
  }

  render() {
    const { loadingErrors, isLoading, messages } = this.state;
    const { invoice, currentAccountId, currentAccountType } = this.props;

    const isSeller = currentAccountType === TYPES.SELLER;
    const setRef = ref => (this.messages = ref);

    return (
      <div className="invoice-chat">
        <Alerts errors={loadingErrors} />
        <InvoiceDetails
          invoice={invoice}
          isSeller={isSeller}
        />
        <Messages
          setRef={setRef}
          messages={messages}
          loading={isLoading}
          currentAccountId={currentAccountId}
        />
        <NewMessage
          onSend={this.createMessage}
          isSeller={isSeller}
        />
      </div>
    );
  }
}
