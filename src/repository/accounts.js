module.exports.getAccount = (account_id, stream, next) => {
	// get the events from the stream
	stream.getEventsByEntity(account_id, (err, events) => {
		if (err) {
			next(err);
		} else {

			var account = {};

			try {
				// build the account
				events.forEach((t) => {
					switch (t.name) {
						case "account:created":
							account.id = t.payload.id;
							account.first_name = t.payload.first_name;
							account.last_name = t.payload.last_name;
							account.email = t.payload.email;
							account.created_timestamp = t.timestamp;
							account.balance = 0;
							account.transactions = [];
							account.version = t.version;
							break;
						case "transaction:completed":
							account.balance += t.payload.amount;
							account.version = t.version;
							account.transactions.push(t.payload);
							break;
					}
				});
			} catch (ex) {
				next(new Error("Could not build account from log"));
			}

			// return the account
			next(null, account);
		}
	});
};