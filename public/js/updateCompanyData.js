const fs = require("fs");
const path = require("path");

const axios = require("axios");

const dataDirPath = path.resolve(__dirname, "../data");

const companySearch = "micro";
const companySymbol = "MSFT";
const apiKey1 = process.env.STOCK_API_KEY;


const symbolSearchUrl =
  "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" +
  companySearch +
  "&apikey=" +
  apiKey1;
const companyDetailsUrl =
  "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" +
  companySymbol +
  "&apikey=" +
  apiKey1;
const companyStockDataUrl =
  "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" +
  companySymbol +
  "&apikey=" +
  apiKey1;

axios.get(companyStockDataUrl).then(function ({ data }) {
    console.log(data)
  fs.writeFile(
    path.join(dataDirPath, "company_stock.json"),
    JSON.stringify(data, null, 2),
    function (err) {
      console.log("Saved Data!");
    }
  );
});

axios.get(symbolSearchUrl).then(function ({ data }) {
  fs.writeFile(
    path.join(dataDirPath, "symbol_search.json"),
    JSON.stringify(data, null, 2),
    function (err) {
      console.log("Saved Data!");
    }
  );
});

axios.get(companyDetailsUrl).then(function ({ data }) {
  fs.writeFile(
    path.join(dataDirPath, "company_details.json"),
    JSON.stringify(data, null, 2),
    function (err) {
      console.log("Saved Data!");
    }
  );
});

