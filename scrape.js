const requestify = require('requestify');
const cheerio = require('cheerio');

const steamSearchUrl = 'https://store.steampowered.com/search/?vrsupport=101%2C102%2C104';
const totalPage = 124;

const requests = Array.from({ length: totalPage }, (v, x) => x + 1)
  .map(page => requestify.get(`${steamSearchUrl}&page=${page}`));

Promise.all(requests).then(results => {
  const data = results.map((html) => {
    const $ = cheerio.load(html.getBody(), { decodeEntities: false });
    const apps = []
    $('.search_result_row').each((i, elem) => {
      apps.push({
        id: $(elem).data('dsAppid'),
        name: $(elem).find('.ellipsis .title').html()
      });
    });
    return apps;
  }).reduce((prev, curr) => prev.concat(curr), []);

  console.log(JSON.stringify(data, null, 2));
});
