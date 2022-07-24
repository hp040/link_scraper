const puppeteerClasses = require('../Classes/puppeteerClasses');
class viewServices {
  async handleIndexGet({}) {
    try {
      //   let data = await ViewServices.getIndex();
      //   return data;
      const page = await puppeteerClasses.getNewPage();
      await page.setContent(`<p>web running at ${Date()}</p>`);
      const content = await page.content();
      page.close();
      return content;
    } catch (err) {
      page.close();
      return Promise.reject(err);
    }
  }
}

module.exports = new viewServices();
