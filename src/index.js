const fs = require("fs");
const express = require("express");
const app = express();

const port = 3000;

let reports = requestJson("json/reports.json");

function requestJson(address) {
  let dataFile = fs.readFileSync(__dirname + "/" + address, "utf8");
  let dataParse = JSON.parse(dataFile);
  return dataParse;
}

app.get("/", (req, res) => {
  res.send("il server funziona");
});

app.get("/reports", (req, res) => {
  res.send(reports);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
