const uuidv4 = require('uuid/v4');

var accounts = [];

module.exports = (eventEmitter, app) => {

	app.post('/', (req, res) => {
		var acc = req.body;
		acc.id = uuidv4();
		res.send(acc);
		eventEmitter.emit('event', 'account.created', acc.id, null, JSON.stringify(acc));
	});

	app.put('/:id', (req, res) => {
		var transaction = req.body;
		transaction.account_id = req.params.id;
		if (!transaction.amount){
			res.status(400).send("no amount provided");
		}
		else if (accounts[transaction.account_id].balance + transaction.amount >=0) {
			res.send("ok");
			eventEmitter.emit('event', 'transaction.completed', accounts[transaction.account_id].id, accounts[transaction.account_id].last_transaction_id, JSON.stringify(transaction));
		}
		else {
			res.status(400).send("not enough funds");
			eventEmitter.emit('event', 'transaction.declined', accounts[transaction.account_id].id, accounts[transaction.account_id].last_transaction_id, JSON.stringify(transaction));
		}
	});


	eventEmitter.on('stream', (event) => {
		switch (event.name) {
			case "account.created":
				var account = JSON.parse(event.payload);
				account.balance = 0;
				accounts[account.id] = account;
				accounts.last_transaction_id = event.id;
				break;
			case "transaction.completed":
				var transaction = JSON.parse(event.payload);
				accounts[transaction.account_id].balance += transaction.amount;
				accounts.last_transaction_id = event.id;
				break;
		}
	});
}