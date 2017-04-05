import { seller } from '../../../../models/router';

import Index from './index';
import Email from './email';
import SignatoryRights from './signatory_rights';
import Contract from './contract';
import VideoId from './video_id/index';
import VideoIdFrame from './video_id/frame';

const { myProfile } = seller;

export default [
  {
    title: 'Verify your account',
    path: myProfile.verifyYourAccount.index,
    indexRoute: {
      component: Index,
    },
    childRoutes: [
      {
        title: 'Email',
        path: myProfile.verifyYourAccount.email,
        components: {
          children: Email,
        },
      },
      {
        title: 'Signatory rights',
        path: myProfile.verifyYourAccount.signatoryRights,
        components: {
          children: SignatoryRights,
        },
      },
      {
        title: 'Contract',
        path: myProfile.verifyYourAccount.contract,
        components: {
          children: Contract,
        },
      },
      {
        title: 'Video verification',
        indexRoute: { component: VideoId },
        path: myProfile.verifyYourAccount.id,
        childRoutes: [
          {
            title: 'Live identification',
            path: myProfile.verifyYourAccount.id_frame,
            component: VideoIdFrame,
          },
        ],
      },
    ],
  },
];
