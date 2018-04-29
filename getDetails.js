const requestify = require('requestify');
const Datastore = require('nedb');
const data = require('./apps.json');

const db = new Datastore({ filename: './appDetails.db' });
db.loadDatabase();

const steamSpyUrl = 'http://steamspy.com/api.php?request=appdetails&appid=';
const requestChunkSize = 20;
const chunks = [];

console.log(`Total Apps: ${data.filter(app => app.id).length}`);

for (let i = 0, j = data.length; i < j; i += requestChunkSize) {
    chunks.push(data.slice(i, i + requestChunkSize));
}

const requestChunks = chunks.map(chunk =>
  chunk.filter(app => app.id).map(app => requestify.get(`${steamSpyUrl}${app.id}`))
);

const failedChunks = []
requestChunks.forEach((requests, i) => {
  setTimeout(() => {
    Promise.all(requests).then((appDetails) => {
      db.insert(appDetails.map(detail => detail.getBody()), (err, newDocs) => {
        console.log(`Processed apps ${i * requestChunkSize} - ${(i + 1) * requestChunkSize}`);
      });
    }).catch((err) => {
      failedChunks.push(i);
      console.log(`Error in ${i}`, err);
    });
  }, i * 5000);
});
