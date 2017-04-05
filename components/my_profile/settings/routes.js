import { seller } from '../../../../models/router';

import Index from './index';

const { myProfile } = seller;

export default [
  {
    title: 'Settings',
    path: myProfile.settings.index,
    indexRoute: {
      component: Index,
    },
  },
];
