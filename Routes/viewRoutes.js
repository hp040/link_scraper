const viewRouter = require('express').Router();
const { ViewControllers } = require('../Controller/index');
const { ViewValidators } = require('../Validators/index');
viewRouter.get('/', ViewValidators.handleIndexGet, ViewControllers.handleIndexGet);
module.exports = viewRouter;
