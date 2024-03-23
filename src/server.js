if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const cors = require("cors");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const express = require("express");
const bodyParser = require("body-parser");
const B2UBankRequest = require("./apis/b2ubank");

const generateNonce = () => {
  return Date.now().toString();
};

const generateSignature = (key, secret, nonce) => {
  const message = nonce + key;
  console.log(message);
  const hash = CryptoJS.HmacSHA256(message, secret);
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

  console.log(hashInBase64);

  return hashInBase64;
};

const corsOptions = {
  origin: "http://localhost:8100",
  optionsSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));

app.use(bodyParser.json());

const reqB2ubankReady = B2UBankRequest();

const generateRandomValue = () => {
  return Math.random() * (0.1 - 0.01) + 0.01;
};

const treatKeyType = (key) => {
  if (key.length === 11) {
    return "cpf";
  } else if (key.length === 14) {
    return "cnpj";
  } else if (key.includes("@")) {
    return "email";
  } else if (key.includes("+")) {
    return "telefone";
  } else {
    return "aleatoria";
  }
};

app.post("/send-pix", async (req, res) => {
  const { pixKey } = req.body;

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://back.b2ubank.com/api/v1/withdrawn/b2bank",
    headers: {
      key: process.env.EFI_CLIENT_KEY,
      nonce: generateNonce(),
      signature: generateSignature(
        process.env.EFI_CLIENT_KEY,
        process.env.EFI_CLIENT_SECRET,
        generateNonce()
      ),
    },
    data: {
      key: pixKey,
      keyType: treatKeyType(pixKey),
      amount: 0.01,
      description: "Pix Film Cash",
    },
  };

  axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      res.status(500).json({ error: error });
    });
});

app.listen(8000, () => {
  console.log("running");
});
