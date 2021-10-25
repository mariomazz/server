const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const ip = require("ip").address();
const app = express();
const port = 1000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get("/", (req: any, res: { send: (arg0: string) => void }) => {
  res.send("il server funziona");
});

app.listen(port, () => {
  console.log(`server listening at http://${ip}:${port}`);
});
