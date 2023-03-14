const express = require("express");
const db = require("./db/db.json");
const fs = require("fs");

// Import built-in Node.js package 'path' to resolve path of files that are located on the server
const path = require("path");

// Initialize an instance of Express.js
const app = express();

// Specify on which port the Express.js server will run
const PORT = process.env.PORT || 3001;

// Static middleware pointing to the public folder
app.use(express.static("Develop/public"));
app.use(express.json());

// Create Express.js routes for default '/',  and '/notes' endpoints
app.get("/", (req, res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);
// get method to display notes in db.json
app.get("/api/notes", (req, res) => {
  res.json(db);
});
// post method to save notes to db.json
app.post("/api/notes", (req, res) => {
  console.log(req.body);
  db.push(req.body);
  fs.writeFile(
    path.join(__dirname, "db/db.json"),
    JSON.stringify(db),
    (err) => {
      if (err) console.log(err);
      else console.log("Successful");
    }
  );

  let response;

  // Check if there is anything in the response body
  if (req.body && req.body.product) {
    response = {
      status: "success",
      data: req.body,
    };
    res.status(201).json(response);
  } else {
    res.status(400).json("Request body must at least contain some data");
  }
});
// deleting notes by id
app.delete("/api/notes/:id", (req, res) => {
  db.forEach((element) => {
    if (element.id == req.params.id) {
      db.pop(element);
    }
  });
  fs.writeFile(
    path.join(__dirname, "db/db.json"),
    JSON.stringify(db),
    (err) => {
      if (err) console.log(err);
      else console.log("Successful");
    }
  );

  let response;

  // Check if there is anything in the response body
  if (req.body && req.body.product) {
    response = {
      status: "success",
      data: req.body,
    };
    res.status(201).json(response);
  } else {
    res.status(400).json("Request body must at least contain some data");
  }
});

// listen() method is responsible for listening for incoming connections on the specified port
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
