const requestify = require('requestify');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const cheerio = require('cheerio');
const Datastore = require('nedb');
const apps = require('../data/apps.json');

const db = new Datastore({ filename: './data/playerCounts.db' });
db.loadDatabase();

const errorPages = [490840, 728950]

const allAppIds = Array.from(
  new Set(apps
    .map(a => a.id)
    .filter(a => a && typeof a === 'number')
    .filter(a => !errorPages.includes(a))
  )
); // Total: 2395
const url = 'http://steamcharts.com/app/';

const requestMetod = 'xx';
const request = (url, type) => {
  switch (type) {
    case 'curl':
      return exec(`curl "${url}"`);
    default:
      return requestify.get(url);
  }
};

const urls = [];
const requests = allAppIds.map(id => {
  urls.push(id);
  return request(`${url}${id}`, requestMetod);
});

requests.forEach((req) => {
  req.then((result) => {
    let data = null;
    switch (requestMetod) {
      case 'curl':
        data = JSON.parse(result.stdout);
        break;
      default:
        data = result.getBody();
    }

    const $ = cheerio.load(data, { decodeEntities: false });

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

// const index = 2;
// Promise
//   .all(requests.slice(405, 420))
//   .then(results => {
//     let data = [];
//     switch (requestMetod) {
//       case 'curl':
//         data = results.map(result => JSON.parse(result.stdout));
//         break;
//       default:
//         data = results.map(detail => detail.getBody());
//     }
//
//     data.forEach((html) => {
//       const $ = cheerio.load(html, { decodeEntities: false });
//
//       const id = $('meta[name="twitter:url"]').attr('content').replace(url, '');
//       const name = $('#app-title').text();
//
//       const stats = []
//       $('.common-table tbody tr').each((i, elem) => {
//         stats.push({
//           month: $(elem).find('td')[0].children[0].data.trim(),
//           avgPlayers: $(elem).find('td')[1].children[0].data.trim(),
//           gain: $(elem).find('td')[2].children[0].data.trim(),
//           percentGain: $(elem).find('td')[3].children[0].data.trim(),
//           peakPlayers: $(elem).find('td')[4].children[0].data.trim()
//         });
//       });
//
//       db.insert({
//         id, name, stats
//       }, (err, newDocs) => {
//         console.log(`Scrapped app ${name} (${id})`);
//       });
//     });
//   }).catch((e) => {
//     console.log(e);
//   });
