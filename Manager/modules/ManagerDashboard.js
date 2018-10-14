exports = module.exports = {};
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";//removed  here


exports.queryDisplayGroups = function (queryName) {
    let query = {username: queryName};
    return new Promise(function (resolve, reject) {
        return MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
            if (err) throw err;
            let dbo = db.db("Echo");
            dbo.collection("displayGroup").find(query).toArray(function (err, result) {
                if (err)
                    reject(err);
                else
                    resolve(result);
            })
            db.close();
        });

    });
}

exports.addGroup = function (userName, displayGroupName) {
    let query = {username: userName, displayGroupName: displayGroupName};

    return new Promise(function (resolve, reject) {
        return MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
            if (err) throw err;
            let dbo = db.db("Echo");
            dbo.collection("displayGroup").insertOne(query,function (err) {
                if (err)
                    reject(err);
                else
                    resolve("Insert " + query + " successfully");
            })
            db.close();
        });

    });


}
