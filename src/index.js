const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
var multer = require("multer");
const { readFile } = require("fs/promises");
var upload = multer({ dest: "src/file/" });
const ip = require("ip").address();
const app = express();

// initial configurations
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const port = 3000;

app.get("/", (req, res) => {
  res.send("il server funziona");
});
// ^ initial configurations

// functions
function readDirectory() {
  fs.readdir(__dirname + "/file", function (err, files) {
    if (err) {
      console.log("Unable to scan directory: " + err);
    }
    return files;
  });
}
// ^ functions

// get all file

app.get("/allFiles", (req, res) => {
  var files_ = new Array();
  fs.readdir(__dirname + "/file", function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    files.forEach(function (file) {
      console.log(file);
      files_.push(file);
    });
  });
  console.log(files_);
  res.send(files_);
});

// ^ get all file

// app flutter receive file

app.post("/receive-file", upload.single("file"), function (req, res) {
  console.log("Received file" + req.file.originalname);
  var src = fs.createReadStream(req.file.path);
  var dest = fs.createWriteStream("src/file/" + req.file.originalname);
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

// end app flutter  receive file

app.listen(port, () => {
  console.log(`server listening at http://${ip}:${port}`);
});
