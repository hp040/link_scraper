const viewRouter = require('express').Router();
const { ViewControllers } = require('../Controller/index');
viewRouter.get('/', ViewControllers.handleIndexGet);
module.exports = viewRouter;
