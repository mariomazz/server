const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;

app.get("/", (req, res) => {
  res.send("il server funziona");
});

//app flutter

//registered users

app.post("/registered-users", (req, res) => {
  dataRegistration = req.body;

  console.log(dataRegistration);

  res.send({ name: "mario" });
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
