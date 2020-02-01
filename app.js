const fs = require('fs');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const errorhandler = require('errorhandler');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
//const methodOverride = require('method-override');
//const methods = require('methods');
const app = express();

let isProduction = process.env.NODE_ENV === 'production';

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
app.use(express.static(path.join(__dirname, '/public')));
// app.use(methodOverride)
app.use(
  session({
    secret: 'u-blog-secret',
    cookie: { maxAge: 3600000 },
    resave: false,
    saveUninitialized: false
  })
);

if (isProduction) {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ errors: { message: err.message, error: {} } });
  });
} else {
  app.use(errorhandler());
  mongoose.set('debug', true);

  app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(err.status || 500);
    res.json({ errors: { message: err.message, error: err } });
  });
}

app.use(require('./routes'));

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

let server = app.listen(process.env.PORT, () => {
  console.log('listening on port ' + server.address.port);
});
