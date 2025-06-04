const puppeteer = require('puppeteer-core');
const http = require('./http');
const utils = require('./utils');
const pptr = require('./pptr');

// hard code Google Chrome bin path
const executablePath = process.platform === 'darwin' ?
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' :
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const options = {
    args: [
        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"',
        // process.platform === 'darwin' ? '--proxy-server=127.0.0.1:1087' :  '--proxy-server=172.29.0.41:443'
    ],
    headless: false,
    executablePath: executablePath,
};

(async function () {
    while(true) {
        // 每次循环获取最新的书列表
        const books = await http.queryBooks(1, 6)

        // 启动浏览器
        const browser = await puppeteer.launch(options);
        
        // 每本书结合泛化 query 词进行爬取
        for (const book of books) {
            const generalQueries = ['', '小说', '笔趣阁'];
            
            for (const generalQuery of generalQueries) {
                // 打开新Tab
                const page = await browser.newPage();

                const query = `${book.title}${generalQuery}`;
                
                try {
                    // 爬取三页的链接
                    const hrefs = await pptr.crawlUrlsPage(page, query, 3);

                    console.log(book.cbid, book.title, hrefs);

                    // 提交链接
                    // await http.submitBookHrefs(book.cbid, hrefs);
                } catch(e) {
                    console.error(e);
                } finally {
                    await page.close();
                }
            }
        }

        await browser.close();

        await utils.delay(Math.ceil(Math.random() * 30) * 1000);
    }
})();
