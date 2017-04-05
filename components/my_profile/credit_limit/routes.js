import { seller } from '../../../../models/router';

import Index from './index';
import BankStatements from './bank_statements';
import FinancialStatements from './financial_statements';
import Others from './others';

const { myProfile } = seller;

export default [
  {
    title: 'Credit Limit',
    path: myProfile.creditLimit.index,
    indexRoute: {
      component: Index,
    },
    childRoutes: [
      {
        title: 'Bank Statements',
        path: myProfile.creditLimit.bankStatements,
        components: {
          children: BankStatements,
        },
      },
      {
        title: 'Financial Statements',
        path: myProfile.creditLimit.financialStatements,
        components: {
          children: FinancialStatements,
        },
      },
      {
        title: 'Credit Limit',
        path: myProfile.creditLimit.others,
        components: {
          children: Others,
        },
      },
    ],
  },
];
