/* global CONFIG */
import '!style!css!sass!./invoices.scss';
import React, { PropTypes } from 'react';

import backendApi from '../../../../models/backend_api';
import Table from '../../../../shared/components/table/table';
import errorContents from '../../../../shared/components/table/error_contents';
import Empty from './empty';
import loadingContents from '../../../../shared/components/table/loading_contents';
import ClearInvoiceButton from '../../invoices/clear/clear_button';
import SyncImportedInvoices from './sync_imported_invoices';
import ImportedInvoiceExpandedRow from './imported_invoice_expanded_row';

import utils from '../../../../utils';
import I18nWithScope from '../../../../models/i18n_with_scope';
import { formatMoneyCHF } from '../../../../helpers/number';

import SCREEN_SIZES from '../../../../constants/screen_sizes';

const i18nWithScope = new I18nWithScope('invoices.imported.table');
const t = i18nWithScope.t.bind(i18nWithScope);
const clearI18nWithScope = new I18nWithScope('clear_invoice_modal');
const tc = clearI18nWithScope.t.bind(clearI18nWithScope);
const FIRST_PAGE_NUMBER = 1;

class Invoices extends React.Component {
  static propTypes = {
    currentSeller: PropTypes.object.isRequired,
    userFromBexio: React.PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      importedInvoices: [],
      currentPage: 1,
      maxPages: 1,
      loading: true,
      fetchingError: false,
    };
  }

  componentWillMount() {
    this.fetchImportedInvoices();
  }

  beforeFetchingImportedInvoices = () => (this.setState({ loading: true }))

  fetchImportedInvoices = (page = FIRST_PAGE_NUMBER) => {
    const sellerId = this.props.currentSeller.id;
    const perPage = 10;

    this.setState({ loading: true, fetchingError: false });
    backendApi.getImportedInvoices(sellerId, page, perPage)
      .then((response) => {
        this.setState({
          importedInvoices: response.importedInvoices,
          maxPages: response.meta.totalPages,
          loading: false,
        });
      }).catch(() => {
        this.setState({
          loading: false,
          fetchingError: true,
        });
      });
  }

  footer = (currentPage, maxPages) => (
    <Table.Footer>
      <Table.Row>
        <Table.Cell colSpan={7}>
          <Table.Pagination
            currentPage={currentPage}
            maxPages={maxPages}
            onSelect={(page) => {
              this.fetchImportedInvoices(page);
              this.setState({ currentPage: page });
            }}
          />
        </Table.Cell>
      </Table.Row>
    </Table.Footer>
  )

  tableContents = (importedInvoices) => {
    const { maxPages, currentPage } = this.state;
    const { currentSeller } = this.props;

    return (
      <div>
        <div className="row m-b-sm">
          <div className="col-xs-12">
            <div className="pull-left">
              <div className="m-l-xs a-bexio-logo" />
            </div>
            <div className="pull-right">
              <SyncImportedInvoices
                currentSellerId={currentSeller.id}
                onClick={this.fetchImportedInvoices}
                beforeImport={this.beforeFetchingImportedInvoices}
              />
            </div>
          </div>
        </div>
        <Table data={importedInvoices}>
          <Table.Header>
            <Table.Row actAsExpander>
              <Table.HCell query={{ minWidth: SCREEN_SIZES.DESKTOP_UP }}>
                {t('invoice_number')}
              </Table.HCell>
              <Table.HCell>{t('amount')}</Table.HCell>
              <Table.HCell>{t('due_date')}</Table.HCell>
              <Table.HCell query={{ minWidth: SCREEN_SIZES.TABLET_PORTRAIT_UP }}>
                {t('debtor')}
              </Table.HCell>
              <Table.HCell query={{ minWidth: SCREEN_SIZES.TABLET_PORTRAIT_UP }}>
                {t('imported_from')}
              </Table.HCell>
              <Table.HCell>{t('actions_header')}</Table.HCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(invoice, index) => (
              <Table.Row
                key={index}
                actAsExpander
                expandableContent={<ImportedInvoiceExpandedRow invoice={invoice} />}
              >
                <Table.Cell>{invoice.id}</Table.Cell>
                <Table.Cell>
                  {formatMoneyCHF(invoice.amount)}
                </Table.Cell>
                <Table.Cell>{utils.formatDate(invoice.dueDate)}</Table.Cell>
                <Table.Cell>
                  <a
                    href={
                      CONFIG.routes.editSellerCustomerPath.replace(
                        '${id}', invoice.customer.id
                      )
                    }
                  >
                    {invoice.customer.firmName}
                  </a>
                </Table.Cell>
                <Table.Cell>{invoice.backofficeName}</Table.Cell>
                <Table.Cell>
                  {this.renderClearAction(invoice)}
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
          {maxPages > 1 && this.footer(currentPage, maxPages)}
        </Table>
      </div>
    );
  }

  renderClearAction(importedInvoice) {
    if (importedInvoice.invoiceId) {
      return <span>{t('actions.already_offered')}</span>;
    } else if (!importedInvoice.canBeOffered) {
      return (
        <button className="btn btn-primary disabled">
          {tc('clear_invoice')}
        </button>
      );
    }
    return <ClearInvoiceButton invoice={importedInvoice} />;
  }

  render() {
    const { currentSeller, userFromBexio } = this.props;
    const { importedInvoices, loading, fetchingError } = this.state;

    let content;
    if (loading) {
      content = loadingContents();
    } else if (fetchingError) {
      content = errorContents();
    } else if (importedInvoices.length === 0) {
      content = (
        <Empty
          userFromBexio={userFromBexio}
          currentSeller={currentSeller}
          fetchImportedInvoices={this.fetchImportedInvoices}
          beforeImport={this.beforeFetchingImportedInvoices}
        />
      );
    } else {
      content = this.tableContents(importedInvoices);
    }

    return (
      <div className="m-t-3">
        {content}
      </div>
    );
  }
}

export default Invoices;
