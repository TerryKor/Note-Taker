const express = require("express");
const db = require("./db/db.json");
const fs = require("fs");

// Import built-in Node.js package 'path' to resolve path of files that are located on the server
const path = require("path");
const { json } = require("express");

// Initialize an instance of Express.js
const app = express();

// Specify on which port the Express.js server will run
const PORT = 3001;

// Static middleware pointing to the public folder
app.use(express.static("public"));

app.use(express.json());

// Create Express.js routes for default '/', '/send' and '/routes' endpoints
app.get("/", (req, res) => res.send("/home"));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/home", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.get("/api/notes", (req, res) => {
  //return (res.send(path.join(__dirname, 'db/db.js')))

  res.json(db);
});
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
    res.status(400).json("Request body must at least contain a product name");
  }
});

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
    res.status(400).json("Request body must at least contain a product name");
  }
});

// listen() method is responsible for listening for incoming connections on the specified port
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
