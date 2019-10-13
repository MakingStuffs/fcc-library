'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const helmet      = require('helmet');
const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');
const mongo             = require('mongodb').MongoClient;
const mongoose          = require('mongoose');
const app = express();
 
// Helmet security features
app.use(helmet());
// Add a fake powered by header to make an attacker think its a php app
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
// Stop caching of JS to prevent old versions of the app being served after bugs have been fixed.
app.use(helmet.noCache());
mongoose.set('useCreateIndex', true);
app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

// Connect mongoose to the mongodb databse
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
// Make a schema for books
const bookSchema = {
  title: {
    type: String,
    unique: true,
    required: true
  },
  author: {
    type: String,
    default: "Not provided"
  },
  genres: {
    type: Array,
    default: []
  },
  language: {
    type: String,
    default: "English"
  },
  release_year: {
    type: Number,
    default: 1001
  },
  commentcount: {
    type: Number,
    default: 0
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],
  added_on: {
    type: Date,
    default: Date.now
  },
  added_by: {
    type: String,
    default: "Anonymous"
  }
};

const commentSchema = {
  comment: {
    type: String,
    required: true
  },
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book"
  },
  commenter: {
    type: String,
    default: "Anonymous"
  },
  created_on: {
    type: Date,
    default: Date.now
  }
};
// Make mongoose models
const Book = new mongoose.model('Book', bookSchema);
const Comment = new mongoose.model('Comment', commentSchema);
//Routing for API pass the mongoose models.
apiRoutes(app, Book, Comment);  

//For FCC testing purposes
fccTestingRoutes(app);
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for unit/functional testing
