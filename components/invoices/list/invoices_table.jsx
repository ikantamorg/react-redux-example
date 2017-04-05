import React, { PropTypes } from 'react';
import { RadioGroup, Radio } from 'react-radio-group';

import backendApi from '../../../../models/backend_api';
import I18nWithScope from '../../../../models/i18n_with_scope';

import InvoiceTable from './table';
import CURRENCIES from '../../../../constants/currencies';

const i18nWithScope = new I18nWithScope('invoices');
const t = i18nWithScope.t.bind(i18nWithScope);

const PER_PAGE = 2;

export default class InvoicesContainer extends React.Component {
  static propTypes = {
    rolloutInvoiceChat: PropTypes.bool,
    currentSellerId: PropTypes.number.isRequired,
    currentAccountId: PropTypes.number.isRequired,
    currentAccountType: PropTypes.string.isRequired,
    invoiceScope: PropTypes.string.isRequired,
  };

  static defaultProps = {
    invoiceScope: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      invoices: [],
      currentPage: 1,
      maxPages: 1,
      loading: true,
      loadingError: false,
      currency: CURRENCIES.ANY,
    };
  }

  componentWillMount() {
    this.fetchInvoices(this.currentPage, this.state.currency);
  }

  onPageChange = currentPage => this.fetchInvoices(currentPage, this.state.currency);

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

  fetchInvoices = (page = 1, currency = CURRENCIES.ANY) => {
    const { currentSellerId, invoiceScope } = this.props;

    this.setState({
      currentPage: page,
      loading: true,
      fetchingError: false,
      currency,
    });

    const params = Object.assign({
      page,
      per: PER_PAGE,
      scope: invoiceScope,
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
    const { invoices, maxPages, currentPage, loading, loadingError } = this.state;
    const { currentAccountId, currentAccountType, rolloutInvoiceChat } = this.props;

    return (
      <div>
        {this.renderCurrency()}
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
          fetchInvoices={this.fetchInvoices}
        />
      </div>
    );
  }
}
