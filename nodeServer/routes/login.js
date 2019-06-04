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
	console.log("처음 받아온 암호문(ID) ==> "+id);
	console.log("처음 받아온 암호문(password) ==>"+password);
	
	var last_id = aes256Cipher.decrypt(id);
	var last_password = aes256Cipher.decrypt(password);

	User.findOne({ where:{ user_id: last_id} }) //테이블 SQL 쿼리
		.then(function(data)
		{
			if(data == null || data == undefined) { //data에는 커서가 담깁니다
				console.log("로그인 자료 없음! ID: " +id);
				var fail = aes256Cipher.encrypt('fail');
				console.log('암호문 ==> ' + fail);		
				var response = {login: fail}; //json형태로
				res.json(response); //전송
			
				return;
			}
			else if(data.password != last_password/*password*/) {
		
				
				console.log("로그인 암호 틀림! ID: " +id);
				var fail = aes256Cipher.encrypt('fail');
				console.log('암호문 ==>' + fail);
				var response = {login: fail};
				res.json(response);
			}else{
				//req.session.userid = id; //세션 설정
				//req.session.username = data.name; //세션 설정
			
				console.log('로그인 성공! ID: '+id);
				
				sequelize.query('select m.name, m.ingredient, m.period, m.effect, m.caution, m.company from medicines as m, user_medicine where user_medicine.userId=:ID and user_medicine.medicineId = m.id', {replacements: {ID: data.id}, type: sequelize.QueryTypes.SELECT
					}).then(function(resultSet){
					var Success = aes256Cipher.encrypt('Success');
					console.log("암호문 ==> " +Success);
					var response = {login: Success, 
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
