const requestify = require('requestify');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const cheerio = require('cheerio');

const feathers = require('@feathersjs/feathers');
const MongoClient = require('mongodb').MongoClient;
const service = require('feathers-mongodb');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const app = feathers();
app.use('messages', service({
  paginate: {
    default: 2,
    max: 4
  }
}));

const i = process.env.MONGODB_URI.lastIndexOf('/');
const connStr = process.env.MONGODB_URI.slice(0, i);
const dbName = process.env.MONGODB_URI.slice(i + 1);

MongoClient.connect(connStr, { useNewUrlParser: true })
  .then((client) => {
    app.service('messages').Model = client.db(dbName).collection('hourly_stats');
  }).catch(error => console.error(error));

const apps = require('../data/apps.json');

const errorPages = [490840, 728950];

const allAppIds = Array.from(
  new Set(apps
    .map(a => a.id)
    .filter(a => a && typeof a === 'number')
    .filter(a => !errorPages.includes(a))
  )
); // Total: 2395
const url = 'https://steamcharts.com/app/';

const requestMetod = 'x';
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

requests.forEach((req, i) => {
  setTimeout(() => {
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

      const appid = $('meta[name="twitter:url"]').attr('content').replace(url.replace('https', 'http'), '');
      const name = $('#app-title').text();

      const stats = { appid, name, timestamp: new Date() };
      $('#app-heading .app-stat').each((i, elem) => {
        const val = $(elem).find('.num').html();
        switch (i) {
          case 0:
            stats.pastHour = val; break;
          case 1:
            stats.past24HrPeak = val; break;
          case 2:
            stats.allTimePeak = val; break;
        }
      });
      console.log(stats);
      app.service('messages').create(stats).then(message => console.log('Saved ', stats.name));
    });
  }, 100 * i);
});

// auto exit after 30 min
setTimeout(() => {
  process.exit();
}, 30 * 60 * 1000);
