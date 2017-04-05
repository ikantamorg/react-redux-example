/* global Intercom */
/* eslint-env browser */

import React, { PropTypes } from 'react';
import $ from 'jquery';
import classnames from 'classnames';

import Logo from '../../../shared/components/navbar/logo';
import NavbarItem from '../../../shared/components/navbar/navbar_item';
import UploadInvoicePopover from '../../../shared/components/navbar/upload_invoice_popover';
import NewInvoiceButton from '../../components/invoices/new/button';
import I18nWithScope from '../../../models/i18n_with_scope';
import { getConfig } from '../../../models/config';

const i18nWithScope = new I18nWithScope('layouts.app');
const t = i18nWithScope.t.bind(i18nWithScope);

const i18nWithScopeNav = new I18nWithScope('components.navbar');
const tNav = i18nWithScope.t.bind(i18nWithScopeNav);

const IS_BEXIO = getConfig('features.bexio');

export const getMainMenu = (routes, props) => {
  const menu = [
    { path: routes.dashboard, icon: 'fa fa-th-large', label: t('menu_dashboard') },
    { path: routes.customers, icon: 'fa fa-users', label: t('menu_my_customers') },
    { path: routes.invoices, icon: 'fa fa-globe', label: t('menu_invoices') },
    { path: routes.transactions, icon: 'fa fa-exchange', label: t('menu_transactions') },
    { path: routes.promotions, icon: 'fa fa-percent', label: t('menu_promotions') },
  ];

  const myInvoicesMenuItem = {
    path: routes.myInvoices,
    icon: 'fa fa-cloud-download',
    label: t('menu_my_invoices'),
    popover: (
      <UploadInvoicePopover
        title={tNav('bexio_my_invoices_popover.title')}
        content={tNav('bexio_my_invoices_popover.content')}
      />
    ),
    showPopover: props.showUploadInvoicePopover,
  };

  if (IS_BEXIO) {
    menu.splice(1, 0, myInvoicesMenuItem);
  }
  return menu;
};

const getSettingsMenu = routes => [
  { path: routes.settings, icon: 'fa fa-cogs', label: t('settings') },
  { path: routes.signOut, icon: 'fa fa-sign-out', label: t('logout'), 'data-method': 'delete' },
];

const getHelpMenu = routes => [
  { path: routes.faq, icon: 'fa fa-question-circle', label: t('menu_faq') },
  {
    icon: 'fa fa-comment-o',
    label: t('menu_chat'),
    onClick: () => Intercom('showNewMessage'), // eslint-disable-line new-cap
  },
  { path: 'tel:+41445853850', icon: 'fa fa-phone', label: '+41 44 585 38 50' },
];

export default class Navbar extends React.Component {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    showUploadInvoicePopover: PropTypes.bool,
    newInvoiceUpload: PropTypes.bool,
    hideNewInvoiceButton: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.state = {
      activePath: window.location.pathname,
      minimized: false,
      showUploadInvoicePopover: props.showUploadInvoicePopover,
    };
  }

  componentDidMount() {
    $(document).on('menuResize', () => {
      this.setState({
        minimized: false,
      });
    });

    $(document).on('menuResizeSmall', () => {
      this.setState({
        minimized: true,
      });
    });
  }

  componentWillUnmount() {
    $(document).off('menuResize menuResizeSmall');
  }

  onMenuItemClick = option => (event) => {
    this.setActiveOption(option.path);

    if (option.onClick) {
      event.preventDefault();
      option.onClick();
    }
  }

  setActiveOption(path) {
    return () => {
      this.setState({ activePath: path });
    };
  }

  buildOptionClass(path) {
    return classnames('option_menu', {
      active: path === this.state.activePath,
    });
  }

  buildMenu(options = []) {
    return options.map((option, index) => (
      <li className={this.buildOptionClass(option.path)} key={index}>
        <NavbarItem
          {...option}
          onClick={this.onMenuItemClick(option)}
        />
      </li>
    ));
  }

  hideNewInvoiceButtonPopover = () =>
    this.setState({ showUploadInvoicePopover: false })

  render() {
    const { routes, newInvoiceUpload, hideNewInvoiceButton } = this.props;
    const { minimized, showUploadInvoicePopover } = this.state;

    let newInvoiceButton = (
      <a
        className="btn btn-primary nav-cta-button"
        href={routes.prefinancing}
      >
        + {!minimized && t('menu_pre_financing')}
      </a>
    );

    if (newInvoiceUpload) {
      newInvoiceButton = (
        <NewInvoiceButton minimized={this.state.minimized} />
      );
    }

    if (hideNewInvoiceButton) {
      newInvoiceButton = null;
    }

    return (
      <nav
        className="navbar-default navbar-static-side a-navigation"
        role="navigation"
      >
        <ul className="nav" id="side-menu">
          <li className="nav-header">
            <Logo link={routes.dashboard} />
          </li>

          <li className="text-center" ref={ref => (this.newInvoiceButtonRef = ref)}>
            {newInvoiceButton}
          </li>
          { !IS_BEXIO && showUploadInvoicePopover && !minimized &&
            <UploadInvoicePopover
              title={tNav('upload_invoice_popover.title')}
              content={tNav('upload_invoice_popover.content')}
              target={this.newInvoiceButtonRef}
              onClose={this.hideNewInvoiceButtonPopover}
              show
            />
          }

          {this.buildMenu(getMainMenu(routes, this.props))}

          { !minimized &&
            <li> <hr /> </li>
          }

          {this.buildMenu(getSettingsMenu(routes))}

          { !minimized &&
            <li> <hr /> </li>
          }

          {this.buildMenu(getHelpMenu(routes))}
        </ul>
      </nav>
    );
  }
}
