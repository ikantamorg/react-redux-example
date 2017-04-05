import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Alert } from 'react-bootstrap';

import ListGroup from '../../../../shared/components/list_group';
import ListGroupItem from '../../../../shared/components/list_group/item';

import StatementIcon from './assets/statements.png';

import { seller } from '../../../../models/router';

const navigate = (router, path) => () =>
  router.push(path);

const List = ({ router }) => (
  <div>
    <Alert bsStyle="info">
      We require financial documentation of your company to assess your credit limit.
      We treat your documents confidentially and do not share them with third parties.
    </Alert>
    <div>
      <ListGroup>
        <ListGroupItem
          imageComponent={<img src={StatementIcon} width={23} alt="Contract" />}
          onClick={navigate(router, seller.myProfile.creditLimit.bankStatements)}
        >
          <h4>Bank Statements</h4>
          <p>
            Please upload your bank statements of the last 3 months.
            It is important that these statements are detailed and show the incomes, expenses and saldo.
            If your company is less than 2 years old,
            please add the bank statements of the last 6 months or since founding of the business.
          </p>
        </ListGroupItem>
        <ListGroupItem
          imageComponent={<img src={StatementIcon} width={23} alt="Contract" />}
          onClick={navigate(router, seller.myProfile.creditLimit.financialStatements)}
        >
          <h4>Financial Statements</h4>
          <p>
            Upload the financial statements of your company of at least the last complete year.
            Should these not be available, please skip the step and make sure to provide bank statements instead.
          </p>
        </ListGroupItem>
        {/* <ListGroupItem
          onClick={navigate(router, seller.myProfile.creditLimit.others)}
        >
          <h4>Others</h4>
          <p>{lipsum}</p>
        </ListGroupItem> */}
      </ListGroup>
    </div>
  </div>
);

List.propTypes = {
  router: PropTypes.object.isRequired,
};

export default withRouter(List);
