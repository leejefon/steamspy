const requestify = require('requestify');
const cheerio = require('cheerio');
const Datastore = require('nedb');
const apps = require('../data/apps.json');

const db = new Datastore({ filename: './data/playerCounts.db' });
db.loadDatabase();

const allAppIds = Array.from(new Set(apps.map(a => a.id).filter(a => a))); // Total: 2395
const url = 'http://steamcharts.com/app/';

const requests = allAppIds.map(id => requestify.get(`${url}${id}`));

Promise.all(requests.slice(100, 100)).then(results => {
  results.forEach((html) => {
    const $ = cheerio.load(html.getBody(), { decodeEntities: false });

    const id = $('meta[name="twitter:url"]').attr('content').replace(url, '');
    const name = $('#app-title').text();

    const stats = []
    $('.common-table tbody tr').each((i, elem) => {
      stats.push({
        month: $(elem).find('td')[0].children[0].data.trim(),
        avgPlayers: $(elem).find('td')[1].children[0].data.trim(),
        gain: $(elem).find('td')[2].children[0].data.trim(),
        percentGain: $(elem).find('td')[3].children[0].data.trim(),
        peakPlayers: $(elem).find('td')[4].children[0].data.trim()
      });
    });

    db.insert({
      id, name, stats
    }, (err, newDocs) => {
      console.log(`Scrapped app ${name} (${id})`);
    });
  });
});
