var express = require('express');
var router = express.Router();

var User = require('../models').User;

//회원가입
router.post('/', function(req, res, next) {
	var user_ID = req.body.ID;
	var Password = req.body.Password;
	var Name = req.body.Name;
	var Age = req.body.Age;
	var Sex = req.body.sex;

	User.create({
		user_id: user_ID,
		password: Password,
		name: Name,
		age: Age,
		sex: Sex,
		flag: 0,
	});

	Console.log("회원가입 성공! ID: "+user_ID);
	var response = {register: 'Success'};
	res.json(response);

});

//아이디 중복체크
router.post('/check', function(req, res, next) {
	var id = req.body.ID; 
	if(id == ''){
		console.log("아이디가 비어있는 채로 도착");
		var response = {register: 'Empty' };
		res.json(response);
		
		return;
	}	
	console.log(id);
	
	User.findOne({ where: { user_id: id} }) //테이블 SQL 쿼리 
		.then(function(data) //결과가 data에 담기게 된다.
		{
			if(data == null || data == undefined) {
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


