var Command = require('./command');
var Query = require('./query');
var Stream = require('./stream');

const express = require('express')
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

Query(eventEmitter, app);

Command(eventEmitter, app);

Stream(eventEmitter, () => {
	app.listen(3000, () => console.log('Example app listening on port 3000!'));
});