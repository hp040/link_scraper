const puppeteerClasses = require('../Classes/puppeteerClasses');

class viewServices {
  async handleIndexGet({ queryData }) {
    try {
      //   let data = await ViewServices.getIndex();
      //   return data;
      const { link } = queryData;
      console.log(`link: ${link}`);
      const url = link || 'https://academy.subquery.network/subquery_network/terminology.html#redelegating';
      const page = await puppeteerClasses.getNewPage();
      await puppeteerClasses.loadWebUrl({ url, page });
      const data = await page.evaluate(() => {
        const finalLinks = [];
        $('body')
          .find('a')
          .each(function (index) {
            const link = $(this).attr('href');
            console.log('link', link);
            if (link && (link.includes(window.location.hostname) || !link.includes('http'))) {
              let text = $(this).text().length < 3 ? $(this).parent().text() : $(this).text();
              text = text ? text.replace(/\n/g, '') : text;
              text = text ? text.replace(/ /g, ' ') : text;
              finalLinks.push({
                link: link.includes('http') ? link : `${window.location.origin}${link}`,
                identifier: text,
              });
            }
          });
        return finalLinks;
      });
      // console.log('data =>', data);
      page.close();
      return data;
    } catch (err) {
      console.log(err);
      page.close();
      return Promise.reject(err);
    }
  }
}

module.exports = new viewServices();
