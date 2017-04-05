import '!style!css!sass!./email.scss';

import React, { PropTypes } from 'react';

import Pill from '../../../../shared/components/pill';

const VideoID = ({ isVerified }) => (
  <div className="a-my-profile__verify-email">
    <div className="m-r-md">
      <h4>Video Verification</h4>
      <p>
        Please enter your personal information and show both sides of your passport
        or identification card to complete this step.
      </p>
    </div>
    { isVerified &&
      <div>
        <Pill>Done</Pill>
      </div>
    }
  </div>
);

VideoID.propTypes = {
  isVerified: PropTypes.bool.isRequired,
};

export default VideoID;
