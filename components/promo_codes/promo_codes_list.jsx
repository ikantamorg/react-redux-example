import React from 'react';
import _ from 'lodash';

import PromoCode from './promo_code';
import I18nWithScope from '../../../models/i18n_with_scope';

const i18nWithScope = new I18nWithScope('');
const t = i18nWithScope.t.bind(i18nWithScope);

class PromoCodesList extends React.Component {
  static propTypes = {
    promoCodes: React.PropTypes.array.isRequired,
    routes: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = { promoCodes: props.promoCodes };
    this.onPromoCodeSelected = this.onPromoCodeSelected.bind(this);
  }

  onPromoCodeSelected(id) {
    this.setState({
      promoCodes: this.state.promoCodes.map((promoCode) => ({
        ...promoCode,
        selected: promoCode.id === id,
      })),
    }, () => {
      _.delay(() => Turbolinks.visit(this.props.routes.newSellerInvoicePath), 500);
    }
    );
  }

  render() {
    const { promoCodes } = this.state;

    if (promoCodes.length > 0) {
      return (
        <div>
          <p>
            {t('seller.referral_program.promo_codes.use_promo_codes_title')}
          </p>
          <div className="a-promo-codes-list">
            {
              promoCodes.map((promoCode, i) =>
                <div key={i}>
                  <PromoCode
                    onSelect={this.onPromoCodeSelected}
                    promoCode={promoCode}
                  />
                </div>
              )
            }
          </div>
        </div>
      );
    }

    return (
      <p className="m-t-sm">
        {t('seller.referral_program.promo_codes.no_promo_codes_title')}
      </p>
    );
  }
}

export default PromoCodesList;
