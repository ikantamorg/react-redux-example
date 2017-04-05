import React, { PropTypes } from 'react';

import I18nWithScope from '../../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('components.responsio.new_message');
const t = i18nWithScope.t.bind(i18nWithScope);

export default class NewMessage extends React.Component {
  static propTypes = {
    onSend: PropTypes.func.isRequired,
    isSeller: PropTypes.bool.isRequired,
  }

  state = {
    message: '',
  }

  onMessageChange = event =>
    this.setState({
      message: event.target.value,
    })

  onMessageSend = (event) => {
    event.preventDefault();

    const { message } = this.state;
    const { onSend } = this.props;

    if (message.length) {
      onSend(message);

      this.setState({ message: '' }, () => {
        if (this.input) {
          this.input.focus();
        }
      });
    }
  }

  render() {
    const { message } = this.state;
    const { isSeller } = this.props;

    const ref = ref => (this.input = ref);

    const placeholder = isSeller ? 'seller_message_placeholder' : 'investor_message_placeholder';

    return (
      <div className="invoice-chat__new-message">
        <form onSubmit={this.onMessageSend}>
          <input
            ref={ref}
            className="form-control"
            type="text"
            onChange={this.onMessageChange}
            value={message}
            placeholder={t(placeholder)}
          />

          <div className="m-t-sm text-right">
            <button
              type="submit"
              disabled={!message.length}
              className="btn btn-primary"
              onClick={this.onMessageSend}
            >
              {t('send')}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
