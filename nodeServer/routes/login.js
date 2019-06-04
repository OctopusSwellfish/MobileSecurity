var express = require('express');
var router = express.Router();

var session = require('express-session');

var sequelize = require('../models').sequelize;
var User = require('../models').User;
var Medicine = require('../models').Medicine;

var aes128Cipher = require('./aes128Cipher');
var v = require('voca');

var crypto = require('crypto');

router.post('/', function(req, res, next) { //로그인할 때
	var temp_id = req.body.ID;
	var temp_password = req.body.Password;
	var temp_HMAC = req.body.MAC;
	console.log("hi");
	console.log("temp+HMAC ==> " + temp_HMAC);
//	var HEHEHE = req.body.HEHEHE;
//	console.log("HEHEHE ==> "+HEHEHE);

	var temp_i = v.replaceAll(temp_id, String.fromCharCode(32), '+');
	var temp_p = v.replaceAll(temp_password, String.fromCharCode(32), '+');
	var temp_H = v.replaceAll(temp_HMAC, String.fromCharCode(32), '+');
	
	var str = aes128Cipher.HMAC(temp_i);

	console.log('asdf ==> ' + str);
	var id = temp_i;
	var password = temp_p;

	console.log("처음 받아온 암호문(ID) ==> "+id);
	
	console.log("처음 받아온 암호문(password) ==>"+password);
	
	var last_id = aes128Cipher.decrypt(id);
	var last_password = aes128Cipher.decrypt(password);

	User.findOne({ where:{ user_id: last_id} }) //테이블 SQL 쿼리
		.then(function(data)
		{
			if(data == null || data == undefined) { //data에는 커서가 담깁니다
				console.log("로그인 자료 없음! ID: " +id);
				var fail = aes128Cipher.encrypt('fail');
				console.log('암호문 ==> ' + fail);		
				var response = {login: fail}; //json형태로
				res.json(response); //전송
			
				return;
			}
			else if(data.password != last_password/*password*/) {
		
				
				console.log("로그인 암호 틀림! ID: " +id);
				var fail = aes128Cipher.encrypt('fail');
				console.log('암호문 ==>' + fail);
				var response = {login: fail};
				res.json(response);
			}else{
				console.log('로그인 성공! ID: '+id);
				
				sequelize.query('select m.name, m.ingredient, m.period, m.effect, m.caution, m.company from medicines as m, user_medicine where user_medicine.userId=:ID and user_medicine.medicineId = m.id', {replacements: {ID: data.id}, type: sequelize.QueryTypes.SELECT
					}).then(function(resultSet){
					
					var Success = aes128Cipher.encrypt('Success');							
					console.log("암호문 ==> " +Success);
				
					var medi = aes128Cipher.encrypt(JSON.stringify(resultSet));

					var response = {login: Success, 
							username: data.name,
							medi_list: medi
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
