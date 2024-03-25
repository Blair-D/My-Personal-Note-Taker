const path = require("path"); 
const routerExp = require("express").routerExp(); 

// this is where the notes page route is defined
routerExp.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/notes.html"));
});

// this is where the homepage path is defined
routerExp.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// this is where the routerExp is exported 
module.exports = routerExp;
