#! /usr/bin/env node

console.log(
  "This script populates some test items and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Item = require("./models/item");
var Category = require("./models/category");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var items = [];
var categories = [];

function categoryCreate(name, description, cb) {
  const category = new Category({ name, description });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function itemCreate(category, description, name, price, quantity, cb) {
  const item = new Item({ category, description, name, price, quantity });

  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Item: " + item);
    items.push(item);
    cb(null, item);
  });
}

function createCategories(cb) {
  async.series([
    function (callback) {
      categoryCreate(
        "Badminton",
        "Badminton is a racquet sport played using racquets to hit a shuttlecock across a net. Although it may be played with larger teams, the most common forms of the game are 'singles' and 'doubles'.",
        callback
      );
    },
    function (callback) {
      categoryCreate(
        "Cricket",
        "Cricket is a bat-and-ball game played between two teams of eleven players on a field at the centre of which is a 22-yard pitch with a wicket at each end, each comprising two bails balanced on three stumps.",
        callback
      );
    },
    function (callback) {
      categoryCreate(
        "Soccer",
        "Association football, more commonly known as simply football or soccer, is a team sport played with a spherical ball between two teams of 11 players.",
        callback
      );
    },
    function (callback) {
      categoryCreate(
        "Tennis",
        "Tennis is a racket sport that can be played individually against a single opponent or between two teams of two players each. Each player uses a tennis racket that is strung with cord to strike a hollow rubber ball covered with felt over or around a net and into the opponent's court.",
        callback
      );
    },
  ], cb);
}
function createItems(cb) {
  async.series([
    function (callback) {
        itemCreate(
        categories[0],
        `Grip size: G4 (3.25 inches)| Weight: 3U (85-92 grams)
            Color: MP 33 - light green | head shape: Isometric
            String level: 30 pounds | string type: string
            Material: Graphite
            In-box Contents: 1 Badminton Racquet`,
        "Badminton Racquet",
        2109,
        3,
        callback
      );
    },
    function (callback) {
      itemCreate(
        categories[0],
        `The outer material is of Mesh & PVC Synthetic Leather with Solid & Striped heel printing. Available with rubber sole .
            The shoe is available with Solid & Striped printing .
            The Nivia Badminton shoe comes in all sizes with an attractive design.
            The pair looks graceful while wearing .`,
        "Badminton Shoes",
        800,
        5,
        callback
      );
    },
    function (callback) {
      itemCreate(
        categories[1],
        `In Box contents: 1 Cricket Bat with Cover | Material: Kashmir Willow | Needs Knocking: Yes | With Cover: Yes | Has Toe Guard: No
            Suitable For: Leather Ball | Weight: 1170-1220gm | Sweet Spot: Medium | Spine Profile: Medium
            Playing Style: All-Round
            Handle-Singapore cane handle with special 3 way insertion of rubber in between splits for enhanced flexibility and shock absorption.`,
        "Cricket Bat",
        1243,
        2,
        callback
      );
    },
    function (callback) {
      itemCreate(
        categories[1],
        `Last uptill 35-40 overs in ideal conditions. High quality centre construction encased with layers of top quality portuguese cork wound with 100 percent wool
            A premium quality four-piece ball made from superior quality alum tanned leather chosen from the top grade hide`,
        "Cricket Ball",
        700,
        10,
        callback
      );
    },
    function (callback) {
      itemCreate(
        categories[1],
        `Protection to fingers with high density foam PVC finger rolls
            Additional foam padding for first 2 fingers of left hand
            Elasticated wrist with touch and close Velcro fastening
            Hard foam protection for lead hand thumb
            Better grip with premium faux leather PU material on the back of the palm
            Increased ventilation with perforated design at the palm`,
        "Cricket Gloves",
        659,
        5,
        callback
      );
    },
    function (callback) {
      itemCreate(
        categories[2],
        `Included Components : 1 Football | Color : White | Size : 5
            Suitable For: All Conditions | Ideal For: Training/Match
            Material : Rubber | Core/Bladder Material : Butyl | Construction Type: Machine Stitched | Number of Panel : Rubberized Moulded| Waterproof: Yes
            Suitable for: Hard Ground without Grass, Wet & Grassy Ground, Artificail Turf
            Stitching Type: Rubber Moulded`,
        "Soccer Ball",
        359,
        1,
        callback
      );
    },
    function (callback) {
      itemCreate(
        categories[3],
        `STREAMLINE BODY: Special handling line and color.
            TWICE VULCANIZED: Less wear and more durable.
            PORTABLE SIZE: Light-weight, easy to carry.
            WIDE APPLICABILITY: Perfect for beach cricket, good practice tool for beginner, intermediate and elite players, but also a good gift for children.
            LASTING DURABILITY: Interlocked wool fiber ensures the cricket tennis balls will play like new for as long as possible.`,
        "Tennis Ball",
        219,
        15,
        callback
      );
    },
  ], cb);
}

async.series(
  [createCategories, createItems],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("Test data created!");
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
