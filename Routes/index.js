const express = require('express');
const indexRouter = express.Router();
const scraperRouter = require('./scraperRoutes');
const viewRoutes = require('./viewRoutes');

indexRouter.use('/scraper', scraperRouter);
indexRouter.use('/', viewRoutes);

module.exports = indexRouter;
