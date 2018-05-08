const Datastore = require('nedb');
const apps = require('../data/apps.json');

const db = new Datastore({ filename: './data/appDetails.db' });
db.loadDatabase();

const allAppIds = apps.map(a => a.id).filter(a => a);

db.find().exec((err, data) => {
  // clean up duplicates
  const uniqIds = Array.from(new Set(data.map(d => d.appid)));
  let dupIds = data.map(d => d.appid);

  uniqIds.forEach((id) => {
    const i = dupIds.indexOf(id);
    dupIds.splice(i, 1);
  });

  dupIds.forEach((appid) => {
    // db.remove({ appid }, {}, () => {});
  });
});
