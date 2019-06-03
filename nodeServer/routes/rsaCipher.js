//encrypt return base64 encoded cipher
//decrypt for base64 encoded cipher
//RSA public key  PKCS8 format

var NodeRSA = require('node-rsa');

const key = new NodeRSA({b: 2048});

var encrypt = function() {
	switch(arguments.length) {
		case 1:
		return key.encrypt(arguments[0], 'base64');

		case 2:
		tempKey = new NodeRSA();
		tempKey.importKey(arguments[1], 'pkcs8-public-pem');
		
		return tempKey.encrypt(arguments[0], 'base64');

		default:
		return null;
	};
};

var decrypt = function(cipherText) {
	return key.decrypt(cipherText, 'utf8');
};


var getKeyPair = function() {
	console.log(key);
	return key;
};

var getPublicKey = function() {
	return key.exportKey('pkcs8-public-pem');
};

module.exports = NodeRSA;

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
module.exports.getKeyPair = getKeyPair;
module.exports.getPublicKey = getPublicKey;
