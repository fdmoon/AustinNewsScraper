// *********************************************************************************
// api-routes.js
// *********************************************************************************

// Dependencies
// =============================================================


// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

    // insert a new note!
    // req.params.id = Article._id
    app.post("/api/notes/:id", function(req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note
            .create(req.body)
            .then(function(dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function(dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // update a note!
    // req.params.id = Note._id
    app.put("/api/notes/:id", function(req, res) {
        db.Note
            .update( { _id: id}, req.body)
            .then(function(dbNote) {
                res.json(dbNote);
            })
            .catch(function(err) {
                res.json(err);
            });
    });

    app.put("/api/articles/:id", function(req, res) {
        db.Article
            .update( { _id: id}, req.body)
            .then(function(dbArticle) {
                res.json(dbArticle);
            })
            .catch(function(err) {
                res.json(err);
            });
    });

};
