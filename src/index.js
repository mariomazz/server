const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer({ dest: "file/" });
const ip = require("ip").address();
//console.dir(ip.address());

const app = express();
//app.use(bodyParser.urlencoded({ extended: true }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
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

  res.send({ state: "success" });
});

//end registered users

//end app flutter

//app flutter receive file

app.post("/receive-file", upload.single("file"), function (req, res) {
  var lines = process.stdout.getWindowSize()[1];
  for (var i = 0; i < lines; i++) {
    console.log("\r\n");
  }
  console.log("Received file" + req.file.originalname);
  var src = fs.createReadStream(req.file.path);
  var dest = fs.createWriteStream("file/" + req.file.originalname);
  src.pipe(dest);
  src.on("end", function () {
    fs.unlinkSync(req.file.path);
    var successSend = { state: "success", filename: req.file.originalname };
    res.json(successSend);
  });
  src.on("error", function (err) {
    res.json("Something went wrong!");
  });
});

//end app flutter  receive file

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
  console.log(`Example app listening at http://${ip}:${port}`);
});
