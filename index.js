const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const Datastore = require('nedb');

const app = express(feathers());
app.configure(express.rest());

const db = new Datastore({ filename: './data/appDetails.db' });
db.loadDatabase();

class Games {
	async find() {
		return new Promise(resolve => {
			db.find().exec((err, docs) => {
				resolve(docs);
			});
		});
	}
}

app.use('/', express.static('./public'));
app.use('games', new Games());
app.use(express.errorHandler());

const server = app.listen(process.env.PORT || 3030);
server.on('listening', () => console.log('Server listening on http://localhost:3030'));
