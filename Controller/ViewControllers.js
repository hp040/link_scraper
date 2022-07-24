const { ViewServices } = require('../Services/index');
const response = require('../Utils/Response');
class ViewControllers {
  async handleIndexGet(req, res) {
    try {
      let data = await ViewServices.handleIndexGet({ queryData: req.query });
      // response.success(res, data);
      // console.log(JSON.stringify(data));
      res.render('index', { links: data ? JSON.stringify(data) : [] });
    } catch (err) {
      console.log(err);
      return response.error(err);
    }
  }
}

module.exports = new ViewControllers();
