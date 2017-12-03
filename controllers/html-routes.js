// *********************************************************************************
// html-routes.js
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

// scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    app.get("/saved", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/saved.html"));
    });    

    app.get("/scrape", function(req, res) {
        // KXAN.com | Austin News & Weather
        request("http://kxan.com/category/news/local/austin/", function(error, response, html) {
            // Load the HTML into cheerio and save it to a variable
            var $ = cheerio.load(html);
    
            var results = [];
    
            // cheerio's Selectors:
            // $( selector, [context], [root] ) -- selector searches within the context scope which searches within the root scope.
            $("article.media-object", "main#main").each(function(i, element) {
    
                var article = {};
    
                article.postid = $(element).attr("id");
                article.title = $(element).children("header").children("h1").children("a").text();
                article.link = $(element).children("header").children("h1").children("a").attr("href");
                article.img = $(element).children("figure").children("a").children("img").attr("src");
                article.summary = $(element).children("div").children("p").text();
    
                // db.Article
                // .findOne({ postid: article.postid })
                // .then(function(dbArticle) {
                //     results.push(article);
                // });
    
                results.push(article);
            });
    
            db.Article.create(result).then(function(dbArticle) {
                res.json(dbArticle);
                // res.redirect("/");
            })
            .catch(function(err) {
                res.json(err);
            });
        });
    });

    app.get("/articles", function(req, res) {
        // Grab every unsaved document in the Articles collection
        db.Article
            .find({ saved: false })
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
            .find({ saved: true })
            .populate("note")
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
            .populate("note")
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
