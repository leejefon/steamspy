const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');

const MongoClient = require('mongodb').MongoClient;
const Datastore = require('nedb');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const app = express(feathers());
app.configure(express.rest());

const appsDb = new Datastore({ filename: './data/appDetails.db' });
appsDb.loadDatabase();

const playerStatsDb = new Datastore({ filename: './data/playerCounts.db' });
playerStatsDb.loadDatabase();

class Games {
	async find() {
		const appsP = new Promise((resolve) => {
			appsDb.find().exec((err, docs) => {
				resolve(docs);
			});
		});

		const playerStatsP = new Promise((resolve) => {
			playerStatsDb.find().exec((err, docs) => {
				resolve(docs);
			});
		});

		return Promise.all([appsP, playerStatsP]).then((results) => {
			const [apps, playerStats] = results;

			return apps.map((app) => {
				const { stats } = playerStats.find((stat) => stat.id == app.appid) || {}; // Double equale since stat.id is string
				return Object.assign({ stats }, app);
			});
		});
	}
}

class HourlyStats {
	async get(appid) {
		return new Promise((resolve) => {
			const i = process.env.MONGODB_URI.lastIndexOf('/');
			const dbName = process.env.MONGODB_URI.slice(i + 1);

			MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
			  .then((client) => {
			    const model = client.db(dbName).collection('hourly_stats');
					model.find({ appid }).sort({ timestamp: 1 }).toArray((err, result) => {
						resolve(result);
					});
			  }).catch(error => console.error(error));
		});
	}
}

app.use('/', express.static('./public'));
app.use('games', new Games());
app.use('hourlyStats', new HourlyStats());
app.use(express.errorHandler());

const server = app.listen(process.env.PORT || 3030);
server.on('listening', () => console.log(`Server listening on port ${process.env.PORT || 3030}`));
