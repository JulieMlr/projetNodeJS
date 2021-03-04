const express = require("express");
const app = express();

const path = require('path');
path.dirname('C:/Users/julie/B3_Ynov/DevBack/Projet/projetNodeJS');
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload/");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname;
    cb(null, `${ext}`);
  },
});

const upload = multer({
  storage: multerStorage,
});

const mongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017";
const dbName = "node";
let db;

mongoClient.connect(url, (err, user) => {
  console.log("Connected successfully");
  db = user.db(dbName);
});

app.use(express.json()); //permet a express de comprendre le json
app.use(express.urlencoded({ extended: true }));

app.get("/users", async (req, res) => {
  try {
    const usersInformations = await db.collection("user").find({}).toArray();
    res.json(usersInformations);
  } catch (err) {
    console.log(err);
  }
});

app.post("/users", async (req, res) => {
  try {
    const userData = req.body;
    const user = await db.collection("user").insertOne(userData);
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

app.get("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const docs = await db.collection("user").findOne({ id });
    res.json(docs);
  } catch (err) {
    console.log(err);
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const modifyUser = req.body;
    const user = await db
      .collection("user")
      .updateOne({ id: id }, { $set: modifyUser });
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const users = await db.collection("user").deleteOne({ id: id });
    res.json(users);
  } catch (err) {
    console.log(err);
  }
});

app.post("/upload/:id", upload.single("file"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const users = await db
      .collection("user")
      .updateOne({ id: id }, { $set: { image: req.file.filename } });
    console.log(users);
    res.json(users);
  } catch (err) {
    console.log(err);
  }
});

app.get("/image/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const userImage = await db.collection("user").findOne({ id });
    res.send("<img src='./upload/"+ userImage.image +"' alt='image'/>");
  } catch (err) {
    console.log(err);
  }
});

app.listen(8080);
