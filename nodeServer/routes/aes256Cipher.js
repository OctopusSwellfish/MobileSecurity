//make random IV and make random 256 bit key
//encrypt return Base64 encoded cipher
//decrypt base 64 encoded cipher
var crypto = require('crypto');

//var Buffer = require('safer-buffer').Buffer;

var AESCrypt = {};

var encrypt = function(cryptKey, cryptIv, plainData) {
	var enciipher = crypto.createCipheriv('aes-256-cbc', cryptKey, cryptIv);
	var encrypted = encipher.update(plainData, 'utf8', 'binary');

	encrypted += encipher.final('binary');

	return new Buffer(encrypted, 'binary').toString('base64');
};


var decrypt = function(cryptKey, encrypted) {
	console.log("키값==> "+ cryptKey);
//	console.log("IV값==> "+ cryptIv);
	console.log("암호문==> "+ encrypted);
	//encrypted = new Buffer(encrypted, 'base64').toString('hex');
	//encrypted = Buffer.from(encrypted, 'base64').toString('binary');
	var decipher = crypto.createDecipher('aes-128-cbc', cryptKey);
	console.log('createdecipheriv완료');
	var decrypted = decipher.update(encrypted, 'hex', 'utf-8');
	console.log('update완료');
	decrypted += decipher.final('utf-8');
	
	console.log('final완료');
	console.log(decrypted);
	return decrypted;

};

 
var toUTF8array = function(str) {
	  let utf8 = [];
    for (let i = 0; i < str.length; i++) {
        let charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
                      0x80 | ((charcode>>6) & 0x3f),
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18),
                      0x80 | ((charcode>>12) & 0x3f),
                      0x80 | ((charcode>>6) & 0x3f),
                      0x80 | (charcode & 0x3f));
        }
    }
    	console.log("toUTF8array == 결과값 +" +utf8);
	return utf8;
}


AESCrypt.makeIv = crypto.randomBytes(16);

//Change this private symme key salt
AESCrypt.KEY = crypto.createHash('sha256').update('Awesometic').digest();

module.exports = AESCrypt;
module.exports.toUTF8array = toUTF8array;
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
