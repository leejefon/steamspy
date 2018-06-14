const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const Datastore = require('nedb');

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

app.use('/', express.static('./public'));
app.use('games', new Games());
app.use(express.errorHandler());

const server = app.listen(process.env.PORT || 3030);
server.on('listening', () => console.log(`Server listening on port ${process.env.PORT || 3030}`));
