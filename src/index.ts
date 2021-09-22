const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
var multer = require("multer");
const { readFile } = require("fs/promises");
var upload = multer({ dest: "src/file/" });
const ip = require("ip").address();
const app = express();

class MyFile {
  constructor(nameFile: string, id: string) {
    this.nameFile = nameFile;
    this.id = id;
  }

  public nameFile: string;
  public id: string;
}

var files: MyFile[] = [];

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

fs.readdir(__dirname + "/file", function (err: string, nameFiles: string[]) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  nameFiles.forEach((nameFile) => {
    //console.log(nameFile);

    files.push(new MyFile(nameFile, uuidv4()));
  });
});

// initial configurations
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const port = 3000;

app.use("/file", express.static(__dirname + "/file"));

app.get("/", (req: any, res: { send: (arg0: string) => void }) => {
  res.send("il server funziona");
});

// ^ initial configurations

// get all file

app.get("/allFiles", (req: any, res: { send: (arg0: MyFile[]) => void }) => {
  fs.readdir(__dirname + "/file", function (err: string, nameFiles: string[]) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    files = nameFiles.map((nameFile) => new MyFile(nameFile, uuidv4()));

    /* nameFiles.forEach((nameFile) => {
      console.log(nameFile);

      files.push(new MyFile(nameFile, uuidv4()));
    }); */
  });
  if (files == []) {
    res.send([]);
  } else {
    res.send(files);
  }
});

// ^ get all file

// app flutter receive file

app.post(
  "/receive-file",
  upload.single("file"),
  function (
    req: { file: { originalname: string; path: any } },
    res: { json: (arg0: string) => void }
  ) {
    console.log("Received file" + req.file.originalname);

    var src = fs.createReadStream(req.file.path);
    var dest = fs.createWriteStream("src/file/" + req.file.originalname);
    src.pipe(dest);
    src.on("end", function () {
      fs.unlinkSync(req.file.path);
      var file = new MyFile(req.file.originalname, uuidv4());

      files.push(file);
      var successSend = { state: "success", filename: req.file.originalname };
      res.json(successSend.filename);
    });
    src.on("error", function (err: any) {
      res.json("Something went wrong!");
    });
  }
);

// end app flutter receive file

//remove file

app.post(
  "/delete-file",
  (req: { body: any }, res: { send: (arg0: string) => void }) => {
    fs.readdir(
      __dirname + "/file",
      function (err: string, nameFiles: string[]) {
        if (err) {
          return console.log("Unable to scan directory: " + err);
        }

        files = nameFiles.map((nameFile) => new MyFile(nameFile, uuidv4()));

        /* nameFiles.forEach((nameFile) => {
        console.log(nameFile);
  
        files.push(new MyFile(nameFile, uuidv4()));
      }); */
      }
    );
    try {
      var nameFile = req.body.key;

      files.forEach(function (file, index) {
        if (file.nameFile == nameFile) {
          files.splice(index);
        }
      });

      var filePath = __dirname + "/file/" + nameFile;
      fs.unlinkSync(filePath);

      res.send("success");
      console.log("file deleted : " + nameFile);
    } catch (err) {
      var nameFile = req.body.key;

      res.send("error");

      console.log("errore - file non cancellato : " + nameFile);
    }
  }
);

//end remove file

app.listen(port, () => {
  console.log(`server listening at http://${ip}:${port}`);
});
