import '!style!css!sass!./extended_step_wrapper.scss';

import React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import classnames from 'classnames';

import SCREEN_SIZES from '../../../../constants/screen_sizes';

import { isModalExtended } from '../../../reducers/invoices/new';

export const ExtendedStepWrapper = (props) => {
  let content;

  if (props.extendedModal) {
    content = (
      <div>
        <MediaQuery minWidth={SCREEN_SIZES.TABLET_LANDSCAPE_DOWN}>
          <div className="row extended_step_wrapper__steps-row">
            <div className="col-sm-6 extended_step_wrapper__main-step">
              {props.mainStep}
            </div>
            <div className="col-sm-6 extended_step_wrapper__aditional-step">
              {props.additionalStep}
            </div>
          </div>
        </MediaQuery>
        <MediaQuery maxWidth={SCREEN_SIZES.TABLET_LANDSCAPE_DOWN}>
          <div className="extended_step_wrapper__main-step">
            {props.additionalStep}
          </div>
        </MediaQuery>
      </div>
    );
  } else {
    content = props.mainStep;
  }

  return (
    <div
      className={classnames('extended_step_wrapper', {
        'extended_step_wrapper--extended': props.extendedModal,
      })}
    >
      {content}
    </div>
  );
};

ExtendedStepWrapper.propTypes = {
  extendedModal: React.PropTypes.bool.isRequired,
  mainStep: React.PropTypes.object.isRequired,
  additionalStep: React.PropTypes.object.isRequired,
};

export default connect(
  state => ({ extendedModal: isModalExtended(state) }),
)(ExtendedStepWrapper);
