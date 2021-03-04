const express = require("express");
const app = express();


const mongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017";
const dbName = "node";
let db;

mongoClient.connect(url, (err, user) => {
  console.log("Connected successfully");
  db = user.db(dbName);
});

app.use(express.json());

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

app.listen(8080);
