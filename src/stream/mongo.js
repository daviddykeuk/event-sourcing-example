var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var eventSchema = new Schema({
	name: String,
	entity_id: String,
	version: Number,
	payload: Object,
	timestamp: Date
});

eventSchema.index({
	entity_id: 1,
	version: 1
}, {
	unique: true
});

var Event = mongoose.model("Event", eventSchema);

mongoose.connect('mongodb://localhost/event-sourcing');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	// we're connected!
});

module.exports.getEventsByEntity = (entity_id, next) => {
	Event.find({
		entity_id: entity_id
	}, (err, events) => {
		if (err) {
			next(new Error("Could not find events"));
		} else {
			next(null, events);
		}
	});
};

module.exports.addEventToStream = (name, entity_id, version, payload, next) => {
	version++;

	// create the event object to be stored
	var event = new Event({
		name: name,
		entity_id: entity_id,
		version: version,
		payload: payload,
		timestamp: new Date()
	});

	// push the new transaction to the database, it will fail if the version clashes with an existing version
	// this is the atomic update, if someting else has gone in to the db between get and commit the versions will clash
	// and this save will fail, leaving the existing event there and not accepting this one
	event.save((err) => {
		if (err) {
			next(new Error("Could not log event"));
		} else {
			next(null, event);
		}
	});
}