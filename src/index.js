const fs = require("fs");
const express = require("express");
const app = express();

const port = 3000;

app.get("/", (req, res) => {
  res.send("il server funziona");
});

//app flutter

//registered users

app.post("/registered-users", (req, res) => {
  console.log("request - registered users");
  res.send("post ricevuta");
});

//end registered users

//end app flutter

//reports

let reports = requestJson("json/reports/reports.json");

function requestJson(address) {
  let dataFile = fs.readFileSync(__dirname + "/" + address, "utf8");
  let dataParse = JSON.parse(dataFile);
  return dataParse;
}

app.get("/reports", (req, res) => {
  res.send(reports);
});

//end reports

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
