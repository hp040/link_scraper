const puppeteer = require('puppeteer');

class puppeteerClasses {
  constructor() {
    this.browser = null;
    this.page = null;
  }
  async init() {
    try {
      if (!this.browser) {
        this.browser = await puppeteer.launch({
          headless: true,
          defaultViewport: {
            width: 1920,
            height: 1080,
          },
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
      }
      //   return (this.page = await this.browser.newPage());
      return this.browser;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async getNewPage() {
    try {
      if (!this.browser) {
        await this.init();
      }
      const newPage = await this.browser.newPage();
      return newPage;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async closePage(page) {
    try {
      return await page.close();
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async closeBrowser() {
    try {
      return await this.browser.close();
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async goto(url) {}
}

module.exports = new puppeteerClasses();
