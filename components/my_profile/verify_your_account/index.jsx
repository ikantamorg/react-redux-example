import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';

import EmailIcon from './assets/email.png';
import ContractIcon from './assets/contract.png';
import IDIcon from './assets/id.png';

import { seller } from '../../../../models/router';

import ListGroup from '../../../../shared/components/list_group';
import ListGroupItem from '../../../../shared/components/list_group/item';

import EmailRow from './email';
import ContactRow from './contract';
import VideoIdRow from './video_id';

import { isVerifiedByIdNow } from '../../../../reducers/account';

const navigate = (router, path) => () =>
  router.push(path);

const { myProfile } = seller;

export const List = ({ router, isVerifiedByIdNow }) => (
  <div>
    <Alert bsStyle="info">In order to verify your account, please submit the missing information.</Alert>
    <div>
      <ListGroup>
        <ListGroupItem
          imageComponent={<img src={EmailIcon} width={33} alt="Email" />}
          clickable={false}
          hideIcon
        >
          <EmailRow />
        </ListGroupItem>
        {/* <ListGroupItem
          onClick={navigate(router, myProfile.verifyYourAccount.signatoryRights)}
        >
          <h4>Signatory Rights</h4>
          <p>{lipsum}</p>
        </ListGroupItem> */}
        <ListGroupItem
          imageComponent={<img src={ContractIcon} width={33} alt="Contract" />}
          clickable={false}
          hideIcon
        >
          <ContactRow />
        </ListGroupItem>
        <ListGroupItem
          imageComponent={<img src={IDIcon} width={33} alt="ID" />}
          onClick={navigate(router, myProfile.verifyYourAccount.id)}
          clickable={!isVerifiedByIdNow}
          hideIcon={isVerifiedByIdNow}
        >
          <VideoIdRow isVerified={isVerifiedByIdNow} />
        </ListGroupItem>
      </ListGroup>
    </div>
  </div>
);

List.propTypes = {
  router: PropTypes.object.isRequired,
  isVerifiedByIdNow: PropTypes.bool.isRequired,
};

export default withRouter(
  connect(
    state => ({ isVerifiedByIdNow: isVerifiedByIdNow(state) }),
  )(List)
);
