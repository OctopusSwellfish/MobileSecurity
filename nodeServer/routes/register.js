var express = require('express');
var router = express.Router();

var User = require('../models').User;

var aes128Cipher = require('./aes128Cipher');
var v = require('voca');

//회원가입
router.post('/', function(req, res, next) {
	var temp_user_ID = req.body.ID;
	var temp_Password = req.body.Password;
	var temp_Name = req.body.Name;
	var temp_Age = req.body.Age;
	var temp_Sex = req.body.Sex;
	
	var temp_u = v.replaceAll(temp_user_ID, String.fromCharCode(32), '+');
	var temp_P = v.replaceAll(temp_Password, String.fromCharCode(32), '+');
	var temp_N = v.replaceAll(temp_Name, String.fromCharCode(32), '+');
	var temp_A = v.replaceAll(temp_Age, String.fromCharCode(32), '+');
	var temp_S = v.replaceAll(temp_Sex, String.fromCharCode(32), '+');

	var user_ID = aes128Cipher.decrypt(temp_u);
	var Password = aes128Cipher.decrypt(temp_P);
	var Name = aes128Cipher.decrypt(temp_N);
	var Age = aes128Cipher.decrypt(temp_A);
	var Sex = aes128Cipher.decrypt(temp_S);

	User.create({
		user_id: user_ID,
		password: Password,
		name: Name,
		age: Age,
		sex: Sex,
		flag: 0,
	})
	.then(function(data) {
		console.log('회원가입 성공! ID: '+user_ID);
		var Success = aes128Cipher.encrypt('Success');
		var response = {register: Success};
		res.json(response);
	})
	.catch(function(err) {
		console.log('error!!' + err);
	});
});

//아이디 중복체크
router.post('/check', function(req, res, next) {
	var temp_id = req.body.ID; 
	
	var temp_i = v.replaceAll(temp_id, String.fromCharCode(32), '+');
	var id = temp_i;

	if(id == ''){
		console.log("아이디 중복 체크: 비어있음");
		var Empty = aes128Cipher.encrypt('Empty');
		var response = {register: Empty};
		res.json(response);
		
		return;
	}	
	console.log(id);
	
	User.findOne({ where: { user_id: id} }) //테이블 SQL 쿼리 
		.then(function(data) //결과가 data에 담기게 된다.
		{
			if(data == null || data == undefined) {
				console.log("아이디 중복체크: 중복 아님!");
				var NotEmpty = aes128Cipher.encrypt('NotEmpty');
				var response = {register: NotEmpty};
				res.json(response);
			
				return;
			}
			else {
				console.log("아이디 중복체크: 중복!");
				var fail = aes128Cipher.encrypt('fail');
				var response = {register: fail};
				res.json(response);

				return;
			}
		});

});

module.exports = router;


