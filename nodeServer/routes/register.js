var express = require('express');
var router = express.Router();

var User = require('../models').User;

var aes128Cipher = require('./aes128Cipher');
var crypto = require('crypto');

var v = require('voca');

//회원가입
router.post('/', function(req, res, next) {
	var temp_user_ID = req.body.ID;
	var temp_Password = req.body.Password;
	var temp_Name = req.body.Name;
	var temp_Age = req.body.Age;
	var temp_Sex = req.body.Sex;

	//받아오는 mac코드
	var mac_u = req.body.MAC_ID;
	var mac_p = req.body.MAC_Password;
	var mac_n = req.body.MAC_Name;
	var mac_a = req.body.MAC_Age;
	var mac_s = req.body.MAC_Sex;	

	var temp_u = v.replaceAll(temp_user_ID, String.fromCharCode(32), '+');
	var temp_P = v.replaceAll(temp_Password, String.fromCharCode(32), '+');
	var temp_N = v.replaceAll(temp_Name, String.fromCharCode(32), '+');
	var temp_A = v.replaceAll(temp_Age, String.fromCharCode(32), '+');
	var temp_S = v.replaceAll(temp_Sex, String.fromCharCode(32), '+');

	
	var MAC_user_id = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(temp_u).digest('hex');
	var MAC_password = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(temp_P).digest('hex');
	var MAC_name = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(temp_N).digest('hex');
	var MAC_age = crypto.createHmac('sha256',Buffer.from('myVeryTopSecretK', 'utf8')).update(temp_A).digest('hex');
	var MAC_sex = crypto.createHmac('sha256', Buffer.from('myverTopSecretK', 'utf8')).update(temp_S).digest('hex');

	var MAC_user_id_buf = Buffer.from(MAC_user_id, 'hex').toString('base64');
	var MAC_password_buf = Buffer.from(MAC_password, 'hex').toString('base64');
	var MAC_name_buf = Buffer.from(MAC_name, 'hex').toString('base64');
	var MAC_age_buf = Buffer.from(MAC_age, 'hex').toString('base64');
	var MAC_sex_buf = Buffer.from(MAC_sex, 'hex').toString('base64');

	if(mac_u!=MAC_user_id_buf || mac_p!=MAC_password_buf || mac_n!=MAC_name_buf || mac_a!=MAC_age_buf || mac_s!=MAC_sex_buf){
		console.log("MAC 값이 다릅니다.");
	}

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
	
		var mac_success = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(Success).digest('hex');
		var mac_success_buf = Buffer.from(mac_success, 'hex').toString('base64');
		var response = {register: Success, MAC_register: mac_success_buf};
		res.json(response);
	})
	.catch(function(err) {
		console.log('error!!' + err);
	});
});

//아이디 중복체크
router.post('/check', function(req, res, next) {
	var temp_id = req.body.ID; 
	var mac_id = req.body.MAC_ID;
	
	var temp_i = v.replaceAll(temp_id, String.fromCharCode(32), '+');
	var temp_mac_id = v.replaceAll(mac_id, String.fromCharCode(32), '+');
	
	var mac_test_id = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(temp_i).digest('hex');
	var mac_test_id_buf = Buffer.from(mac_test_id, 'hex').toString('base64');
	
	if(temp_mac_id!=mac_test_id_buf) {
		console.log("MAC코드가 다릅니다!");
		return;
	}

	var id = aes128Cipher.decrypt(temp_i);

	console.log("idididid???"+id);

	if(id == ''){
		console.log("아이디 중복 체크: 비어있음");
		var Empty = aes128Cipher.encrypt('Empty');
		
		var mac_empty = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(Empty).digest('hex');
		var mac_empty_buf = Buffer.from(mac_empty, 'hex').toString('base64');
		var response = {register: Empty, MAC_register: mac_empty_buf};
		console.log("Successfully response !==>" +response);	
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
				
				var mac_notempty = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(NotEmpty).digest('hex');
				var mac_notempty_buf = Buffer.from(mac_notempty, 'hex').toString('base64');

				var response = {register: NotEmpty, MAC_register: mac_notempty_buf};
				res.json(response);
		               console.log("Sucessfully response! ==>" + response);

			
				return;
			}
			else {
				console.log("아이디 중복체크: 중복!");
				var fail = aes128Cipher.encrypt('fail');

				var mac_fail = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(fail).digest('hex');
				var mac_fail_buf = Buffer.from(mac_fail, 'hex').toString('base64');

				var response = {register: fail, MAC_register: mac_fail_buf};
				res.json(response);

				return;
			}
		});

});

module.exports = router;


