var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var secretObj = require('../config/jwt');

var sequelize = require('../models').sequelize;
var Medicine = require('../models').Medicine;
var User = require('../models').User;


router.post('/showAllmedicine', function(req, res) {
//	var token = req.cookies.user;
//	console.log(token);	
//	var decoded =jwt.verify(token, secretObj.secret);
//	console.log(decoded);
	var reqStatus = req.body.AllMedicine;
	console.log(reqStatus);
		
	Medicine.findAll({
		attributes: { exclude: ['id'] } 
	})
	.then(function(resultSet)
		{
			var response = {AllMedicine: 'Success',
					All_medi_list: resultSet
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
//	console.log(req.session.userid);
	var keyword = req.body.SearchMedicine;
	escape(keyword);
	console.log(keyword);
	sequelize.query('select name, ingredient, period, effect, caution, company from medicines where name like :searchkeyword',
 { replacements: { searchkeyword: '%'+keyword+'%' }, type: sequelize.QueryTypes.SELECT})
	.then(function(resultSet) {
		var response = {SearchMedicine: 'Success',
				Search_medi_list: resultSet
				};
		
		res.json(response);

	//	console.log(response);
		console.log('response Success!');
	})
	.catch(function(err) {
		console.log('데이터 읽어오기 프로세스 오류 :'+err);
	});
});

	
router.post('/addMedicine', function(req, res) {
	var sess_id = req.body.ID;
	var keyword = req.body.AddMedicine;
	
	console.log(sess_id);
	console.log(keyword);
	
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
					var response = {
						AddMedicine: 'Success'
						};
					res.json(response);
					console.log('중복된 데이터가 없어서 데이터 삽입에 성공하였습니다.');
					console.log(sess_id+'의'+keyword+'를(을) 추가하였습니다.');
				});
                          }else if(rawResult!=null) {
                                 var response = {
                                         AddMedicine: 'fail'
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
	var sess_id = req.body.ID;
	var keyword = req.body.DeleteMedicine;

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
				var response = {Delete: 'Success'};
				res.json(response);
				console.log('요청을 수행하여, '+sess_id+'의 '+keyword+'을(를) 삭제하였습니다.');
			}).catch(function(err){
				console.log('삭제 프로세스 오류 : ' +err);
			});
		
		});
	
	});	


});

router.post('/changeName', function(req, res) {

});

router.post('/changePassword', function(req, res) {
});

module.exports = router;
