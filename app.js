'use strict';
const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
require('dotenv').config({ path: './.env' });
var cors = require('cors');
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './Views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const indexRouter = require('./Routes/index');

if (process.env.NODE_ENV === 'development') {
  //centeral logger
  app.use('*', (req, res, next) => {
    switch (req.method) {
      case 'GET':
        console.log('request received =>', req.method, req.originalUrl, req.query);
        break;
      case 'POST':
      case 'PUT':
      case 'PATCH':
      case 'DELETE':
        console.log('request received =>', req.method, req.originalUrl, req.body);
        break;
    }
    next();
  });
}

// error handler
app.use((err, req, res, next) => {
  console.error('error', err.stack);
  res.status(400).json({ status: 'failure', message: 'Something went wrong', data: {} });
});

app.use('/', indexRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
  });
