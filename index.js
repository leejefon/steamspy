const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');

const app = express(feathers());
app.configure(express.rest());

class Games {
	async find() {
		return {
			name: "Jeff Lee"
		};
	}
}

app.use('/', express.static('./public'));
app.use('games', new Games());
app.use(express.errorHandler());

const server = app.listen(3030);
server.on('listening', () => console.log('Server listening on http://localhost:3030'));
