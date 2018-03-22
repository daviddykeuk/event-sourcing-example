var fs = require('fs');
const uuidv4 = require('uuid/v4');

module.exports = (eventEmitter, next) => {
	eventEmitter.on('event', (name, entity_id, last_transaction_id, payload) => {
		var event = {
			id: uuidv4(),
			entity_id: entity_id,
			name: name,
			timestamp: new Date(),
			payload: payload
		};

		fs.readFile('stream.json', function (err, data) {
			var json = JSON.parse(data);
			json.push(event);
			fs.writeFile('stream.json', JSON.stringify(json), ()=>{
			});
		});

		eventEmitter.emit("stream", event);
	});


	
	fs.readFile('stream.json', function (err, data) {
		var json = JSON.parse(data);

		json.forEach(event => {
			eventEmitter.emit("stream", event);
		});

		next();
	});


};