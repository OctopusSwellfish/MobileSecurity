var express = require('express');
var router = express.Router();

var sequelize = require('../models').sequelize;
var Medicine = require('../models').Medicine;
var User = require('../models').User;

var Op = sequelize.Op;

router.post('/showAllmedicine', function(req, res) {
	
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
	
	var keyword = req.body.SearchMedicine;
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

		console.log(response);
		console.log('response Success!');
	})
	.catch(function(err) {
		console.log('데이터 읽어오기 프로세스 오류 :'+err);
	});
});

	



module.exports = router;
