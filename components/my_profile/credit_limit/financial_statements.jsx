import '!style!css!sass!./financial_statements.scss';

import range from 'lodash/range';
import map from 'lodash/map';
import React, { PropTypes } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import { Alert, Panel } from 'react-bootstrap';

import FinancialDocumentUploader from '../../../../shared/components/document_uploader/financial_document_uploader';
import { getSellerId } from '../../../../reducers/account';
import DOCUMENTABLE_TYPES from '../../../../constants/documentable_types';

const YEAR_COUNT = 3;
const CURRENT_YEAR = moment().year();
const YEARS = range(CURRENT_YEAR - YEAR_COUNT, CURRENT_YEAR).reverse();

export const FinancialStatements = ({ sellerId }) => (
  <div className="a-my-profile-financial">
    <Alert bsStyle="info">
      Upload the financial statement of your company of at least the last complete year.
      If available, please provide your audited financial statement.
    </Alert>
    <div>
      {map(YEARS, (year, index) => (
        <Panel
          header={year}
          eventKey={year}
          key={year}
          defaultExpanded={index === 0}
          collapsible
        >
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6">
              <h4>Income statement</h4>
              <div>
                <FinancialDocumentUploader
                  sellerId={sellerId}
                  category={DOCUMENTABLE_TYPES.INCOME_STATEMENT}
                  year={year}
                />
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6">
              <h4>Balance sheet</h4>
              <div>
                <FinancialDocumentUploader
                  sellerId={sellerId}
                  category={DOCUMENTABLE_TYPES.BALANCE_SHEET}
                  year={year}
                />
              </div>
            </div>
          </div>
        </Panel>
      ))}
    </div>
  </div>
);

FinancialStatements.propTypes = {
  sellerId: PropTypes.number.isRequired,
};

export default connect(
  state => ({ sellerId: getSellerId(state) }),
)(FinancialStatements);
