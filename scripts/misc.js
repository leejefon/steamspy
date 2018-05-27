const fs = require('fs');
const Datastore = require('nedb');
const apps = require('../data/apps.json');
const db = new Datastore({ filename: './data/appDetails.db' });
db.loadDatabase();

const allAppIds = Array.from(new Set(apps.map(a => a.id).filter(a => a)));

db.find().exec((err, data) => {
  const uniqIds = Array.from(new Set(data.map(d => d.appid)));

  const missingIds = Object.assign([], allAppIds);

  allAppIds.forEach((id, i) => {
    if (uniqIds.includes(id)) {
      missingIds[i] = null;
    }
  });

  console.log(allAppIds.length);
  console.log(uniqIds.length);
  console.log(missingIds.filter(id => id).length);
  // console.log(JSON.stringify(missingIds.filter(id => id && typeof id === 'number').map(id => ({ id })), null, 2));

  // clean up duplicates
  let dupIds = data.map(d => d.appid);
  uniqIds.forEach((id) => {
    const i = dupIds.indexOf(id);
    dupIds.splice(i, 1);
  });
  dupIds.forEach((appid) => {
    console.log(appid);
    // db.remove({ appid }, {}, () => {});
  });
});
