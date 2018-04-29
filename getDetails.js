const requestify = require('requestify');
const data = require('./apps.json');

const steamSpyUrl = 'http://steamspy.com/api.php?request=appdetails&appid=';

const chunkSize = 20;
const chunks = [];

for (let i = 0, j = data.length; i < j; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
}

const requestChunks = chunks.map(chunk =>
  chunk.filter(app => app.id).map(app => requestify.get(`${steamSpyUrl}${app.id}`))
);

// Source: https://davidwalsh.name/pubsub-javascript
const events = (() => {
  const topics = {};
  const hOP = topics.hasOwnProperty;

  return {
    subscribe: (topic, listener) => {
      if (!hOP.call(topics, topic)) topics[topic] = [];
      const index = topics[topic].push(listener) - 1;
      return {
        remove: () => {
          delete topics[topic][index];
        }
      };
    },
    publish: (topic, info) => {
      if (!hOP.call(topics, topic)) return;
      topics[topic].forEach((item) => {
    		item(info !== undefined ? info : {});
      });
    }
  };
})();

const results = [];
const subscription = events.subscribe('processChunk', (apps) => {
  results.push(...apps.details);
  if (apps.chunkNum === Math.floor(data.length / chunkSize)) {
      console.log(results);
  }
});

requestChunks.forEach((requests, i) => {
  setTimeout(() => {
    Promise.all(requests).then((appDetails) => {
      console.log(`Processed apps ${i * chunkSize} - ${(i + 1) * chunkSize}`);
      events.publish('processChunk', {
        details: appDetails.map(detail => detail.getBody()),
        chunkNum: i
      });
    }).catch((err) => console.log(`Error in ${i}: ${err.message}`));
  }, i * 5000);
});
