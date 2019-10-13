/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: "Shantaram",
            author: "G.D.R",
            release_year: 2003,
            genres: [
              "crime",
              "novel",
              "travel",
              "biography"
            ],
            added_by: "Test Unit"
          })
          .end((err, res) => {
            assert.equal(res.body.title, "Shantaram");
            assert.equal(res.body.added_by, "Test Unit");
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post("/api/books")
          .send({
            author: "Me"
          })
          .end((err, res) => {
            assert.equal(res.body.error, "It looks like you haven't specified a title.");
            done(); 
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get("/api/books")
          .query({})
          .end((err, res) => {
            assert.isDefined(res.body[0].author, "Something went wrong");
            assert.isNotNull(res.body[0].author, "Something went wrong");
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/5da3321529ceb273482d768a')
        .end((err, res) => {
          assert.equal(res.body.error, "No book found with the ID 5da3321529ceb273482d768a");
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/5da384b202eb971e23b79466')
        .end((err, res) => {
          assert.equal(res.body.title, "Shantaram");
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/5da384b202eb971e23b79466')
        .send({
          comment: 'This is a good book which I like a lot',
          commenter: 'Someone'
        })
        .end((err, res) => {
          assert.equal(res.body.title, "Shantaram");
          done();
        });
      });
      
    });
    
    suite('DELETE /api/books => [id] delete books in the database', function(){
      /*
          
          test('No _id', function(done) {
            chai.request(server)
            .delete('/api/books')
            .end((err, res) => {
              assert.equal(res.body.success, "Successfuly deleted all books");
              done();
            });
          });
          
      */
          
      /*
          test('With _id', function(done) {
            chai.request(server)
            .delete('/api/books/5da34db1c910d1630fed5ef4')
            .end((err, res) => {
              assert.equal(res.body.success, "Successfully deleted book with the ID 5da34db1c910d1630fed5ef4");
              done();
            });
          });
      */
      
        });

  });

});
