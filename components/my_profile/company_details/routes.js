import { seller } from '../../../../models/router';

import Index from './index';

const { myProfile } = seller;

export default [
  {
    title: 'Company details',
    path: myProfile.companyDetails.index,
    indexRoute: {
      component: Index,
    },
  },
];
