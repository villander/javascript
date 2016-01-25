var frontendCore = require("./frontend-core");
var cryptoObj = require("../../core/lib/crypto-obj");

var exportedObj = frontendCore("Modern");

instancedExport = exportedObj({});
exportedObj.init = exportedObj;
exportedObj.secure = exportedObj;
exportedObj.crypto_obj = cryptoObj();

module.exports = instancedExport;