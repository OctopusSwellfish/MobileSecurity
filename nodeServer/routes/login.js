var express = require('express');
var router = express.Router();

var session = require('express-session');

var jwt = require('jsonwebtoken');
var secretObj = require('../config/jwt');
var sequelize = require('../models').sequelize;
var User = require('../models').User;
var Medicine = require('../models').Medicine;

var cipher = require('./cipher');

var crypto = require('crypto');

var aes256Cipher = require('./aes256Cipher');

router.post('/', function(req, res, next) { //로그인할 때
	var id = req.body.ID;
	var password = req.body.Password;
	console.log("처음 받아온 ID ==> "+id);
	

var qwerqwer = Buffer.from(id, 'base64').toString('hex');
var asdfasdf = Buffer.from(password, 'base64').toString('hex');
//스페이스바는 플러스(+) 기호로 바꿔주는 것 잊지말기
console.log('qwerqwer ==> '+qwerqwer);	
		

	var key = 'myVeryTopSecretK';

	//var test_key = aes256Cipher.toUTF8array(key);
	//var test_iv = aes256Cipher.toUTF8array(iv);
	console.log("여기까지!");

	var last_id = aes256Cipher.decrypt(key, qwerqwer);
	var last_password = aes256Cipher.decrypt(key, asdfasdf);

	User.findOne({ where:{ user_id: last_id} }) //테이블 SQL 쿼리
		.then(function(data)
		{
			if(data == null || data == undefined) { //data에는 커서가 담깁니다
				console.log("로그인 자료 없음! ID: " +id);
			
				var response = {login: 'fail'}; //json형태로
				res.json(response); //전송
			
				return;
			}
			else if(data.password != last_password/*password*/) {
				console.log("로그인 암호 틀림! ID: " +id);
			
				var response = {login: 'fail'};
				res.json(response);
			}else{
				var response = {login: 'Success', username:data.name};
				req.session.userid = id; //세션 설정
				req.session.username = data.name; //세션 설정
				console.log('로그인 성공! ID: '+id);
				
				/*
				var token = jwt.sign({
					userid: data.user_id
				},
					secretObj.secret,
				{
					expiresIn: '5m'
				})	
				
				res.cookie("user", token);
				console.log(token);
			///////*/
				sequelize.query('select m.name, m.ingredient, m.period, m.effect, m.caution, m.company from medicines as m, user_medicine where user_medicine.userId=:ID and user_medicine.medicineId = m.id', {replacements: {ID: data.id}, type: sequelize.QueryTypes.SELECT
					}).then(function(resultSet){
					var response = {login: 'Success', 
							username: data.name,
							medi_list: resultSet
							}; 
					
					res.json(response);
					console.log(response);	
					console.log("Successfully send");

				});
				
			}
		})
		.catch(function(err) {
			console.log('로그인 프로세스 오류 : ' + err);
		})
	
});
module.exports = router;
