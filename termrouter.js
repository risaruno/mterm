var express = require("express");
var ejs = require("ejs");
var jade = require("jade");
var path = require("path");
var fs = require("fs");
var multer = require("multer");
var app = express();

var folder = "/views/partials/images";
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + folder);
  },
  filename: (req, file, cb) => {
    const date = Date.now();
    cb(null, file.fieldname + "-" + date + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage });

var router = express.Router();
var ejsR = express.Router();
var jadeR = express.Router();

var server = app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set("view engine", "ejs")
  .set("view engine", "jade")
  .set("views", path.join(__dirname, "views"))
  .use("/", router)
  .use("/ejs", ejsR)
  .use("/jade", jadeR)
  .use("/images", express.static(path.join(__dirname + folder)));

router.get("/", (req, res) => {
  res.send(
    "<h1>Main Page</h1><br><a href='./ejs'>Ejs Page</a><br><a href='./jade'>Jade Page</a>"
  );
});
var ejsServer = ejsR
  .get("/", (req, res) => {
    res.render("termejs.ejs");
  })
  .post("/", upload.single("image"), (req, res) => {
    // const img = fs.readFileSync(req.file.path);
    // const encode_image = img.toString("base64");
    // const finalImg = {
    //   contentType: req.file.mimetype,
    //   image: encode_image,
    // };
    // const image =
    //   "data:image/" + finalImg.contentType + ";base64," + finalImg.image;
    const fullUrl = req.protocol + "://" + req.get("host") + "/";
    const ts = Date.now();
    const date = new Date(ts);
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();

    const name = req.body.name;
    const now = y + "/" + m + "/" + d;
    const message = req.body.message;
    const image = "images/" + req.file.filename;
    const body = {
      name: name,
      date: now,
      message: message,
      image: image,
      url: fullUrl + image,
    };
    res.render("termejs.ejs", body);
  });
var jadeServer = jadeR
  .get("/", (req, res) => {
    res.render("termjade.jade");
  })
  .post("/", upload.single("image"), (req, res) => {
    const fullUrl = req.protocol + "://" + req.get("host") + "/";
    const ts = Date.now();
    const date = new Date(ts);
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();

    const name = req.body.name;
    const now = y + "/" + m + "/" + d;
    const message = req.body.message;
    const image = "images/" + req.file.filename;
    const body = {
      name: name,
      date: now,
      message: message,
      image: image,
      url: fullUrl + image,
    };
    res.render("termjade.jade", body);
  });
app.listen(3000, () => {
  console.log("Server Term Start");
});
