import noop from 'lodash/noop';
import classnames from 'classnames';
import React, { PropTypes } from 'react';
import ArrowRightIcon from '-!svg-react!../../../../../../images/arrow_right.svg';

import I18nWithScope from '../../../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('components.invoices.imported.browse_software');
const t = i18nWithScope.t.bind(i18nWithScope);

const BrowseSoftwareItem = ({
  title,
  description,
  enabled,
  logoClassName,
  onClick,
  selected,
}) => {
  const disabled = !enabled;
  return (
    <div
      className={classnames('a-software-box__item', {
        'a-software-box__item--disabled': disabled,
        'a-software-box__item--selected': selected,
      })}
      onClick={enabled && !selected ? onClick : noop}
    >
      <div className={classnames('a-software-box__item-logo', logoClassName)} />
      <div className="a-software-box__item-content">
        <h4>
          {title} {disabled && <small>{t('available_soon')}</small>}
        </h4>
        <p>{description}</p>
      </div>
      <div>
        { selected ?
          <i
            className="fa fa-lg fa-check-circle a-software-box__item-selected-icon"
            aria-hidden="true"
          /> :
            <ArrowRightIcon className="a-software-box__item-icon" />
        }
      </div>
    </div>
  );
};

BrowseSoftwareItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  enabled: PropTypes.bool,
  logoClassName: PropTypes.string,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
};

BrowseSoftwareItem.defaultProps = {
  enabled: false,
  logoClassName: '',
  onClick: noop,
  selected: false,
};

export default BrowseSoftwareItem;
