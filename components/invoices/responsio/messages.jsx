import '!style!css!sass!./messages.scss';

import classnames from 'classnames';
import React, { PropTypes } from 'react';

import Message from './message';
import NoMessages from './no_messages';
import LoadingMessages from './loading_messages';

export default class Messages extends React.Component {
  static propTypes = {
    currentAccountId: PropTypes.number.isRequired,
    messages: PropTypes.array,
    loading: PropTypes.bool,
    setRef: PropTypes.func,
  }

  static defaultProps = {
    messages: [],
  }

  renderContent() {
    const { messages, loading, currentAccountId } = this.props;

    if (loading) {
      return (<LoadingMessages />);
    }

    if (!messages.length) {
      return (<NoMessages />);
    }

    return messages.map((message, i) =>
      <Message key={i} currentAccountId={currentAccountId} message={message} />
    );
  }

  render() {
    const { messages, setRef } = this.props;

    const className = classnames('invoice-chat__messages', {
      'invoice-chat__messages--valign': messages.length === 0,
    });

    return (
      <div className={className} ref={setRef}>
        {this.renderContent()}
      </div>
    );
  }
}
