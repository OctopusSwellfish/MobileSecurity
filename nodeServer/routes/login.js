var express = require('express');
var router = express.Router();

var User = require('../models').User;

router.post('/', function(req, res, next) {
	var id = req.body.ID;
	var password = req.body.Password;
	
	User.findAll({
		attributes: ['password'],
		where: {
			user_id: id,
	},
	})	
});

module.exports = router;
