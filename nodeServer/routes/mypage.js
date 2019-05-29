var express = require('express');
var router = express.Router();

var sequelize = require('../models').sequelize;
var Medicine = require('../models').Medicine;
var User = require('../models').User;


router.post('/showAllmedicine', function(req, res) {
	
	var AllMedicine = req.body.AllMedicine;
	console.log(AllMedicine);
		

		Medicine.findAll({
		attributes: ['name', 'ingredient', 'period', 'effect', 'caution', 'company'], type: sequelize.QueryTypes.SELECT})
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
	



module.exports = router;
