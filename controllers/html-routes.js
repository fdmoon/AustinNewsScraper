// *********************************************************************************
// html-routes.js
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

    app.get("/", function(req, res) {
        db.Article
            .find(
                { saved: false },           // Search Filters
                [],                         // Columns to Return
                {
                    limit: 20,              // Ending Row
                    sort: { postid: -1 }    // Order by (1: ASC, -1: DESC)
                }
            )
            .then(function(dbArticle) {
                var hbsObject = {
                    hasArticles: (dbArticle.length > 0) ? true : false,
                    articles: dbArticle
                }
                res.render("index", hbsObject);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });

        // res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    app.get("/saved", function(req, res) {
        db.Article
            .find(
                { saved: true },            // Search Filters
                [],                         // Columns to Return
                {
                    sort: { postid: -1 }    // Order by (1: ASC, -1: DESC)
                }
            )
            .populate("notes")
            .then(function(dbArticle) {
                var hbsObject = {
                    hasArticles: (dbArticle.length > 0) ? true : false,
                    articles: dbArticle
                }
                res.render("saved", hbsObject);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });

        // res.sendFile(path.join(__dirname, "../public/saved.html"));
    });

    app.get("/articles", function(req, res) {
        // Grab every unsaved document in the Articles collection
        db.Article
            .find(
                { saved: false },           // Search Filters
                [],                         // Columns to Return
                {
                    limit: 20,              // Ending Row
                    sort: { postid: -1 }    // Order by (1: ASC, -1: DESC)
                }
            )
            .then(function(dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.get("/articles/saved", function(req, res) {
        // Grab every saved document in the Articles collection
        db.Article
            .find(
                { saved: true },            // Search Filters
                [],                         // Columns to Return
                {
                    sort: { postid: -1 }    // Order by (1: ASC, -1: DESC)
                }
            )
            .populate("notes")
            .then(function(dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });    

    app.get("/articles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article
            .findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("notes")
            .then(function(dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

};
