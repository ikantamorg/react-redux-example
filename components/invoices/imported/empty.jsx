import '!style!css!sass!./empty.scss';
import ConnectIcon from '-!svg-react!./empty/connect_icon.svg';
import UploadManuallyIcon from '-!svg-react!./empty/upload_manually_icon.svg';

import React, { PropTypes } from 'react';
import I18nWithScope from '../../../../models/i18n_with_scope';
import router from '../../../../models/router';

import NewInvoiceButton from '../new/button';
import OpenModalButton from '../shared/open_modal_button';
import BrowseSoftware from './empty/browse_software';
import SyncImportedInvoices from '../imported/sync_imported_invoices';

const i18nWithScope = new I18nWithScope('components.invoices.imported.empty');
const t = i18nWithScope.t.bind(i18nWithScope);

const BexioContent = ({ currentSeller, fetchImportedInvoices, beforeImport }) => {
  const buttonContent = (
    <span>
      {t('import_now')} <i className="fa fa-chevron-right a-imported-empty--bexio__button-icon" />
    </span>
  );

  return (
    <div className="a-imported-empty a-imported-empty--bexio">
      <div className="a-imported-empty--bexio__logo-column">
        <div className="a-bexio-logo m-t-md" />
      </div>
      <div className="a-imported-empty--bexio__content-column">
        <h4>{t('import_from_bexio')}</h4>
        <p>{t('connect_description')}</p>
        <SyncImportedInvoices
          currentSellerId={currentSeller.id}
          onClick={fetchImportedInvoices}
          beforeImport={beforeImport}
          buttonContent={buttonContent}
          buttonClassName="btn btn-primary nav-cta-button"
        />
      </div>
    </div>
  );
};

BexioContent.propTypes = {
  beforeImport: PropTypes.func,
  currentSeller: PropTypes.object.isRequired,
  fetchImportedInvoices: PropTypes.func.isRequired,
};

const RegularContent = ({ currentSeller }) => (
  <div className="a-imported-empty">
    <div className="a-imported-empty__row">
      <div className="a-imported-empty__cell1">
        <ConnectIcon />
      </div>
      <div className="a-imported-empty__cell2">
        <h2 className="m-t-0">{t('connect')}</h2>
        <p
          className="m-b-0 a-imported-empty__short-description"
          dangerouslySetInnerHTML={{ __html: t('connect_short_description') }}
        />
      </div>
      <div className="a-imported-empty__cell3">
        <p className="m-y-0 a-imported-empty__description">
          {t('connect_description')}
        </p>
      </div>
      <div className="a-imported-empty__cell4">
        <OpenModalButton
          customButton={
            <a href={router.bexioSamlInitPath()} className="a-imported-empty__action">
              {t('browse')}
              <i className="fa fa-chevron-right a-imported-empty__chevron" aria-hidden="true" />
            </a>
          }
        >
          <BrowseSoftware currentSeller={currentSeller} />
        </OpenModalButton>
      </div>
    </div>
    <div className="a-imported-empty__row">
      <div className="a-imported-empty__cell1">
        <UploadManuallyIcon />
      </div>
      <div className="a-imported-empty__cell2">
        <h2 className="m-t-0">{t('upload_manually')}</h2>
        <p
          className="m-b-0 a-imported-empty__short-description"
          dangerouslySetInnerHTML={{ __html: t('upload_manually_short_description') }}
        />
      </div>
      <div className="a-imported-empty__cell3">
        <p className="m-y-0 a-imported-empty__description">
          {t('upload_manually_description')}
        </p>
      </div>
      <div className="a-imported-empty__cell4">
        <NewInvoiceButton
          minimized={false}
          customButton={
            <a href="" className="a-imported-empty__action">
              {t('proceed')}
              <i className="fa fa-chevron-right a-imported-empty__chevron" aria-hidden="true" />
            </a>
          }
        />
      </div>
    </div>
  </div>
);

RegularContent.propTypes = {
  currentSeller: PropTypes.object.isRequired,
};

const Empty = ({
  userFromBexio,
  currentSeller,
  fetchImportedInvoices,
  beforeImport,
}) => {
  if (userFromBexio) {
    return (
      <BexioContent
        fetchImportedInvoices={fetchImportedInvoices}
        currentSeller={currentSeller}
        beforeImport={beforeImport}
      />
    );
  }
  return (
    <RegularContent currentSeller={currentSeller} />);
};

Empty.propTypes = {
  userFromBexio: PropTypes.bool,
  currentSeller: PropTypes.object.isRequired,
  fetchImportedInvoices: PropTypes.func.isRequired,
  beforeImport: PropTypes.func,
};

export default Empty;
