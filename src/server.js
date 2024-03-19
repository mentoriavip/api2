if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const B2UBankRequest = require("./apis/b2ubank");

const corsOptions = {
  origin: "https://filmcash.site",
  optionsSuccessStatus: 200,
};

const app = express();

app.use(bodyParser.json());

const reqB2ubankReady = B2UBankRequest();

app.post("/send-pix", cors(corsOptions), async (req, res) => {
  const reqB2ubank = await reqB2ubankReady;

  const { pixKey, keyType } = req.body;

  try {
    const response = await reqB2ubank.post("/withdrawn/b2bank", {
      key: pixKey,
      amount: 0.1,
      keyType: keyType ? keyType : "cpf",
      description: "Pix Film Cash",
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(8000, () => {
  console.log("running");
});
