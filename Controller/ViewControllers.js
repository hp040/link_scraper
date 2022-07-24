const { ViewServices } = require('../Services/index');
const response = require('../Utils/Response');
class ViewControllers {
  async handleIndexGet(req, res) {
    try {
      let data = await ViewServices.handleIndexGet({});
      response.success(res, data);
    } catch (err) {
      console.log(err);
      return response.error(err);
    }
  }
}

module.exports = new ViewControllers();
