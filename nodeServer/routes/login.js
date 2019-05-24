var express = require('express');
var router = express.Router();

var session = require('express-session');

var User = require('../models').User;

router.post('/', function(req, res, next) {
	var id = req.body.ID;
	var password = req.body.Password;

	console.log(id);
	console.log(password);

	User.findOne({ where:{ user_id: id} })
		.then(function(data)
		{
			if(data == null || data == undefined) {
				console.log("로그인 자료 없음! ID: " +id);
			
				var response = {login: 'fail'};
				res.json(response);
			
			return;
			}
			else if(data.password != password) {
				console.log("로그인 암호 틀림! ID: " +id);
			
				var response = {login: 'fail'};
				res.json(response);
			}else{
				var sess = req.session;
				sess.userid = id;
				sess.username = data.name;
				console.log('set session:' + sess);

				var response = {login: 'Success'};
				res.json(response);
			}
		})
		.catch(function(err) {
			console.log('로그인 프로세스 오류 : ' + err);
		})
	
});
module.exports = router;
