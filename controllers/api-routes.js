// *********************************************************************************
// api-routes.js
// *********************************************************************************

// Dependencies
// =============================================================
// scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

    const articleCreatePromise = (article) => {
        return new Promise((resolve,reject) => {
            db.Article.create(article).then(function(dbArticle) {
                var retObject = {
                    result: true,
                    data: dbArticle
                }
                resolve(retObject);
            })
            .catch(function(err) {
                var retObject = {
                    result: false,
                    message: err.message
                }
                resolve(retObject);
            });
        });
    }

    function ScrapingFromKxan(req, res) {
        // KXAN.com | Austin News & Weather
        request("http://kxan.com/category/news/local/austin/", function(error, response, html) {
            // Load the HTML into cheerio and save it to a variable
            var $ = cheerio.load(html);

            var promiseArray = [];

            // cheerio's Selectors:
            // $( selector, [context], [root] ) -- selector searches within the context scope which searches within the root scope.
            $("article.media-object", "main#main").each(function(i, element) {

                var article = {};

                article.postid = $(element).attr("id");
                article.title = $(element).children("header").children("h1").children("a").text();
                article.link = $(element).children("header").children("h1").children("a").attr("href");
                article.img = $(element).children("figure").children("a").children("img").attr("src");
                article.summary = $(element).children("div").children("p").text();

                promiseArray.push(articleCreatePromise(article));
            });

            const allTheThings = Promise.all(promiseArray);

            allTheThings
                .then((results) => {
                    res.json(results.filter((item) => item.result === true));
                })
                .catch(function(err) {
                    res.status(500).json(err);
                });
        });
    }

    app.post("/api/scrape", function(req, res) {
        db.Article.remove({ saved: false }, function(err) {
            if(err) {
                res.send(err)
            }

            ScrapingFromKxan(req, res)
        });
    });

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
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
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
        var updateObj = req.body;

        updateObj.updatedAt = Date.now();

        db.Note
            .update( { _id: id }, updateObj)
            .then(function(dbNote) {
                res.json(dbNote);
            })
            .catch(function(err) {
                res.json(err);
            });
    });

    // delete a note!
    app.delete("/api/notes", function(req, res) {
        db.Note
            .remove({ _id: req.body.noteId })
            .then(function(dbNote) {
                return db.Article.findOneAndUpdate({ _id: req.body.articleId }, { $pull: { notes: dbNote._id } }, { new: true });
            })
            .then(function(dbArticle) {
                res.json(dbArticle);
            })
            .catch(function(err) {
                res.json(err);
            });
    });

    app.put("/api/articles/:id", function(req, res) {
        db.Article
            .update({ _id: req.params.id }, req.body)
            .then(function(dbArticle) {
                res.json(dbArticle);
            })
            .catch(function(err) {
                res.json(err);
            });
    });

    app.put("/api/articles/save/:id", function(req, res) {
        db.Article
            .update({ _id: req.params.id }, { saved: true })
            .then(function(dbArticle) {
                res.json(dbArticle);
            })
            .catch(function(err) {
                res.json(err);
            });
    });

    app.put("/api/articles/unsave/:id", function(req, res) {

        db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false }, { new: true })
            .then(function(dbArticle) {
                db.Note
                    .remove({ _id: dbArticle.notes })
                    .then(function(dbNote) {
                        return db.Article.findOneAndUpdate({ _id: dbArticle._id }, { notes: [] }, { new: true });
                    })
                    .then(function(newArticle) {
                        res.json(newArticle);
                    })
                    .catch(function(err) {
                        res.json(err);
                    });
            })
            .catch(function(err) {
                res.json(err);
            });

    });

};

