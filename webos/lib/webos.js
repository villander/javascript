var frontendCore = require("../../modern/lib/frontend-core");
var cryptoObj = require("../../core/vendor/crypto/crypto-obj");

var exportedObj = frontendCore("Webos");
exportedObj.init = exportedObj;
exportedObj.secure = exportedObj;
exportedObj.crypto_obj = cryptoObj();

module.exports = exportedObj;