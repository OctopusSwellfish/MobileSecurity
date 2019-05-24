var express = require('express');
var router = express.Router();

var User = require('../models').User;

//회원가입
router.post('/', function(req, res, next) {
	var id = req.body.user_id


});

//아이디 중복체크
router.post('/check', function(req, res, next) {
	var id = req.body.ID; 
	
	console.log(id);
	
	User.findOne({ where: { user_id: id} }) //테이블 SQL 쿼리 
		.then(function(data)
		{
			if(data == null || data == undifined) {
				console.log("아이디 중복체크: 중복 아님!");
				
				var response = {register: 'Success'};
				res.json(response);
			
				return;
			}
			else {
				console.log("아이디 중복입니다!");
					
				var response = {register: 'fail'};
				res.json(response);

				return;
			}
		});

});

module.exports = router;


