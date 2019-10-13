/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var mongoose = require('mongoose');


module.exports = function (app, Book, Comment) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, (err, books) => {
        if(err)
          return res.json(err);
      })
    .populate({
        path: 'comments'
      })
    .exec((err, booksWithComments) => {
        if(err)
          return res.json(err);
        res.json(booksWithComments);
      })
    })
    
    .post(function (req, res){
      // Destructure the req.body object.
      let title = req.body.title;
    
      // Ensure there is a title provided
      if(!title)
        return res.json({ error: "It looks like you haven't specified a title." });
    
    // Search the database to see if the book already exists.
    Book.findOne({title: title}, (err, book) => {
      
        // Error handling
        if(err)
          return res(`Error! Server responded with: ${err}`);
        if(book)
          return res.json(book);
        
        // Create the new book object
        let newBook = new Book(req.body);
        // Save it to the database
        newBook.save((err, savedBook) => {
          return res.json(savedBook);
        });
      });
    })
    
    .delete(function(req, res){
      Book.deleteMany((err) => {
        if(err)
          return res.json(err);
        return res.json({ success: "Successfuly deleted all books" });
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookId = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookId)
      .populate({
        path: "comments"
      })
      .exec((err, bookWithComments) => {
        if(err)
          return res.json(err);
        if(!bookWithComments)
          return res.json({ error: `No book found with the ID ${bookId}`});
        return res.json(bookWithComments);
      });
    })
    
    .post(function(req, res){
      var bookId = req.params.id;
      var comment = req.body.comment;
    
      Book.findById(bookId)
      .populate({
        path: "comments"
      })
      .exec((err, book) => {
        if(err)
          return res.json(err);
        if(!book)
          return res.json({ error: `No book found with the ID ${bookId}`});
        let newComment = new Comment({
          comment,
          book_id: bookId
        });
        if(req.body.commenter)
          newComment.commenter = req.body.commenter;

        newComment.save((err, savedComment) => {
          if(err)
            return res.json(err);
          book.comments.push(savedComment);
          ++book.commentcount;
          book.save((err, savedBook) => {
            if(err)
              return res.json(err);
            return res.json(savedBook);
          });
        });
      });
    })
    
    .delete(function(req, res){
      let id = req.params.id;
      Book.findByIdAndRemove(id, (err) => {
        if(err)
          return res.json(err);
        return res.json({ success: `Successfully deleted book with the ID ${id}`});  
      })
    });
  
};
