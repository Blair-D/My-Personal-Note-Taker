// Requires express to handle routes
const routerExp = require("express").routerExp(); 
// require uuid to create identifiers
const { v4: uuid } = require('uuid'); 
// require fs (file system)
const fs = require("fs"); 
// Path for the file where notes are stored
const savePath = path.join(__dirname, "../save_db");
const path = require("path"); 

// this is a adding new post route
routerExp.post("/notes", function (req, res) {
    notesRead((err, notes) => {
        if (err) {
            //if there is an error it send error response back
            res.status(500).send("Error occured when reading notes"); 
            return;
        }
        // this creates a new notes that also uses uuid to create a unique id for that note
        const noteNew = { ...req.body, id: uuid() }; 
        // this adds the new note
        notes.push(noteNew); 
        notesWrite(notes, (writeError) => {
            if (writeError) {
                //if there is an error it send error response back
                res.status(500).send("Error occured when writing notes"); 
            } else {
                res.json(noteNew); 
            }
        });
    });
});


// this is a read notes function 
function notesRead(callback) {
    fs.readFile(savePath, "utf8", (err, data) => {
        if (err) {
            //if an error is encountered then send it to the call back to notify the user
            callback(err); 
        } else {
            //if no error parse the data for the call back
            callback(null, JSON.parse(data)); 
        }
    });
}

// this is a function to write notes
function notesWrite(notes, callback) {
    //this writes notes to the file
    fs.writeFile(savePath, JSON.stringify(notes), (err) => {
        // if any errors then send error message to callback
        callback(err); 
    });
}

// this is a route for deleting notes previsouly stored
routerExp.delete("/notes/:id", function (req, res) {
    notesRead((err, notes) => {
        if (err) {
            // if error occurs when reading notes send back error message
            res.status(500).send("Error occured when reading notes"); 
            return;
        }
        // this allows the note to be updated by filtering what needs to be deleted
        const notesUpdated = notes.filter(note => note.id !== req.params.id); 
        notesWrite(notesUpdated, (writeError) => {
            if (writeError) {
                // if error occurs when deleting notes send back error message
                res.status(500).send("Error occured when deleting note"); 
            } else {
                // message that informs the user the note has successfully been deleted
                res.json({ message: "Note has been deleted" }); 
            }
        });
    });
});

// this is a route to retrieve notes
routerExp.get("/notes", function (req, res) {
    notesRead((err, notes) => {
        if (err) {
            // if error occurs send back message to user
            res.status(500).send("Error occured when reading notes"); 
        } else {
            res.json(notes);
        }
    });
});





module.exports = routerExp; // Export the routerExp for use in other parts of the application
