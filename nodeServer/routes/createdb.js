var express = require('express');
var router = express.Router();

router.get('/createdb', function(req, res) { 
	console.log("hi");
});

module.exports = router;
