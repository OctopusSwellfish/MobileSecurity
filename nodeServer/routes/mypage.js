var express = require('express');
var router = express.Router();

var sequelize = require('../models').sequelize;
var Medicine = require('../models').Medicine;
var User = require('../models').User;

var aes128Cipher = require('./aes128Cipher');
var v = require('voca');

var crypto = require('crypto');

router.post('/showAllmedicine', function(req, res) {
		
	Medicine.findAll({
		attributes: { exclude: ['id'] } 
	})
	.then(function(resultSet)
		{
			var Success = aes128Cipher.encrypt('Success');
			var all_medi = aes128Cipher.encrypt(JSON.stringify(resultSet));
			 let hmac_success = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(Success).digest('hex');

			 let hmac_medi_list = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(all_medi).digest('hex');

			let hmac_success_buf = Buffer.from(hmac_success, 'hex').toString('base64');
			let hmac_medi_list_buf = Buffer.from(hmac_medi_list, 'hex').toString('base64');

			var response = {AllMedicine: Success,
					All_medi_list: all_medi,
					MAC_AllMedicine: hmac_success_buf,
					MAC_All_medi_list: hmac_medi_list_buf
					};
			console.log(response);
			res.json(response);
			

			console.log('response Success!');		
		})
	.catch(function(err) {
		console.log('데이터 읽어오기 프로세스 오류 :' +err);
	});

});

router.post('/search', function(req, res) {
	var temp_keyword = req.body.SearchMedicine;
	var temp_i = v.replaceAll(temp_keyword, String.fromCharCode(32), '+');
	
	var temp_hmac_keyword = req.body.MAC_SearchMedicine;
	var temp_h = v.replaceAll(temp_hmac_keyword, String.fromCharCode(32), '+');
	
	var mac_h = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(temp_i).digest('hex');
	var mac_h_buf = Buffer.from(mac_h, 'hex').toString('base64');

	if(mac_h_buf!=temp_h) {
		console.log("맥 값이 다릅니다.");
		return;
	}	
	
	var keyword = aes128Cipher.decrypt(temp_i);
	sequelize.query('select name, ingredient, period, effect, caution, company from medicines where name like :searchkeyword',
 { replacements: { searchkeyword: '%'+keyword+'%' }, type: sequelize.QueryTypes.SELECT})
	.then(function(resultSet) {
			var Success= aes128Cipher.encrypt('Success');
			var Search_medi = aes128Cipher.encrypt(JSON.stringify(resultSet));
			
			let hmac_success = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(Success).digest('hex');
			let hmac_success_buf = Buffer.from(hmac_success, 'hex').toString('base64');

			let hmac_search = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(Search_medi).digest('hex');
			let hmac_search_buf = Buffer.from(hmac_search, 'hex').toString('base64');
			
			var response={
			SearchMedicine: Success,
			Search_medi_list: Search_medi,
			MAC_SearchMedicine: hmac_success_buf,
			MAC_Search_medi_list: hmac_search_buf
			};
		console.log(response);
		res.json(response);

		console.log('response Success!');
	})
	.catch(function(err) {
		console.log('데이터 읽어오기 프로세스 오류 :'+err);
	});
});

	
router.post('/addMedicine', function(req, res) {
	var temp_sess_id = req.body.ID;
	var temp_keyword = req.body.AddMedicine;
	var temp_mac_sess_id = req.body.MAC_ID;
	var temp_mac_keyword = req.body.MAC_AddMedicine;

	var temp_s = v.replaceAll(temp_sess_id, String.fromCharCode(32), '+');
	var temp_k = v.replaceAll(temp_keyword, String.fromCharCode(32), '+');
	var temp_m_s = v.replaceAll(temp_mac_sess_id, String.fromCharCode(32), '+');
	var temp_m_k = v.replaceAll(temp_mac_keyword, String.fromCharCode(32), '+');

	var sess_id = aes128Cipher.decrypt(temp_s);
	var keyword = aes128Cipher.decrypt(temp_k);

	var hmac_sess_str = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(temp_s).digest('hex');
	var hmac_key_str = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(temp_k).digest('hex');
	var hmac_sess_buf = Buffer.from(hmac_sess_str, 'hex').toString('base64');
	var hmac_key_buf = Buffer.from(hmac_key_str, 'hex').toString('base64');

	if(temp_m_s!=hmac_sess_buf || temp_m_k!=hmac_key_buf) {
		console.log("MAC 값이 다릅니다.");
		
		return;
	}

	User.findOne({where: { user_id: sess_id} })
		.then(function(data) {
			var userID = data.id;	

    		 Medicine.findOne({where: { name: keyword } })
               	 .then(function(result) {
                	        var medicineID = result.id;
				
		sequelize.query('select * from user_medicine where userId=:USERID and medicineId=:MEDICINEID', {
			replacements: { USERID: userID,
					MEDICINEID: medicineID
					},
			type: sequelize.QueryTypes.SELECT})
                	 .then(function(rawResult) {
			console.log(rawResult);
			if(rawResult.length===0) {
                                  sequelize.query('insert into user_medicine values(now(), now(), '+userID+', '+medicineID+')', {type: sequelize.QueryTypes.CREATE}).then(function(finalResult) {
					var Success = aes128Cipher.encrypt('Success');
					
					let mac_Success = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(Success).digest('hex');
					let mac_Success_buf = Buffer.from(mac_Success, 'hex').toString('base64');
					var response = {
						AddMedicine: Success,
						MAC_AddMedicine: mac_Success_buf
						};
					console.log(response);
					res.json(response);
					console.log('중복된 데이터가 없어서 데이터 삽입에 성공하였습니다.');
					console.log(sess_id+'의'+keyword+'를(을) 추가하였습니다.');
				});
                          }else if(rawResult!=null) {
				var fail = aes128Cipher.encrypt('Fail');
				
				let mac_fail = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(fail).digest('hex');
				let mac_fail_buf = Buffer.from(mac_fail, 'hex').toString('base64');

                                 var response = {
                                         AddMedicine: fail,
					MAC_AddMedicine: mac_fail_buf
                                 };
				console.log(response);
				res.json(response);
				console.log('실패! 이미 데이터가 존재합니다.');
                         }
                  }).catch(function(err){
				console.log('추가 프로세스 오류:'+err);
			});
 
               		 });


		});

});

router.post('/deleteMedicine', function(req, res) {
	var temp_sess_id = req.body.ID;
        var temp_keyword = req.body.DeleteMedicine;
	var mac_sess_id = req.body.MAC_ID;
	var mac_sess_keyword = req.body.MAC_DeleteMedicine;
        
	var temp_s = v.replaceAll(temp_sess_id, String.fromCharCode(32), '+');
        var temp_k = v.replaceAll(temp_keyword, String.fromCharCode(32), '+');
	var temp_m_s = v.replaceAll(mac_sess_id, String.fromCharCode(32), '+');
	var temp_m_k = v.replaceAll(mac_sess_keyword, String.fromCharCode(32), '+');
	
	var mac_sess_str = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(temp_s).digest('hex');
	var mac_key_str = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(temp_k).digest('hex');
	
	var mac_sess_buf = Buffer.from(mac_sess_str, 'hex').toString('base64');
	var mac_key_buf = Buffer.from(mac_key_str, 'hex').toString('base64');
	
	if(mac_sess_buf!=temp_m_s || mac_key_buf!=temp_m_k){
		console.log("MAC 값이 다릅니다.");
		console.log("상대방맥값(키워드):"+temp_m_k);
		return;
	}


        var sess_id = aes128Cipher.decrypt(temp_s);
        var keyword = aes128Cipher.decrypt(temp_k);
	
	User.findOne({where: {user_id: sess_id} })
		.then(function(data) {
			var userID = data.id;
		
		Medicine.findOne({where: {name: keyword } })
		.then(function(result) {
			var medicineID = result.id;
			
			sequelize.query('delete from user_medicine where userId=:USERID and medicineId=:MEDICINEID', {
				replacements: { USERID: userID,
						MEDICINEID: medicineID
						},
				type: sequelize.QueryTypes.DELETE})
			.then(function(resultSet){
				var Success = aes128Cipher.encrypt('Success');
				let mac_Success = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(Success).digest('hex');
				let mac_Success_buf = Buffer.from(mac_Success, 'hex').toString('base64');

				var response = {Delete: Success, MAC_Delete: mac_Success_buf};
				console.log(response);
				res.json(response);
				console.log('요청을 수행하여, '+sess_id+'의 '+keyword+'을(를) 삭제하였습니다.');
			}).catch(function(err){
				console.log('삭제 프로세스 오류 : ' +err);
			});
		
		});
	
	});	


});

router.post('/changeName', function(req, res) {
	var temp_AlterName = req.body.AlterName;
	var temp_sess_id = req.body.ID;
	var temp_mac_Altername = req.body.MAC_AlterName;
	var temp_mac_sess = req.body.MAC_ID;

	var temp_a = v.replaceAll(temp_AlterName, String.fromCharCode(32), '+');
	var temp_s = v.replaceAll(temp_sess_id, String.fromCharCode(32), '+');
	var temp_m_A = v.replaceAll(temp_mac_Altername, String.fromCharCode(32), '+');
	var temp_m_s = v.replaceAll(temp_mac_sess, String.fromCharCode(32), '+');

	var mac_Alter_str = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(temp_a).digest('hex');
	var mac_sess_str = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(temp_s).digest('hex');

	var mac_Alter_buf = Buffer.from(mac_Alter_str, 'hex').toString('base64');
	var mac_sess_buf = Buffer.from(mac_sess_str, 'hex').toString('base64');

	if(mac_Alter_buf!=temp_m_A || mac_sess_buf!=temp_m_s) {
		console.log("MAC 값이 다릅니다.");
		return;
	}

	var AlterName = aes128Cipher.decrypt(temp_a);
	var sess_id = aes128Cipher.decrypt(temp_s);
	

	User.findOne({where: {user_id: sess_id} })
		.then(function(data) {
			var previousName = data.name;

			User.update({
				name: AlterName
			}, {
				where: { name: previousName },
			});
			var Success = aes128Cipher.encrypt('Success');	
			let mac_success = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(Success).digest('hex');
			let mac_success_buf = Buffer.from(mac_success, 'hex').toString('base64');

			var response = {ModifyName: Success, MAC_ModifyName: mac_success_buf};
			console.log(response);
			res.json(response);			
			console.log(previousName+'을(를) '+AlterName+'으로 변경하였습니다.');
		})
		.catch(function(err) {
			console.log("이름 바꾸기 프로세스 오류 +" +err);
		});

});
router.post('/changePassword', function(req, res) {
	var temp_AlterPassword = req.body.NewPassword;
	var temp_sess_id = req.body.ID;
		
	var temp_a = v.replaceAll(temp_AlterPassword, String.fromCharCode(32), '+');
	var temp_s = v.replaceAll(temp_sess_id, String.fromCharCode(32), '+');	

	var AlterPassword = aes128Cipher.decrypt(temp_a);
	var sess_id = aes128Cipher.decrypt(temp_s);

	User.findOne({where: {user_id: sess_id} })
		.then(function(data) {
			var previousPassword = data.password;

			User.update({
				password: AlterPassword
			}, {
				where: {password: previousPassword },
			});
			var Success = aes128Cipher.encrypt('Success');
			let mac_Success = crypto.createHmac('sha256', Buffer.from('myVeryTopSecretK', 'utf8')).update(Success).digest('hex');
			let mac_Success_buf = Buffer.from(mac_Success, 'hex').toString('base64');

			var response = {ModifyPassword: Success, MAC_ModifyPassword: mac_Success_buf};
			console.log(response);
			res.json(response);
			console.log("비밀번호 변경 성공");
		}).catch(function(err) {
			console.log("비밀번호 바꾸기 프로세스 오류 +"+err);
		});
});

module.exports = router;
