let express = require('express');
let app = module.exports = express();
let dba = require("./modules/ImageModule.js");
let dbb = require("./modules/CommandModule.js");
let imgCtrl = require("./subController/imageController.js");//Because this page is complex, need to spite into several sub controller
app.use(imgCtrl);
let cmdCtrl = require("./subController/commandController");//Because this page is complex, need to spite into several sub controller
app.use(cmdCtrl);
path = require("path");
//view engine set up
app.set('views', path.join(__dirname, 'views'));//Set the view engine path to views
app.set('view engine', 'pug');
app.use("/EditDisplay", express.static(path.join(__dirname, "public")));
//app.use("/EditDisplay", express.static(path.join("node_modules/viewerjs/dist")));//This is just for testing
//This must be redeclare for every app
//app.use(express.static("public"));
//end file uploader config

app.use("/css", express.static(path.join(__dirname, "../css/"))); //link stylesheet

app.get('/EditDisplay', async function (req, res) {
    let groupID = req.query.groupID;// get the ID of that group to know where to manage
    let displayGroupName = await dba.queryDisplayGroupNameByID(groupID);
    //let images = await dba.queryAllImages(groupID);// We might not need it anymore
    let imageAndCommand = await dbb.queryAllImageCommand(groupID);

    res.render('EditDisplay', {
        EditDisplay: 'EditDisplay',
        images: imageAndCommand,// Put image and command here view engine will accept that use image.imageCommand to access data in the imageCommand
        groupID: groupID,
        groupName: displayGroupName,
    });
});

///Test function a re here
app.get('/deleteOneImage', function (req, res) {
    console.log(dba.deleteOneImageInDatabase("5bcbcb1c55e1b91fa094ffcc"));//Deleted successful
});

app.get('/TestChangeState', async function (req, res) {
    let newstate = await dba.updateDisplayGroupState("5bcbaea27a56983a1414f27f");
    res.send(newstate);
});
app.get("/testImages", async function (req, res) {
    let images = await dba.queryAllImages(1234);
    // console.log(images);
    // res.send(images);
    //res.send(images[0].imagePath);
    console.log(path.basename(images[0].imagePath));
    res.send("<img alt=\"Poster\" id=\"poster\" src=\"" + "/userUpload/" + path.basename(images[0].imagePath) + "\">"
        // this is how to transfer location in database to location in the server file system
    );
});

