var crypto = require('crypto');

var AESCrypt = {};

const cryptKey = 'myVeryTopSecretK';

var encrypt = function(plainData) {
	console.log("암호화 할 평문: "+plainData);
	var encipher = crypto.createCipheriv('aes-128-ecb', cryptKey, null);
	var encrypted = encipher.update(plainData, 'utf8', 'hex');
	encrypted += encipher.final('hex');
	console.log("암호화 된 암호문: " + encrypted);
	return Buffer.from(encrypted, 'hex').toString('base64');
};


var decrypt = function(encrypted) {
	console.log("암호화 할 암호문: "+encrypted);
	var buffer_text = Buffer.from(encrypted, 'base64').toString('hex');	
	
	var decipher = crypto.createDecipheriv('aes-128-ecb', cryptKey, null);
		
	var decrypted = decipher.update(buffer_text, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	
	console.log("복호화 된 복호문: "+decrypted);
	return decrypted;

};

module.exports = AESCrypt;
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
