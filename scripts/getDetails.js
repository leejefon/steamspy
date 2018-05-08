const requestify = require('requestify');
const Datastore = require('nedb');
const data = require('../data/apps.json');

const db = new Datastore({ filename: '../data/appDetails.db' });
db.loadDatabase();

const steamSpyUrl = 'http://steamspy.com/api.php?request=appdetails&appid=';
const requestChunkSize = 4;
const chunks = [];

console.log(`Total Apps: ${data.filter(app => app.id).length}`);

for (let i = 0, j = data.length; i < j; i += requestChunkSize) {
    chunks.push(data.slice(i, i + requestChunkSize));
}

const startFromChunk = 213;
const requestChunks = chunks.map(chunk =>
  chunk.filter(app => app.id).map(app => requestify.get(`${steamSpyUrl}${app.id}`))
).splice(startFromChunk);

requestChunks.forEach((requests, i) => {
  setTimeout(() => {
    Promise.all(requests).then((appDetails) => {
      db.insert(appDetails.map(detail => detail.getBody()), (err, newDocs) => {
        console.log(`Processed apps ${(i + startFromChunk) * requestChunkSize} - ${(i + startFromChunk+ 1) * requestChunkSize}`);
      });
    }).catch((err) => {
      console.log(`Error in ${i + startFromChunk}`, err);
      process.exit();
    });
  }, i * 5000);
});
