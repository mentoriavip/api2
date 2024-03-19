const axios = require("axios");
const CryptoJS = require("crypto-js");

const generateNonce = () => {
  return Date.now().toString();
};

const generateSignature = (key, secret, nonce) => {
  const message = nonce + key;
  const hash = CryptoJS.HmacSHA256(message, secret);
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

  return hashInBase64;
};

const B2UBankRequest = async () => {
  const nonce = generateNonce();
  const signature = generateSignature(
    process.env.EFI_CLIENT_KEY,
    process.env.EFI_CLIENT_SECRET,
    nonce
  );

  return axios.create({
    baseURL: "https://back.b2ubank.com/api/v1",
    headers: {
      key: process.env.EFI_CLIENT_KEY,
      nonce: nonce,
      signature: signature,
    },
  });
};

module.exports = B2UBankRequest;
