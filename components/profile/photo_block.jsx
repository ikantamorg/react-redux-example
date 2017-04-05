import React from 'react';

import backendApi from '../../../models/backend_api';
import PhotoUploader from '../../../shared/components/uploader/photo_uploader';

export default class SellerPhotoBlock extends React.Component {
  static propTypes = {
    currentPhoto: React.PropTypes.string,
    photoClassName: React.PropTypes.string,
    photoAlt: React.PropTypes.string,
    sellerId: React.PropTypes.number.isRequired,
    sellerPublicProfileId: React.PropTypes.number.isRequired,
  }

  removePhoto = () => {
    const { sellerId, sellerPublicProfileId } = this.props;
    return backendApi.sellerRemoveLogo(sellerId, sellerPublicProfileId)
      .then((response) => {
        if (response.logo) {
          return response.logo;
        }
        return null;
      });
  }

  uploadPhoto = (file) => {
    const { sellerId, sellerPublicProfileId } = this.props;
    return backendApi.sellerUploadLogo(sellerId, sellerPublicProfileId, file)
      .then((response) => {
        if (response.logo) {
          return response.logo;
        }
        return null;
      });
  }

  render() {
    const { currentPhoto, photoClassName, photoAlt } = this.props;
    return (
      <PhotoUploader
        onRemovePhoto={this.removePhoto}
        onUploadPhoto={this.uploadPhoto}
        currentPhoto={currentPhoto}
        photoClassName={photoClassName}
        photoAlt={photoAlt}
      />
    );
  }
}
