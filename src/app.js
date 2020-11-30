require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const databaseHelper = require('./database');

class App {
  constructor() {
    this.express = express();
    App.database();
    this.middlewares();
    this.routes();
  }

  static database() {
    databaseHelper.connect();
  }

  middlewares() {
    this.express.use(morgan('dev'));
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(express.json());
  }

  routes() {
    this.express.use(routes);
  }
}

module.exports = new App().express;
