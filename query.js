var accounts = {};

module.exports = (eventEmitter, app) => {
	eventEmitter.on('stream', (event) => {
		switch (event.name) {
			case "account.created":
				var account = JSON.parse(event.payload);
				account.created_date = event.timestamp;
				account.balance = 0;
				account.transactions = [];
				accounts[account.id] = account;
				break;
			case "transaction.completed":
				var transaction = JSON.parse(event.payload);
				accounts[transaction.account_id].balance += transaction.amount;
				accounts[transaction.account_id].transactions.push({
					timestamp: event.timestamp,
					amount: transaction.amount,
					description: transaction.description
				});
				break;
		}
	});

	app.get('/:id', (req, res) => {
		res.status(accounts[req.params.id] ? 200 : 404).send(accounts[req.params.id] || "no account found");
	});
};