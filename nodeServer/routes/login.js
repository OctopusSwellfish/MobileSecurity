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
	var temp_HMAC = req.body.MAC_ID;
	var temp_HMAC_PASSWORD = req.body.MAC_Password;
	var temp_password = req.body.Password;
//	var HEHEHE = req.body.HEHEHE;
//	console.log("HEHEHE ==> "+HEHEHE);

	var temp_i = v.replaceAll(temp_id, String.fromCharCode(32), '+');
	var temp_p = v.replaceAll(temp_password, String.fromCharCode(32), '+');
	var temp_H = v.replaceAll(temp_HMAC, String.fromCharCode(32), '+');
	var temp_H_P = v.replaceAll(temp_HMAC_PASSWORD, String.fromCharCode(32), '+');

	//hmac검증
	var hmac = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(temp_i).digest('hex');
	var h_mac = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(temp_password).digest('hex');
	var hmac_str = Buffer.from(hmac, 'hex').toString('base64');
	var h_mac_str = Buffer.from(h_mac, 'hex').toString('base64');

	console.log("맥아이디"+temp_HMAC);
	console.log("맥아이디(내꺼, 위에꺼는 남에꺼)"+hmac_str);
	
	console.log("맥패스워드오빠꺼"+temp_HMAC_PASSWORD.length);
	console.log("맥패수어드내꺼?"+h_mac_str.length);	
	console.log("내꺼맥값"+ h_mac_str);
	console.log("상대방맥값"+temp_HMAC_PASSWORD);	
	if(hmac_str!=temp_H || h_mac_str!=temp_H_P){ //mac 값 검증
		console.log("MAC값이 다릅니다.");
		var fail = aes128Cipher.encrypt('fail');
		var response = {login: fail};
		res.json(response);

		return;
	}

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
			else if(data.password != last_password) {
			
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
					var Username = aes128Cipher.encrypt(data.name);
					var medi = aes128Cipher.encrypt(JSON.stringify(resultSet));					
					let hmac_success = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(Success).digest('hex');
       					let hmac_username = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(Username).digest('hex');
					let hmac_medi_list = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(medi).digest('hex');

					let hmac_success_buf = Buffer.from(hmac_success, 'hex').toString('base64');
					let hmac_username_buf = Buffer.from(hmac_username, 'hex').toString('base64');
					let hmac_medi_list_buf = Buffer.from(hmac_medi_list, 'hex').toString('base64');

					var response = {login: Success, 
							username: Username,
							medi_list: medi,
							MAC_login: hmac_success_buf,
							MAC_username: hmac_username_buf,
							MAC_medi_list: hmac_medi_list_buf
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
