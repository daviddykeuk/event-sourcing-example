const uuidv4 = require('uuid/v4');
var repo = require('../repository');

module.exports = (eventEmitter, stream, app) => {

	app.post('/', (req, res) => {
		var acc = req.body;
		acc.id = uuidv4();
		eventEmitter.emit('event', 'account:created', acc.id, null, acc, (err) => {
			if (!err) {
				res.status(201).send(acc);
			} else {
				res.status(503).send("sorry");
			}
		});
	});

	app.put('/:id', (req, res) => {
		var transaction = req.body;
		transaction.account_id = req.params.id;

		if (!transaction.amount) {
			res.status(400).send("no amount provided");
		} else {

			// get the account
			repo.accounts.getAccount(transaction.account_id, stream, (err, account) => {
				if (err) {
					res.status(500).send("Please try again");
				} else if (!account) {
					res.status(404).send("Account not found");
				} else if (account.balance + transaction.amount < 0) {
					res.status(403).send("Not enough funds");
				} else {
					eventEmitter.emit('event',
						'transaction:completed',
						account.id,
						account.version,
						transaction,
						(err) => {
							if (err) {
								res.status(500).send("Please try again");
							} else {
								res.send("ok");
							}
						});
				}
			})
		}
	});


};