var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var secretObj = require('../config/jwt');

var sequelize = require('../models').sequelize;
var Medicine = require('../models').Medicine;
var User = require('../models').User;

var aes128Cipher = require('./aes128Cipher');
var v = require('voca');
router.post('/showAllmedicine', function(req, res) {
		
	Medicine.findAll({
		attributes: { exclude: ['id'] } 
	})
	.then(function(resultSet)
		{
			var Success = aes128Cipher.encrypt('Success');
			var all_medi = aes128Cipher.encrypt(JSON.stringify(resultSet));
			var response = {AllMedicine: Success,
					All_medi_list: all_medi
					};
			res.json(response);
			

			console.log(response);
			console.log('response Success!');		
		})
	.catch(function(err) {
		console.log('데이터 읽어오기 프로세스 오류 :' +err);
	});

});

router.post('/search', function(req, res) {
	var temp_keyword = req.body.SearchMedicine;
	var temp_i = v.replaceAll(temp_keyword, String.fromCharCode(32), '+');
	var keyword = aes128Cipher.decrypt(temp_i);
	sequelize.query('select name, ingredient, period, effect, caution, company from medicines where name like :searchkeyword',
 { replacements: { searchkeyword: '%'+keyword+'%' }, type: sequelize.QueryTypes.SELECT})
	.then(function(resultSet) {
			var Success= aes128Cipher.encrypt('Success');
			var Search_medi = aes128Cipher.encrypt(JSON.stringify(resultSet));
			var response={
			SearchMedicine: Success,
			Search_medi_list: Search_medi
			};
		
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
	
	var temp_s = v.replaceAll(temp_sess_id, String.fromCharCode(32), '+');
	var temp_k = v.replaceAll(temp_keyword, String.fromCharCode(32), '+');

	var sess_id = aes128Cipher.decrypt(temp_s);
	var keyword = aes128Cipher.decrypt(temp_k);
	
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
					var response = {
						AddMedicine: Success
						};
					res.json(response);
					console.log('중복된 데이터가 없어서 데이터 삽입에 성공하였습니다.');
					console.log(sess_id+'의'+keyword+'를(을) 추가하였습니다.');
				});
                          }else if(rawResult!=null) {
				var fail = aes128Cipher.encrypt('Fail');
                                 var response = {
                                         AddMedicine: fail
                                 };
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
        var temp_keyword = req.body.AddMedicine;

        var temp_s = v.replaceAll(temp_sess_id, String.fromCharCode(32), '+');
        var temp_k = v.replaceAll(temp_keyword, String.fromCharCode(32), '+');

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
				var response = {Delete: Success};
				res.json(response);
				console.log(response);
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
	
	var temp_a = v.replaceAll(temp_AlterName, String.fromCharCode(32), '+');
	var temp_s = v.replaceAll(temp_sess_id, String.fromCharCode(32), '+');

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
			var response = {ModifyName: Success};
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
			var response = {ModifyPassword: Success};
			res.json(response);
			console.log("비밀번호 변경 성공");
		}).catch(function(err) {
			console.log("비밀번호 바꾸기 프로세스 오류 +"+err);
		});
});

module.exports = router;
