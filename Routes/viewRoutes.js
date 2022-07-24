const viewRouter = require('express').Router();

viewRouter.get('/', (req, res) => {
  try {
    res.render('index');
  } catch (err) {
    console.log(err);
  }
});
module.exports = viewRouter;
