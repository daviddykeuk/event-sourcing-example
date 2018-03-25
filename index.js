var Command = require('./src/command');
var Query = require('./src/query');
var Stream = require('./src/stream');

const express = require('express')
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

Stream.init(eventEmitter);

Query(eventEmitter, Stream, app);

Command(eventEmitter, Stream, app);

app.listen(3000, () => console.log('Example app listening on port 3000!'));