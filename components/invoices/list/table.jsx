/* global CONFIG */
import '!style!css!sass!./table.scss';

import moment from 'moment';
import React, { PropTypes } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import AdvanonProgressBar from '../../../../shared/components/advanon_progress_bar';

import Table from '../../../../shared/components/table/table';

import InitiateChat from '../responsio/initiate';

import DateCell from './date_cell';
import MoneyCell from './money_cell';
import ActionsDropDown from './actions';
import Summary from './summary';

import router from '../../../../models/router';
import I18nWithScope from '../../../../models/i18n_with_scope';
import { formatMoneyCHF } from '../../../../helpers/number';
import { getLabelFor, STATUSES } from '../../../../constants/invoice_status';
import SCREEN_SIZES from '../../../../constants/screen_sizes';

const i18nWithScope = new I18nWithScope('invoices.overview.open_invoices');
const t = i18nWithScope.t.bind(i18nWithScope);

const i18nWithScopeStatus = new I18nWithScope('invoices.statuses');
const tStatus = i18nWithScopeStatus.t.bind(i18nWithScopeStatus);

const i18nWithScopeStatusDescription = new I18nWithScope('invoices.statuses_description');
const tStatusDescription = i18nWithScopeStatusDescription.t.bind(i18nWithScopeStatusDescription);

export default class InvoicesTable extends React.Component {
  static propTypes = {
    rolloutInvoiceChat: PropTypes.bool,
    currentAccountId: PropTypes.number.isRequired,
    currentAccountType: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    currentPage: PropTypes.number.isRequired,
    maxPages: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    onPageChange: PropTypes.func.isRequired,
    clearInvoiceUnreadMessagesCount: PropTypes.func.isRequired,
  };

  renderChat(invoice) {
    const {
      rolloutInvoiceChat,
      currentAccountId,
      currentAccountType,
      clearInvoiceUnreadMessagesCount,
    } = this.props;

    const financed = (invoice.status === STATUSES.FINANCED);

    if (rolloutInvoiceChat && financed) {
      return (
        <InitiateChat
          currentAccountId={currentAccountId}
          currentAccountType={currentAccountType}
          invoice={invoice}
          clearInvoiceUnreadMessagesCount={clearInvoiceUnreadMessagesCount(invoice.id)}
        />
      );
    }

    return false;
  }

  renderTable() {
    const {
      data,
      maxPages,
      currentPage,
      onPageChange,
      loading,
      error,
    } = this.props;

    return (
      <div>
        <Table data={data} className="invoices-table invoices-table--no-border">
          <Table.Header>
            <Table.Row actAsExpander>
              <Table.HCell query={{ minWidth: SCREEN_SIZES.TABLET_PORTRAIT_UP }}>
                {t('debtor')}
              </Table.HCell>
              <Table.HCell>{t('advancement')}</Table.HCell>
              <Table.HCell query={{ minWidth: SCREEN_SIZES.TABLET_LANDSCAPE_UP }}>
                {t('financed')}
              </Table.HCell>
              <Table.HCell query={{ minWidth: SCREEN_SIZES.DESKTOP_UP }}>
                {t('maximum_fee')}
              </Table.HCell>
              <Table.HCell query={{ minWidth: SCREEN_SIZES.DESKTOP_UP }}>
                {t('duration')}
              </Table.HCell>
              <Table.HCell query={{ minWidth: SCREEN_SIZES.MID_DESKTOP_UP }}>
                {t('closing_date')}
              </Table.HCell>
              <Table.HCell query={{ minWidth: SCREEN_SIZES.MID_DESKTOP_UP }}>
                {t('repayment_date')}
              </Table.HCell>
              <Table.HCell query={{ minWidth: SCREEN_SIZES.MID_DESKTOP_UP }}>
                {t('status')}
              </Table.HCell>
              <Table.HCell />
              <Table.HCell />
            </Table.Row>
          </Table.Header>
          <Table.Body loading={loading} error={error}>
            {(invoice, index) => {
              const financedAmountPercentage = invoice.financedAmountPercentage * 100;

              const statusTooltip = (
                <Tooltip placement="bottom" id={`status-${index}`}>
                  {tStatusDescription(invoice.status)}
                </Tooltip>
              );

              return (
                <Table.Row
                  key={index}
                  actAsExpander
                  expandableContent={<Summary invoice={invoice} />}
                >
                  <Table.Cell>
                    <div>
                      {invoice.customerFirmName}&nbsp;
                      <a
                        title="Edit"
                        href={router.editSellerCustomerPath(invoice.customerId)}
                      >
                        <i className="fa fa-pencil small" />
                      </a>
                      <br />
                      <span className="text-muted text-nowrap">
                        {formatMoneyCHF(invoice.amount)}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <MoneyCell
                      amount={invoice.minimalAmount}
                      percentage={invoice.minimalAmountPercentage}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <AdvanonProgressBar
                      className="invoices-table__progress"
                      style={{ minWidth: 40 }}
                      now={financedAmountPercentage}
                      min={0}
                      max={100}
                      label={`${Math.round(financedAmountPercentage)}%`}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <MoneyCell
                      amount={invoice.maximumFee}
                      percentage={invoice.maximumFeePercentage}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <DateCell date={moment(invoice.repaymentDate).add(1, 'days').toDate()} />
                  </Table.Cell>
                  <Table.Cell>
                    <DateCell date={invoice.finishDate} />
                  </Table.Cell>
                  <Table.Cell>
                    <DateCell date={invoice.investorReceivesRepaymentDate} />
                  </Table.Cell>
                  <Table.Cell>
                    <OverlayTrigger placement="top" overlay={statusTooltip}>
                      <span className={`label label-${getLabelFor(invoice.status)}`}>
                        {tStatus(invoice.status)}
                      </span>
                    </OverlayTrigger>
                  </Table.Cell>
                  <Table.Cell>
                    <ActionsDropDown invoice={invoice} />
                  </Table.Cell>
                  <Table.Cell>
                    { this.renderChat(invoice) }
                  </Table.Cell>
                </Table.Row>
              );
            }}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell colSpan={9}>
                <Table.Pagination
                  currentPage={currentPage}
                  maxPages={maxPages}
                  onSelect={onPageChange}
                />
              </Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    );
  }

  render() {
    const { data } = this.props;

    return this.renderTable(data);
  }
}
