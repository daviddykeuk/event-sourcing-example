var mongo = require('./mongo');

module.exports.init = (eventEmitter) => {
	// name: name of the event in the format "noun:past participal" e.g. account:created
	// entity_id: the primary key of the entity which is being updated, this is used for querying later
	// version: the version of the entity when retrieved, which is incremented by one every time it is updated, this prevents concurency
	// payload: the description of the event including all the data required to replay it, e.g. { "amount":29 }
	// callback: code run when the event emission completes, with an err object if it fails

	eventEmitter.on('event', (name, entity_id, version, payload, next) => {
		mongo.addEventToStream(name, entity_id, version, payload, next);
	});
};

module.exports.getEventsByEntity = mongo.getEventsByEntity;