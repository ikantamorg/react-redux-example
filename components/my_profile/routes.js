import { seller } from '../../../models/router';

import Layout from './layout';
import List from './list';

import companyDetailRoutes from './company_details/routes';
import creditLimitRoutes from './credit_limit/routes';
import verifyYourAccountRoutes from './verify_your_account/routes';
import settingsRoutes from './settings/routes';

const { myProfile } = seller;

export default [
  {
    component: Layout,
    isLayout: true,
    childRoutes: [
      {
        title: 'My Profile',
        path: myProfile.index,
        indexRoute: { component: List },
        childRoutes: [
          ...companyDetailRoutes,
          ...creditLimitRoutes,
          ...verifyYourAccountRoutes,
          ...settingsRoutes,
        ],
      },
    ],
  },
];
