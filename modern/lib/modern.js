var frontendCore = require("./frontend-core");
var cryptoObj = require("../../core/lib/crypto-obj");

var exportedObj = frontendCore("Modern");
exportedObj.init = exportedObj;
exportedObj.secure = exportedObj;
exportedObj.crypto_obj = cryptoObj();

module.exports = exportedObj;