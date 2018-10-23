let express = require('express');
let app = module.exports = express();
let path = require('path');
let multer = require('multer');
let dba = require("../modules/ImageModule.js");
let dbb = require("../modules/CommandModule.js")

const fs = require("fs");

//file uploader configuration
let storageConfig = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '../Echo/Manager/public/userUpload/');//this is where the files go
    },
    filename: function (req, file, callback) {
        if (file.mimetype === 'image/png')//if files is PNG append with .png
            callback(null, file.fieldname + '-' + Date.now() + '.png');//This is file name was set as file name + current time
    }
});

let upload = multer({storage: storageConfig}).array("file", 10);
app.use(express.static("public"));
//end file uploader config


//This handles the user drag and drop upload request
app.post("/upLoadImageHandler", function (req, res) {
    let groupID = req.query.groupID;// get the ID of that group to know where to manage
    upload(req, res, async function (err) {// The maximum number of uploading is 10 don't go over that.
        if (err instanceof multer.MulterError) {
            console.log(err);
        }
        else if (err) {
            throw err
        }
        else {
            console.log(req.files);
            for (let image of req.files) {
                dba.addOneImageInfoToDatabase(groupID, image.path, image.filename);// This function take a display group ID and image path store in the database
                dbb.addDefaultCommand(image.filename)// If each image uploaded will be add a default command
            }
            res.send("Upload Finished");
        }
    })

});
app.post("/deleteAllImageHandler", async function (req, res) {
    let groupID = req.query.groupID;
    let allImageName = await dba.queryAllImageNames(groupID);
    for (let imageName of allImageName) {
        dbb.deleteCommand(imageName.imageName);//Delete commands before deleting images
        console.log(imageName.imageName);
    }
    dba.deleteAllImagesInDisplayGroup(groupID);
    res.redirect("/EditDisplay?groupID=" + groupID);
});

app.post("/deleteOneImageHandler", async function (req, res) {
    let groupID = req.query.groupID;
    let imageID = req.query.imageID;
    console.log(imageID);
    await dba.deleteOneImageInDatabase(imageID);
    res.redirect("/EditDisplay?groupID=" + groupID);
});