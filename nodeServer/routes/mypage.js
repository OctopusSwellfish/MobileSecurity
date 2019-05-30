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
			
	/*Medicine.findAll({
		attribute: { exclude: ['id'] },
		name: {
			[Op.substring]: keyword
		}
		
	})*/
	sequelize.query('select name, ingredient, period, effect, caution, company from medicines where name like \'%'+keyword+'%\'', {/* {replacements: { ID: keyword},*/ type: sequelize.QueryTypes.SELECT})
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
			const userID = data.id;	

    		 Medicine.findOne({where: { name: keyword } })
               	 .then(function(result) {
                	        const medicineID = result.id;
                        	console.log(keyword+'의 인덱스: '+medicineID);
				
				sequelize.query('select * from user_medicine where userId='+userID+' and medicineId='+medicineID,
  {type: sequelize.QueryTypes.SELECT})
                 .then(function(rawResult) {
			console.log(rawResult);
			if(rawResult.length===0) {
                                  sequelize.query('insert into user_medicine values(now(), now(), '+userID+', '+medicineID+')', {type: sequelize.QueryTypes.CREATE}).then(function(finalResult) {
					var response = {
						AddMedicine: 'Success'
						};
					res.json(response);
					console.log('성공 inser into user_medicine' + response);
				});
                          }else if(rawResult!=null) {
                                 var response = {
                                         AddMedicine: 'fail'
                                 };
				res.json(response);
				console.log('실패 fail! '+response);
                         }
                  });
 


               		 });


		});



/*
	sequelize.query('select * from user_medicine where userId='+userID+'and medicineId='+medicineID,
 {replacements: [{USERID: userID, MEDICINEID: medicineID}], type: sequelize.QueryTypes.SELECT})
		.then(function(data) {
			if(data===null) {
				//등록
			}else if(data!=null) {
				var response = {
					AddMedicine: 'fail'
				};
			}

		});

*/				
});


module.exports = router;
