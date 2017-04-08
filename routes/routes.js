var Chance = require("chance");
var chance = new Chance();

var appRouter = function(app) {

app.get("/", function(req, res) {
    res.send("Hello World");
});

app.get("/account", function(req, res) {

    var gen_name = chance.name();
    var gen_pass = chance.string();

    var accountMock = {

        "user_account": {
            "username": gen_name,
            "password": gen_pass,
            "twitter": "@"+gen_name
        }
    }
    // if(!req.query.username) {
    //     return res.send({"status": "error", "message": "missing username"});
    // } else if(req.query.username != accountMock.username) {
    //     return res.send({"status": "error", "message": "wrong username"});
    // } else {
        return res.send(accountMock);
    // }
});

// app.post("/account", function(req, res) {
//     if(!req.body.username || !req.body.password || !req.body.twitter) {
//         return res.send({"status": "error", "message": "missing a parameter"});
//     } else {
//         return res.send(req.body);
//     }
// });
 
}
 
module.exports = appRouter;