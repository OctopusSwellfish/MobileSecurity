var crypto = require('crypto');

var AESCrypt = {};

const cryptKey = 'myVeryTopSecretK';

var encrypt = function(plainData) {
	var encipher = crypto.createCipheriv('aes-128-ecb', cryptKey, null);
	var encrypted = encipher.update(plainData, 'utf8', 'hex');
	console.log("제발 되어라");
	encrypted += encipher.final('hex');
	console.log("제발제발!!!encrypted ==> " + encrypted);
	return Buffer.from(encrypted, 'hex').toString('base64');
};


var decrypt = function(encrypted) {
	var buffer_text = Buffer.from(encrypted, 'base64').toString('hex');	
	
	var decipher = crypto.createDecipheriv('aes-128-ecb', cryptKey, null);
	console.log('createdecipheriv완료');
		
	var decrypted = decipher.update(buffer_text, 'hex', 'utf8');
	console.log("decrypted ====> " +decrypted);	
	console.log('update완료');
	decrypted += decipher.final('utf8');
	
	console.log('final완료');
	console.log(decrypted);
	return decrypted;

};

module.exports = AESCrypt;
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
