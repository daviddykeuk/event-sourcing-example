var repo = require('../repository');

module.exports = (eventEmitter, stream, app) => {
	app.get('/:id', (req, res) => {
		repo.accounts.getAccount(req.params.id, stream, (err, account) => {
			if(err){
				res.status(500).send("Sorry");
			} else if (!account.id){
				res.status(404).send("Account not found");
			} else {
				res.send(account);
			}
		})
	});
};