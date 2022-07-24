const Joi = require('joi');
const response = require('../Utils/Response');
class ViewValidators {
  handleIndexGet(req, res, next) {
    try {
      let schema = Joi.object({
        link: Joi.string().uri().required().label('link'),
      }).options({
        allowUnknown: false,
      });

      let value = schema.validate(req.query);
      return response.joiResponse(value, req, res, next);
    } catch (error) {
      console.log(`handleIndexGet validator error ->> `, error);
      return response.error(res, STATUS_MSG.IMP_ERROR);
    }
  }
}

module.exports = new ViewValidators();
