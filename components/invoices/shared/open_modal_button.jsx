import '!style!css!sass!./new_invoice_modal.scss';
import '!style!css!sass!./new_invoice_form.scss';

import React from 'react';

import AsideModal from '../../../../shared/components/aside_modal';

class OpenModalButton extends React.Component {
  static propTypes = {
    extended: React.PropTypes.bool,
    buttonText: React.PropTypes.string,
    children: React.PropTypes.element,
    customButton: React.PropTypes.element,
  }

  static defaultProps = {
    buttonText: '',
  }

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
    };
  }

  openModal = (event) => {
    if (event) event.preventDefault();

    this.setState({ isModalOpen: true });
  }

  closeModal = () => {
    this.setState({ isModalOpen: false });
  }

  render() {
    const { buttonText, children, extended, customButton } = this.props;
    const { isModalOpen } = this.state;

    let button = (
      <button
        className="btn btn-primary nav-cta-button"
        onClick={this.openModal}
      >
        {buttonText}
      </button>
    );

    if (customButton) {
      button = React.cloneElement(customButton, { onClick: this.openModal });
    }

    return (
      <div>
        {button}
        <AsideModal
          show={isModalOpen}
          onHide={this.closeModal}
          extended={extended}
          className="aside-modal--new-invoice-modal"
        >
          {children}
        </AsideModal>
      </div>
    );
  }
}

export default OpenModalButton;
