const utils = require('./utils');

const crawlUrls = async (page, url) => {
  let hrefs = [];
  
  await page.goto(url, { timeout: 0 });
  await page.evaluate(() => {
    const links = document.querySelectorAll('#search .g a');
    links.forEach(h => {
			if(h.ping && h.href !== '#' && h.className.indexOf('fl ') === -1 && h.className.indexOf(' fl') === -1 && h.className !== 'fl') {
					hrefs.push(h.href);
			}
    });
	});
	return hrefs;
}

const getRandomMs = () => Math.ceil(Math.random() * 30) * 1000;

const crawlUrlsPage = async (page, query, pageSize = 3) => {
  let hrefs = [];

  const url = `https://www.google.com/search?q=${query.replace(/ /g, '+')}`;

  // 爬取首页链接
  const hrefsOfFirstPage = await crawlUrls(page, url);
  hrefs = hrefs.concat(hrefsOfFirstPage);
  
  await utils.delay(getRandomMs());

  const pageUrls = await page.evaluate(() => {
      const urls = document.querySelectorAll('#rcnt div[role="navigation"] table td a.fl');
      return urls.slice(0, pageSize).map(item => item.href)
  });

  // 爬取分页的链接列表
  for (const pageUrl of pageUrls) {
    const hrefsOfPage = await crawlUrls(page, pageUrl);
    hrefs = hrefs.concat(hrefsOfPage);
    await utils.delay(getRandomMs());
  }

  return hrefs;
}

module.exports = {
  crawlUrlsPage,
}