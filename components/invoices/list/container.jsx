import React, { PropTypes } from 'react';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import { RadioGroup, Radio } from 'react-radio-group';

import '!style!css!sass!./tabs.scss';

import I18nWithScope from '../../../../models/i18n_with_scope';
import backendApi from '../../../../models/backend_api';

import Wrapper from '../../../../shared/components/wrapper';
import InvoiceTable from './table';
import CURRENCIES from '../../../../constants/currencies';

const i18nWithScope = new I18nWithScope('invoices');
const t = i18nWithScope.t.bind(i18nWithScope);

const INVOICES = {
  ALL: 'all',
  OPEN: 'open',
  CLOSED: 'closed',
};

const PER_PAGE = 10;

export default class InvoicesContainer extends React.Component {
  static propTypes = {
    rolloutInvoiceChat: PropTypes.bool,
    activeTab: PropTypes.string,
    currentSellerId: PropTypes.number.isRequired,
    currentAccountId: PropTypes.number.isRequired,
    currentAccountType: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeTab: props.activeTab || INVOICES.ALL,
      invoices: [],
      currentPage: 1,
      maxPages: 1,
      loading: true,
      loadingError: false,
      currency: CURRENCIES.ANY,
    };
  }

  componentWillMount() {
    this.fetchInvoices(this.state.currentPage, this.state.currency, this.state.activeTab);
  }

  onTabChange = activeTab => {
    this.fetchInvoices(this.state.currentPage, this.state.currency, activeTab);
  };

  onPageChange = currentPage => {
    this.fetchInvoices(currentPage, this.state.currency, this.state.activeTab);
  };

  getScope = (activeTab) => {
    if (activeTab === INVOICES.ALL) {
      return null;
    }

    return activeTab;
  };

  clearInvoiceUnreadMessagesCount = id => () =>
    this.setState(state => ({
      invoices: state.invoices.map(invoice => {
        if (invoice.id === id) {
          return {
            ...invoice,
            conversationUnreadMessagesCount: 0,
          };
        }
        return invoice;
      }),
    }));

  fetchInvoices = (page = 1, currency = CURRENCIES.ANY, activeTab) => {
    const { currentSellerId } = this.props;

    this.setState({
      activeTab,
      currentPage: page,
      loading: true,
      fetchingError: false,
      currency,
    });

    const params = Object.assign({
      page,
      per: PER_PAGE,
      scope: this.getScope(activeTab),
    }, this.isAny(currency) ? {} : { currency });

    backendApi.getInvoices(currentSellerId, params)
      .then((response) => {
        this.setState({
          invoices: response.invoices,
          maxPages: response.meta.totalPages,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          loadingError: true,
        });
      });
  };

  isAny(currency) {
    return currency === CURRENCIES.ANY;
  }

  changeCurrency = (currency) => {
    if (this.state.currency === currency) return;

    this.setState({ currency }, () =>
      this.fetchInvoices(1, currency, this.state.activeTab),
    );
  };

  renderTable() {
    const { invoices, maxPages, currentPage, loading, loadingError } = this.state;
    const { currentAccountId, currentAccountType, rolloutInvoiceChat } = this.props;

    return (
      <InvoiceTable
        rolloutInvoiceChat={rolloutInvoiceChat}
        currentAccountId={currentAccountId}
        currentAccountType={currentAccountType}
        data={invoices}
        currentPage={currentPage}
        maxPages={maxPages}
        loading={loading}
        error={loadingError}
        onPageChange={this.onPageChange}
        clearInvoiceUnreadMessagesCount={this.clearInvoiceUnreadMessagesCount}
      />
    );
  }

  renderCurrency() {
    return (
      <div className="currencyFilter">
        <RadioGroup name="currency" selectedValue={this.state.currency} onChange={this.changeCurrency}>
          <div>
            <Radio value={CURRENCIES.ANY} id="all" />
            <div className="check" />
            <label htmlFor="all">{t('types.all_invoices')}</label>
          </div>
          <div>
            <Radio value={CURRENCIES.CHF} id="CHF" />
            <div className="check" />
            <label htmlFor="CHF">{t('types.swiss_invoices')}</label>
          </div>
          <div>
            <Radio value={CURRENCIES.EUR} id="EUR" />
            <div className="check" />
            <label htmlFor="EUR">{t('types.german_invoices')}</label>
          </div>
        </RadioGroup>
      </div>
    );
  }

  render() {
    const { activeTab } = this.state;

    return (
      <Wrapper>
        <Row className="gutter-05x">
          <Col sm={12}>
            <Tabs
              id="invoices"
              defaultActiveKey={activeTab}
              className="a-tabs-container tabs-container"
              onSelect={this.onTabChange}
              mountOnEnter
              unmountOnExit
            >
              <Tab tabClassName="a-tab" eventKey={INVOICES.ALL} title={t('types.all_invoices')}>
                {this.renderCurrency()}
                {this.renderTable()}
              </Tab>
              <Tab tabClassName="a-tab" eventKey={INVOICES.OPEN} title={t('types.open_invoices')}>
                {this.renderCurrency()}
                {this.renderTable()}
              </Tab>
              <Tab tabClassName="a-tab" eventKey={INVOICES.CLOSED} title={t('types.closed_invoices')}>
                {this.renderCurrency()}
                {this.renderTable()}
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Wrapper>
    );
  }
}
