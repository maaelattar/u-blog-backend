const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const errorhandler = require('errorhandler');
const mongoose = require('mongoose');
const morgan = require('morgan');

require('./models/User');
require('./models/Article');
require('./models/Comment');
require('./config/passport');

const app = express();
let port = process.env.PORT;
let isProduction = process.env.NODE_ENV === 'production';
let cookieMaxAge = 7 * 24 * 60 * 60 * 1000;
const DB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-8vfn5.mongodb.net/main-db?retryWrites=true&w=majority`;
mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database ');
  })
  .catch(() => {
    console.log('Connection failed');
  });

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('./routes'));

app.use(
  session({
    secret: 'u-blog-secret',
    cookie: { maxAge: cookieMaxAge },
    resave: false,
    saveUninitialized: false
  })
);

if (!isProduction) {
  app.use(errorhandler());
  mongoose.set('debug', true);
}


let server = app.listen(port, () => {
  console.log('listening on port ' + port);
});
