'use strict;';
const { STATUS_MSG } = require('./defaultResponses');
class Response {
  success(res, data, statusCode) {
    try {
      return res.status(statusCode || 200).json(data);
    } catch (err) {
      console.log(err);
      return res.status(400).json(STATUS_MSG.IMP_ERROR);
    }
  }

  error(res, data, statusCode) {
    try {
      return res.status(statusCode || 400).json(this.handleError(data));
    } catch (err) {
      console.log(err);
      return res.status(400).json(STATUS_MSG.IMP_ERROR);
    }
  }

  joiResponse(value, req, res, next) {
    try {
      if (value.error) {
        let param = value.error.details[0].context.key;
        let type = value.error.details[0].type;
        let message = value.error.details[0].message;

        if ('label' in value.error.details[0].context) {
          param = value.error.details[0].context.label;
        }
        // console.log({ param, type, message });
        return this.error(res, { status: 'failure', message: `${message}`, data: {} });
      } else {
        switch (req.method) {
          case 'POST':
          case 'PUT':
          case 'PATCH':
            req.body = value.value;
            break;
          case 'GET':
          case 'DELETE':
            req.query = value.value;
            break;
        }
        next();
      }
    } catch (error) {
      return;
    }
  }

  sendJsonResponse(res, data, statusCode) {
    try {
      if (data.status == 'success') {
        response.success(res, data, statusCode);
      } else {
        response.error(res, data, statusCode);
      }
    } catch (err) {
      return res.status(400).json(STATUS_MSG.IMP_ERROR);
    }
  }

  handleError(errorObject) {
    try {
      console.log('handleError =>', errorObject);
      if (errorObject.message && errorObject.status) return errorObject;
      return { status: 'failure', message: 'Something went wrong', data: {} };
    } catch (err) {
      console.log(err);
      return { status: 'failure', message: 'Something went wrong', data: {} };
    }
  }
}

module.exports = new Response();
