var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require('mongodb');

var Chance = require("chance");
var chance = new Chance();

var app = express();
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 
var routes = require("./routes/routes.js")(app);

var MongoClient = require('mongodb').MongoClient;
var db;

// Initialize connection once
MongoClient.connect("mongodb://localhost:27017/tmb_rest_apis", function(err, database) {
  if(err) throw err;

  db = database;

  // Start the application after the database connection is ready
  var server = app.listen(3000, function () {
    console.log("Successfully connected to " + database.databaseName);
    console.log("Listening on port %s...", server.address().port);
    });
});

// Reuse database object in request handlers
app.get("/", function(req, res) {

var reqUserName = req.query.username;

var results;

db.collection("mongo_cases").find({"case_at_user" : reqUserName}).toArray(function(err, data) {

        results = {
            "cases" : data
        };
        
        
        

        if (err) {
            res(err);
            console.log(err);
        } else {
            //console.log(data);
            res.json(results)


        }
    });
});

app.get('/account', function (req, res) {

    var reqName = req.query.name;

    var gen_pass = chance.string();
    var accountMock = {
        accountCollection : [
            {
                "username": reqName,
                "password": gen_pass,
                "twitter": "@"+reqName
            }
        ]
    }

    return res.send(accountMock);

});