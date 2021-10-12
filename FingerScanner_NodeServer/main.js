//*************************************************
// Imports
//*************************************************
const FileStream = require('fs');
const Crypto = require('crypto');
const Crypto2 = require('crypto');
const Crypto3 = require('crypto');
const Crypto4 = require('crypto');
const Crypto5 = require('crypto');
const Crypto6 = require('crypto');
const SHA256 = require('sha256'); // sha256('hello');
const aesjs = require('aes-js');
const Express = require('express');
const App = Express();
const Cors = require('cors');
const BodyParser = require('body-parser')
const Net = require('net');
const Auth = require('basic-auth');

var sshKeyToPEM = require('ssh-key-to-pem');
var sshpk = require('sshpk');

var js2xmlparser = require("js2xmlparser");

var converter = require('hex2dec');

//*************************************************
// Defines
//*************************************************
const SAVED_WSQ_IMAGE = true;

const CIS_BLOCK_SIZE_AES = 16;
const CIS_ANSOL_SIZE = 16;
const CIS_ANBIO_SIZE = 16;
const CIS_SESSION_KEY_SIZE = 32;
const CIS_PATH_BTK_FILE = __dirname + '\\btk.key';
//const CIS_PATH_RSA_PUBLIC_KEY_FILE = __dirname + '\\RSA_SIABM_K_001.pub';
//const CIS_PATH_RSA_PUBLIC_KEY_FILE = __dirname + '\\PRD_RSA_SIABM_K_001.pub';
//const CIS_PATH_RSA_PUBLIC_KEY_FILE = __dirname + '\\id_rsa_1024.pub';

const CIS_PATH_RSA_PUBLIC_KEY_FILE = __dirname + '\\RSA_SIABM_K_001.pem';

//const CIS_PATH_RSA_PUBLIC_KEY_FILE = __dirname + '\\public.pem';
//const CIS_PATH_RSA_PRIVATE_KEY_FILE = __dirname + '\\private.pem';

const CIS_PATH_SAVE_XML_FILE = __dirname + '\\temp\\';
const CEF_TAIL_NAME_FILE = "SP7266NB556";

//*************************************************
// Objetos Node
//*************************************************
var objAppServer;

//*************************************************
// Variaveis
//*************************************************
var bolDebug = false;
var strBtkHexFile = "";
var strBtkFile = "";
var strRSAPublicFile = "";
var bufRSAPublicKey = "";
var strRSAPemKey = "";
var bufRSAPemKey = "";
var strRSAPrivateFile = "";
var bufRSAPrivateKey = "";
var strSessionKey = "";
var strFixedKey = "";
var strCurrentKey = "";
var strANBIO = ""; 											// 16 bytes = Numero Aleatorio do Sensor
var strANSOL = ""; 											// 16 bytes = Numero Aleatorio do Servidor
var strKCV = "";												// 04 Bytes
var strKeyValue = "";										// variable = Chave de Sessao
var strPad = "";												// variable
var strIv = "";

var bufAux = Buffer.from("1111111111111111111111111111111111111111111111111111111111111111", "hex");
strFixedKey = Buffer.from(bufAux.toString());
strCurrentKey = strFixedKey;	

const SESSION_KEY = 4097;
const FIXED_KEY = 3;

const PARAM_CAPTURE_INFO = 0;
const PARAM_CAPTURE_SCORE = 1;
const PARAM_IMAGE = 2;
const PARAM_TEMPLATE = 3;
const PARAM_READ_CONFIG = 4;
const PARAM_WRITE_CONFIG = 5;

const HAND_HIGT = "right";
const HAND_LEFT = "left";

const FINGER_THUMB = "thumb";
const FINGER_INDEX = "index";
const FINGER_MIDDLE = "middle";
const FINGER_RING = "ring";
const FINGER_LITTLE = "little";		

var objCapture = {'type': '', 
									'hand' : '',
									'finger': '',
									'data' : ''																
								 };

var arrayObjTemplate = {objCapture, objCapture, objCapture, objCapture, objCapture, objCapture, objCapture, objCapture, objCapture, objCapture};
var arrayObjImage = {objCapture, objCapture, objCapture, objCapture, objCapture, objCapture, objCapture, objCapture, objCapture, objCapture};

const RELEASE_VERSAO_01 = 1;
const RELEASE_VERSAO_02 = 2;
const CURRENTE_VERSION = RELEASE_VERSAO_02;

//***********************************************************
// function fncReadBtkFile
//***********************************************************
const fncReadBtkFile = (strPath) => {
	try {
		strBtkHexFile = FileStream.readFileSync(strPath, 'utf8');
		strBtkHexFile = strBtkHexFile.replace(/\s/g, '');
		strBtkFile = Buffer.from(strBtkHexFile, 'hex');
		if(0){console.log("BTK raw: ", strBtkFile.toString('utf8'));}
		if(1){console.log("BTK hex: ", strBtkFile.toString('hex'));}
		return true;
	} catch (err) {
		// Here you get the error when the file was not found,
		// but you also get any other error
		return false;
	}	
}

//***********************************************************
// function fncReadRSAPublicKeyFile
//***********************************************************
const fncReadRSAPublicKeyFile = (strPath) => {
	
	try {
		
		strRSAPublicFile = FileStream.readFileSync(CIS_PATH_RSA_PUBLIC_KEY_FILE, "utf8");
		bufRSAPublicKey = Buffer.from(strRSAPublicFile);
		if(1){console.log("RSA Public Pem: ", strRSAPublicFile.toString());}
		
		//strRSAPrivateFile = FileStream.readFileSync(CIS_PATH_RSA_PRIVATE_KEY_FILE, "utf8");
		//bufRSAPrivateKey = Buffer.from(strRSAPrivateFile);
		//if(1){console.log("RSA Private Pem: ", strRSAPrivateFile.toString());}		

		// OK - com chave ssh
		//const CIS_PATH_RSA_PUBLIC_KEY_FILE = __dirname + '\\id_rsa.pub';
		//strRSAPublicFile = FileStream.readFileSync(strPath, 'ascii');
		//strRSAPemKey = sshKeyToPEM(strRSAPublicFile);
		//bufRSAPemKey = Buffer.from(strRSAPemKey);
		//strRSAPublicFile = strRSAPemKey ;
		//if(1){console.log("RSA Pem: ", strRSAPemKey.toString());}
		
		// ERROR
		//strRSAPublicFile = FileStream.readFileSync(strPath);
		//strRSAPemKey = sshpk.parseKey(strRSAPublicFile, 'ssh');
		////bufRSAPemKey = Buffer.from(strRSAPemKey);
		//if(1){console.log("RSA Pem: ", strRSAPemKey.toString());}
		//if(1){console.log("RSA Pem hex: ", strRSAPemKey.toString('hex'));}		
		
		return true;
	} catch (err) {
		// Here you get the error when the file was not found,
		// but you also get any other error
		console.log(err);
		return false;
	}	
}

//***********************************************************
// function fncReadRSAPrivateKeyFile
//***********************************************************
const fncReadRSAPrivateKeyFile = (strPath) => {
	try {
		strRSAPrivateFile = FileStream.readFileSync(strPath, 'utf8');
		//strRSAHexFile = strRSAHexFile.replace(/\s/g, '');
		strRSAPrivateKey = Buffer.from(strRSAPrivateFile);
		if(0){console.log("RSA Public raw: ", strRSAPrivateKey.toString('utf8'));}
		if(1){console.log("RSA Public hex: ", strRSAPrivateKey.toString('hex'));}
		return true;
	} catch (err) {
		// Here you get the error when the file was not found,
		// but you also get any other error
		return false;
	}	
}

//***********************************************************
// function fncGenerateRandomNumber
//***********************************************************
function fncGenerateRandomNumber(n) {
	var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   

	if ( n > max ) {
					return fncGenerateRandomNumber(max) + fncGenerateRandomNumber(n - max);
	}

	max        = Math.pow(10, n+add);
	var min    = max/10; // Math.pow(10, n) basically
	var number = Math.floor( Math.random() * (max - min + 1) ) + min;

	return ("" + number).substring(add); 
}

//***********************************************************
// function fncTimestamp
//***********************************************************
const fncTimestamp = () => {
	
	let date_ob = new Date();

	// current date
	// adjust 0 before single digit date
	let date = ("0" + date_ob.getDate()).slice(-2);

	// current month
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

	// current year
	let year = date_ob.getFullYear();
	yearTemp = year.toString();
	yearTemp2 = yearTemp.substr(-2);
	//let year = date_ob.getYear();

	// current hours
	let hours = date_ob.getHours();

	// current minutes
	let minutes = date_ob.getMinutes();

	// current seconds
	let seconds = date_ob.getSeconds();

	// prints date in YYYY-MM-DD format
	//console.log(year + "-" + month + "-" + date);

	// prints date & time in YYYY-MM-DD HH:MM:SS format
	console.log(yearTemp2 + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

	return (date + month + yearTemp2 + hours + minutes + seconds);
	
}

//***********************************************************
// function fncInitServer
//***********************************************************
const fncInitServer = () => {
  
  //*************************************************
  // Configurando o Servidor
  //*************************************************
	
  App.use(BodyParser.urlencoded({ limit: '100mb', extended: true }))
  App.use(BodyParser.json({limit: '100mb'}))
  App.use(Cors());
  
  //*************************************************
  // Autenticacao Basica do Servidor
  //*************************************************  
	/*
  App.use(function(req, res, next){      
    var user = auth(req);
    if (user === undefined || user['name'] != "CisEletronica" || user['pass'] != "CisElet") {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm="CIS"');
      res.end('Unauthorized');
    } else {
      next();
    }      
  });    
	*/
	
	// Add headers
	App.use(function (req, res, next) {
		// Website you wish to allow to connect
		res.setHeader('Access-Control-Allow-Origin', '*');
		// Request methods you wish to allow
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		// Request headers you wish to allow
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
		// Set to true if you need the website to include cookies in the requests sent
		// to the API (e.g. in case you use sessions)
		res.setHeader('Access-Control-Allow-Credentials', true);
		// Pass to next layer of middleware
		next();
	});	
	
		
	//****************************************************************
	// Function set_fixed_key()
	//****************************************************************			
	App.get('/cef/set_fixed_key', function (req, res) {	
	
		console.log("\nRequisicao PUT - set_fixed_key");
		
		//strANSOL = fncGenerateRandomNumber(CIS_ANSOL_SIZE);
		strANSOL = "0123456789012345";
		bufTemp = Buffer.from(strANSOL.toString());
		if(1){console.log("ANSOL: ", bufTemp.toString('hex'));}
		
		bufTemp = Buffer.from("1111111111111111111111111111111111111111111111111111111111111111", "hex");
		strFixedKey = Buffer.from(bufTemp.toString());
		strCurrentKey = strFixedKey;
		if(1){console.log("strCurrentKey: ", bufTemp.toString('hex'));}				

		res.send({'resposta': 'set_fixed_key', 
							'status' : 'CIS Status: 200 - OK'});	
		
	});	



	//****************************************************************
	// Function set_session_key()
	//****************************************************************		
	App.get('/cef/set_session_key', function (req, res) {	
	
		console.log("\nRequisicao PUT - set_session_key");

		strANSOL = fncGenerateRandomNumber(CIS_ANSOL_SIZE);
		//strANSOL = "0123456789012345";
		bufTemp = Buffer.from(strANSOL.toString());
		if(1){console.log("ANSOL: ", bufTemp.toString('hex'));}				
		
		strSessionKey = fncGenerateRandomNumber(CIS_SESSION_KEY_SIZE);//32 numerico
		//strSessionKey = "01234567890123456789012345678901";				
		
		strCurrentKey = strSessionKey;
		bufTemp = Buffer.from(strSessionKey.toString());
		if(1){console.log("strCurrentKey: ", bufTemp.toString('hex'));}	
		
		res.send({'resposta': 'set_session_key', 
							'status' : 'CIS Status: 200 - OK'});							

	});			
	
	
	
	//****************************************************************
	// Function get_key_data(key)
	// Parameters: key -> SESSION_KEY = 4097
	//								 -> FIXED_KEY = 3
	//****************************************************************
	App.get('/cef/get_key_data', function (req, res) {	
	
		console.log("\nRequisicao GET - get_key_data");
		
		var intKey = req.query.key;
		console.log("Key: ", intKey);
		
		if(intKey){

			strPad = "";

			//****************************************
			// Via POST
			//****************************************
			/*
			var strSerialNumber = req.body.serial_number;
			//console.log("Serial Number: ", strSerialNumber);
			var strRandomNumber = req.body.random_number;
			//console.log("Random Number: ", strRandomNumber);	
			*/
			//****************************************
			
			//****************************************
			// Via Get
			//****************************************
			// Serve somente para buscar a BTK quando estiver no server da CEF
			//var strSerialNumber = req.query.serial_number; 
			//console.log("Serial Number: ", strSerialNumber);		
			// ANBIO
			var strRandomNumber = req.query.random_number; // EM BASE 64
			bufTemp = Buffer.from(strRandomNumber, 'base64'); // Converte
			//console.log("Random Number Size: ", bufTemp.length,); // Mostra em hexa
			console.log("ANBIO: ", bufTemp.toString('hex')); // Mostra em hexa
			//****************************************
			
			strANBIO = bufTemp;

			if(strANBIO){
				
				bufTemp = Buffer.from(strANSOL.toString());
				if(1){console.log("ANSOL: ", bufTemp.toString('hex'));}				
				
				if(strANSOL){
					
					if(intKey == SESSION_KEY){
						//strSessionKey = fncGenerateRandomNumber(CIS_SESSION_KEY_SIZE);//32 numerico
						//strSessionKey = "01234567890123456789012345678901";
						strCurrentKey = strSessionKey;							;
						bufTemp = Buffer.from(strSessionKey.toString());							
					}
					else{							
						bufTemp = Buffer.from("1111111111111111111111111111111111111111111111111111111111111111", "hex");
						strFixedKey = Buffer.from(bufTemp.toString());
						strCurrentKey = strFixedKey;	
					}						
					if(1){console.log("strCurrentKey: ", bufTemp.toString('hex'));}									
					
					if(strCurrentKey){			
						
						// Cifra SessionKey com Btk										
						var cipherKeyValue = Crypto.createCipheriv("aes-256-cbc", Buffer.from(strBtkFile), "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0");
						strKeyValue = cipherKeyValue.update(strCurrentKey);					
						//console.log("strKeyValue: ", strKeyValue.toString('hex'));					
				
						// Cifra NULL com SesssionKey
						var cipherKvc = Crypto.createCipheriv("aes-256-cbc", Buffer.from(strCurrentKey), "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0");
						strKCV = cipherKvc.update("\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0");
						//console.log("strKCV: ", strKCV.toString('hex'));						
						
						// Bufferiza ANBIO
						var bufANBIO = [];
						bufANBIO = Buffer.from(strANBIO);
						if(bolDebug){console.log("bufANBIO: ", bufANBIO.toString('hex'));}
						
						// Bufferiza ANSOL
						var bufANSOL = [];
						bufANSOL = Buffer.from(strANSOL);
						if(bolDebug){console.log("bufANSOL: ", bufANSOL.toString('hex'));}	

						if(intKey == SESSION_KEY){
							// Bufferiza Slot Id (Little Endian)
							var bufSlotIdTemp = [];											// 02 Bytes
							bufSlotIdTemp.push(0x01); 
							bufSlotIdTemp.push(0x10);
						}
						else{
							// Bufferiza Slot Id (Little Endian)
							var bufSlotIdTemp = [];											// 02 Bytes
							bufSlotIdTemp.push(0x03); 
							bufSlotIdTemp.push(0x00);								
						}

						// Bufferiza Slot Id (Little Endian)
						//var bufSlotIdTemp = [];										// 02 Bytes
						//bufSlotIdTemp.push(0x03); 
						//bufSlotIdTemp.push(0x00); 
						
						var bufSlotId = [];
						bufSlotId = Buffer.from(bufSlotIdTemp);
						if(bolDebug){console.log("bufSlotId: ", bufSlotId.toString('hex'));}					
						
						// Bufferiza Version (Little Endian)
						var bufVersionTemp = []; 										// 02 Bytes
						bufVersionTemp.push(0x00); 
						bufVersionTemp.push(0x00); 
						
						var bufVersion = [];
						bufVersion = Buffer.from(bufVersionTemp);
						if(bolDebug){console.log("bufVersion: ", bufVersion.toString('hex'));}						
						
						// Bufferiza Key Mode (Little Endian)
						var bufKeyModeTemp = []; 				  					// 02 Bytes
						bufKeyModeTemp.push(0x01);
						bufKeyModeTemp.push(0x00); 					
						
						var bufKeyMode = [];
						bufKeyMode = Buffer.from(bufKeyModeTemp);
						if(bolDebug){console.log("bufKeyMode: ", bufKeyMode.toString('hex'));}					

						// Bufferiza KCV (Little Endian)
						var bufKCVTemp = [];
						bufKCVTemp = Buffer.from(strKCV);
						if(bolDebug){console.log("bufKCVTemp: ", bufKCVTemp.toString('hex'));}
						
						var bufKCV = bufKCVTemp.slice(0, 4);
						if(bolDebug){console.log("bufKCV: ", bufKCV.toString('hex'));}
						
						// Bufferiza Len Key Value (Little Endian)
						var bufKeyValueLenTemp = []; 				  					// 02 Bytes
						bufKeyValueLenTemp.push(0x20);
						bufKeyValueLenTemp.push(0x00); 
						
						// Bufferiza Key Value
						var bufKeyValueLen = [];
						bufKeyValueLen = Buffer.from(bufKeyValueLenTemp);
						if(bolDebug){console.log("bufKeyValueLen: ", bufKeyValueLen.toString('hex'));}
						
						var bufKeyValue = [];
						bufKeyValue = Buffer.from(strKeyValue);
						if(bolDebug){console.log("bufKeyValue: ", bufKeyValue.toString('hex'));}					

						// Monta Key Block Temp para calcular o Pad
						var bufKeyBlockTemp = [];
						bufKeyBlockTemp = Buffer.concat([bufANBIO, bufANSOL, bufSlotId, bufVersion, bufKeyMode, bufKCV, bufKeyValueLen, bufKeyValue]);

						bufTemp = Buffer.from(bufKeyBlockTemp);
						if(bolDebug){console.log("bufKeyBlockTemp raw: ", bufTemp.toString('hex'));}

						// Calcula o Pad
						var intFill = bufKeyBlockTemp.length % CIS_BLOCK_SIZE_AES;
						//intFill = CIS_BLOCK_SIZE_AES - (intFill * CIS_BLOCK_SIZE_AES);
						if(intFill){
							intFill = CIS_BLOCK_SIZE_AES - intFill;
						}
						strPad = "";
						for(let intCont = 0; intCont < intFill; intCont++){
							strPad = strPad + "\0"; // Arrumar para 0x00 -> sempre 4 nulls
						}
						
						var bufPad = [];
						bufPad = Buffer.from(strPad);
						if(bolDebug){console.log("bufPad: ", bufPad.toString('hex'));}						
						
						// Monta Key Block
						var bufKeyBlock = [];
						bufKeyBlock = Buffer.concat([bufANBIO, bufANSOL, bufSlotId, bufVersion, bufKeyMode, bufKCV, bufKeyValueLen, bufKeyValue, bufPad]);
						
						bufTemp = Buffer.from(bufKeyBlock);
						console.log("KeyBlock raw: ", bufTemp.toString('hex'), '\n');	

						// Cifra KeyBlock com Btk
						var cipherKeyBlock = Crypto.createCipheriv("aes-256-cbc", Buffer.from(strBtkFile), "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0");
						strKeyBlock = cipherKeyBlock.update(bufKeyBlock);
						
						bufTemp = Buffer.from(strKeyBlock);
						console.log("KeyBlock crypt: ", bufTemp.toString('hex'), '\n');								
						
						res.send({'resposta': 'get_key_data', 
											'status' : 'CIS Status: 200 - OK',
											'key_block' : bufTemp.toString('base64')});					
						
					}
					else{
						res.send({'resposta': 'get_key_data', 'status' : 'CIS Status: 200 - ERROR_EMPTY_SESSION_KEY'});
					}
					
				}
				else{
					res.send({'resposta': 'get_key_data', 'status' : 'CIS Status: 200 - ERROR_EMPTY_ANSOL'});
				}			
				
			}
			else{
				res.send({'resposta': 'get_key_data', 'status' : 'CIS Status: 200 - ERROR_EMPTY_ANBIO'});
			}
			
		}
		else{
			res.send({'resposta': 'get_key_data', 'status' : 'CIS Status: 200 - ERROR_MISSING_KEY'});
		}
		
	})
	
	
	
	//****************************************************************
	// Function get_parameters_data(parameters)
	// Parameters: parameters -> PARAM_CAPTURE_INFO
	//												-> PARAM_CAPTURE_SCORE
	//												-> PARAM_IMAGE
	//												-> PARAM_TEMPLATE
	//												-> PARAM_READ_CONFIG
	//												-> PARAM_WRITE_CONFIG
	//****************************************************************		
	App.get('/cef/get_parameters_data', function (req, res) {	
		
		console.log("\nRequisicao GET - get_parameters_data");
		
		var intParameter = req.query.parameter;
		console.log("Parameter: ", intParameter);
		
		var bolStatus = true;
		
		if(intParameter){
			
			var paramHex = "";
			
			if(intParameter	== PARAM_CAPTURE_INFO){
				paramHex = "";
			}
			else if(intParameter	== PARAM_CAPTURE_SCORE){
				paramHex = "";
			}
			else if(intParameter	== PARAM_IMAGE){
				//******************************************
				// RAW MODE				
				//******************************************
				paramHex = "00000000";
				
				//******************************************
				// BIR MODE				
				//******************************************				
			}
			else if(intParameter	== PARAM_TEMPLATE){
				//******************************************
				// RAW MODE				
				//******************************************				
				paramHex = "00000000";
				
				//******************************************
				// BIR MODE				
				//******************************************					
			}
			else if(intParameter	== PARAM_WRITE_CONFIG){
				//******************************************
				// DEFAULT				
				//******************************************
				// nTimeoutSeconds = 15                                             // 0f00
				// nProcessingMode = 15                                             // 0f00
				// nCropLevel = 3                                                   // 0300
				// nWSQCompressionRatio = 11                                        // 0b00
				// nSpoofProtectionLevel = SPOOF_PROTECTION_MEDIUM_SECURE           // 1200		
				// nMaxTemplateSize = 900 // 0x0384                                 // 8403
				// nThresholdMode = Far Mode                                        // 0000
				// nEnrolmmentThreshold = 1                                         // 0100
				// nVerifyThreshold = 1                                             // 0100
				// nTemplateMode = ANSI                                             // 0100
				// nRecordMode = RAW Mode //0x00, 0x00, 0x00, 0x00                  // 0000
				// nImageMode = WSQ Compression Mode                                // 0100
				// zeropad = fill with 0                                            // 000000000000000000000000000000000000000000000000				
				
				//paramHex = "0f000f0003000b00120084030000010001000100000001000000000000000000000000000000000000000000000000000000";
				
				//******************************************
				//CEF - Config
				//******************************************
				// nTimeoutSeconds = 30	// 0x001E																		// 1e00
				// nProcessingMode = 15																							// 0f00
				// nCropLevel = 0 																									// 0000
				// nWSQCompressionRatio = 11																				// 0b00
				// nSpoofProtectionLevel = SPOOF_PROTECTION_MEDIUM_SECURE						// 1200
				// nMaxTemplateSize = 2048 // 0x0800																// 0008
				// nThresholdMode = Far Mode																				// 0000
				// nEnrolmmentThreshold = 1																					// 0100
				// nVerifyThreshold = 1																							// 0100
				// nTemplateMode = TEMPLATE_ISO_NORMAL															// 0200	
				// nRecordMode = RAW Mode																						// 0000
				// nImageMode = WSQ Compression Mode																// 0100
				// zeropad = fill with 0																						// 000000000000000000000000000000000000000000000000				
				
				paramHex = "1e000f0003000b00120000080000010001000200000001000000000000000000000000000000000000000000000000000000";
			
				//******************************************
				//CEF - Config TESTE (image raw)
				//******************************************
				// nTimeoutSeconds = 30	// 0x001E																		// 1e00
				// nProcessingMode = 15																							// 0f00
				// nCropLevel = 0 																									// 0000
				// nWSQCompressionRatio = 11																				// 0b00
				// nSpoofProtectionLevel = SPOOF_PROTECTION_MEDIUM_SECURE						// 1200
				// nMaxTemplateSize = 2048 // 0x0800																// 0008
				// nThresholdMode = Far Mode																				// 0000
				// nEnrolmmentThreshold = 1																					// 0100
				// nVerifyThreshold = 1																							// 0100
				// nTemplateMode = TEMPLATE_ISO_NORMAL															// 0200	
				// nRecordMode = RAW Mode																						// 0000
				// nImageMode = IMAGE_RAW																						// 0000
				// zeropad = fill with 0																						// 000000000000000000000000000000000000000000000000				
				
				//paramHex = "1e000f0003000b00120000080000010001000200000000000000000000000000000000000000000000000000000000000000";
						
			
			}
			else if(intParameter	== PARAM_READ_CONFIG){
				paramHex = "";
			}				
			else{
				bolStatus = false;
				res.send({'resposta': 'get_parameters_data', 'status' : 'CIS Status: 200 - ERROR_INVALID_PARAMETERS'});
			}
			
		}
		else{
			bolStatus = false;
			res.send({'resposta': 'get_parameters_data', 'status' : 'CIS Status: 200 - ERROR_MISSING_PARAMETERS'});				
		}
		
		if(bolStatus == true){
			
			res.send({'resposta': 'get_parameters_data', 
								'status' : 'CIS Status: 200 - OK',
								'data' : paramHex});					
			
		}
		
	})



	//****************************************************************
	// Function crypt_data(parameters, data)
	// Parameters: parameters -> PARAM_CAPTURE_INFO
	//												-> PARAM_CAPTURE_SCORE
	//												-> PARAM_IMAGE
	//												-> PARAM_TEMPLATE
	//												-> PARAM_READ_CONFIG		
	//												-> PARAM_WRITE_CONFIG		
	//****************************************************************
	App.put('/cef/crypt_data', function (req, res) {	
	
		console.log("\nRequisicao PUT - crypt_data");
		
		bufCurrentKey = Buffer.from(strCurrentKey);
		if(1){console.log("bufCurrentKey: ", bufCurrentKey.toString('hex'));}				
		
		var intParameter = req.query.parameter;
		console.log("Parameter: ", intParameter);
		
		var strRawData = req.body.rawData;
		console.log("Base 64 Data: ", strRawData);
		bufRawData = Buffer.from(strRawData, 'base64');
		console.log("Raw Data: ", bufRawData.toString('hex')); // Mostra em hexa		
		
		if(intParameter){
			
			if((intParameter	== PARAM_CAPTURE_INFO) || 
					(intParameter	== PARAM_CAPTURE_SCORE) || 
					(intParameter	== PARAM_IMAGE) || 
					(intParameter	== PARAM_TEMPLATE) ||
					(intParameter	== PARAM_READ_CONFIG)){

				if(strANSOL){
					
					if(strCurrentKey){	
					
						var bufANSOL = [];
						bufANSOL = Buffer.from(strANSOL);
						if(1){console.log("ANSOL: ", bufANSOL.toString('hex'));}					

						// Monta Key Block Temp para calcular o Pad
						var bufDataBlockTemp = [];
						bufDataBlockTemp = Buffer.concat([bufANSOL, bufRawData]);
						console.log("Data Block Temp Hex (ANBIO + Param) ", bufDataBlockTemp.toString('hex')); // Mostra em hexa
						
						console.log("Tamanho Data Block Temp: ", bufDataBlockTemp.length); // Mostra em hexa				
											
						// Calcula o Pad
						var intFill = bufDataBlockTemp.length % CIS_BLOCK_SIZE_AES;
						console.log("DataBlock Mod SIZE_AES: ", intFill); // Mostra em hexa
						if(intFill){
							intFill = CIS_BLOCK_SIZE_AES - intFill;
							console.log("Fill DataBlock: ", intFill); // Mostra em hexa
						}
						strPad = "";
						for(let intCont = 0; intCont < intFill; intCont++){
							strPad = strPad + "\0"; // Arrumar para 0x00 -> sempre 4 nulls
						}
						
						var bufPad = [];
						bufPad = Buffer.from(strPad);
						if(1){console.log("Padding Hex: ", bufPad.toString('hex'));}						
					
						var bufDataBlock = [];
						bufDataBlock = Buffer.concat([bufDataBlockTemp, bufPad]);
						console.log("Data Block Hex (ANSOL + Param + Padding): ", bufDataBlock.toString('hex')); // Mostra em hexa				

						//strIv = "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0";
						//strIV = str_repeat('\0', 16);
											
						var cryptData = Crypto2.createCipheriv("aes-256-cbc", Buffer.from(strCurrentKey), "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0");
						var strCryptData = cryptData.update(bufDataBlock);										
						
						bufCryptData = Buffer.from(strCryptData); // Converte
						console.log("Crypt Data: ", bufCryptData.toString('hex')); // Mostra em hexa															
						
						// Com Padding
						var hashDataBlock = Crypto2.createHash('sha256').update(bufDataBlock).digest('hex');										
						var bufHashDataBlock = [];
						bufHashDataBlock = Buffer.from(hashDataBlock, 'hex');
						if(1){console.log("Hash DataBlock: ", bufHashDataBlock.toString('hex'));}								
						
						res.send({'resposta': 'encrypt_data', 
											'status' : 'CIS Status: 200 - OK',
											'data' : bufCryptData.toString('base64'),
											'dataSize' : bufCryptData.length,
											'signature' : bufHashDataBlock.toString('base64')});					
			
					}
					else{
						res.send({'resposta': 'encrypt_data', 'status' : 'CIS Status: 200 - ERROR_EMPTY_CURRENT_KEY'});
					}
					
				}
				else{
					res.send({'resposta': 'encrypt_data', 'status' : 'CIS Status: 200 - ERROR_EMPTY_ANSOL'});
				}								
									
			}
			else if(intParameter	== PARAM_WRITE_CONFIG){
		
				//****************************************
				// Via POST
				//****************************************
				/*
				var strSerialNumber = req.body.serial_number;
				//console.log("Serial Number: ", strSerialNumber);
				var strRandomNumber = req.body.random_number;
				//console.log("Random Number: ", strRandomNumber);	
				*/
				//****************************************
				
				//****************************************
				// Via Get
				//****************************************
				// Serve somente para buscar a BTK quando estiver no server da CEF
				//var strSerialNumber = req.query.serial_number; 
				//console.log("Serial Number: ", strSerialNumber);		
				// ANBIO
				var strRandomNumber = req.query.random_number; // EM BASE 64
				bufANBIOTmp = Buffer.from(strRandomNumber, 'base64'); // Converte
				//console.log("Random Number Size: ", bufTemp.length,); // Mostra em hexa
				console.log("ANBIO: ", bufANBIOTmp.toString('hex')); // Mostra em hexa
				//****************************************			
		
				if(strRandomNumber){
					
					if(strCurrentKey){				

						// Monta Key Block Temp para calcular o Pad
						var bufDataBlockTemp = [];
						bufDataBlockTemp = Buffer.concat([bufANBIOTmp, bufRawData]);
						console.log("Data Block Temp Hex (ANBIO + Param) ", bufDataBlockTemp.toString('hex')); // Mostra em hexa
						
						console.log("Tamanho Data Block Temp: ", bufDataBlockTemp.length); // Mostra em hexa				
											
						// Calcula o Pad
						var intFill = bufDataBlockTemp.length % CIS_BLOCK_SIZE_AES;
						console.log("DataBlock Mod SIZE_AES: ", intFill); // Mostra em hexa
						if(intFill){
							intFill = CIS_BLOCK_SIZE_AES - intFill;
							console.log("Fill DataBlock: ", intFill); // Mostra em hexa
						}
						strPad = "";
						for(let intCont = 0; intCont < intFill; intCont++){
							strPad = strPad + "\0"; // Arrumar para 0x00 -> sempre 4 nulls
						}
						
						var bufPad = [];
						bufPad = Buffer.from(strPad);
						if(1){console.log("Padding Hex: ", bufPad.toString('hex'));}						
					
						var bufDataBlock = [];
						bufDataBlock = Buffer.concat([bufDataBlockTemp, bufPad]);
						console.log("Data Block Hex (ANBIO + Param + Padding): ", bufDataBlock.toString('hex')); // Mostra em hexa				

						//strIv = "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0";
						//strIV = str_repeat('\0', 16);
											
						var cryptData = Crypto2.createCipheriv("aes-256-cbc", Buffer.from(strCurrentKey), "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0");
						var strCryptData = cryptData.update(bufDataBlock);										
						
						bufCryptData = Buffer.from(strCryptData); // Converte
						console.log("Crypt Data: ", bufCryptData.toString('hex')); // Mostra em hexa															
						
						// Com Padding
						var hashDataBlock = Crypto2.createHash('sha256').update(bufDataBlock).digest('hex');										
						var bufHashDataBlock = [];
						bufHashDataBlock = Buffer.from(hashDataBlock, 'hex');
						if(1){console.log("Hash DataBlock: ", bufHashDataBlock.toString('hex'));}								
						
						res.send({'resposta': 'encrypt_data', 
											'status' : 'CIS Status: 200 - OK',
											'data' : bufCryptData.toString('base64'),
											'dataSize' : bufCryptData.length,
											'signature' : bufHashDataBlock.toString('base64')});					
			
					}
					else{
						res.send({'resposta': 'encrypt_data', 'status' : 'CIS Status: 200 - ERROR_EMPTY_SESSION_KEY'});
					}
					
				}
				else{
					res.send({'resposta': 'encrypt_data', 'status' : 'CIS Status: 200 - ERROR_EMPTY_ANBIO'});
				}					
				
				
			}
			else{
				bolStatus = false;
				res.send({'resposta': 'encrypt_data', 'status' : 'CIS Status: 200 - ERROR_INVALID_PARAMETERS'});
			}
			
		}
		else{
			
			bolStatus = false;
			res.send({'resposta': 'encrypt_data', 'status' : 'CIS Status: 200 - ERROR_MISSING_PARAMETERS'});					
			
		}				
	})		
	
	
	
	//****************************************************************
	// Function decrypt_data(parameters, data)
	// Parameters: parameters -> PARAM_CAPTURE_INFO
	//												-> PARAM_CAPTURE_SCORE
	//												-> PARAM_IMAGE
	//												-> PARAM_TEMPLATE
	//												-> PARAM_READ_CONFIG
	//												-> PARAM_WRITE_CONFIG
	//****************************************************************		
	App.put('/cef/decrypt_data', function (req, res) {	
	
		console.log("\nRequisicao PUT - decrypt_data");
		
		bufCurrentKey = Buffer.from(strCurrentKey);
		if(1){console.log("bufCurrentKey: ", bufCurrentKey.toString('hex'));}						
		
		var intParameter = req.query.parameter;
		console.log("Parameter: ", intParameter);
		
		var strEncryptedData = req.body.encryptedData;
		console.log("Encrypted Data: ", strEncryptedData); 
		bufEncData = Buffer.from(strEncryptedData.data, 'base64'); // Converte
		console.log("Encrypted Data: ", bufEncData.toString('hex')); // Mostra em hexa	
		
		if(intParameter){
			
			if((intParameter	== PARAM_CAPTURE_INFO) || 
				 (intParameter	== PARAM_CAPTURE_SCORE) || 
				 (intParameter	== PARAM_IMAGE) || 
				 (intParameter	== PARAM_TEMPLATE) ||
				 (intParameter	== PARAM_READ_CONFIG) ||
				 (intParameter	== PARAM_WRITE_CONFIG)){
				
				if(bufEncData){

					if(strCurrentKey){	

						strIv = "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0";
						//strIV = str_repeat('\0', 16);
											
						var decipherANSOL = Crypto.createDecipheriv("aes-256-cbc", Buffer.from(strCurrentKey), strIv);
						decipherANSOL.setAutoPadding(false);
						var strANSOLDecrip = decipherANSOL.update(bufEncData.toString('hex'), 'hex');								
						console.log("strANSOLDecrip: ", strANSOLDecrip); // Mostra em hexa										
						bufDecData = Buffer.from(strANSOLDecrip); // Converte
						
						console.log("Decrypt Data: ", bufDecData.toString('hex')); // Mostra em hexa										
						
						res.send({'resposta': 'decrypt_data', 
											'status' : 'CIS Status: 200 - OK',
											'data' : bufDecData.toString('base64')});										
			
					}
					else{
						res.send({'resposta': 'decrypt_data', 'status' : 'CIS Status: 200 - ERROR_EMPTY_SESSION_KEY'});
					}

				}
				else{
					res.send({'resposta': 'decrypt_data', 'status' : 'CIS Status: 200 - ERROR_EMPTY_DATA'});
				}						
				
			}
			else{
				res.send({'resposta': 'decrypt_data', 'status' : 'CIS Status: 200 - ERROR_INVALID_PARAMETERS'});
			}

		}
		else{
			res.send({'resposta': 'decrypt_data', 'status' : 'CIS Status: 200 - ERROR_EMPTY_DATA'});
		}				
		
	})

	//****************************************************************
	// Function save_wsq_data(data)
	//****************************************************************	
	App.put('/cef/save_wsq_data', function (req, res) {

		console.log("\nRequisicao PUT - save_wsq_data");

		var strWSQData = req.body.wsqDataImage;
		console.log("WSQ Data: ", strWSQData); 
		
		bufWsqData = Buffer.from(strWSQData.data, 'base64'); // Converte
		console.log("WSQ Data: ", bufWsqData.toString('hex')); // Mostra em hexa

		
		if(strWSQData){
			
			res.send({'resposta': 'save_wsq_data', 
								'status' : 'CIS Status: 200 - OK'});						
	
			var strNomeArquivoWSQ = __dirname + "\\images\\" + fncTimestamp() +".wsq";
			console.log("Nome Arquivo: " + strNomeArquivoWSQ);
			
			FileStream.writeFile(strNomeArquivoWSQ, bufWsqData,  function(err) {
					if(err) {
							console.log(err);
					} else {
							console.log("The file was saved!");
					}
			});							
					
		}
		else{
			res.send({'resposta': 'save_wsq_data', 'status' : 'CIS Status: 200 - ERROR_EMPTY_DATA'});
		}			
		
		
	})


	//****************************************************************
	// Function crypt_client_tag_data(data)
	//****************************************************************	
	App.put('/cef/crypt_client_tag_data', function (req, res) {	
	
		console.log("\nRequisicao PUT - crypt_client_tag_data");
				
		var objRawData = req.body.cliente;
		console.log("Obj Raw Data: ", objRawData);
		
		var xmlRawData = js2xmlparser.parse("cliente", objRawData);
		xmlRawData = xmlRawData.replace("<?xml version='1.0'?>", "");
		console.log("XML Raw Data: ", xmlRawData);
		
		bufRawData = Buffer.from(xmlRawData);
		//if(1){console.log("Raw Data: ", bufRawData.toString('hex'));} // Mostra em hexa
			
		if(xmlRawData){
			
			if(strCurrentKey){				

				var bufDataBlockTemp = [];
				bufDataBlockTemp = Buffer.concat([bufRawData]);
				console.log("Data Block Temp Hex (Client XML) ", bufDataBlockTemp.toString('hex')); // Mostra em hexa
				
				console.log("Tamanho Data Block Temp: ", bufDataBlockTemp.length); // Mostra em hexa				
									
				// Calcula o Pad
				var intFill = bufDataBlockTemp.length % CIS_BLOCK_SIZE_AES;
				console.log("DataBlock Mod SIZE_AES: ", intFill); // Mostra em hexa
				if(intFill){
					intFill = CIS_BLOCK_SIZE_AES - intFill;
					console.log("Fill DataBlock: ", intFill); // Mostra em hexa
				}
				strPad = "";
				for(let intCont = 0; intCont < intFill; intCont++){
					strPad = strPad + "\0"; // Arrumar para 0x00 -> sempre 4 nulls
				}
				
				var bufPad = [];
				bufPad = Buffer.from(strPad);
				if(1){console.log("Padding Hex: ", bufPad.toString('hex'));}						
			
				var bufDataBlock = [];
				bufDataBlock = Buffer.concat([bufDataBlockTemp, bufPad]);
				console.log("Data Block Hex (Client XML + Padding): ", bufDataBlock.toString('hex')); // Mostra em hexa				

				//strIv = "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0";
				//strIV = str_repeat('\0', 16);
									
				var cryptData = Crypto2.createCipheriv("aes-256-cbc", Buffer.from(strCurrentKey), "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0");
				var strCryptData = cryptData.update(bufDataBlock);										
				
				bufCryptData = Buffer.from(strCryptData); // Converte
				console.log("Crypt Data: ", bufCryptData.toString('hex')); // Mostra em hexa															
				
				// Com Padding
				var hashDataBlock = Crypto2.createHash('sha256').update(bufDataBlock).digest('hex');										
				var bufHashDataBlock = [];
				bufHashDataBlock = Buffer.from(hashDataBlock, 'hex');
				if(1){console.log("Hash DataBlock: ", bufHashDataBlock.toString('hex'));}				

				res.send({'resposta': 'crypt_client_tag_data', 
									'status' : 'CIS Status: 200 - OK',
									'clienteCriptografado' : bufCryptData.toString('base64'),
									'hash' : bufHashDataBlock.toString('base64')
									});	

			}
			else{
				res.send({'resposta': 'crypt_client_tag_data', 'status' : 'CIS Status: 200 - ERROR_EMPTY_CURRENT_KEY_DATA'});
			}
		}
		else{
			res.send({'resposta': 'crypt_client_tag_data', 'status' : 'CIS Status: 200 - ERROR_EMPTY_DATA'});
		}

	
	})


	//****************************************************************
	// Function crypt_key_tag_data()
	//****************************************************************	
	App.put('/cef/crypt_key_tag_data', function (req, res) {	
	
		console.log("\nRequisicao PUT - crypt_key_tag_data");			

		if(strRSAPublicFile){
			
			if(strCurrentKey){
				
				bufPublicKey = Buffer.from(strRSAPublicFile);
				if(0){console.log("bufPublicKey: ", bufPublicKey.toString('hex'));}					

				var bufCurrentKey = Buffer.from(strCurrentKey.toString());
				if(0){console.log("bufCurrentKey: ", bufCurrentKey.toString('hex'));}		
									
				var encryptedKey = Crypto4.publicEncrypt(bufPublicKey, bufCurrentKey); 				

				res.send({'resposta': 'crypt_key_tag_data', 
									'status' : 'CIS Status: 200 - OK',
									'chaveAleatoria' :  encryptedKey.toString('base64')});	

			}
			else{
				res.send({'resposta': 'crypt_key_tag_data', 'status' : 'CIS Status: 200 - ERROR_EMPTY_CURRENT_KEY_DATA'});
			}

		}
		else{
			res.send({'resposta': 'crypt_key_tag_data', 'status' : 'CIS Status: 200 - ERROR_EMPTY_PUBLIC_KEY'});
		}
	
	})
	

	//****************************************************************
	// Function save_xml_file(data)
	//****************************************************************	
	App.put('/cef/save_xml_file', function (req, res) {	
	
		console.log("\nRequisicao PUT - save_xml_file");
				
		var strCPF = req.query.cpf;
		console.log("CPF: ", strCPF);				
				
		var objRawData = req.body.cliente;
		console.log("Obj Raw Data: ", objRawData);
		
		var xmlRawData = js2xmlparser.parse("cliente", objRawData);
		xmlRawData = xmlRawData.replace("<?xml version='1.0'?>", "");
		console.log("XML Raw Data: ", xmlRawData);
		
		bufRawData = Buffer.from(xmlRawData);
		//if(1){console.log("Raw Data: ", bufRawData.toString('hex'));} // Mostra em hexa
			
		if(strCPF){
		
			if(xmlRawData){
				
				//if(strCurrentKey){		
				if(1){				

					//***********************************************************************
					// Criptografa chave com RSA
					//***********************************************************************
					
					const CIS_BLOCK_SIZE_AES_16 = 16;
					
					bufPublicKey = Buffer.from(strRSAPublicFile);
					if(0){console.log("bufPublicKey: ", bufPublicKey.toString('hex'));}					

					//var bufCurrentKey = Buffer.from(strCurrentKey);
					//if(0){console.log("bufCurrentKey: ", bufCurrentKey.toString('hex'));}

					//var strRandomKey = fncGenerateRandomNumber(CIS_BLOCK_SIZE_AES_16);
					var strRandomKey = Buffer.from("30313233343536373839303132333435", "hex");
					var bufRandomKey = Buffer.from(strRandomKey.toString());
					if(1){console.log("Random Key: ", bufRandomKey.toString('hex'));}						
										
					var encryptedKey = Crypto4.publicEncrypt(strRSAPublicFile, bufRandomKey);
					//var bufencryptedKey = Buffer.from(encryptedKey);
					//if(1){console.log("encryptedKey: ", encryptedKey.toString("base64"));}
					
					// Teste
					//var decryptedKey = Crypto4.privateDecrypt(strRSAPrivateFile, bufencryptedKey);
					//if(1){console.log("decryptedKey: ", decryptedKey.toString('hex'));}



					//***********************************************************************
					// Criptografa dados com AES
					//***********************************************************************
					var bufDataBlockTemp = [];
					bufDataBlockTemp = Buffer.concat([bufRawData]);
					console.log("Data Block Temp Hex (Client XML) ", bufDataBlockTemp.toString('hex')); // Mostra em hexa
					
					console.log("Tamanho Data Block Temp: ", bufDataBlockTemp.length); // Mostra em hexa				
										
					// Calcula o Pad
					var intFill = bufDataBlockTemp.length % CIS_BLOCK_SIZE_AES_16;
					console.log("DataBlock Mod SIZE_AES: ", intFill); // Mostra em hexa
					if(intFill){
						intFill = CIS_BLOCK_SIZE_AES_16 - intFill;
						console.log("Fill DataBlock: ", intFill); // Mostra em hexa
					}
					
					// Padding PKCS5
					var strPad = "";
					for(let intCont = 0; intCont < intFill; intCont++){
						var charFill = String.fromCharCode(intFill);
						strPad = strPad + charFill;						
					}									
				
					var bufPad = [];
					bufPad = Buffer.from(strPad);
					if(1){console.log("Buffer Padding Hex: ", bufPad.toString("hex"));}
					
				
					var bufDataBlock = [];
					bufDataBlock = Buffer.concat([bufDataBlockTemp, bufPad]);
					console.log("Data Block Hex (Client XML + Padding): ", bufDataBlock.toString('hex')); // Mostra em hexa				

					//strIv = "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0";
					//strIV = str_repeat('\0', 16);
										
					var cryptData = Crypto5.createCipheriv("aes-128-cbc", Buffer.from(strRandomKey), "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0");
					var strCryptData = cryptData.update(bufDataBlock);										
					
					bufCryptData = Buffer.from(strCryptData); // Converte
					console.log("Crypt Data: ", bufCryptData.toString('hex')); // Mostra em hexa															
					
					
					// Calcula o Hash
					var hashDataBlock = Crypto6.createHash('sha256').update(bufDataBlock).digest('hex');										
					var bufHashDataBlock = [];
					bufHashDataBlock = Buffer.from(hashDataBlock, 'hex');
					if(1){console.log("Hash DataBlock: ", bufHashDataBlock.toString('hex'));}			
					
					
					
					//***********************************************************************
					// Nome Arquivo
					//***********************************************************************
					var strTimeStamp = fncTimestamp();
					var strNameFileToSave = strTimeStamp + CEF_TAIL_NAME_FILE + '.xml';
					
					
					
					//***********************************************************************
					// Cria Estrutura do Arquivo de Saida
					//***********************************************************************
					var structCrypt = {
						clienteCriptografado: bufCryptData.toString('base64'),
						chaveAleatoria: encryptedKey.toString('base64'),
						hash: bufHashDataBlock.toString('hex'),
						nomeArquivo: strNameFileToSave,
						versao: "2.0"
					}				
					
					
					
					//***********************************************************************
					// Converte Arquivo de Saida em XML
					//***********************************************************************
					var xmlFinalData = js2xmlparser.parse("ArquivoCriptografado", structCrypt);				
					console.log("XML Final Data: ", xmlFinalData);
					
					// Salva arquivo de Saida
					// Salvando nome como CPF
					//FileStream.writeFile(CIS_PATH_SAVE_XML_FILE + strCPF + '.xml', xmlFinalData, function(err, data) {
					
					//Salvando nome como CEF
					FileStream.writeFile(CIS_PATH_SAVE_XML_FILE + strNameFileToSave, xmlFinalData, function(err, data) {
						if (err) {
							console.log(err);
						}
						else {
							console.log('Arquivo XML salvo com sucesso!');
						}
					});				
					

					res.send({'resposta': 'save_xml_file', 
										'status' : 'CIS Status: 200 - OK'
										});	

				}
				else{
					res.send({'resposta': 'save_xml_file', 'status' : 'CIS Status: 200 - ERROR_EMPTY_CURRENT_KEY_DATA'});
				}
			}
			else{
				res.send({'resposta': 'save_xml_file', 'status' : 'CIS Status: 200 - ERROR_EMPTY_DATA'});
			}
		}
		else{
			res.send({'resposta': 'save_xml_file', 'status' : 'CIS Status: 200 - ERROR_EMPTY_CPF'});
		}
	
	})


	//****************************************************************
	// Function save_capture_data(parameters, hand, finger, data)
	// Parameters: parameters -> IMAGE
	//												-> TEMPLATE
	//
	//						 hand 			-> RIGHT
	//												-> LEFT
	//
	//						 finger 		-> THUMB
	//												-> INDEX_FINGER
	//												-> MIDDLE_FINGER
	//												-> RING_FINGER
	//												-> LITTLE_FINGER
	//
	//****************************************************************
	App.post('/cef/save_capture_data', function (req, res) {	
	
		console.log("\nRequisicao POST - save_capture_data");
		
		var intParameter = req.query.parameter;
		console.log("Parameter: ", intParameter);
		
		var intHand = req.query.hand;
		console.log("Hand: ", intHand);		

		var intFinger = req.query.finger;
		console.log("Finger: ", intFinger);		

		var strData = req.query.data; // EM BASE 64
		bufData = Buffer.from(strData, 'base64'); // Converte
		console.log("Data: ", bufData.toString('hex')); // Mostra em hexa
		
		var bolStatus = true;
		
		if((intParameter) && (intHand) && (intFinger) && (strData)){
			
			if(intParameter	== PARAM_IMAGE){
				if(intHand == HAND_LEFT){
					if(intFinger == FINGER_LITTLE){
						arrayObjImage[0].type = PARAM_IMAGE;
						arrayObjImage[0].hand = HAND_LEFT;
						arrayObjImage[0].finger = FINGER_LITTLE;
						arrayObjImage[0].data = strData;
					}
					else if(intFinger == FINGER_RING){
						arrayObjImage[1].type = PARAM_IMAGE;
						arrayObjImage[1].hand = HAND_LEFT;
						arrayObjImage[1].finger = FINGER_RING;
						arrayObjImage[1].data = strData;							
					}
					else if(intFinger == FINGER_MIDDLE){
						arrayObjImage[2].type = PARAM_IMAGE;
						arrayObjImage[2].hand = HAND_LEFT;
						arrayObjImage[2].finger = FINGER_MIDDLE;
						arrayObjImage[2].data = strData;								
					}
					else if(intFinger == FINGER_INDEX){
						arrayObjImage[3].type = PARAM_IMAGE;
						arrayObjImage[3].hand = HAND_LEFT;
						arrayObjImage[3].finger = FINGER_INDEX;
						arrayObjImage[3].data = strData;								
					}
					else if(intFinger == FINGER_THUMB){
						arrayObjImage[4].type = PARAM_IMAGE;
						arrayObjImage[4].hand = HAND_LEFT;
						arrayObjImage[4].finger = FINGER_THUMB;
						arrayObjImage[4].data = strData;								
					}
					else{
						bolStatus = false;
						res.send({'resposta': 'save_capture_data', 'status' : 'CIS Status: 200 - ERROR_FINGER_PARAMETERS'});
					}
					
				}
				else if(intHand == HAND_RIGHT){
					if(intFinger == FINGER_LITTLE){
						arrayObjImage[9].type = PARAM_IMAGE;
						arrayObjImage[9].hand = HAND_RIGHT;
						arrayObjImage[9].finger = FINGER_LITTLE;
						arrayObjImage[9].data = strData;							
					}
					else if(intFinger == FINGER_RING){
						arrayObjImage[8].type = PARAM_IMAGE;
						arrayObjImage[8].hand = HAND_RIGHT;
						arrayObjImage[8].finger = FINGER_RING;
						arrayObjImage[8].data = strData;								
					}
					else if(intFinger == FINGER_MIDDLE){
						arrayObjImage[7].type = PARAM_IMAGE;
						arrayObjImage[7].hand = HAND_RIGHT;
						arrayObjImage[7].finger = FINGER_MIDDLE;
						arrayObjImage[7].data = strData;										
					}
					else if(intFinger == FINGER_INDEX){
						arrayObjImage[6].type = PARAM_IMAGE;
						arrayObjImage[6].hand = HAND_RIGHT;
						arrayObjImage[6].finger = FINGER_MIDDLE;
						arrayObjImage[6].data = strData;								
					}
					else if(intFinger == FINGER_THUMB){
						arrayObjImage[5].type = PARAM_IMAGE;
						arrayObjImage[5].hand = HAND_RIGHT;
						arrayObjImage[5].finger = FINGER_THUMB;
						arrayObjImage[5].data = strData;								
					}
					else{
						bolStatus = false;
						res.send({'resposta': 'save_capture_data', 'status' : 'CIS Status: 200 - ERROR_FINGER_PARAMETERS'});
					}						
				}
				else{
					bolStatus = false;
					res.send({'resposta': 'save_capture_data', 'status' : 'CIS Status: 200 - ERROR_HAND_PARAMETERS'});
				}
					
			}
			else if(intParameter	== PARAM_TEMPLATE){
				if(intHand == HAND_LEFT){
					if(intFinger == FINGER_LITTLE){
						arrayObjTemplate[0].type = PARAM_TEMPLATE;
						arrayObjTemplate[0].hand = HAND_LEFT;
						arrayObjTemplate[0].finger = FINGER_LITTLE;
						arrayObjTemplate[0].data = bufData;
					}
					else if(intFinger == FINGER_RING){
						arrayObjTemplate[1].type = PARAM_TEMPLATE;
						arrayObjTemplate[1].hand = HAND_LEFT;
						arrayObjTemplate[1].finger = FINGER_RING;
						arrayObjTemplate[1].data = bufData;							
					}
					else if(intFinger == FINGER_MIDDLE){
						arrayObjTemplate[2].type = PARAM_TEMPLATE;
						arrayObjTemplate[2].hand = HAND_LEFT;
						arrayObjTemplate[2].finge = FINGER_rMIDDLE;
						arrayObjTemplate[2].data = bufData;								
					}
					else if(intFinger == FINGER_INDEX){
						arrayObjTemplate[3].type = PARAM_TEMPLATE;
						arrayObjTemplate[3].hand = HAND_LEFT;
						arrayObjTemplate[3].finger = FINGER_INDEX;
						arrayObjTemplate[3].data = bufData;								
					}
					else if(intFinger == FINGER_THUMB){
						arrayObjTemplate[4].type = PARAM_TEMPLATE;
						arrayObjTemplate[4].hand = HAND_LEFT;
						arrayObjTemplate[4].finger = FINGER_THUMB;
						arrayObjTemplate[4].data = bufData;								
					}
					else{
						bolStatus = false;
						res.send({'resposta': 'save_capture_data', 'status' : 'CIS Status: 200 - ERROR_FINGER_PARAMETERS'});
					}
					
				}
				else if(intHand == HAND_RIGHT){
					if(intFinger == FINGER_LITTLE){
						arrayObjTemplate[9].type = PARAM_TEMPLATE;
						arrayObjTemplate[9].hand = HAND_RIGHT;
						arrayObjTemplate[9].finger = FINGER_LITTLE;
						arrayObjTemplate[9].data = bufData;							
					}
					else if(intFinger == FINGER_RING){
						arrayObjTemplate[8].type = PARAM_TEMPLATE;
						arrayObjTemplate[8].hand = HAND_RIGHT;
						arrayObjTemplate[8].finger = FINGER_RING;
						arrayObjTemplate[8].data = bufData;								
					}
					else if(intFinger == FINGER_MIDDLE){
						arrayObjTemplate[7].type = PARAM_TEMPLATE;
						arrayObjTemplate[7].hand = HAND_RIGHT;
						arrayObjTemplate[7].finger = FINGER_MIDDLE;
						arrayObjTemplate[7].data = bufData;										
					}
					else if(intFinger == FINGER_INDEX){
						arrayObjTemplate[6].type = PARAM_TEMPLATE;
						arrayObjTemplate[6].hand = HAND_RIGHT;
						arrayObjTemplate[6].finger = FINGER_MIDDLE;
						arrayObjTemplate[6].data = bufData;								
					}
					else if(intFinger == FINGER_THUMB){
						arrayObjTemplate[5].type = PARAM_TEMPLATE;
						arrayObjTemplate[5].hand = HAND_RIGHT;
						arrayObjTemplate[5].finger = FINGER_THUMB;
						arrayObjTemplate[5].data = bufData;								
					}
					else{
						bolStatus = false;
						res.send({'resposta': 'save_capture_data', 'status' : 'CIS Status: 200 - ERROR_FINGER_PARAMETERS'});
					}						
				}
				else{
					bolStatus = false;
					res.send({'resposta': 'save_capture_data', 'status' : 'CIS Status: 200 - ERROR_HAND_PARAMETERS'});
				}					
			}
			else{
				bolStatus = false;
				res.send({'resposta': 'save_capture_data', 'status' : 'CIS Status: 200 - ERROR_INVALID_PARAMETERS'});
			}
			
		}
		else{
			bolStatus = false;
			res.send({'resposta': 'save_capture_data', 'status' : 'CIS Status: 200 - ERROR_MISSING_PARAMETERS'});
		}
		
		if(bolStatus == true){
				res.send({'resposta': 'save_capture_data', 
									'status' : 'CIS Status: 200 - OK'});						
		}
		
	})	



	//****************************************************************
	// Function read_capture_data(parameters, hand, finger, data)
	// Parameters: parameters -> IMAGE
	//												-> TEMPLATE
	//
	//						 hand 			-> RIGHT
	//												-> LEFT
	//
	//						 finger 		-> THUMB
	//												-> INDEX_FINGER
	//												-> MIDDLE_FINGER
	//												-> RING_FINGER
	//												-> LITTLE_FINGER
	//
	//****************************************************************
	App.get('/cef/read_capture_data', function (req, res) {	
	
		console.log("\nRequisicao GET - read_capture_data");
		
		var intParameter = req.query.parameter;
		console.log("Parameter: ", intParameter);
		
		var intHand = req.query.hand;
		console.log("Hand: ", intHand);		

		var intFinger = req.query.finger;
		console.log("Finger: ", intFinger);		

		var strData = req.query.data; // EM BASE 64
		bufData = Buffer.from(strData, 'base64'); // Converte
		console.log("Data: ", bufData.toString('hex')); // Mostra em hexa
		
		var bolStatus = true;
		
		if((intParameter) && (intHand) && (intFinger) && (strData)){
			
			var objCaptureRead = objCapture;
			
			if(intParameter	== PARAM_IMAGE){
				if(intHand == HAND_LEFT){
					if(intFinger == FINGER_LITTLE){
						objCaptureRead = arrayObjImage[0];
					}
					else if(intFinger == FINGER_RING){
						objCaptureRead = arrayObjImage[1];						
					}
					else if(intFinger == FINGER_MIDDLE){
						objCaptureRead = arrayObjImage[2];						
					}
					else if(intFinger == FINGER_INDEX){
						objCaptureRead = arrayObjImage[3];							
					}
					else if(intFinger == FINGER_THUMB){
						objCaptureRead = arrayObjImage[4];						
					}
					else{
						bolStatus = false;
						res.send({'resposta': 'read_capture_data', 'status' : 'CIS Status: 200 - ERROR_FINGER_PARAMETER'});
					}
					
				}
				else if(intHand == HAND_RIGHT){
					if(intFinger == FINGER_LITTLE){
						objCaptureRead = arrayObjImage[9];							
					}
					else if(intFinger == FINGER_RING){
						objCaptureRead = arrayObjImage[8];							
					}
					else if(intFinger == FINGER_MIDDLE){
						objCaptureRead = arrayObjImage[7];									
					}
					else if(intFinger == FINGER_INDEX){
						objCaptureRead = arrayObjImage[6];							
					}
					else if(intFinger == FINGER_THUMB){
						objCaptureRead = arrayObjImage[5];								
					}
					else{
						bolStatus = false;
						res.send({'resposta': 'read_capture_data', 'status' : 'CIS Status: 200 - ERROR_FINGER_PARAMETER'});
					}						
				}
				else{
					bolStatus = false;
					res.send({'resposta': 'read_capture_data', 'status' : 'CIS Status: 200 - ERROR_HAND_PARAMETER'});
				}
					
			}
			else if(intParameter	== PARAM_TEMPLATE){
				if(intHand == HAND_LEFT){
					if(intFinger == FINGER_LITTLE){
						objCaptureRead = arrayObjTemplate[0];
					}
					else if(intFinger == FINGER_RING){
						objCaptureRead = arrayObjTemplate[1];							
					}
					else if(intFinger == FINGER_MIDDLE){
						objCaptureRead = arrayObjTemplate[2];						
					}
					else if(intFinger == FINGER_INDEX){
						objCaptureRead = arrayObjTemplate[3];							
					}
					else if(intFinger == FINGER_THUMB){
						objCaptureRead = arrayObjTemplate[4];							
					}
					else{
						bolStatus = false;
						res.send({'resposta': 'read_capture_data', 'status' : 'CIS Status: 200 - ERROR_FINGER_PARAMETER'});
					}
					
				}
				else if(intHand == HAND_RIGHT){
					if(intFinger == FINGER_LITTLE){
						objCaptureRead = arrayObjTemplate[9];					
					}
					else if(intFinger == FINGER_RING){
						objCaptureRead = arrayObjTemplate[8];								
					}
					else if(intFinger == FINGER_MIDDLE){
						objCaptureRead = arrayObjTemplate[7];									
					}
					else if(intFinger == FINGER_INDEX){
						objCaptureRead = arrayObjTemplate[6];							
					}
					else if(intFinger == FINGER_THUMB){
						objCaptureRead = arrayObjTemplate[5];							
					}
					else{
						bolStatus = false;
						res.send({'resposta': 'read_capture_data', 'status' : 'CIS Status: 200 - ERROR_FINGER_PARAMETERS'});
					}						
				}
				else{
					bolStatus = false;
					res.send({'resposta': 'read_capture_data', 'status' : 'CIS Status: 200 - ERROR_HAND_PARAMETERS'});
				}					
			}
			else{
				bolStatus = false;
				res.send({'resposta': 'read_capture_data', 'status' : 'CIS Status: 200 - ERROR_INVALID_PARAMETERS'});
			}
			
			
		}
		else{
			bolStatus = false;
			res.send({'resposta': 'read_capture_data', 'status' : 'CIS Status: 200 - ERROR_MISSING_PARAMETERS'});
		}		

		if(bolStatus == true){
			
			res.send({'resposta': 'read_capture_data', 
								'status' : 'CIS Status: 200 - OK',
								'data' : objCaptureRead.data});
								
		}
	})			
	

  
	console.log("Porta Servidor: ", 8080);

  objAppServer = App.listen(8080, function () {})

}	



//***********************************************************
// function fncInitApp
//***********************************************************
const fncInitApp = () => {
  
	var strStatusBtkFile = false;
	var strStatusRSAPublicKeyFile = false;
	
	if(fncReadBtkFile(CIS_PATH_BTK_FILE)){
		
		console.log("Leitura do arquivo da BTK realizado com sucesso...");
		strStatusBtkFile = true;
	}
	else{
		console.log("Erro na leitura do arquivo da BTK...");
		process.exit();
	}
  
	/*
	if(fncReadRSAPublicKeyFile(CIS_PATH_RSA_PUBLIC_KEY_FILE)){
		
		console.log("Leitura do arquivo da RSA Public Key realizado com sucesso...");
		strStatusRSAPublicKeyFile = true;
	}
	else{
		console.log("Erro na leitura do arquivo da RSA Public Key...");
		process.exit();
	}	
	*/
	
	//if((strStatusBtkFile) && (strStatusRSAPublicKeyFile)){
	if(strStatusBtkFile){
		fncInitServer(); 
	}
	
}



//###########################################################
// MAIN
//###########################################################
fncInitApp();


//***********************************************************
// Testes....
//***********************************************************
