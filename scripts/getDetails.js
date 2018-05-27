const util = require('util');
const exec = util.promisify(require('child_process').exec);
const requestify = require('requestify');
const Datastore = require('nedb');
// const data = require('../data/apps.json');
const data = require('../data/missingIds.json');

const db = new Datastore({ filename: './data/appDetails.db' });
db.loadDatabase();

const steamSpyUrl = 'http://steamspy.com/api.php?request=appdetails&appid=';
const requestChunkSize = 4;
const chunks = [];

const requestMetod = 'curl';

console.log(`Total Apps: ${data.filter(app => app.id).length}`);

for (let i = 0, j = data.length; i < j; i += requestChunkSize) {
  chunks.push(data.slice(i, i + requestChunkSize));
}

const request = (url, type) => {
  switch (type) {
    case 'curl':
      return exec(`curl "${url}"`);
    default:
      return requestify.get(url);
  }
};

const startFromChunk = 0;
const requestChunks = chunks.map(chunk =>
  chunk.filter(app => app.id).map(app => request(`${steamSpyUrl}${app.id}`, requestMetod))
).splice(startFromChunk);

requestChunks.forEach((requests, i) => {
  setTimeout(() => {
    Promise.all(requests).then((appDetails) => {
      let data = [];
      switch (requestMetod) {
        case 'curl':
          data = appDetails.map(result => JSON.parse(result.stdout));
          break;
        default:
          data = appDetails.map(detail => detail.getBody());
      }

      db.insert(data, (err, newDocs) => {
        console.log(`Processed apps ${(i + startFromChunk) * requestChunkSize} - ${(i + startFromChunk+ 1) * requestChunkSize}`);
      });
    }).catch((err) => {
      console.log(`Error in ${i + startFromChunk}`, err);
      process.exit();
    });
  }, i * 4000);
});
