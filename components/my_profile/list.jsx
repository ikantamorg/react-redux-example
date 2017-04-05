import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';

import { seller } from '../../../models/router';
import Location from '../../../models/location';

import ListGroup from '../../../shared/components/list_group';
import ListGroupItem from '../../../shared/components/list_group/item';

import UserIcon from './assets/user.png';
import CreditLimitIcon from './assets/credit_limit.png';
import SettingsIcon from './assets/settings.png';

const lipsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Pellentesque odio sem, luctus ac justo id, fermentum varius lacus.
  Etiam quis mauris tellus. Nulla eu tincidunt arcu. Pellentesque felis augue,
  sollicitudin eu molestie in, imperdiet id turpis.
  Cras accumsan mauris sit amet neque varius semper. Pellentesque in vehicula elit.`;

const navigate = (router, path) => () =>
  router.push(path);

const { myProfile } = seller;

const List = ({ router }) => (
  <ListGroup>
    <ListGroupItem
      imageComponent={<img src={UserIcon} width={33} alt="Contract" />}
      onClick={navigate(router, myProfile.verifyYourAccount.index)}
    >
      <h4>Verify Your Account</h4>
      <p>In order to fully activate your account, please complete all verification steps.</p>
    </ListGroupItem>
    <ListGroupItem
      imageComponent={<img src={CreditLimitIcon} width={33} alt="Contract" />}
      onClick={navigate(router, myProfile.creditLimit.index)}
    >
      <h4>Increase Credit Limit</h4>
      <p>
        To evaluate your company, we require your latest financial information.
        The more information we have about your company, the better we can work on increasing your credit limits and decreasing the prices you pay on our platform.
        We treat your documents confidentially and do not share them with third parties.
      </p>
    </ListGroupItem>
    <ListGroupItem
      imageComponent={<img src={SettingsIcon} width={33} alt="Contract" />}
      onClick={() => (Location.visit(seller.settingsPath))}
    >
      <h4>Settings</h4>
      <p>{lipsum}</p>
    </ListGroupItem>
  </ListGroup>
);

List.propTypes = {
  router: PropTypes.object.isRequired,
};

export default withRouter(List);
