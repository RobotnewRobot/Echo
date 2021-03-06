var exports = module.exports = {};
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb+srv://Shared:1q2w3e4r.@cluster0-urxdu.mongodb.net";//removed mydb here


exports.LoginCheck = function (username, password, callback) {
    //might be future securities risk of using var
    var managerLogin = false;
    var displayLogin = false;
    MongoClient.connect(url, {useNewUrlParser: true}, async function (err, db) {
        if (err) throw err;
        let dbo = db.db("Echo");//Base on database name
        let queryManager = {username: username, managerPassword: password};//{$and: [{username: username}, {managerPassword: password}]};
        let queryDisplay = {username: username, displayPassword: password};

        try {
            managerLogin = await queryUser(dbo, queryManager);
            console.log("Manager Login statue is " +managerLogin);
            displayLogin = await queryUser(dbo, queryDisplay);
            console.log("Display Login statue is " +displayLogin);
            callback(err, managerLogin, displayLogin);

        } catch (e) {
            callback(e, managerLogin, displayLogin);
        }
        db.close();
    })


};

function queryUser(dbo, query) {
    return new Promise(function (resolve, reject) {
        console.log(query);
        dbo.collection("users").find(query).count(function (err, result) {
            if (err) reject(err);
            else if (result > 0) {
                console.log(result);
                resolve(true);
            }
            else {
                console.log(result);
                resolve(false);
            }
        });
    });
}


/*
        dbo.collection("user").find(queryManager).count(function (err, result) {
            if (err) throw err;
            if (result > 0) managerLogin = true;
            console.log(result);
            console.log(managerLogin);

        });

        dbo.collection("user").find(queryDisplay, function (err, result) {
            if (err) throw err;
            if (result.rowsAffected > 0) displayLogin = true;
        });
        */