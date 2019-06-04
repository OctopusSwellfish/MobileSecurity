var crypto = require('crypto');

var AESCrypt = {};

const cryptKey = 'myVeryTopSecretK';

var encrypt = function(plainData) {
	console.log("");
	console.log("======암호화 시작!!======");
	console.log("암호화 할 평문: "+plainData);
	var encipher = crypto.createCipheriv('aes-128-ecb', cryptKey, null);
	var encrypted = encipher.update(plainData, 'utf8', 'hex');
	encrypted += encipher.final('hex');
	console.log("암호화 된 암호문: " + encrypted);
	console.log("======암호화 끝!!!!======");
	console.log("");
	return Buffer.from(encrypted, 'hex').toString('base64');
};

var HMAC = function(data) {
	console.log("");
	console.log("******HMAC 시작!!******");
	var hmac = crypto.createHmac('sha256', cryptKey);
	var pass = hmac.update(data).digest('hex');
	console.log("HMAC값 ==>" pass);
	console.log("******HMAC 끝!!!!******");
	console.log("");
	
	return Buffer.from(pass, 'hex').toString('base64');
};


var decrypt = function(encrypted) {
	console.log("");
	console.log("######복호화 시작!!######");
	console.log("복호화 할 암호문: "+encrypted);
	var buffer_text = Buffer.from(encrypted, 'base64').toString('hex');	
	
	var decipher = crypto.createDecipheriv('aes-128-ecb', cryptKey, null);
		
	var decrypted = decipher.update(buffer_text, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	
	console.log("복호화 된 복호문: "+decrypted);
	console.log("######복호화 끝!!!!######");
	console.log("");
	return decrypted;

};

module.exports = AESCrypt;
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
module.exports.HMAC = HMAC;
