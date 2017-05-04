var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require('mongodb');

var Chance = require("chance");
var chance = new Chance();

var app = express();
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 
var routes = require("./routes/routes.js")(app);

//Connect to mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/tmb_rest_apis');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
    var server = app.listen(3000, function () {
        console.log("Successfully connected to " + db.name);
        console.log("Listening on port %s...", server.address().port);
    });
});


// Reuse database object in request handlers
app.get("/", function(req, res) {

var reqUserName = req.query.username;

var results;

db.collection("mongo_cases").find( { $and: [{case_at_user :  reqUserName }, { case_status : { $ne: "Closed" } } ]}).toArray(function(err, data) {

        for (var i in data) {
            //var rDate = Date(data[i].case_received_date);
            //date.format("dd/mm/yyyy");
            //console.log(date);
            //var rDate_str = rDate.toLocaleDateString();
            var jsonDate = (new Date(data[i].case_received_date)).toJSON();
            var backToDate = new Date(jsonDate);
            //console.log(jsonDate);

            data[i].case_received_date = jsonDate;
        }

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

app.get('/update', function (req, res) {

    var reqName = req.query.username;
    console.log(reqName);
    var reqApp = req.query.app;
    console.log(reqApp);
    var results;

    results = { case : 
        {
            result : "Success"
        } 
    }

    db.collection("mongo_cases").findAndModify(
    { case_at_user : reqName , case_application_no : reqApp },
    [], 
    { $set: { case_status : "afterNCB" } },
    { upsert: true }, 
    function (err, doc) {

        if (err) {
            res(err);
            console.log(err);
        } else {
            //console.log(data);
            res.json(results)
        }
    });
    
});