const QRCode = require('qrcode');

const generateQRCode = async (businessCard) => {
  try {
    const { _id, name, phone, location, expertise } = businessCard;
    const data = JSON.stringify({ _id, name, phone, location, expertise });
    const qrCodeDataURL = await QRCode.toDataURL(data);
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

module.exports = {
  generateQRCode,
};
