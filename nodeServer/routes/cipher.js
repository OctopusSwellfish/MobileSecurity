
var crypto = require('crypto');

const keyBase64 = 'myVeryTopSecretK';
const ivBase64 = '12345678901234567890112233445566';
/////////////////////////////



function getAlgorithm(keyBase64) {
	
	var key = Buffer.from(keyBase64, 'base64');
	switch(key.length) {
		case 16:
			return 'aes-128-cbc';
		case 32:
			return 'aes-256-cbc';
	}

	throw new Error('Invalid key length: '+key.length);
}

function _encrypt(plainText, keyBase64, ivBase64){
	var key = Buffer.from(keyBase64, 'base64');
	var iv = Buffer.from(ivBase64, 'base64');

	var cipher = crypto.createCipheriv(getAlgorithm(keyBase64), key, iv);
	
	cipher.update(plainText, 'utf8', 'base64');
	
	return cipher.final('base64');

};

function _decrypt(messagebase64, keyBase64, ivBase64){
	var test = Buffer.from(messagebase64, 'base64');
	
	console.log(test);
	
//	var key = Buffer.from(keyBase64, 'base64');
//	var iv = Buffer.from(ivBase64, 'base64');

	var decipher = crypto.createDecipheriv('aes-128-cbc', keyBase64, ivBase64);
	decipher.update(messagebase64, 'base64');

	var sdf = decipher.final();

	console.log(sdf);

/*	let data = 'c3RhY2thYnVzZS5jb20=';  
let buff = new Buffer(data, 'base64');  
let text = buff.toString('ascii');

console.log('"' + data + '" converted from Base64 to ASCII is "' + text + '"');  	
*/

/*
var iv = new Buffer("0000000000000000");

	console.log(iv);
	var encodeKey = crypto.createHash('sha256').update(key, 'utf-8').digest();
	console.log(encodeKey);
	var cipher = crypto.createDecipheriv('aes-128-cbc', new Buffer(keyBase64, 'hex'), new Buffer(ivBase64));
	
	console.log(cipher);
*/
	return 1;
};
//////////////////////////////

	


module.exports = function(text, b){
	if(b=='encrypt') {
		return _encrypt(text, keyBase64, ivBase64);
	}else if(b=='decrypt') {
		return _decrypt(text, keyBase64, ivBase64);
	}
	return 0;
};
