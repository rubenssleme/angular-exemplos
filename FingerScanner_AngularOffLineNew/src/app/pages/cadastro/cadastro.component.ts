import { Component, OnInit } from '@angular/core';
import { ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SiabmScannerService } from '../../services/siabm-scanner.service';
import { SiabmCamService } from '../../services/siabm-cam.service';
import { SimulateServerService } from '../../services/simulate-server.service';
import { IResponse, IEncryptedData, ICameraID, ICameraOptions } from '../../interfaces/interface';
import * as  EventBus from 'vertx3-eventbus-client';
import { Buffer } from 'buffer';
//import { Js2xmlparser } from 'js2xmlparser';
//import * as JsonToXML from "js2xmlparser";
import { ToastrService } from "ngx-toastr";
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
	@ViewChild('video', { static: true }) videoElement: ElementRef;

	TEST_MODE = "VERSAO_03";
	
	// Tratador de evento
	subject = new Subject<string>();
	subject2 = new Subject<string>();	

	//***********************************************************
	// Defines
	//***********************************************************  
	STATUR_ERROR_OK = 0;
	STATUS_ERROR_GLOBAL_GET_PARAMETERS = -1;
	STATUS_ERROR_GLOBAL_ENCRYPT_DATA = -2;
	STATUS_ERROR_GLOBAL_DECRYPT_DATA = -3;
	STATUS_ERROR_GLOBAL_RSA_DATA = -4;
	
	STATUS_ERROR_SCANNER_INITIALIZE = -5;
	STATUS_ERROR_SCANNER_SET_FIXED_KEY = -6;
	STATUS_ERROR_SCANNER_SET_READER_INFO = -7;
	STATUS_ERROR_SCANNER_START_CAPTURE = -8;
	STATUS_ERROR_SCANNER_STOP_CAPTURE = -9;
	STATUS_ERROR_SCANNER_GET_IMAGE = -10;
	STATUS_ERROR_SCANNER_GET_TEMPLATE = -11;
	STATUS_ERROR_SCANNER_GET_RANDOM = -12;
	STATUS_ERROR_SCANNER_CAPTURE_IS_ACTIVE = -13;
	STATUS_ERROR_SCANNER_INITIALIZE_IS_ACTIVE = -14;
	STATUS_ERROR_SCANNER_CONVERT_IMAGE = -15;
	STATUS_ERROR_SCANNER_GET_CAPTURE_INFO = -16;
	
	STATUS_ERROR_CAM_INITIALIZE = -17;
	STATUS_ERROR_CAM_SET_OPTIONS = -18;
	STATUS_ERROR_CAM_START_CAPTURE = -19;
	STATUS_ERROR_CAM_STOP_CAPTURE = -20;
	STATUS_ERROR_CAM_MANUAL_CAPTURE = -21;
	STATUS_ERROR_CAM_SAVE_DATA = -22;
	STATUS_ERROR_CAM_INITIALIZE_IS_ACTIVE = -23;
	STATUS_ERROR_CAM_CAPTURE_IS_ACTIVE = -24;	
	
	STATUS_ERROR_SCANNER_CAPTURE_EVENT_OK = 0;
	STATUS_ERROR_SCANNER_CAPTURE_EVENT_FAIL = -1;
	STATUS_ERROR_SCANNER_CAPTURE_EVENT_CANCEL = -2;
	STATUS_ERROR_SCANNER_CAPTURE_EVENT_SPOOF = -3;
	
	
	countries = [
			{id: "AC", name: "Acre"},
			{id: "AL", name: "Alagoas"},
			{id: "AM", name: "Amazonas"},
			{id: "AP", name: "Amapá"},
			{id: "BA", name: "Bahia"},
			{id: "CE", name: "Ceará"},
			{id: "DF", name: "Distrito Federal"},
			{id: "ES", name: "Espírito Santo"},
			{id: "GO", name: "Goiás"},
			{id: "MA", name: "Maranhão"},
			{id: "MG", name: "Minas Gerais"},
			{id: "MS", name: "Mato Grosso do Sul"},
			{id: "MT", name: "Mato Grosso"},
			{id: "PA", name: "Pará"},
			{id: "PB", name: "Paraíba"},
			{id: "PE", name: "Pernambuco"},
			{id: "PI", name: "Piauí"},
			{id: "PR", name: "Paraná"},
			{id: "RJ", name: "Rio de Janeiro"},
			{id: "RN", name: "Rio Grande do Norte"},
			{id: "RO", name: "Rondônia"},
			{id: "RR", name: "Roraima"},
			{id: "RS", name: "Rio Grande do Sul"},
			{id: "SC", name: "Santa Catarina"},
			{id: "SE", name: "Sergipe"},
			{id: "SP", name: "São Paulo"},
			{id: "TO", name: "Tocantins"}
	 ];
	selectedValueUFRG	= "SP";
	selectedValueUF	= "SP";
	
	genders = [
			{id: "M", name: "Male"},
			{id: "F", name: "Female"}
	 ];	
	selectedValueSexo	= "M";	



	//***********************************************************
	// Global Variables
	//***********************************************************  
	eventBusScanner;
	hostScanner = 'https://siabmdevices.caixa:9090';
	eventBusCam;
	hostCam = 'https://siabmdevices.caixa:9091';	

	strTimestamp: any = "";
	objMessage: any = "";
	strTipoEvento: any = "";
	strMensagem: any = "";
	intResult: any = "";
	strImage: any = "";
	statusCaptureComplete: any;
	websocketposition: any;
	result: any;
	error: any;
	saida: any;
	
	currenthand: any;
  currentfinger: any;
	currentwsqimagebase64: any;
	currentjpgimagebase64: any;
	currenttemplatebase64: any;
	currentminutia: any;
	
	captureWSQImageRT:any;
	captureWSQImageRI:any;
	captureWSQImageRM:any;
	captureWSQImageRR:any;
	captureWSQImageRL:any;	
	captureWSQImageLT:any;
	captureWSQImageLI:any;
	captureWSQImageLM:any;
	captureWSQImageLR:any;
	captureWSQImageLL:any;	

	captureJPGImageRT:any;
	captureJPGImageRI:any;
	captureJPGImageRM:any;
	captureJPGImageRR:any;
	captureJPGImageRL:any;	
	captureJPGImageLT:any;
	captureJPGImageLI:any;
	captureJPGImageLM:any;
	captureJPGImageLR:any;
	captureJPGImageLL:any;			
	
	captureTemplateRT:any;
	captureTemplateRI:any;
	captureTemplateRM:any;
	captureTemplateRR:any;
	captureTemplateRL:any;	
	captureTemplateLT:any;
	captureTemplateLI:any;
	captureTemplateLM:any;
	captureTemplateLR:any;
	captureTemplateLL:any;

	captureMinutiaRT: any;
	captureMinutiaRI: any;
	captureMinutiaRM: any;
	captureMinutiaRR: any;
	captureMinutiaRL: any;
	captureMinutiaLT: any;
	captureMinutiaLI: any;
	captureMinutiaLM: any;
	captureMinutiaLR: any;
	captureMinutiaLL: any;
		
	structFingerTagRL:any = {	
												 dedo: {
																dedoAusente: "bypassed",
																idDedo: "rl",
																imagem: "",
																qualidade: 0,
																template: ""
												 }	
	};
	structFingerTagRR:any = {	
												 dedo: {
																dedoAusente: "bypassed",
																idDedo: "rr",
																imagem: "",
																qualidade: 0,
																template: ""
												 }	
	};
	structFingerTagRM:any = {	
												 dedo: {
																dedoAusente: "bypassed",
																idDedo: "rm",
																imagem: "",
																qualidade: 0,
																template: ""
												 }	
	};
	structFingerTagRI:any = {	
												 dedo: {
																dedoAusente: "bypassed",
																idDedo: "ri",
																imagem: "",
																qualidade: 0,
																template: ""
												 }	
	};
	structFingerTagRT:any = {	
												 dedo: {
																dedoAusente: "bypassed",
																idDedo: "rt",
																imagem: "",
																qualidade: 0,
																template: ""
												 }	
	};
											
	structFingerTagLL:any = {	
												 dedo: {
																dedoAusente: "bypassed",
																idDedo: "ll",
																imagem: "",
																qualidade: 0,
																template: ""
												 }	
	};
	structFingerTagLR:any = {	
												 dedo: {
																dedoAusente: "bypassed",
																idDedo: "lr",
																imagem: "",
																qualidade: 0,
																template: ""
												 }	
	};
	structFingerTagLM:any = {	
												 dedo: {
																dedoAusente: "bypassed",
																idDedo: "lm",
																imagem: "",
																qualidade: 0,
																template: ""
												 }	
	};
	structFingerTagLI:any = {	
												 dedo: {
																dedoAusente: "bypassed",
																idDedo: "li",
																imagem: "",
																qualidade: 0,
																template: ""
												 }	
	};
	structFingerTagLT:any = {	
												 dedo: {
																dedoAusente: "bypassed",
																idDedo: "lt",
																imagem: "",
																qualidade: 0,
																template: ""
												 }	
	};

	cameraId: ICameraID;
	cameraOptions: ICameraOptions;


	//***********************************************************
	// Form Variables
	//***********************************************************
	propBiographicalInformationHidden = false;
	propFingersEnrollmentHidden = false;
	propFaceEnrollmentHidden = false;
	propConfirmDetailsHidden = false;
	
	firstname:any = "Washington";
	lastname:any = "Ishio Lopes"	
	rgnumber:any = "1234567890";
	ufrg:any = "SP";
	cpfnumber:any = "1234567890";
	tituloeleitornumber:any = "1234567890";
	datanascimento:any = "14/05/1977";
	sexo:any = "M";
	uf:any = "SP";
	municipionascimento:any = "Sao Paulo";
	mothername:any = "Maria Miyoko Ishio Lopes"
	fathername:any = "Amandio da Silva Lopes"	
	beneficionome:any = "";
	beneficionumero:any = "";	
	unidade:any = "0004";
	dataemissao:any = "14/05/1977";
	matricula:any = "c060385";
	
	captureStaticImageRT:any = "../../../assets/img/fingerprint-scanning.png";
	captureStaticImageRI:any = "../../../assets/img/fingerprint-scanning.png";
	captureStaticImageRM:any = "../../../assets/img/fingerprint-scanning.png";
	captureStaticImageRR:any = "../../../assets/img/fingerprint-scanning.png";
	captureStaticImageRL:any = "../../../assets/img/fingerprint-scanning.png";
	
	captureStaticImageLT:any = "../../../assets/img/fingerprint-scanning.png";
	captureStaticImageLI:any = "../../../assets/img/fingerprint-scanning.png";
	captureStaticImageLM:any = "../../../assets/img/fingerprint-scanning.png";
	captureStaticImageLR:any = "../../../assets/img/fingerprint-scanning.png";
	captureStaticImageLL:any = "../../../assets/img/fingerprint-scanning.png";
	
	fingerImageRT:any = "../../../assets/img/final_finger.png";
	fingerImageRI:any = "../../../assets/img/final_finger.png";
	fingerImageRM:any = "../../../assets/img/final_finger.png";
	fingerImageRR:any = "../../../assets/img/final_finger.png";
	fingerImageRL:any = "../../../assets/img/final_finger.png";
											
	fingerImageLT:any = "../../../assets/img/final_finger.png";
	fingerImageLI:any = "../../../assets/img/final_finger.png";
	fingerImageLM:any = "../../../assets/img/final_finger.png";
	fingerImageLR:any = "../../../assets/img/final_finger.png";
	fingerImageLL:any = "../../../assets/img/final_finger.png";	
	
	livePreviewImage:any = "../../../assets/img/finger_scan_gray_320.png";
	livrePreviewDataImage: any;
	finalPhotoDataImage: any = "../../../assets/img/default-user.jpg";
	portraitDataImage: any = "../../../assets/img/default-user.jpg";
	
	captureImageJpg: any;

  disableIniciarCaptura: boolean = false;
	disableCapturaManual: boolean = true;	
  disableCancelarCaptura: boolean = true;	
	disableCapturaImpressao: boolean = false;
	
	isDisableCapturaImpressao(){
		
		return(this.disableCapturaImpressao);
		
	}
	
	getSantizeUrl(url : string) {
		
		return this.sanitizer.bypassSecurityTrustUrl(url); 
			
	}

	//getSanitizeHtml(value : any){
	//	return this.sanitizer.bypassSecurityTrustHtml(value).toString();
	//}	
	
	//***********************************************************
	// Constructor
	//***********************************************************
  constructor(private ScannerService: SiabmScannerService,
							private CamService: SiabmCamService, 							
							private ServerService: SimulateServerService,
							private toastr: ToastrService,
							private router: Router,
							private sanitizer: DomSanitizer) { 
	}


	//***********************************************************
	// ngOnInit
	//***********************************************************
  ngOnInit() {
		
		this.fncShowBiographicalInformationPage();
		
		// Video Initialize
		//this.fncCamMostraVideoCapturado();	
		
		// Scanner Initialize
		this.fncScannerInitialize();

		// Cam Initialize
		this.fncCamInitialize();
		
  }
	
	
	//***********************************************************
	// ngOnDestroy
	//***********************************************************
  ngOnDestroy(): void {
    this.eventBusCam.close();
		this.eventBusScanner.close();
  }		
	
	
	//***********************************************************
	// attachVideo
	//***********************************************************	
	//attachVideo(stream) {
	//	this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
	//	this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
	//			this.videoHeight = this.videoElement.nativeElement.videoHeight;
	//			this.videoWidth = this.videoElement.nativeElement.videoWidth;
	//	});
	//}		
	
	
	fncInitializeVariables(){
		
		this.selectedValueUFRG	= "SP";
		this.selectedValueUF	= "SP";
		this.selectedValueSexo	= "M";	
		
		this.strTimestamp = "";
		this.objMessage = "";
		this.strTipoEvento = "";
		this.strMensagem = "";
		this.intResult = "";
		this.strImage = "";
		
		this.currenthand = "";
		this.currentfinger = "";
		this.currentwsqimagebase64 = "";
		this.currentjpgimagebase64 = "";
		this.currenttemplatebase64 = "";
		this.currentminutia = "";
		
		this.captureWSQImageRT = "";
		this.captureWSQImageRI = "";
		this.captureWSQImageRM = "";
		this.captureWSQImageRR = "";
		this.captureWSQImageRL = "";	
		
		this.captureWSQImageLT = "";
		this.captureWSQImageLI = "";
		this.captureWSQImageLM = "";
		this.captureWSQImageLR = "";
		this.captureWSQImageLL = "";	

		this.captureJPGImageRT = "";
		this.captureJPGImageRI = "";
		this.captureJPGImageRM = "";
		this.captureJPGImageRR = "";
		this.captureJPGImageRL = "";
		
		this.captureJPGImageLT = "";
		this.captureJPGImageLI = "";
		this.captureJPGImageLM = "";
		this.captureJPGImageLR = "";
		this.captureJPGImageLL = "";			
		
		this.captureTemplateRT = "";
		this.captureTemplateRI = "";
		this.captureTemplateRM = "";
		this.captureTemplateRR = "";
		this.captureTemplateRL = "";
		
		this.captureTemplateLT = "";
		this.captureTemplateLI = "";
		this.captureTemplateLM = "";
		this.captureTemplateLR = "";
		this.captureTemplateLL = "";

		this.captureMinutiaRT = "";
		this.captureMinutiaRI = "";
		this.captureMinutiaRM = "";
		this.captureMinutiaRR = "";
		this.captureMinutiaRL = "";
		
		this.captureMinutiaLT = "";
		this.captureMinutiaLI = "";
		this.captureMinutiaLM = "";
		this.captureMinutiaLR = "";
		this.captureMinutiaLL = "";

		this.structFingerTagRL = {	
													 dedo: {
																	dedoAusente: "bypassed",
																	idDedo: "rl",
																	imagem: "",
																	qualidade: 0,
																	template: ""
													 }	
		};
		this.structFingerTagRR = {	
													 dedo: {
																	dedoAusente: "bypassed",
																	idDedo: "rr",
																	imagem: "",
																	qualidade: 0,
																	template: ""
													 }	
		};
		this.structFingerTagRM = {	
													 dedo: {
																	dedoAusente: "bypassed",
																	idDedo: "rm",
																	imagem: "",
																	qualidade: 0,
																	template: ""
													 }	
		};
		this.structFingerTagRI = {	
													 dedo: {
																	dedoAusente: "bypassed",
																	idDedo: "ri",
																	imagem: "",
																	qualidade: 0,
																	template: ""
													 }	
		};
		this.structFingerTagRT = {	
													 dedo: {
																	dedoAusente: "bypassed",
																	idDedo: "rt",
																	imagem: "",
																	qualidade: 0,
																	template: ""
													 }	
		};
												
		this.structFingerTagLL = {	
													 dedo: {
																	dedoAusente: "bypassed",
																	idDedo: "ll",
																	imagem: "",
																	qualidade: 0,
																	template: ""
													 }	
		};
		this.structFingerTagLR = {	
													 dedo: {
																	dedoAusente: "bypassed",
																	idDedo: "lr",
																	imagem: "",
																	qualidade: 0,
																	template: ""
													 }	
		};
		this.structFingerTagLM = {	
													 dedo: {
																	dedoAusente: "bypassed",
																	idDedo: "lm",
																	imagem: "",
																	qualidade: 0,
																	template: ""
													 }	
		};
		this.structFingerTagLI = {	
													 dedo: {
																	dedoAusente: "bypassed",
																	idDedo: "li",
																	imagem: "",
																	qualidade: 0,
																	template: ""
													 }	
		};
		this.structFingerTagLT = {	
													 dedo: {
																	dedoAusente: "bypassed",
																	idDedo: "lt",
																	imagem: "",
																	qualidade: 0,
																	template: ""
													 }	
		};
			
		this.firstname = "Washington";
		this.lastname = "Ishio Lopes"	
		this.rgnumber = "1234567890";
		this.ufrg = "SP";
		this.cpfnumber = "1234567890";
		this.tituloeleitornumber = "1234567890";
		this.datanascimento = "14/05/1977";
		this.sexo = "M";
		this.uf = "SP";
		this.municipionascimento = "Sao Paulo";
		this.mothername = "Maria Miyoko Ishio Lopes"
		this.fathername = "Amandio da Silva Lopes"	
		this.beneficionome = "";
		this.beneficionumero = "";	
		this.unidade = "0004";
		this.dataemissao = "14/05/1977";
		this.matricula = "c060385";
		
		this.captureStaticImageRT = "../../../assets/img/fingerprint-scanning.png";
		this.captureStaticImageRI = "../../../assets/img/fingerprint-scanning.png";
		this.captureStaticImageRM = "../../../assets/img/fingerprint-scanning.png";
		this.captureStaticImageRR = "../../../assets/img/fingerprint-scanning.png";
		this.captureStaticImageRL = "../../../assets/img/fingerprint-scanning.png";
		
		this.captureStaticImageLT = "../../../assets/img/fingerprint-scanning.png";
		this.captureStaticImageLI = "../../../assets/img/fingerprint-scanning.png";
		this.captureStaticImageLM = "../../../assets/img/fingerprint-scanning.png";
		this.captureStaticImageLR = "../../../assets/img/fingerprint-scanning.png";
		this.captureStaticImageLL = "../../../assets/img/fingerprint-scanning.png";
		
		this.fingerImageRT = "../../../assets/img/final_finger.png";
		this.fingerImageRI = "../../../assets/img/final_finger.png";
		this.fingerImageRM = "../../../assets/img/final_finger.png";
		this.fingerImageRR = "../../../assets/img/final_finger.png";
		this.fingerImageRL = "../../../assets/img/final_finger.png";
										
		this.fingerImageLT = "../../../assets/img/final_finger.png";
		this.fingerImageLI = "../../../assets/img/final_finger.png";
		this.fingerImageLM = "../../../assets/img/final_finger.png";
		this.fingerImageLR = "../../../assets/img/final_finger.png";
		this.fingerImageLL = "../../../assets/img/final_finger.png";	
		
		this.livePreviewImage = "../../../assets/img/finger_scan_gray_320.png";
		this.livrePreviewDataImage = "";
		this.finalPhotoDataImage = "../../../assets/img/default-user.jpg";
		this.portraitDataImage = "../../../assets/img/default-user.jpg";
		
		this.captureImageJpg = "";		
		
	}
	
	
		
	
	//###########################################################
	// SCANNER WEBSERVICE FUNCTIONS
	//###########################################################
	
	//***********************************************************
	// fncScannerWebSocketConnect
	//***********************************************************		
	fncScannerWebSocketConnect(){
		
    const self = this;
    self.eventBusScanner = new EventBus(this.hostScanner + '/ws');
    self.eventBusScanner.onopen = function () {

      // set a handler to receive a message
      self.eventBusScanner.registerHandler('ws-to-client', function (error, message) {		
				
				if(message){
				
					self.strTimestamp = Math.round(new Date().getTime()/1000);
					//console.log('Timestamp: ', self.strTimestamp);
					
					//console.log('Received a Message: ', JSON.stringify(message));	
					
					self.objMessage = JSON.parse(message.body);
					
					self.strTipoEvento = self.objMessage.eventType;
					//console.log('Tipo Evento: ', self.strTipoEvento);

					self.strMensagem = self.objMessage.message;
					//console.log('Mensagem: ', self.strMensagem);
					
					self.intResult = self.objMessage.result;
					//console.log('Result: ', self.intResult);					

					if(this.TEST_MODE == "VERSAO_01"){
						self.fncScannerWebSocketParseMessageAndExtractInfos(self.strTipoEvento, self.strMensagem, self.intResult);
					}
					else if(this.TEST_MODE == "VERSAO_02"){
						self.fncScannerWebSocketParseMessageAndExtractInfos2(self.strTipoEvento, self.strMensagem, self.intResult);
					}
					else{
						self.fncScannerWebSocketParseMessageAndExtractInfos3(self.strTipoEvento, self.strMensagem, self.intResult);
					}
									
				}
				
      });
			
    };
		
    self.eventBusScanner.enableReconnect(true);			
		
	}	
	
	//***********************************************************
	// fncScannerInitialize
	//***********************************************************		
	fncScannerInitialize(){
		
		var result;
		
		this.fncScannerWebSocketConnect();
		
		result = this.fncScannerWebServiceInitialize();
		
	}	
	
	//***********************************************************
	// fncScannerWebServiceInitialize
	//***********************************************************		
	fncScannerWebServiceInitialize(){
		
		var initializeStatus = this.STATUR_ERROR_OK;
				
    this.ScannerService.initializeIsActive()
		.subscribe((res: any) => {
								
				console.log(res);
				
				if(res.statuscode == 0){
					
					console.log("Washington - InitializeIsActive OK");
					
					if(res.initializeIsActive == false){

						this.ScannerService.initializeCapture()
						.subscribe((res: IResponse) => {
																
								console.log(res);
														
								if(res.statuscode == 0){
														
									console.log("Washington - InitializeScanner OK");
														
									console.log("Washington - Executando SetFixedKey");	
														
									this.ServerService.setFixedKey()
									.subscribe((res: any) => {
																					
											console.log(res);

											if(1){

												console.log("Washington - SetFixedKey OK");			
												
												this.ScannerService.setActiveKey(3)
												.subscribe( async (res: IResponse) => {	
																										
														console.log(res);
														
														if(res.statuscode == 0){
												
															console.log("Washington - setActiveKey OK");
												
															var numTentativas = 0;
															var bolSaida = false;
															
															do{
															
																console.log("Washington - Tentativa Numero: " + numTentativas.toString() );
															
																// Function execGetTemplate
																const execPromiseSetReaderInfo = async () => {
																	
																	await this.promiseSetReaderInfo()
																			.then(async (statusSetReaderInfo) => {
																				
																				bolSaida = true;
																				
																				console.log("Washington - SetReaderInfo OK");	
																				this.fncShowNotificationSuccess("Finger Scanner inicializado com SUCESSO...");
																								
																			})
																			.catch((statusSetReaderInfo) => {
																				
																				numTentativas = numTentativas + 1;																								
																				initializeStatus = statusSetReaderInfo;
																				
																			});														
																	
																};
																
																// Call funtion execPromiseSetReaderInfo
																await execPromiseSetReaderInfo();
															
															}while((bolSaida == false) && (numTentativas < 3));
															
															if(bolSaida == false){
																
																initializeStatus = this.STATUS_ERROR_SCANNER_SET_READER_INFO;
																this.fncScannerMostraMsgStatus(initializeStatus);
																console.log("Washington - SetReaderInfo ERROR");														
																
															}												
												

														}
														else{
															initializeStatus = this.STATUS_ERROR_SCANNER_SET_FIXED_KEY;
															this.fncScannerMostraMsgStatus(initializeStatus);
															console.log("Washington - setActiveKey ERROR");														
														}
														
													},
													(error) => {
														initializeStatus = this.STATUS_ERROR_SCANNER_SET_FIXED_KEY;
														this.fncScannerMostraMsgStatus(initializeStatus);
														console.log("Washington - setActiveKey ERROR");
													}
												)

											}
											else{
												initializeStatus = this.STATUS_ERROR_SCANNER_SET_FIXED_KEY;
												this.fncScannerMostraMsgStatus(initializeStatus);
												console.log("Washington - SetFixedKey ERROR");												
											}

										},
										(error) => {
											initializeStatus = this.STATUS_ERROR_SCANNER_SET_FIXED_KEY;
											this.fncScannerMostraMsgStatus(initializeStatus);
											console.log("Washington - SetFixedKey ERROR");
										}
									)							

								}
								else{
									
									initializeStatus = this.STATUS_ERROR_SCANNER_INITIALIZE;
									this.fncScannerMostraMsgStatus(initializeStatus);
									console.log("Washington - InitializeCapture ERROR");									
									
								}

							},
							(error) => {
								initializeStatus = this.STATUS_ERROR_SCANNER_INITIALIZE;
								this.fncScannerMostraMsgStatus(initializeStatus);
								console.log("Washington - InitializeCapture ERROR");
							}
						)
						
					}
					else{
						
						console.log("Washington - Executando SetFixedKey");	
						
						this.ServerService.setFixedKey()
						.subscribe((res: any) => {
																		
								console.log(res);

								if(1){

									console.log("Washington - SetFixedKey OK");			
									
									this.ScannerService.setActiveKey(3)
									.subscribe( async (res: IResponse) => {	
																							
											console.log(res);
											
											if(res.statuscode == 0){
									
												console.log("Washington - setActiveKey OK");
									
												var numTentativas = 0;
												var bolSaida = false;
												
												do{
												
													console.log("Washington - Tentativa Numero: " + numTentativas.toString() );
												
													// Function execGetTemplate
													const execPromiseSetReaderInfo = async () => {
														
														await this.promiseSetReaderInfo()
																.then(async (statusSetReaderInfo) => {
																	
																	bolSaida = true;
																	
																	console.log("Washington - SetReaderInfo OK");	
																	this.fncShowNotificationSuccess("Finger Scanner inicializado com SUCESSO...");
																					
																})
																.catch((statusSetReaderInfo) => {
																	
																	numTentativas = numTentativas + 1;																								
																	initializeStatus = statusSetReaderInfo;
																	
																});														
														
													};
													
													// Call funtion execPromiseSetReaderInfo
													await execPromiseSetReaderInfo();
													
													this.delay(500);
												
												}while((bolSaida == false) && (numTentativas < 3));
												
												if(bolSaida == false){
													
													initializeStatus = this.STATUS_ERROR_SCANNER_SET_READER_INFO;
													this.fncScannerMostraMsgStatus(initializeStatus);
													console.log("Washington - SetReaderInfo ERROR");														
													
												}

											}
											else{
												initializeStatus = this.STATUS_ERROR_SCANNER_SET_FIXED_KEY;
												this.fncScannerMostraMsgStatus(initializeStatus);
												console.log("Washington - setActiveKey ERROR");														
											}
											
										},
										(error) => {
											initializeStatus = this.STATUS_ERROR_SCANNER_SET_FIXED_KEY;
											this.fncScannerMostraMsgStatus(initializeStatus);
											console.log("Washington - setActiveKey ERROR");
										}
									)

								}
								else{
									initializeStatus = this.STATUS_ERROR_SCANNER_SET_FIXED_KEY;
									this.fncScannerMostraMsgStatus(initializeStatus);
									console.log("Washington - SetFixedKey ERROR");												
								}

							},
							(error) => {
								initializeStatus = this.STATUS_ERROR_SCANNER_SET_FIXED_KEY;
								this.fncScannerMostraMsgStatus(initializeStatus);
								console.log("Washington - SetFixedKey ERROR");
							}
						)							
						
					}
			
				}
				else{
					initializeStatus = this.STATUS_ERROR_SCANNER_INITIALIZE_IS_ACTIVE;
					this.fncScannerMostraMsgStatus(initializeStatus);
					console.log("Washington - InitializeIsActive ERROR");					
				}
		},
			(error) => {
				initializeStatus = this.STATUS_ERROR_SCANNER_INITIALIZE_IS_ACTIVE;
				this.fncScannerMostraMsgStatus(initializeStatus);
				console.log("Washington - InitializeIsActive ERROR");
			}
		)		

		return initializeStatus;
		
	}
	
	//***********************************************************
	// fncScannerWebServiceSetFixedKey
	//***********************************************************		
  fncScannerWebServiceSetFixedKey(){

		var setFixedKeyStatus = this.STATUR_ERROR_OK;
		
		this.ServerService.setFixedKey()
		.subscribe((res: any) => {
						
				console.log(res);

				if(1){

					console.log("Washington - SetFixedKey OK");			

					this.ScannerService.setActiveKey(3)
					.subscribe((res: IResponse) => {						
							
							console.log(res);
							
							if(res.statuscode == 0){
								console.log("Washington - setActiveKey OK");
							}
							else{
								setFixedKeyStatus = this.STATUS_ERROR_SCANNER_SET_FIXED_KEY;
								this.fncScannerMostraMsgStatus(setFixedKeyStatus);
								console.log("Washington - setActiveKey ERROR");								
							}
							
						},
						(error) => {
							setFixedKeyStatus = this.STATUS_ERROR_SCANNER_SET_FIXED_KEY;
							this.fncScannerMostraMsgStatus(setFixedKeyStatus);
							console.log("Washington - setActiveKey ERROR");
						}
					)
				}
				else{
					setFixedKeyStatus = this.STATUS_ERROR_SCANNER_SET_FIXED_KEY;
					this.fncScannerMostraMsgStatus(setFixedKeyStatus);
					console.log("Washington - SetFixedKey ERROR");				
				}
			},
			(error) => {
				setFixedKeyStatus = this.STATUS_ERROR_SCANNER_SET_FIXED_KEY;
				this.fncScannerMostraMsgStatus(setFixedKeyStatus);
				console.log("Washington - SetFixedKey ERROR");
			}
		)

		return setFixedKeyStatus;

	}	
	
	//***********************************************************
	// fncScannerWebServiceSetReaderInfo
	//***********************************************************		
  fncScannerWebServiceSetReaderInfo() {
	
		var setReaderInfoStatus = this.STATUR_ERROR_OK;
		var PARAM_WRITE_CONFIG = 5;
		
		this.ServerService.getParametersData(PARAM_WRITE_CONFIG)
		.subscribe((res: any) => {
							
				console.log(res);

				if(1){

					console.log("Washington - GetParameterData:PARAM_WRITE_CONFIG OK");			

					// Resposta como dados Hexa em string
					const bufferParameters = Buffer.from(res.data, "hex");
					console.log("bufferParameters: ", bufferParameters.toString("hex"));

					const strBufferBase64 = bufferParameters.toString('base64')
					console.log("bufferParameters (base64): ", strBufferBase64.toString());
					
					var objConfigHex = { rawData : strBufferBase64};

					this.ScannerService.getRamdom()
					.subscribe((res: any) => {
													
							console.log(res);

							if(res.statuscode == 0){

								console.log("Washington - GetRandom OK");

								const _bufferRandomNumber = Buffer.from(res.randomNumber, 'base64');
								console.log("RandomNumber hex: ", _bufferRandomNumber.toString('hex'));
								
								this.ServerService.cryptData(objConfigHex, PARAM_WRITE_CONFIG, res.randomNumber)
								.subscribe((res: any) => {
										
										console.log("Washington - CryptData OK");
										console.log(res);
										
										if(1){
										
											const encrypteddata:IEncryptedData = {
												encryptedData: {
																				data: res.data,
																				dataSize: res.dataSize,
																				signature: res.signature
												}
											}

											
											const bufferDataCrypt = Buffer.from(res.data, "base64");								
											const bufferDataCryptHex = bufferDataCrypt.toString('hex');								
											
											const bufferSignatureCrypt = Buffer.from(res.signature, "base64");								
											const bufferSignatureCryptHex = bufferSignatureCrypt.toString('hex');									
											
											const encrypteddataAux:IEncryptedData = {
												encryptedData: {
																				data: bufferDataCryptHex,
																				dataSize: res.dataSize,
																				signature: bufferSignatureCryptHex
												}
											}								
									
											// _lumiService.setReaderInfo
											this.ScannerService.setReaderInfo(encrypteddata)
											.subscribe((res: any) => {
												
																				
													console.log(res);
													
													if(res.statuscode == 0){
														console.log("Washington - SetReaderInfo OK");		
													}
													else{
														setReaderInfoStatus = this.STATUS_ERROR_SCANNER_SET_READER_INFO;
														this.fncScannerMostraMsgStatus(setReaderInfoStatus);
														console.log("Washington - SetReaderInfo ERROR");														
													}
													

												},
												(error) => {
													setReaderInfoStatus = this.STATUS_ERROR_SCANNER_SET_READER_INFO;
													this.fncScannerMostraMsgStatus(setReaderInfoStatus);
													console.log("Washington - SetReaderInfo ERROR");
												}
											)							
											
										}
										else{
											setReaderInfoStatus = this.STATUS_ERROR_GLOBAL_ENCRYPT_DATA;
											this.fncScannerMostraMsgStatus(setReaderInfoStatus);
											console.log("Washington - CryptData ERROR");											
										}
										
									},
									(error) => {
										setReaderInfoStatus = this.STATUS_ERROR_GLOBAL_ENCRYPT_DATA;
										this.fncScannerMostraMsgStatus(setReaderInfoStatus);
										console.log("Washington - CryptData ERROR");
									}
								)							
								
							}
							else{
								setReaderInfoStatus = this.STATUS_ERROR_SCANNER_GET_RANDOM;
								this.fncScannerMostraMsgStatus(setReaderInfoStatus);
								console.log("Washington - GetRandom ERROR");								
							}
							
						},
						(error) => {
							setReaderInfoStatus = this.STATUS_ERROR_SCANNER_GET_RANDOM;
							this.fncScannerMostraMsgStatus(setReaderInfoStatus);
							console.log("Washington - GetRandom ERROR");
						}
					)			
					
				}
				else{
					setReaderInfoStatus = this.STATUS_ERROR_GLOBAL_GET_PARAMETERS;
					this.fncScannerMostraMsgStatus(setReaderInfoStatus);
					console.log("Washington - GetParametersData ERROR");					
				}
			},
			(error) => {
				setReaderInfoStatus = this.STATUS_ERROR_GLOBAL_GET_PARAMETERS;
				this.fncScannerMostraMsgStatus(setReaderInfoStatus);
				console.log("Washington - GetParametersData ERROR");
			}
		)		
		
		return setReaderInfoStatus;
		
  }
		
	//***********************************************************
	// fncScannerWebServiceStartCapture
	//***********************************************************			
  fncScannerWebServiceStartCapture() {

		var startCaptureStatus = this.STATUR_ERROR_OK;

    this.ScannerService.captureIsActive()
		.subscribe((res: any) => {
				
				console.log(res);
				
				if(res.statuscode == 0){
				
					console.log("Washington - CaptureIsActive OK");
				
					if(res.captureIsActive == false){

						this.ScannerService.startCapture()
						.subscribe((res: IResponse) => {
								
								console.log(res);
								
								if(res.statuscode == 0){
										console.log("Washington - StartCapture OK");
								}
								else{
									startCaptureStatus = this.STATUS_ERROR_SCANNER_START_CAPTURE;
									this.fncScannerMostraMsgStatus(startCaptureStatus);
									console.log("Washington - StartCapture ERROR");								
								}
								
						},
							(error) => {
								startCaptureStatus = this.STATUS_ERROR_SCANNER_START_CAPTURE;
								this.fncScannerMostraMsgStatus(startCaptureStatus);
								console.log("Washington - StartCapture ERROR");
							}
						)
						
					}
			
				}
				else{
					startCaptureStatus = this.STATUS_ERROR_SCANNER_CAPTURE_IS_ACTIVE;
					console.log("Washington - StartCapture ERROR");					
					this.fncScannerMostraMsgStatus(startCaptureStatus);
				}
		
		},
			(error) => {
				startCaptureStatus = this.STATUS_ERROR_SCANNER_CAPTURE_IS_ACTIVE
				this.fncScannerMostraMsgStatus(startCaptureStatus);
				console.log("Washington - StartCapture ERROR");
			}
		)
		
		return startCaptureStatus;		
		
  }	
	
	//***********************************************************
	// fncScannerWebServiceStartCapture2
	//***********************************************************			
  async fncScannerWebServiceStartCapture2() {

		this.saida = false;

		// Function execCapture
		const execCapture = async () => {

			this.statusCaptureComplete = "";

			await this.promiseStartCapture()
					.then(async (statusStartCapture) => {
						
						console.log("Washington - testeCaptureLoopCompletePromise - promise StartCapture RESOLVED");

						if(statusStartCapture == "Capture OK"){
							
							console.log("Washington - testeCaptureLoopCompletePromise - Capture Complete OK");
							
							// Function execGetImage
							const execGetImage = async () => {
																		
								console.log("Washington - testeCaptureLoopCompletePromise - COMECOU GET_IMAGE");

								await this.promiseGetImage()
										.then(async (statusGetImage) => {
											
											console.log("Washington - testeCaptureLoopCompletePromise - promise getImage RESOLVED");
											
											console.log("Washington - testeCaptureLoopCompletePromise - GetImage OK");	

											// Function execGetTemplate
											const execGetTemplate = async () => {
												
												await this.promiseGetTemplate()
														.then(async (statusGetTemplate) => {
															
															console.log("Washington - testeCaptureLoopCompletePromise - promise getTemplate RESOLVED");
															
															console.log("Washington - testeCaptureLoopCompletePromise - GetTemplate OK");	

															console.log("Washington - testeCaptureLoopCompletePromise - PROCESSO COMPLETO");																													
																																																	
														})
														.catch((statusGetTemplate) => {
															
															console.log("Washington - testeCaptureLoopCompletePromise - GetTemplate ERROR");
															this.error = this.STATUS_ERROR_SCANNER_GET_TEMPLATE;
															this.saida = true;										
															
														});														
												
											};
											
											// Call funtion execGetTemplate
											await execGetTemplate();
											
										})
										.catch((statusGetImage) => {
											
											console.log("Washington - testeCaptureLoopCompletePromise - GetImage ERROR");
											this.error = this.STATUS_ERROR_SCANNER_GET_IMAGE;
											this.saida = true;										
											
										});											
									
							};
							
							// Call function execGetImage
							await execGetImage();									

						}
						else{
							
							console.log("Washington - testeCaptureLoopCompletePromise - Capture ERROR: Timeout, Cancel ou Fail");
							this.error = this.STATUS_ERROR_SCANNER_START_CAPTURE;
							this.saida = true;								
							
						}								
						
					})
					.catch((statusStartCapture) => {
						
						console.log("Washington - testeCaptureLoopCompletePromise - promise StartCapture REJECTED");
						this.error = this.STATUS_ERROR_SCANNER_START_CAPTURE;
						this.saida = true;


						this.ScannerService.stopCapture()
						.subscribe((res: IResponse) => {
								
								console.log(res);
								
								if(res.statuscode == 0){
									console.log("Washington - StopCapture OK");
								}
								else{
									console.log("Washington - StopCapture ERROR");					
								}
								
							},
							(error) => {
								
								console.log("Washington - StopCapture ERROR");
								
							}
						)
						
						
					});							

		};
		
		// Call function execCapture
		await execCapture();

		if(this.saida == false){
			//alert("PROCESSO COMPLETO - OK");
			this.fncScannerIndicateFingerCapturedOK();
			return this.STATUR_ERROR_OK;
		}
		else{
			//alert("PROCESSO INCOMPLETO - ERRO");
			this.fncScannerIndicateFingerCapturedError();	
			this.fncScannerMostraMsgStatus(this.error);
			return this.error;
		}		
		
  }	
	
	//***********************************************************
	// fncScannerWebServiceStartCapture3
	//***********************************************************			
  async fncScannerWebServiceStartCapture3() {

    console.log('ENTROU na Fnc fncScannerWebServiceStartCapture3');
		
		this.saida = false;	
		
		try{

			//console.log("Washington - startCapture - Realizando CaptureIsActive...");
			
			//this.ScannerService.captureIsActive()
			//	.subscribe( async (res: any) => {
							
						//if(res.statuscode == 0){
							
							//console.log("Washington - CaptureIsActive OK");
							
							//if(res.captureIsActive == false){						
								
							//	console.log("Washington - CaptureIsActive nao esta ativo...");
								
								console.log("Washington - startCapture - Realizando StartCapture...");

								this.disableCapturaImpressao = true;

								this.ScannerService.startCapture()
								.subscribe((res: any) => {
									
										console.log("Washington - StartCapture OK");
										
										//console.log(res);
										this.result = res;

										this.saida = false;
										
										// WASHINGTON - Aqui poderia disparar o evento...
										// 
										
								},
									(error) => {
										console.log("Washington - StartCapture ERROR");
										this.saida = true;	
										this.error = this.STATUS_ERROR_SCANNER_START_CAPTURE;
									}
								)


								if(this.saida == false){

									const execPromiseWaitCaptureComplete = async () => {
												
										console.log("Washington - startCapture - COMECOU WAIT_CAPTURE_COMPLETE");
							
										// Call promiseWaitCaptureComplete
										await this.promiseWaitCaptureComplete()
											.then(async (statusWaitCaptureComplete) => {
												
												console.log("Washington - startCapture - promise WaitCaptureComplete RESOLVED");
												
												// Function execGetImage
												const execGetImage = async () => {
																							
													console.log("Washington - testeCaptureLoopCompletePromise - COMECOU GET_IMAGE");

													await this.promiseGetImage()
															.then(async (statusGetImage) => {
																
																console.log("Washington - testeCaptureLoopCompletePromise - promise getImage RESOLVED");
																
																console.log("Washington - testeCaptureLoopCompletePromise - GetImage OK");	

																// Function execGetTemplate
																const execGetTemplate = async () => {
																	
																	await this.promiseGetTemplate()
																			.then(async (statusGetTemplate) => {
																				
																				console.log("Washington - testeCaptureLoopCompletePromise - promise getTemplate RESOLVED");
																				
																				console.log("Washington - testeCaptureLoopCompletePromise - GetTemplate OK");	

																				console.log("Washington - testeCaptureLoopCompletePromise - PROCESSO COMPLETO");																													
																																																						
																			})
																			.catch((statusGetTemplate) => {
																				
																				console.log("Washington - testeCaptureLoopCompletePromise - GetTemplate ERROR");
																				this.error = this.STATUS_ERROR_SCANNER_GET_TEMPLATE;
																				this.saida = true;										
																				
																			});														
																	
																};
																
																// Call funtion execGetTemplate
																await execGetTemplate();
																
															})
															.catch((statusGetImage) => {
																
																console.log("Washington - testeCaptureLoopCompletePromise - GetImage ERROR");
																this.error = this.STATUS_ERROR_SCANNER_GET_IMAGE;
																this.saida = true;										
																
															});											
														
												};
												
												// Call function execGetImage
												await execGetImage();		
												
											})
											.catch((statusWaitCaptureComplete) => {
												
												console.log("Washington - startCapture - promise WaitCaptureComplete REJECTED");
												
												console.log("Washington - startCapture - " + statusWaitCaptureComplete);
												
												this.saida = true;												
												this.error = this.STATUS_ERROR_SCANNER_START_CAPTURE;
												
												//this.stopCapture();
																					
												
											});	
									};
									
									await execPromiseWaitCaptureComplete();
									
									this.disableCapturaImpressao = false;
									
									if(this.saida == false){
										//alert("PROCESSO COMPLETO - OK");
										this.fncScannerIndicateFingerCapturedOK();
										return this.STATUR_ERROR_OK;
									}
									else{
										//alert("PROCESSO INCOMPLETO - ERRO");
										this.fncScannerIndicateFingerCapturedError();	
										this.fncScannerMostraMsgStatus(this.error);
									}										

								}

							//}
							//else{
							//	
							//	console.log("Washington - CaptureIsActive ja esta ativo...");
							//	
							//}
							
						//}
						//else{
						//	console.log("Washington - CaptureIsActive ERROR");
						//	this.saida = true;
						//	this.error = this.STATUS_ERROR_SCANNER_CAPTURE_IS_ACTIVE;
						//	this.fncScannerIndicateFingerCapturedError();	
						//	this.fncScannerMostraMsgStatus(this.error);							
						//}
					
					//},
					//(error) => {
					//	console.log("Washington - StartCapture ERROR");
					//	this.saida = true;
					//	this.error = this.STATUS_ERROR_SCANNER_CAPTURE_IS_ACTIVE;
					//	this.fncScannerIndicateFingerCapturedError();	
					//	this.fncScannerMostraMsgStatus(this.error);						
					//}
				//)			

		}
    catch (err) {
			console.log("Washington - testeCaptureLoopCompletePromise2 - Exception...");
			this.fncScannerIndicateFingerCapturedError();	
			this.fncScannerMostraMsgStatus(this.error);					
    }		
		
  }	
	
	//******************************************************************
	// Function promiseWaitCaptureComplete()
	//******************************************************************		
	promiseWaitCaptureComplete(){
		
		console.log("Washington - ENTROU na função promiseWaitCaptureComplete...");
		
		return new Promise((resolve, reject) => {
			
			console.log("Washington - promiseWaitCaptureComplete - Ligando o timeout..");
			
			const timerCheckTimeout = setTimeout(() => { 
				
				console.log("Washington - promiseWaitCaptureComplete - TIMEOUT de Aplicacao");
				clearTimeout(timerCheckTimeout);
				reject("Capture ERROR - TIMEOUT"); 
									
			}, 65000);			

			// Handle Capture Event Complete
			this.subject.pipe(take(1)).subscribe((data) => {
				
				console.log("Washington - promiseWaitCaptureComplete - Subscriber - Recebeu Evento:" + data);
				
				if(data == "Capture_complete_ok"){
				
					console.log("Washington - promiseWaitCaptureComplete - Capture OK");
					
					clearTimeout(timerCheckTimeout);
					resolve("Capture OK");
				
				}
				else{
					
					if(data == "Capture_complete_fail"){
						console.log("Washington - promiseWaitCaptureComplete - Capture FAIL");
						clearTimeout(timerCheckTimeout);
						reject("Capture ERROR - FAIL");
					}
					else if(data == "Capture_complete_cancel"){
						console.log("Washington - promiseWaitCaptureComplete - Capture CANCEL");
						clearTimeout(timerCheckTimeout);
						reject("Capture ERROR - CANCEL");
					}
					else if(data == "Capture_complete_spoof"){
						console.log("Washington - promiseWaitCaptureComplete - Capture SPOOF");
						clearTimeout(timerCheckTimeout);
						reject("Capture ERROR - SPOOF");
					}
					else if(data == "Capture_complete_unknown"){
						console.log("Washington - promiseWaitCaptureComplete - Capture UNKNOWN");
						clearTimeout(timerCheckTimeout);
						reject("Capture ERROR - UNKNOWN");
					}					

				}	

			});
			
			// Reset Handle Capture Event
			//this.subject.unsubscribe();

		});		
		
	}	
	
	//***********************************************************
	// fncScannerWebServiceStopCapture
	//***********************************************************		
	fncScannerWebServiceStopCapture() {
		
    var stopCaptureStatus = this.STATUR_ERROR_OK;
		
		this.ScannerService.stopCapture()
		.subscribe((res: IResponse) => {
				
				console.log(res);
				
				if(res.statuscode == 0){
					
					console.log("Washington - StopCapture OK");
					
					// Emitindo Evento
					console.log("Washington - parseWebSocketMessage - Emitindo Evento de Cancel Capture");
					this.subject.next("Capture_complete_cancel");					
										
				}
				else{
					stopCaptureStatus = this.STATUS_ERROR_SCANNER_STOP_CAPTURE;
					this.fncScannerMostraMsgStatus(stopCaptureStatus);
					console.log("Washington - StopCapture ERROR");					
				}
				
			},
			(error) => {
				
				stopCaptureStatus = this.STATUS_ERROR_SCANNER_STOP_CAPTURE;	
				this.fncScannerMostraMsgStatus(stopCaptureStatus);
				console.log("Washington - StopCapture ERROR");
			}
		)	

		return stopCaptureStatus;	
		
	}
	
	//***********************************************************
	// fncScannerWebServiceGetImage
	//***********************************************************		
  fncScannerWebServiceGetImage() {	
		
		var getImageStatus = this.STATUR_ERROR_OK;
		var PARAM_IMAGE = 2;
		
		this.ServerService.getParametersData(PARAM_IMAGE)
		.subscribe((res: any) => {
			
				console.log("Washington - GetParametersData:PARAM_IMAGE OK");			
				console.log(res);

				// Resposta como dados Hexa em string
				const _bufferHexData = Buffer.from(res.data, "hex");
				console.log("Hex Data: ", _bufferHexData.toString("hex"));

				const strBufferBase64 = _bufferHexData.toString('base64')
				console.log("Base64: ", strBufferBase64.toString());
				
				var objConfigHex = { rawData : strBufferBase64};
				
				this.ServerService.cryptData(objConfigHex, PARAM_IMAGE, "")
				.subscribe((res: any) => {
						
						console.log("Washington - CryptData:PARAM_IMAGE OK");
						console.log(res);
						
						const encrypteddata:IEncryptedData = {
							encryptedData: {
															data: res.data,
															dataSize: res.dataSize,
															signature: res.signature
							}
						}					
				
						// _lumiService.setReaderInfo
						this.ScannerService.extractImage(encrypteddata)
						.subscribe((res: any) => {
															
								console.log(res);
	
								if(res.statuscode == 0){
	
									console.log("Washington - ExtractImage OK");							
	
									this.ServerService.decryptData(res.encryptedData, PARAM_IMAGE)
									.subscribe((res: any) => {
											
											console.log(res);										
											console.log("Washington - DecryptData OK");	
											
											var BufferImageDataPacket = Buffer.from(res.data, "base64");
											console.log("BufferImageDataPacket: ", BufferImageDataPacket.toString("hex"));
											
											var dataDecrypt = "Dados Hex: " + BufferImageDataPacket.toString("hex");											
											
											//*******************************************************************
											// Washington - WSQ
											//*******************************************************************
											// Resposta = Payload = ImageDataPacket = { ImageHeader + ImageData}
											//
											// 	ImageHeader = { ANSOL + ImageMode + RecordMode + ImageWidth + ImageHeight + ImageBPP + SpoofScore + ImageDataSize} = 44 Bytes
											// 	Onde:
											// 		ANSOL = 				16 bytes						u128 nANSOL;					// Random number generated by trusted host
											// 		ImageMode = 		04 bytes     				u32  nImageMode;  		// The mode of the image data returned (_V100_ENC_IMAGE_MODE). Either IMAGE_RAW or IMAGE_WSQ_COMPRESSED
											// 		RecordMode = 		04 bytes    				u32  nRecordMode;  		// How to wrap the image data(_V100_ENC_RECORD_MODE). Either RAW_RECORD or BIR_RECORD
											// 		ImageWidth = 		04 bytes    				u32  nImageWidth; 		// Image width (uncompressed)
											// 		ImageHeight = 	04 bytes   					u32  nImageHeight; 		// Image height (uncompressed)
											// 		ImageBPP = 			04 bytes      			u32  nImageBPP; 			// Image Format (Bits Per Pixel) 
											// 		SpoofScore = 		04 bytes    				u32  nSpoofScore;			// Spoof Score(u32 max will indicate spoof is turned off)
											//		ImageDataSize = 04 bytes 						u32  nImageDataSize;	// Image data size in bytes
											//
											//	ImageData = {...Data...}
											
											//*******************************************************************
											// Tem que desconsiderar 44 bytes...
											//*******************************************************************
											const SizeANSOL = 16;
											const SizeImageMode = 4;
											const SizeRecordMode = 4;
											const SizeImageWidth = 4;
											const SizeImageHeight = 4;
											const SizeImageBPP = 4;
											const SizeSpoofScore = 4;
											const SizeImageDataSize = 4;
											const SizeImageHeader = SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth + SizeImageHeight + SizeImageBPP + SizeSpoofScore +  SizeImageDataSize;
																					
											var BufferANSOL = Buffer.alloc(SizeANSOL);
											var BufferImageMode = Buffer.alloc(SizeImageMode);
											var BufferRecordMode = Buffer.alloc(SizeRecordMode);
											var BufferImageWidth = Buffer.alloc(SizeImageWidth);
											var BufferImageHeight = Buffer.alloc(SizeImageHeight);
											var BufferImageBPP = Buffer.alloc(SizeImageBPP);
											var BufferSpoofScore = Buffer.alloc(SizeSpoofScore);
											var BufferImageDataSize = Buffer.alloc(SizeImageDataSize);
											var BufferImageHeader = Buffer.alloc(SizeImageHeader);
											var BufferImageData = Buffer.alloc(BufferImageDataPacket.length - SizeImageHeader);								
																					
											//******************************************************************
											// Pega ImageHeader
											//******************************************************************
											BufferImageDataPacket.copy(BufferImageHeader, 0, 0, SizeImageHeader);
											console.log("BufferImageHeader: ", BufferImageHeader.toString("hex"));
											
											//******************************************************************
											// Pega ANSOL
											//******************************************************************
											BufferImageHeader.copy(BufferANSOL, 0, 0, SizeANSOL);
											console.log("BufferANSOL: ", BufferANSOL.toString("hex"));

											//******************************************************************
											// Pega ImageMode
											//******************************************************************
											BufferImageHeader.copy(BufferImageMode, 0, SizeANSOL, (SizeANSOL + SizeImageMode));
											console.log("BufferImageMode: ", BufferImageMode.toString("hex"));
											var intImageMode = this.fncConvertU32(BufferImageMode);
											
											//******************************************************************
											// Pega RecordMode
											//******************************************************************
											BufferImageHeader.copy(BufferRecordMode, 0, (SizeANSOL + SizeImageMode), (SizeANSOL + SizeImageMode + SizeRecordMode));
											console.log("BufferRecordMode: ", BufferRecordMode.toString("hex"));
											var intRecordMode = this.fncConvertU32(BufferRecordMode);
											
											//******************************************************************
											// Pega ImageWidth
											//******************************************************************
											BufferImageHeader.copy(BufferImageWidth, 0, (SizeANSOL + SizeImageMode + SizeRecordMode), (SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth));
											console.log("BufferImageWidth: ", BufferImageWidth.toString("hex"));
											var intImageWidth = this.fncConvertU32(BufferImageWidth);

											//******************************************************************
											// Pega ImageHeight
											//******************************************************************
											BufferImageHeader.copy(BufferImageHeight, 0, (SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth), (SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth + SizeImageHeight));
											console.log("BufferImageHeight: ", BufferImageHeight.toString("hex"));
											var intImageHeight = this.fncConvertU32(BufferImageHeight);

											//******************************************************************
											// Pega ImageBPP
											//******************************************************************
											BufferImageHeader.copy(BufferImageBPP, 0, (SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth + SizeImageHeight), (SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth + SizeImageHeight + SizeImageBPP));
											console.log("BufferImageBPP: ", BufferImageBPP.toString("hex"));
											var intImageBPP = this.fncConvertU32(BufferImageBPP);
											
											//******************************************************************
											// Pega SpoofScore
											//******************************************************************
											BufferImageHeader.copy(BufferSpoofScore, 0, (SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth + SizeImageHeight + SizeImageBPP), (SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth + SizeImageHeight + SizeImageBPP + SizeSpoofScore));
											console.log("BufferSpoofScore: ", BufferSpoofScore.toString("hex"));
											var intSpoofScore = this.fncConvertU32(BufferSpoofScore);
											
											//******************************************************************
											// Pega ImageDataSize
											//******************************************************************
											BufferImageHeader.copy(BufferImageDataSize, 0, (SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth + SizeImageHeight + SizeImageBPP + SizeSpoofScore), (SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth + SizeImageHeight + SizeImageBPP + SizeSpoofScore + SizeImageDataSize));
											console.log("BufferImageDataSize: ", BufferImageDataSize.toString("hex"));										
											var intImageDataSize = this.fncConvertU32(BufferImageDataSize);
											
											const imageCapturedInfosTemp = {
												'ANSOL(hex)' : BufferANSOL.toString("hex"),
												'ImageMode': intImageMode,
												'RecordMode': intRecordMode,
												'ImageWidth': intImageWidth,
												'ImageHeight': intImageHeight,
												'ImageBPP': intImageBPP,
												'SpoofScore': intSpoofScore,
												'ImageDataSize': intImageDataSize
											}
											
											//this.imageCapturedInfos = JSON.stringify(imageCapturedInfosTemp);
											
											//******************************************************************
											// Pega ImageData
											//******************************************************************
											BufferImageDataPacket.copy(BufferImageData, 0, SizeImageHeader);
											console.log("BufferImageData: ", BufferImageData.toString("hex"));
																					
											const wsqdataimage:any = { 
												wsqDataImage: {
																				data: BufferImageData.toString('base64'),
																				dataSize: BufferImageData.length
												}
											}
											
											this.ScannerService.convertImageWsqToJpg(wsqdataimage)
											.subscribe((res: any) => {
												
												console.log(res);
												console.log("Washington - convertImageWsqToJpg OK");
												
												var BufferJpgImage = Buffer.from(res.imageData, "base64");
												//console.log("BufferJpgImage: ", BufferJpgImage.toString("hex"));
												
												//this.dataDecrypt = "Dados Hex: " + BufferJpgImage.toString("hex");

												// ANTIGO
												// Mostra a imagem no Front End
												//this.livePreviewImage = 'data:image/bmp;base64,' + res.imageData;
												// NOVO
												this.livePreviewImage = this.getSantizeUrl('data:image/bmp;base64,' + res.imageData);												
												
												this.currentwsqimagebase64 = BufferImageData.toString('base64');
												this.currentjpgimagebase64 = res.imageData;
												
												this.fncScannerSaveFingerCapturedImage();
												
												},
												(error) => {
													getImageStatus = this.STATUS_ERROR_SCANNER_CONVERT_IMAGE;
													this.fncScannerMostraMsgStatus(getImageStatus);
													console.log("Washington - convertImageWsqToJpg ERROR");
												}
											)												
																					

										},
										(error) => {
											getImageStatus = this.STATUS_ERROR_GLOBAL_DECRYPT_DATA;
											this.fncScannerMostraMsgStatus(getImageStatus);
											console.log("Washington - DecryptData ERROR");
										}
									)	
									
								}
								else{
									getImageStatus = this.STATUS_ERROR_SCANNER_GET_IMAGE;
									this.fncScannerMostraMsgStatus(getImageStatus);
									console.log("Washington - ExtractImage ERROR");									
								}
							},
							(error) => {
								getImageStatus = this.STATUS_ERROR_SCANNER_GET_IMAGE;
								this.fncScannerMostraMsgStatus(getImageStatus);
								console.log("Washington - ExtractImage ERROR");
							}
						)							
						
					},
					(error) => {
						getImageStatus = this.STATUS_ERROR_GLOBAL_ENCRYPT_DATA;
						this.fncScannerMostraMsgStatus(getImageStatus);
						console.log("Washington - CryptData ERROR");
					}
				)				
				
			},
			(error) => {
				getImageStatus = this.STATUS_ERROR_GLOBAL_GET_PARAMETERS;
				this.fncScannerMostraMsgStatus(getImageStatus);
				console.log("Washington - GetParametersData ERROR");
			}
		)	
		
		return getImageStatus;
		
  }	
		
	//***********************************************************
	// fncScannerWebServiceGetTemplate
	//***********************************************************			
  fncScannerWebServiceGetTemplate() {

		var getTemplateStatus = this.STATUR_ERROR_OK;
		var PARAM_TEMPLATE = 3;
		
		this.ServerService.getParametersData(PARAM_TEMPLATE)
		.subscribe((res: any) => {
			
				console.log("Washington - GetParametersData:PARAM_IMAGE OK");
				console.log(res);

				// Resposta como dados Hexa em string
				const _bufferHexData = Buffer.from(res.data, "hex");
				console.log("Hex Data: ", _bufferHexData.toString("hex"));

				const strBufferBase64 = _bufferHexData.toString('base64')
				console.log("Base64: ", strBufferBase64.toString());
				
				var objConfigHex = { rawData : strBufferBase64};
				
				this.ServerService.cryptData(objConfigHex, PARAM_TEMPLATE, "")
				.subscribe((res: any) => {
						
						console.log("Washington - CryptData OK");
						console.log(res);
						
						const encrypteddata:IEncryptedData = {
							encryptedData: {
															data: res.data,
															dataSize: res.dataSize,
															signature: res.signature
							}
						}					
				
						// _lumiService.setReaderInfo
						this.ScannerService.extract(encrypteddata)
						.subscribe((res: any) => {
															
								console.log(res);
								
								if(res.statuscode == 0){

									console.log("Washington - Extract OK");							

									this.ServerService.decryptData(res.encryptedData, PARAM_TEMPLATE)
									.subscribe((res: any) => {
											
											console.log("Washington - DecryptData OK");
											
											var BufferTemplateDataPacket = Buffer.from(res.data, "base64");
											console.log("BufferTemplateDataPacket: ", BufferTemplateDataPacket.toString("hex"));
											
											var dataDecrypt = "Dados Hex: " + BufferTemplateDataPacket.toString("hex");

											//*******************************************************************
											// Washington - Template
											//*******************************************************************
											// Resposta = Payload = TemplateDataPacket = { TemplateHeader + TemplateData}
											//
											// 	ImageHeader = { ANSOL + TemplateMode + RecordMode + SpoofScore + TemplateDataSize} = 32 Bytes
											// 	Onde:
											// 		ANSOL = 						16 bytes						u128 nANSOL;						// Random number generated by trusted host
											// 		TemplateMode = 			04 bytes     				u32  nTemplateMode;  		// The mode of the template data returned (_V100_ENC_IMAGE_MODE). Either IMAGE_RAW or IMAGE_WSQ_COMPRESSED
											// 		RecordMode = 				04 bytes    				u32  nRecordMode;  			// How to wrap the template data(_V100_ENC_RECORD_MODE). Either RAW_RECORD or BIR_RECORD 
											// 		SpoofScore = 				04 bytes    				u32  nSpoofScore;				// Spoof Score(u32 max will indicate spoof is turned off)
											//		TemplateDataSize = 	04 bytes 						u32  nTemplateDataSize;	// Template data size in bytes
											//
											//	TemplateData = {...Data...}
											
											//*******************************************************************
											// Tem que desconsiderar 32 bytes...
											//*******************************************************************										
											
											const SizeANSOL = 16;
											const SizeTemplateMode = 4;
											const SizeRecordMode = 4;
											const SizeSpoofScore = 4;
											const SizeTemplateDataSize = 4;
											const SizeTemplateHeader = SizeANSOL + SizeTemplateMode + SizeRecordMode + SizeSpoofScore +  SizeTemplateDataSize;
																					
											var BufferANSOL = Buffer.alloc(SizeANSOL);
											var BufferTemplateMode = Buffer.alloc(SizeTemplateMode);
											var BufferRecordMode = Buffer.alloc(SizeRecordMode);
											var BufferSpoofScore = Buffer.alloc(SizeSpoofScore);
											var BufferTemplateDataSize = Buffer.alloc(SizeTemplateDataSize);
											var BufferTemplateHeader = Buffer.alloc(SizeTemplateHeader);
											var BufferTemplateData = Buffer.alloc(BufferTemplateDataPacket.length - SizeTemplateHeader);											
											
											//******************************************************************
											// Pega TemplateHeader
											//******************************************************************
											BufferTemplateDataPacket.copy(BufferTemplateHeader, 0, 0, SizeTemplateHeader);
											console.log("BufferTemplateDataPacket: ", BufferTemplateHeader.toString("hex"));
											
											//******************************************************************
											// Pega ANSOL
											//******************************************************************
											BufferTemplateHeader.copy(BufferANSOL, 0, 0, SizeANSOL);
											console.log("BufferANSOL: ", BufferANSOL.toString("hex"));

											//******************************************************************
											// Pega ImageMode
											//******************************************************************
											BufferTemplateHeader.copy(BufferTemplateMode, 0, SizeANSOL, (SizeANSOL + SizeTemplateMode));
											console.log("BufferTemplateMode: ", BufferTemplateMode.toString("hex"));
											var intTemplateMode = this.fncConvertU32(BufferTemplateMode);
											
											//******************************************************************
											// Pega RecordMode
											//******************************************************************
											BufferTemplateHeader.copy(BufferRecordMode, 0, (SizeANSOL + SizeTemplateMode), (SizeANSOL + SizeTemplateMode + SizeRecordMode));
											console.log("BufferRecordMode: ", BufferRecordMode.toString("hex"));
											var intRecordMode = this.fncConvertU32(BufferRecordMode);										
											
											//******************************************************************
											// Pega SpoofScore
											//******************************************************************
											BufferTemplateHeader.copy(BufferSpoofScore, 0, (SizeANSOL + SizeTemplateMode + SizeRecordMode), (SizeANSOL + SizeTemplateMode + SizeRecordMode + SizeSpoofScore));
											console.log("BufferSpoofScore: ", BufferSpoofScore.toString("hex"));
											var intSpoofScore = this.fncConvertU32(BufferSpoofScore);
											
											//******************************************************************
											// Pega ImageDataSize
											//******************************************************************
											BufferTemplateHeader.copy(BufferTemplateDataSize, 0, (SizeANSOL + SizeTemplateMode + SizeRecordMode + SizeSpoofScore), (SizeANSOL + SizeTemplateMode + SizeRecordMode + SizeSpoofScore + SizeTemplateDataSize));
											console.log("BufferTemplateDataSize: ", BufferTemplateDataSize.toString("hex"));										
											var intTemplateDataSize = this.fncConvertU32(BufferTemplateDataSize);
											
											const templateCapturedInfosTemp = {
												'ANSOL(hex)' : BufferANSOL.toString("hex"),
												'TemplateMode': intTemplateMode,
												'RecordMode': intRecordMode,
												'SpoofScore': intSpoofScore,
												'TemplateDataSize': intTemplateDataSize
											}
											
											//this.templateCapturedInfos = JSON.stringify(templateCapturedInfosTemp);	

											//******************************************************************
											// Pega TemplateData
											//******************************************************************
											BufferTemplateDataPacket.copy(BufferTemplateData, 0, SizeTemplateHeader);
											console.log("BufferTemplateData: ", BufferTemplateData.toString("hex"));
											
											//this.templateCaptured = JSON.stringify(BufferTemplateData.toString("hex"));

											this.currenttemplatebase64 = BufferTemplateData.toString('base64');
											
											this.fncScannerSaveFingerCapturedTemplate();
											
											/*										
											// 46 4D 52 00: FMR<0>
											// 20 32 30 00:  20<0>										
											//****************************************************************************************************
											//ISO 19794-2
											//****************************************************************************************************
											#		Field																	Size (bits)				Valid Values				Notes
											01	Format identifier											32								"FMR"								Record header
											02	Standard version											32								" XX" XX => 20	
											03	Record length, in bytes								32								24 to 2^32	
											04	Capture Equipment Certification				4									?										?
											05	Capture device type ID								12								?										vendor code
											06	Image size, x dimension (pixels)			16		
											07	Image size, y dimension (pixels)			16		
											08	Resolution, x dimension (pixels/cm)		16		
											09	Resolution, y dimension (pixels/cm)		16		
											10	Number of finger views								8									1	
											11	Reserved byte													8									00	
											12	Finger position												8									0 to 10	19794-2 		Table 2
											13	View number														4									0	Only one view
											14	Impression type												4									0 to 3 or 8					19794-2 Table 3
											15	Finger Quality												8									0 to 100						19794-2 Table 3
											16	Number of minutiae										8									[0,128]	
											17	X location (0.1 m)										8									[0,255]							repeat rec 16 times
											18	Y location (0.1 m)										8									[0,255]							repeat rec 16 times
											19	Minutiae type													2																			repeat rec 16 times
											20	Minutiae angle (5.625 deg )						6									[0,63]							repeat rec 16 times
											21	Extended data block length						16								0	0x0000	 					= No private area
											... Extended data block																					
											//****************************************************************************************************
											*/
																					
										},
										(error) => {
											getTemplateStatus = this.STATUS_ERROR_GLOBAL_DECRYPT_DATA;
											this.fncScannerMostraMsgStatus(getTemplateStatus);
											console.log("Washington - DecryptData ERROR");
										}
									)	
										
								}
								else{
									getTemplateStatus = this.STATUS_ERROR_SCANNER_GET_TEMPLATE;
									this.fncScannerMostraMsgStatus(getTemplateStatus);
									console.log("Washington - Extract ERROR"); 									
								}
							},
							(error) => {
								getTemplateStatus = this.STATUS_ERROR_SCANNER_GET_TEMPLATE;
								this.fncScannerMostraMsgStatus(getTemplateStatus);
								console.log("Washington - Extract ERROR"); 
							}
						)							
						
					},
					(error) => {
						getTemplateStatus = this.STATUS_ERROR_GLOBAL_ENCRYPT_DATA;
						this.fncScannerMostraMsgStatus(getTemplateStatus);
						console.log("Washington - CryptData ERROR");
					}
				)				
				
			},
			(error) => {
				getTemplateStatus = this.STATUS_ERROR_GLOBAL_GET_PARAMETERS;
				this.fncScannerMostraMsgStatus(getTemplateStatus);
				console.log("Washington - GetParametersData ERROR");
			}
		)

		return getTemplateStatus;
		
  }	
	
	//***********************************************************
	// fncScannerWebServiceGetCaptureInfo
	//***********************************************************		
	fncScannerWebServiceGetCaptureInfo(){
    
		var getCaptureInfoStatus = this.STATUR_ERROR_OK;
		var PARAM_CAPTURE_INFO = 0;
		
		this.ServerService.getParametersData(PARAM_CAPTURE_INFO)
		.subscribe((res: any) => {
			
				console.log("Washington - GetParametersData:PARAM_CAPTURE_INFO OK");			
				console.log(res);
				
				// Resposta como dados Hexa em string
				const _bufferHexData = Buffer.from(res.data, "hex");
				console.log("Hex Data: ", _bufferHexData.toString("hex"));

				const strBufferBase64 = _bufferHexData.toString('base64')
				console.log("Base64: ", strBufferBase64.toString());
				
				var objConfigHex = { rawData : strBufferBase64};
				
				this.ServerService.cryptData(objConfigHex, PARAM_CAPTURE_INFO, "")
				.subscribe((res: any) => {
						
						console.log("Washington - CryptData OK");
						console.log(res);
						
						const encrypteddata:IEncryptedData = {
							encryptedData: {
															data: res.data,
															dataSize: res.dataSize,
															signature: res.signature
							}
						}					
				
						// _lumiService.getCaptureInfo
						this.ScannerService.getCaptureInfo(encrypteddata)
						.subscribe((res: any) => {
															
								console.log(res);
								
								if(res.statuscode == 0){
								
									console.log("Washington - GetCaptureInfo OK");							
								
									console.log("Washington - Minutias:");
									console.log(res.captureStats.imageMinutiaCount);
									
									this.currentminutia = Number(res.captureStats.imageMinutiaCount);
									
									this.fncScannerSaveFingerCapturedMinutia();
								}
								else{
									getCaptureInfoStatus = this.STATUS_ERROR_SCANNER_GET_CAPTURE_INFO;
									this.fncScannerMostraMsgStatus(getCaptureInfoStatus);
									console.log("Washington - GetCaptureInfo ERROR");									
								}
							},
							(error) => {
								getCaptureInfoStatus = this.STATUS_ERROR_SCANNER_GET_CAPTURE_INFO;
								this.fncScannerMostraMsgStatus(getCaptureInfoStatus);
								console.log("Washington - GetCaptureInfo ERROR");
							}
						)							
						
					},
					(error) => {
						getCaptureInfoStatus= this.STATUS_ERROR_GLOBAL_ENCRYPT_DATA;
						this.fncScannerMostraMsgStatus(getCaptureInfoStatus);
						console.log("Washington - CryptData ERROR");
					}
				)				
				
			},
			(error) => {
				getCaptureInfoStatus = this.STATUS_ERROR_GLOBAL_GET_PARAMETERS;
				this.fncScannerMostraMsgStatus(getCaptureInfoStatus);
				console.log("Washington - GetParametersData ERROR");
			}
		)
		
		return getCaptureInfoStatus;		
		
	}
	
	//***********************************************************
	// fncScannerWebSocketParseMessageAndExtractInfos
	//***********************************************************		
	fncScannerWebSocketParseMessageAndExtractInfos(eventType, message, result) {
		
		if((eventType == "fingerEventListener") || (eventType == "captureEventListener")){
		
			//eventType: fingerEventListener
			//	No Finger Present
			//	Finger Position Ok
			//	Move Finger Up
			//	Move Finger Down
			//	Move Finger Left
			//	Move Finger Right		
			if(eventType == "fingerEventListener"){
			
				if(message == "No Finger Present"){
					console.log("Washington - Dedo fora do sensor");
				}					
				else if(message == "Finger Position Ok"){				
					console.log("Washington - Dedo no sensor");
				}
				else if(message == "Move Finger Up"){
					console.log("Washington - Mova o dedo para cima");
				}
				else if(message == "Move Finger Down"){
					console.log("Washington - Mova o dedo para baixo");
				}	
				else if(message == "Move Finger Left"){
					console.log("Washington - Mova o dedo para esquerda");
				}		
				else if(message == "Move Finger Right"){
					console.log("Washington - Mova o dedo para a direita");
				}
				else{
					console.log("Washington - Mensagem Desconhecida");
				}
				
			}		
			else if(eventType == "captureEventListener"){
				
				if(message == "Capture Completed"){
					console.log("Washington - Captura realizada");
					
					if(result == this.STATUS_ERROR_SCANNER_CAPTURE_EVENT_OK){
						console.log("Washington - Captura OK");
						
						// Pega Imagem
						result = this.fncScannerWebServiceGetImage();
						
						if(result == this.STATUR_ERROR_OK){
							
							// Pega Template
							result = this.fncScannerWebServiceGetTemplate();							
							
							if(result == this.STATUR_ERROR_OK){
								
								// Pega Info
								result = this.fncScannerWebServiceGetCaptureInfo();							
								
								if(result == this.STATUR_ERROR_OK){								
															
									//this.fncScannerWebServiceSaveTemplate();								
									this.fncScannerIndicateFingerCapturedOK();
									//this.fncScannerSaveFingerCapturedOK();
									
								}
								else{
									
									this.fncScannerIndicateFingerCapturedError();	
									this.fncScannerMostraMsgStatus(result);									
									
								}
							
							}
							else{
								this.fncScannerIndicateFingerCapturedError();	
								this.fncScannerMostraMsgStatus(result);
							}
																				
						}
						else{
							this.fncScannerIndicateFingerCapturedError();	
							this.fncScannerMostraMsgStatus(result);
						}
						
					}
					else if(result == this.STATUS_ERROR_SCANNER_CAPTURE_EVENT_FAIL){
						console.log("Washington - Falha");						
						this.fncScannerIndicateFingerCapturedError();	
						this.fncScannerMostraMsgCapture(result);
					}
					else if(result == this.STATUS_ERROR_SCANNER_CAPTURE_EVENT_CANCEL){
						console.log("Washington - Cancelado");						
						this.fncScannerIndicateFingerCapturedError();
						this.fncScannerMostraMsgCapture(result);						
					}
					else if(result == this.STATUS_ERROR_SCANNER_CAPTURE_EVENT_SPOOF){
						console.log("Washington - Spoof");						
						this.fncScannerIndicateFingerCapturedError();							
						this.fncScannerMostraMsgCapture(result);
						
					}
					else{
						console.log("Washington - Status Desconhecido");
					}
					
				}		
				else{
					console.log("Washington - Mensagem Desconhecida");
				}		
			}
			else{
				console.log("Washington - Evento Desconhecido");
			}
		}
	}	
		
	//***********************************************************
	// Function fncScannerWebSocketParseMessage
	//***********************************************************		
	fncScannerWebSocketParseMessageAndExtractInfos2(eventType, message, result) {
		
		if((eventType == "fingerEventListener") || (eventType == "captureEventListener") || (eventType == "statusEventListener")){
		
			if(eventType == "fingerEventListener"){
			
				if(message == "No Finger Present"){
					this.websocketposition = "Dedo fora do sensor";
					//console.log("Washington - Dedo fora do sensor");
				}					
				else if(message == "Finger Position Ok"){	
					this.websocketposition = "Dedo no sensor";				
					//console.log("Washington - Dedo no sensor");
				}
				else if(message == "Move Finger Up"){
					this.websocketposition = "Mova o dedo para cima";
					//console.log("Washington - Mova o dedo para cima");
				}
				else if(message == "Move Finger Down"){
					this.websocketposition = "Mova o dedo para baixo";
					//console.log("Washington - Mova o dedo para baixo");
				}	
				else if(message == "Move Finger Left"){
					this.websocketposition = "Mova o dedo para esquerda";
					//console.log("Washington - Mova o dedo para esquerda");
				}		
				else if(message == "Move Finger Right"){
					this.websocketposition = "Mova o dedo para a direita";
					//console.log("Washington - Mova o dedo para a direita");
				}
				else{
					this.websocketposition = "Mensagem Desconhecida";
					//console.log("Washington - Mensagem Desconhecida");
				}
				
			}		
			else if(eventType == "captureEventListener"){
				
				if(message == "Capture Completed"){
					
					this.websocketposition = "Captura completed";
					console.log("Washington - parseWebSocketMessage - Captura Completed");
					
					if(result == this.STATUS_ERROR_SCANNER_CAPTURE_EVENT_OK){						
						this.statusCaptureComplete = "Capture_complete_ok";
						console.log("Washington - parseWebSocketMessage - Captura OK");
					}
					else if(result == this.STATUS_ERROR_SCANNER_CAPTURE_EVENT_FAIL){						
						this.statusCaptureComplete = "Capture_complete_fail";
						console.log("Washington - parseWebSocketMessage - Falha");						
					}
					else if(result == this.STATUS_ERROR_SCANNER_CAPTURE_EVENT_CANCEL){					
						this.statusCaptureComplete = "Capture_complete_cancel";
						console.log("Washington - parseWebSocketMessage - Cancelado");						
					}
					else if(result == this.STATUS_ERROR_SCANNER_CAPTURE_EVENT_SPOOF){						
						this.statusCaptureComplete = "Capture_complete_spoof";
						console.log("Washington - parseWebSocketMessage - Spoof");						
					}
					else{						
						this.statusCaptureComplete = "Capture_complete_unknown";
						console.log("Washington - parseWebSocketMessage - Unknown");
						console.log("Washington - parseWebSocketMessage - Mostrando result: " + (result ? result.toString() : ""));
					}
					
				}		
				else{
					this.statusCaptureComplete = "Capture_complete_incomplete";
					console.log("Washington - parseWebSocketMessage - Mensagem Desconhecida");
				}		
			}
			else if(eventType == "statusEventListener"){
				if(message == "Sensor Unplug"){					
					this.statusCaptureComplete = "Capture_sensor_unplug";
					console.log("Washington - parseWebSocketMessage - Unplug");	
					alert("Sensor Desplugado...");
				}
			}
			else{
				console.log("Washington - parseWebSocketMessage - Evento Desconhecido");
			}
		}
	}	

	//***********************************************************
	// Function fncScannerWebSocketParseMessage3
	//***********************************************************		
	fncScannerWebSocketParseMessageAndExtractInfos3(eventType, message, result) {
		
		console.log("eventType: " + eventType);
		console.log("message: " + message);
		console.log("result: " + result);
		
		if((eventType == "fingerEventListener") || (eventType == "captureEventListener") || (eventType == "statusEventListener")){
		
			if(eventType == "fingerEventListener"){
			
				if(message == "No Finger Present"){
					this.websocketposition = "Dedo fora do sensor";
					//console.log("Washington - Dedo fora do sensor");
				}					
				else if(message == "Finger Position Ok"){	
					this.websocketposition = "Dedo no sensor";				
					//console.log("Washington - Dedo no sensor");
				}
				else if(message == "Move Finger Up"){
					this.websocketposition = "Mova o dedo para cima";
					//console.log("Washington - Mova o dedo para cima");
				}
				else if(message == "Move Finger Down"){
					this.websocketposition = "Mova o dedo para baixo";
					//console.log("Washington - Mova o dedo para baixo");
				}	
				else if(message == "Move Finger Left"){
					this.websocketposition = "Mova o dedo para esquerda";
					//console.log("Washington - Mova o dedo para esquerda");
				}		
				else if(message == "Move Finger Right"){
					this.websocketposition = "Mova o dedo para a direita";
					//console.log("Washington - Mova o dedo para a direita");
				}
				else{
					this.websocketposition = "Mensagem Desconhecida";
					//console.log("Washington - Mensagem Desconhecida");
				}
				
			}		
			else if(eventType == "captureEventListener"){
				
				if(message == "Capture Completed"){
					
					this.websocketposition = "Captura completed";
					console.log("Washington - parseWebSocketMessage - Captura Completed");
					
					if(result == this.STATUS_ERROR_SCANNER_CAPTURE_EVENT_OK){						
						this.statusCaptureComplete = "Capture_complete_ok";
						console.log("Washington - parseWebSocketMessage - Captura OK");
					}
					else if(result == this.STATUS_ERROR_SCANNER_CAPTURE_EVENT_FAIL){						
						this.statusCaptureComplete = "Capture_complete_fail";
						console.log("Washington - parseWebSocketMessage - Falha");						
					}
					else if(result == this.STATUS_ERROR_SCANNER_CAPTURE_EVENT_CANCEL){					
						this.statusCaptureComplete = "Capture_complete_cancel";
						console.log("Washington - parseWebSocketMessage - Cancelado");						
					}
					else if(result == this.STATUS_ERROR_SCANNER_CAPTURE_EVENT_SPOOF){						
						this.statusCaptureComplete = "Capture_complete_spoof";
						console.log("Washington - parseWebSocketMessage - Spoof");						
					}
					else{						
						this.statusCaptureComplete = "Capture_complete_unknown";
						console.log("Washington - parseWebSocketMessage - Unknown");
						console.log("Washington - parseWebSocketMessage - Mostrando result: " + (result ? result.toString() : ""));
					}
					
					// Emitindo Evento
					console.log("Washington - parseWebSocketMessage - Emitindo Evento");
					this.subject.next(this.statusCaptureComplete);					
					
				}		
				else{
					this.statusCaptureComplete = "Capture_complete_incomplete";
					console.log("Washington - parseWebSocketMessage - Mensagem Desconhecida");
				}		
			}
			else if(eventType == "statusEventListener"){
				if(message == "Sensor Unplug"){					
					this.statusCaptureComplete = "Capture_sensor_unplug";
					console.log("Washington - parseWebSocketMessage - Unplug");	
					alert("Sensor Desplugado...");
				}
			}
			else{
				console.log("Washington - parseWebSocketMessage - Evento Desconhecido");
			}
		}
	}				
		
		
	//***********************************************************
	// fncScannerIndicateFingerCapturedOK
	//***********************************************************			
	fncScannerIndicateFingerCapturedOK(){
				
		if(this.currenthand == 'right'){
			if(this.currentfinger == 'little'){
				this.captureStaticImageRL = "../../../assets/img/fingerprint-scanning-ok.png";
				this.fingerImageRL = "../../../assets/img/fingerprint-scanning-ok.png";
				//this.fingerImageRL = this.captureJPGImageRL;								
			}
			else if(this.currentfinger == 'ring'){
				this.captureStaticImageRR = "../../../assets/img/fingerprint-scanning-ok.png";
				this.fingerImageRR = "../../../assets/img/fingerprint-scanning-ok.png";
				//this.fingerImageRR = this.captureJPGImageRR;			
			}
			else if(this.currentfinger == 'middle'){
				this.captureStaticImageRM = "../../../assets/img/fingerprint-scanning-ok.png";
				this.fingerImageRM = "../../../assets/img/fingerprint-scanning-ok.png";
				//this.fingerImageRM = this.captureJPGImageRM;				
			}
			else if(this.currentfinger == 'index'){
				this.captureStaticImageRI = "../../../assets/img/fingerprint-scanning-ok.png";
				this.fingerImageRI = "../../../assets/img/fingerprint-scanning-ok.png";
				//this.fingerImageRI = this.captureJPGImageRI;				
			}
			else{
				this.captureStaticImageRT = "../../../assets/img/fingerprint-scanning-ok.png";
				this.fingerImageRT = "../../../assets/img/fingerprint-scanning-ok.png";
				//this.fingerImageRT = this.captureJPGImageRT;				
			}
		}
		else{
			if(this.currentfinger == 'little'){
				this.captureStaticImageLL = "../../../assets/img/fingerprint-scanning-ok.png";
				this.fingerImageLL = "../../../assets/img/fingerprint-scanning-ok.png";;
				//this.fingerImageLL = this.captureJPGImageLL;				
			}
			else if(this.currentfinger == 'ring'){
				this.captureStaticImageLR = "../../../assets/img/fingerprint-scanning-ok.png";
				this.fingerImageLR = "../../../assets/img/fingerprint-scanning-ok.png";
				//this.fingerImageLR = this.captureJPGImageLR;				
			}
			else if(this.currentfinger == 'middle'){
				this.captureStaticImageLM = "../../../assets/img/fingerprint-scanning-ok.png";
				this.fingerImageLM = "../../../assets/img/fingerprint-scanning-ok.png";
				//this.fingerImageLM = this.captureJPGImageLM;				
			}
			else if(this.currentfinger == 'index'){
				this.captureStaticImageLI = "../../../assets/img/fingerprint-scanning-ok.png";
				this.fingerImageLI = "../../../assets/img/fingerprint-scanning-ok.png";
				//this.fingerImageLI = this.captureJPGImageLI;					
			}
			else{
				this.captureStaticImageLT = "../../../assets/img/fingerprint-scanning-ok.png";
				this.fingerImageLT = "../../../assets/img/fingerprint-scanning-ok.png";
				//this.fingerImageLT = this.captureJPGImageLT;			
			}			
		}
	}	
	
	//***********************************************************
	// fncScannerIndicateFingerCapturedError
	//***********************************************************		
	fncScannerIndicateFingerCapturedError(){
		
		if(this.currenthand == 'right'){
			if(this.currentfinger == 'little'){
				this.captureStaticImageRL = "../../../assets/img/fingerprint-scanning-error.png";
			}
			else if(this.currentfinger == 'ring'){
				this.captureStaticImageRR = "../../../assets/img/fingerprint-scanning-error.png";
			}
			else if(this.currentfinger == 'middle'){
				this.captureStaticImageRM = "../../../assets/img/fingerprint-scanning-error.png";
			}
			else if(this.currentfinger == 'index'){
				this.captureStaticImageRI = "../../../assets/img/fingerprint-scanning-error.png";
			}
			else{
				this.captureStaticImageRT = "../../../assets/img/fingerprint-scanning-error.png";
			}
		}
		else{
			if(this.currentfinger == 'little'){
				this.captureStaticImageLL = "../../../assets/img/fingerprint-scanning-error.png";
			}
			else if(this.currentfinger == 'ring'){
				this.captureStaticImageLR = "../../../assets/img/fingerprint-scanning-error.png";
			}
			else if(this.currentfinger == 'middle'){
				this.captureStaticImageLM = "../../../assets/img/fingerprint-scanning-error.png";
			}
			else if(this.currentfinger == 'index'){
				this.captureStaticImageLI = "../../../assets/img/fingerprint-scanning-error.png";
			}
			else{
				this.captureStaticImageLT = "../../../assets/img/fingerprint-scanning-error.png";
			}			
		}
	}		
	
	//***********************************************************
	// fncScannerSaveFingerCapturedImage
	//***********************************************************		
	fncScannerSaveFingerCapturedImage(){
	
		//console.log("Washington - fncScannerSaveFingerCapturedImage");
		
		//console.log("Washington - currentwsqimagebase64");
		//console.log(this.currentwsqimagebase64);
		
		//console.log("Washington - currentjpgimagebase64");
		//console.log(this.currentjpgimagebase64);
	
		if(this.currenthand == 'right'){
			
			//console.log("Washington - right");
			
			if(this.currentfinger == 'little'){
				
				//console.log("Washington - little");
				
				this.captureWSQImageRL = this.currentwsqimagebase64;
				this.captureJPGImageRL = this.currentjpgimagebase64;
				this.structFingerTagRL.dedo.imagem = this.captureWSQImageRL;
				this.structFingerTagRL.dedo.dedoAusente = "0";
				
			}
			else if(this.currentfinger == 'ring'){
				
				//console.log("Washington - ring");
				
				this.captureWSQImageRR = this.currentwsqimagebase64;
				this.captureJPGImageRR = this.currentjpgimagebase64;
				this.structFingerTagRR.dedo.imagem = this.captureWSQImageRR;
				this.structFingerTagRR.dedo.dedoAusente = "0";
						
			}
			else if(this.currentfinger == 'middle'){
				
				//console.log("Washington - middle");
				
				this.captureWSQImageRM = this.currentwsqimagebase64;
				this.captureJPGImageRM = this.currentjpgimagebase64;
				this.structFingerTagRM.dedo.imagem = this.captureWSQImageRM;
				this.structFingerTagRM.dedo.dedoAusente = "0";
				
			}
			else if(this.currentfinger == 'index'){
				
				//console.log("Washington - index");
				
				this.captureWSQImageRI = this.currentwsqimagebase64;
				this.captureJPGImageRI = this.currentjpgimagebase64;
				this.structFingerTagRI.dedo.imagem = this.captureWSQImageRI;
				this.structFingerTagRI.dedo.dedoAusente = "0";
				
			}
			else{
				
				//console.log("Washington - thumb");
				
				this.captureWSQImageRT = this.currentwsqimagebase64;
				this.captureJPGImageRT = this.currentjpgimagebase64;
				this.structFingerTagRT.dedo.imagem = this.captureWSQImageRT;
				this.structFingerTagRT.dedo.dedoAusente = "0";
				
			}
		}
		else{
			
			//console.log("Washington - left");
			
			if(this.currentfinger == 'little'){
				
				//console.log("Washington - little");
				
				this.captureWSQImageLL = this.currentwsqimagebase64;
				this.captureJPGImageLL = this.currentjpgimagebase64;
				this.structFingerTagLL.dedo.imagem = this.captureWSQImageLL;
				this.structFingerTagLL.dedo.dedoAusente = "0";				
				
			}
			else if(this.currentfinger == 'ring'){
				
				//console.log("Washington - ring");
				
				this.captureWSQImageLR = this.currentwsqimagebase64;
				this.captureJPGImageLR = this.currentjpgimagebase64;
				this.structFingerTagLR.dedo.imagem = this.captureWSQImageLR;
				this.structFingerTagLR.dedo.dedoAusente = "0";				
				
			}
			else if(this.currentfinger == 'middle'){
				
				//console.log("Washington - middle");
				
				this.captureWSQImageLM = this.currentwsqimagebase64;
				this.captureJPGImageLM = this.currentjpgimagebase64;
				this.structFingerTagLM.dedo.imagem = this.captureWSQImageLM;
				this.structFingerTagLM.dedo.dedoAusente = "0";
					
			}
			else if(this.currentfinger == 'index'){
				
				//console.log("Washington - index");
				
				this.captureWSQImageLI = this.currentwsqimagebase64;
				this.captureJPGImageLI = this.currentjpgimagebase64;
				this.structFingerTagLI.dedo.imagem = this.captureWSQImageLI;
				this.structFingerTagLI.dedo.dedoAusente = "0";
				
			}
			else{
				
				//console.log("Washington - thumb");
				
				this.captureWSQImageLT = this.currentwsqimagebase64;
				this.captureJPGImageLT = this.currentjpgimagebase64;
				this.structFingerTagLT.dedo.imagem = this.captureWSQImageLT;
				this.structFingerTagLT.dedo.dedoAusente = "0";
				
			}
			
		}		
		
	}
	
	//***********************************************************
	// fncScannerSaveFingerCapturedTemplate
	//***********************************************************		
	fncScannerSaveFingerCapturedTemplate(){
	
		//console.log("Washington - fncScannerSaveFingerCapturedTemplate");
		
		//console.log("Washington - currenttemplatebase64");
		//console.log(this.currenttemplatebase64);
	
		if(this.currenthand == 'right'){
			
			//console.log("Washington - right");
			
			if(this.currentfinger == 'little'){
				
				//console.log("Washington - little");

				this.captureTemplateRL = this.currenttemplatebase64;	
				this.structFingerTagRL.dedo.template = this.captureTemplateRL;
				this.structFingerTagRL.dedo.dedoAusente = "0";
				
			}
			else if(this.currentfinger == 'ring'){
				
				//console.log("Washington - ring");
				
				this.captureTemplateRR = this.currenttemplatebase64;	
				this.structFingerTagRR.dedo.template = this.captureTemplateRR;	
				this.structFingerTagRR.dedo.dedoAusente = "0";				
				
			}
			else if(this.currentfinger == 'middle'){
				
				//console.log("Washington - middle");
				
				this.captureTemplateRM = this.currenttemplatebase64;	
				this.structFingerTagRM.dedo.template = this.captureTemplateRM;
				this.structFingerTagRM.dedo.dedoAusente = "0";				
				
			}
			else if(this.currentfinger == 'index'){
				
				//console.log("Washington - index");

				this.captureTemplateRI = this.currenttemplatebase64;
				this.structFingerTagRI.dedo.template = this.captureTemplateRI;
				this.structFingerTagRI.dedo.dedoAusente = "0";				
				
			}
			else{
				
				//console.log("Washington - thumb");
				
				this.captureTemplateRT = this.currenttemplatebase64;
				this.structFingerTagRT.dedo.template = this.captureTemplateRT;
				this.structFingerTagRT.dedo.dedoAusente = "0";				
				
			}
		}
		else{
			
			//console.log("Washington - left");
			
			if(this.currentfinger == 'little'){
				
				//console.log("Washington - little");

				this.captureTemplateLL = this.currenttemplatebase64;
				this.structFingerTagLL.dedo.template = this.captureTemplateLL;
				this.structFingerTagLL.dedo.dedoAusente = "0";
				
			}
			else if(this.currentfinger == 'ring'){
				
				//console.log("Washington - ring");
				
				this.captureTemplateLR = this.currenttemplatebase64;
				this.structFingerTagLR.dedo.template = this.captureTemplateLR;
				this.structFingerTagLR.dedo.dedoAusente = "0";
				
			}
			else if(this.currentfinger == 'middle'){
				
				//console.log("Washington - middle");
				
				this.captureTemplateLM = this.currenttemplatebase64;
				this.structFingerTagLM.dedo.template = this.captureTemplateLM;
				this.structFingerTagLM.dedo.dedoAusente = "0";
				
			}
			else if(this.currentfinger == 'index'){
				
				//console.log("Washington - index");
				
				this.captureTemplateLI = this.currenttemplatebase64;	
				this.structFingerTagLI.dedo.template = this.captureTemplateLI;
				this.structFingerTagLI.dedo.dedoAusente = "0";
				
			}
			else{
				
				//console.log("Washington - thumb");
				
				this.captureTemplateLT = this.currenttemplatebase64;
				this.structFingerTagLT.dedo.template = this.captureTemplateLT;
				this.structFingerTagLT.dedo.dedoAusente = "0";
				
			}
			
		}		
		
	}	
	
	//***********************************************************
	// fncScannerSaveFingerCapturedMinutia
	//***********************************************************		
	fncScannerSaveFingerCapturedMinutia(){
	
		console.log("Washington - fncScannerSaveFingerCapturedMinutia");
		
		console.log("Washington - currentminutia");
		console.log(this.currentminutia);
	
		if(this.currenthand == 'right'){
			
			console.log("Washington - right");
			
			if(this.currentfinger == 'little'){
				
				console.log("Washington - little");
				
				this.captureMinutiaRL = this.currentminutia;	
				this.structFingerTagRL.dedo.qualidade = this.captureMinutiaRL;
				this.structFingerTagRL.dedo.dedoAusente = "0";
					
			}
			else if(this.currentfinger == 'ring'){
				
				console.log("Washington - ring");

				this.captureMinutiaRR = this.currentminutia;	
				this.structFingerTagRR.dedo.qualidade = this.captureMinutiaRR;
				this.structFingerTagRR.dedo.dedoAusente = "0";
				
			}
			else if(this.currentfinger == 'middle'){
				
				console.log("Washington - middle");
					
				this.captureMinutiaRM = this.currentminutia;	
				this.structFingerTagRM.dedo.qualidade = this.captureMinutiaRM;
				this.structFingerTagRM.dedo.dedoAusente = "0";
					
			}
			else if(this.currentfinger == 'index'){
				
				console.log("Washington - index");
				
				this.captureMinutiaRI = this.currentminutia;			
				this.structFingerTagRI.dedo.qualidade = this.captureMinutiaRI;
				this.structFingerTagRI.dedo.dedoAusente = "0";				
				
			}
			else{
				
				console.log("Washington - thumb");
				
				this.captureMinutiaRT = this.currentminutia;
				this.structFingerTagRT.dedo.qualidade = this.captureMinutiaRT;
				this.structFingerTagRT.dedo.dedoAusente = "0";
				
			}
		}
		else{
			
			console.log("Washington - left");
			
			if(this.currentfinger == 'little'){
				
				console.log("Washington - little");
				
				this.captureMinutiaLL = this.currentminutia;
				this.structFingerTagLL.dedo.qualidade = this.captureMinutiaLL;
				this.structFingerTagLL.dedo.dedoAusente = "0";
				
			}
			else if(this.currentfinger == 'ring'){
				
				console.log("Washington - ring");
				
				this.captureMinutiaLR = this.currentminutia;	
				this.structFingerTagLR.dedo.qualidade = this.captureMinutiaLR;
				this.structFingerTagLR.dedo.dedoAusente = "0";
				
			}
			else if(this.currentfinger == 'middle'){
				
				console.log("Washington - middle");
				
				this.captureMinutiaLM = this.currentminutia;	
				this.structFingerTagLM.dedo.qualidade = this.captureMinutiaLM;
				this.structFingerTagLM.dedo.dedoAusente = "0";
				
			}
			else if(this.currentfinger == 'index'){
				
				console.log("Washington - index");
				
				this.captureMinutiaLI = this.currentminutia;
				this.structFingerTagLI.dedo.qualidade = this.captureMinutiaLI;
				this.structFingerTagLI.dedo.dedoAusente = "0";
				
			}
			else{
				
				console.log("Washington - thumb");

				this.captureMinutiaLT = this.currentminutia;
				this.structFingerTagLT.dedo.qualidade = this.captureMinutiaLT;
				this.structFingerTagLT.dedo.dedoAusente = "0";
					
			}
			
		}		
		
	}	
		
	//***********************************************************
	// fncScannerMostraMsgStatus
	//***********************************************************		
	fncScannerMostraMsgStatus(intResult){

		if(intResult != this.STATUR_ERROR_OK){

			switch(intResult) {

				case this.STATUS_ERROR_GLOBAL_GET_PARAMETERS:
					this.fncShowNotificationError('Scanner - ERROR_GET_PARAMETERS');
					break;
				case this.STATUS_ERROR_GLOBAL_ENCRYPT_DATA:
					this.fncShowNotificationError('Scanner - ERROR_ENCRYPT_DATA');
					break;
				case this.STATUS_ERROR_GLOBAL_DECRYPT_DATA:
					this.fncShowNotificationError('Scanner - ERROR_DECRYPT_DATA');
					break;
				case this.STATUS_ERROR_SCANNER_INITIALIZE:
					this.fncShowNotificationError('Scanner - ERROR_SCANNER_INITIALIZE');
					break;
				case this.STATUS_ERROR_SCANNER_SET_FIXED_KEY:
					this.fncShowNotificationError('Scanner - ERROR_SCANNER_SET_FIXED_KEY');
					break;
				case this.STATUS_ERROR_SCANNER_SET_READER_INFO:
					this.fncShowNotificationError('Scanner - ERROR_SCANNER_SET_READER_INFO');
					break;
				case this.STATUS_ERROR_SCANNER_START_CAPTURE:
					this.fncShowNotificationError('Scanner - ERROR_SCANNER_START_CAPTURE');
					break;
				case this.STATUS_ERROR_SCANNER_STOP_CAPTURE:
					this.fncShowNotificationError('Scanner - ERROR_SCANNER_STOP_CAPTURE');
					break;
				case this.STATUS_ERROR_SCANNER_GET_IMAGE:
					this.fncShowNotificationError('Scanner - ERROR_SCANNER_GET_IMAGE');
					break;
				case this.STATUS_ERROR_SCANNER_GET_TEMPLATE:
					this.fncShowNotificationError('Scanner - ERROR_SCANNER_GET_TEMPLATE');
					break;
				case this.STATUS_ERROR_SCANNER_GET_RANDOM:
					this.fncShowNotificationError('Scanner - ERROR_SCANNER_GET_RANDOM');
					break;
				case this.STATUS_ERROR_SCANNER_CAPTURE_IS_ACTIVE:
					this.fncShowNotificationError('Scanner - ERROR_SCANNER_CAPTURE_IS_ACTIVE');
					break;
				case this.STATUS_ERROR_SCANNER_INITIALIZE_IS_ACTIVE:
					this.fncShowNotificationError('Scanner - ERROR_SCANNER_INITIALIZE_IS_ACTIVE');
					break;
				case this.STATUS_ERROR_SCANNER_CONVERT_IMAGE:	
					this.fncShowNotificationError('Scanner - ERROR_SCANNER_CONVERT_IMAGE');
					break;
				case this.STATUS_ERROR_SCANNER_GET_CAPTURE_INFO:
					this.fncShowNotificationError('Scanner - ERROR_SCANNER_GET_CAPTURE_INFO');
					break;	
				case this.STATUS_ERROR_GLOBAL_RSA_DATA:
					this.fncShowNotificationError('Scanner - ERROR_GLOBAL_RSA_DATA');
					break;					
				default:
					this.fncShowNotificationError('Scanner - ERROR_SCANNER_UNKNOWN');
					break;
			}		
		}
	}	
	
	//***********************************************************
	// fncScannerMostraMsgCapture
	//***********************************************************			
	fncScannerMostraMsgCapture(intResult){
		
		switch(intResult) {

			case this.STATUS_ERROR_SCANNER_CAPTURE_EVENT_FAIL:	
				this.fncShowNotificationError('Scanner - ERROR_CAPTURE_EVENT_FAIL');
				break;
			case this.STATUS_ERROR_SCANNER_CAPTURE_EVENT_CANCEL:	
				this.fncShowNotificationError('Scanner - ERROR_CAPTURE_EVENT_CANCEL');
				break;
			case this.STATUS_ERROR_SCANNER_CAPTURE_EVENT_SPOOF:	
				this.fncShowNotificationError('Scanner - ERROR_CAPTURE_EVENT_SPOOF:');
				break;				
			default:
				this.fncShowNotificationError('Scanner - ERROR_CAPTURE_UNKNOWN');
				break;
		}			
		
	}
	
	//***********************************************************
	// fncScannerWebServiceSaveTemplate
	//***********************************************************		
	fncScannerWebServiceSaveTemplate(templateData){
		
    var saveTemplateStatus = this.STATUR_ERROR_OK;
		
		var PARAM_TEMPLATE = 3;
		
		this.ServerService.saveCaptureData(this.currenthand, this.currentfinger, templateData, PARAM_TEMPLATE)
		.subscribe((res: IResponse) => {
				console.log("Washington - SaveTemplateData OK");
				console.log(res);
			},
			(error) => {
				
				saveTemplateStatus = this.STATUS_ERROR_CAM_SAVE_DATA;				
				console.log("Washington - SaveTemplateData ERROR");
			}
		)			
		
		return saveTemplateStatus;				
		
	}
	
	//***********************************************************
	// fncScannerWebServiceSaveImage
	//***********************************************************		
	fncScannerWebServiceSaveImage(imageData){
		
    var saveImageStatus = this.STATUR_ERROR_OK;
		
		var PARAM_IMAGE = 2;
		
		this.ServerService.saveCaptureData(this.currenthand, this.currentfinger, imageData, PARAM_IMAGE)
		.subscribe((res: IResponse) => {
				console.log("Washington - SaveImageData OK");
				console.log(res);
			},
			(error) => {
				
				saveImageStatus = this.STATUS_ERROR_CAM_SAVE_DATA;				
				console.log("Washington - SaveImageData ERROR");
			}
		)			
		
		return saveImageStatus;		
		
	}	
	
	//******************************************************************
	// Function promiseStartCapture()
	//******************************************************************	
	/*
	promiseStartCapture(){
		
		console.log("Washington - ENTROU na função promiseStartCapture...");
		
		return new Promise((resolve, reject) => {

			this.ScannerService.startCapture()
			.subscribe((res: any) => {
				
					console.log("Washington - promiseStartCapture - StartCapture OK");
					
					//console.log(res);
					this.result = res;
					
					if((res.statuscode == "0") && (this.statusCaptureComplete == "Capture_complete_ok")){
						
						console.log("Washington - promiseStartCapture - Capture OK");
						
						resolve("Capture OK");
						
					}
					else{
						
						if(this.statusCaptureComplete == "Capture_complete_fail"){
							console.log("Washington - promiseStartCapture - Capture FAIL");
						}
						else if(this.statusCaptureComplete == "Capture_complete_cancel"){
							console.log("Washington - promiseStartCapture - Capture CANCEL");
						}
						else if(this.statusCaptureComplete == "Capture_complete_spoof"){
							console.log("Washington - promiseStartCapture - Capture SPOOF");
						}
						else{
							console.log("Washington - promiseStartCapture - Capture UNKNOWN");
						}
												
						reject("Capture ERROR");						
						
					}						
					
					
			},
				(error) => {
					console.log("Washington - promiseStartCapture - StartCapture ERROR");
					reject("startCapture promise rejected");
				}
			)	

		});			
		
	}	
	*/

	//******************************************************************
	// Function promiseStartCapture()
	//******************************************************************				
	promiseStartCapture(){
		
		console.log("Washington - ENTROU na função promiseStartCapture...");
		
		return new Promise((resolve, reject) => {

			this.ScannerService.startCapture()
			.subscribe((res: any) => {
				
					console.log("Washington - promiseStartCapture - StartCapture OK");
					
					//console.log(res);
					this.result = res;
					
					if(res.statuscode == "0"){ 
					
						if(this.statusCaptureComplete == "Capture_complete_ok"){
						
							console.log("Washington - promiseStartCapture - Capture OK");
							
							resolve("Capture OK");
						
						}
						else{
							
							if(this.statusCaptureComplete == "Capture_complete_fail"){
								console.log("Washington - promiseStartCapture - Capture FAIL");
								reject("Capture ERROR - FAIL");
							}
							else if(this.statusCaptureComplete == "Capture_complete_cancel"){
								console.log("Washington - promiseStartCapture - Capture CANCEL");
								reject("Capture ERROR - CANCEL");
							}
							else if(this.statusCaptureComplete == "Capture_complete_spoof"){
								console.log("Washington - promiseStartCapture - Capture SPOOF");
								reject("Capture ERROR - SPOOF");
							}
							else if(this.statusCaptureComplete == "Capture_complete_unknown"){
								console.log("Washington - promiseStartCapture - Capture UNKNOWN");								
								reject("Capture ERROR - UNKNOWN");								
							}
							else{								
								
								console.log("Washington - promiseStartCapture - Aguardando o EVENTO capture valido do WebSocket...");
												
								console.log("Washington - promiseStartCapture - Ligando o timeout (500ms)...");
																
								setTimeout(() => { 
									if(this.statusCaptureComplete == "Capture_complete_ok"){
										resolve("Capture OK");
									}
									else{
										reject("Capture ERROR - TIMEOUT"); 
									}									
								}, 500);	
								
							}							

						}
						
					}
					else{
						
						console.log("Washington - promiseStartCapture - Response StartCapture diferente de 0");						
						reject("Capture ERROR - Response");						
						
					}						
										
			},
				(error) => {
					console.log("Washington - promiseStartCapture - StartCapture ERROR");
					reject("Capture ERROR - startCapture promise rejected");
				}
			)	

		});			
		
	}		
	
	//******************************************************************
	// Function promiseSetReaderInfo()
	//******************************************************************				
	promiseSetReaderInfo(){
		
		console.log("Washington - ENTROU na função promiseSetReaderInfo...");
		
		return new Promise((resolve, reject) => {

			const timerCheckTimeout = setTimeout(() => { 
				
				console.log("Washington - promiseSetReaderInfo - TIMEOUT de Aplicacao");
				clearTimeout(timerCheckTimeout);
				reject("SetReaderInfo ERROR - TIMEOUT"); 
									
			}, 5000);	

			var PARAM_WRITE_CONFIG = 5;
			
			this.ServerService.getParametersData(PARAM_WRITE_CONFIG)
			.subscribe((res: any) => {
																					
					console.log(res);
					
					if(1){

						console.log("Washington - GetParameterData:PARAM_WRITE_CONFIG OK");			

						// Resposta como dados Hexa em string
						const bufferParameters = Buffer.from(res.data, "hex");
						console.log("bufferParameters: ", bufferParameters.toString("hex"));

						const strBufferBase64 = bufferParameters.toString('base64')
						console.log("bufferParameters (base64): ", strBufferBase64.toString());
						
						var objConfigHex = { rawData : strBufferBase64};

						this.ScannerService.getRamdom()
						.subscribe((res: any) => {
																											
								console.log(res);
								
								if(res.statuscode == 0){

									console.log("Washington - GetRandom OK");

									const _bufferRandomNumber = Buffer.from(res.randomNumber, 'base64');
									console.log("RandomNumber hex: ", _bufferRandomNumber.toString('hex'));
									
									this.ServerService.cryptData(objConfigHex, PARAM_WRITE_CONFIG, res.randomNumber)
									.subscribe((res: any) => {
																																		
											console.log(res);
											
											if(1){
											
												console.log("Washington - CryptData OK");
											
												const encrypteddata:IEncryptedData = {
													encryptedData: {
																					data: res.data,
																					dataSize: res.dataSize,
																					signature: res.signature
													}
												}
												
												const bufferDataCrypt = Buffer.from(res.data, "base64");								
												const bufferDataCryptHex = bufferDataCrypt.toString('hex');								
												
												const bufferSignatureCrypt = Buffer.from(res.signature, "base64");								
												const bufferSignatureCryptHex = bufferSignatureCrypt.toString('hex');									
												
												const encrypteddataAux:IEncryptedData = {
													encryptedData: {
																					data: bufferDataCryptHex,
																					dataSize: res.dataSize,
																					signature: bufferSignatureCryptHex
													}
												}								
										
												// _lumiService.setReaderInfo
												this.ScannerService.setReaderInfo(encrypteddata)
												.subscribe((res: any) => {
																																							
														console.log(res);
														
														if(res.statuscode == 0){
															//console.log("Washington - SetReaderInfo OK");
															clearTimeout(timerCheckTimeout);															
															resolve("SetReaderInfo OK");
															//this.fncShowNotificationSuccess("Finger Scanner inicializado com SUCESSO...");				
														}
														else{
															//initializeStatus = this.STATUS_ERROR_SCANNER_SET_READER_INFO;
															//this.fncScannerMostraMsgStatus(initializeStatus);
															console.log("Washington - SetReaderInfo ERROR");
															clearTimeout(timerCheckTimeout);
															reject("SetReaderInfo ERROR");
														}

													},
													(error) => {
														//initializeStatus = this.STATUS_ERROR_SCANNER_SET_READER_INFO;
														//this.fncScannerMostraMsgStatus(initializeStatus);
														console.log("Washington - SetReaderInfo ERROR");
														clearTimeout(timerCheckTimeout);
														reject("SetReaderInfo ERROR");
													}
												)							
												
											}
											else{
												//initializeStatus = this.STATUS_ERROR_GLOBAL_ENCRYPT_DATA;
												//this.fncScannerMostraMsgStatus(initializeStatus);
												console.log("Washington - CryptData ERROR");
												clearTimeout(timerCheckTimeout);
												reject("SetReaderInfo ERROR");												
											}
											
										},
										(error) => {
											//initializeStatus = this.STATUS_ERROR_GLOBAL_ENCRYPT_DATA;
											//this.fncScannerMostraMsgStatus(initializeStatus);
											console.log("Washington - CryptData ERROR");
											clearTimeout(timerCheckTimeout);
											reject("SetReaderInfo ERROR");
										}
									)							
									
								}
								else{
									//initializeStatus = this.STATUS_ERROR_SCANNER_GET_RANDOM;
									//this.fncScannerMostraMsgStatus(initializeStatus);
									console.log("Washington - GetRandom ERROR");
									clearTimeout(timerCheckTimeout);
									reject("SetReaderInfo ERROR");
								}
								
							},
							(error) => {
								//initializeStatus = this.STATUS_ERROR_SCANNER_GET_RANDOM;
								//this.fncScannerMostraMsgStatus(initializeStatus);
								console.log("Washington - GetRandom ERROR");
								clearTimeout(timerCheckTimeout);
								reject("SetReaderInfo ERROR");
							}
						)			
						
					}
					else{
						//initializeStatus = this.STATUS_ERROR_GLOBAL_GET_PARAMETERS;
						//this.fncScannerMostraMsgStatus(initializeStatus);
						console.log("Washington - GetParametersData ERROR");
						clearTimeout(timerCheckTimeout);
						reject("SetReaderInfo ERROR");
					}
					
				},
				(error) => {
					//initializeStatus = this.STATUS_ERROR_GLOBAL_GET_PARAMETERS;
					//this.fncScannerMostraMsgStatus(initializeStatus);
					console.log("Washington - GetParametersData ERROR");
					clearTimeout(timerCheckTimeout);
					reject("SetReaderInfo ERROR");
				}
			)											
															
		});			
		
	}		
	
	//******************************************************************
	// Function promiseGetImage()
	//******************************************************************		
	promiseGetImage(){
		
		console.log("Washington - ENTROU na função promiseGetImage...");
		
		return new Promise((resolve, reject) => {

			this.result = null;
			this.error = null;		
			
			var PARAM_IMAGE = 2;
			
			const timerCheckTimeout = setTimeout(() => { 
				
				console.log("Washington - promiseGetImage - TIMEOUT de Aplicacao");
				clearTimeout(timerCheckTimeout);
				reject("Capture ERROR - TIMEOUT"); 
									
			}, 5000);					
			
			
			this.ServerService.getParametersData(PARAM_IMAGE)
			.subscribe((res: any) => {
				
					console.log("Washington - promiseGetImage - GetParametersData:PARAM_IMAGE OK");
				
					//console.log(res);
					this.result = res;

					// Resposta como dados Hexa em string
					const _bufferHexData = Buffer.from(res.data, "hex");
					//console.log("Hex Data: ", _bufferHexData.toString("hex"));

					const strBufferBase64 = _bufferHexData.toString('base64')
					//console.log("Base64: ", strBufferBase64.toString());
					
					var objConfigHex = { rawData : strBufferBase64};
					
					this.ServerService.cryptData(objConfigHex, PARAM_IMAGE, "")
					.subscribe((res: any) => {
							
							console.log("Washington - promiseGetImage - CryptData:PARAM_IMAGE OK");

							//console.log(res);
							this.result = res;
							
							const encrypteddata:IEncryptedData = {
								encryptedData: {
																data: res.data,
																dataSize: res.dataSize,
																signature: res.signature
								}
							}					
					
							// _lumiService.setReaderInfo
							this.ScannerService.extractImage(encrypteddata)
							.subscribe((res: any) => {
								
									console.log("Washington - promiseGetImage - ExtractImage OK");
								
									//console.log(res);
									this.result = res;	
									
									//this.delay(this.NUMBER_DELAY);

									this.ServerService.decryptData(res.encryptedData, PARAM_IMAGE)
									.subscribe((res: any) => {
											
											console.log("Washington - promiseGetImage - DecryptData OK");
											
											//console.log(res);
											this.result = res;
											
											
											
											var BufferImageDataPacket = Buffer.from(res.data, "base64");
											//console.log("BufferImageDataPacket: ", BufferImageDataPacket.toString("hex"));
											
											var dataDecrypt = "Dados Hex: " + BufferImageDataPacket.toString("hex");											
											
											//*******************************************************************
											// Washington - WSQ
											//*******************************************************************
											// Resposta = Payload = ImageDataPacket = { ImageHeader + ImageData}
											//
											// 	ImageHeader = { ANSOL + ImageMode + RecordMode + ImageWidth + ImageHeight + ImageBPP + SpoofScore + ImageDataSize} = 44 Bytes
											// 	Onde:
											// 		ANSOL = 				16 bytes						u128 nANSOL;					// Random number generated by trusted host
											// 		ImageMode = 		04 bytes     				u32  nImageMode;  		// The mode of the image data returned (_V100_ENC_IMAGE_MODE). Either IMAGE_RAW or IMAGE_WSQ_COMPRESSED
											// 		RecordMode = 		04 bytes    				u32  nRecordMode;  		// How to wrap the image data(_V100_ENC_RECORD_MODE). Either RAW_RECORD or BIR_RECORD
											// 		ImageWidth = 		04 bytes    				u32  nImageWidth; 		// Image width (uncompressed)
											// 		ImageHeight = 	04 bytes   					u32  nImageHeight; 		// Image height (uncompressed)
											// 		ImageBPP = 			04 bytes      			u32  nImageBPP; 			// Image Format (Bits Per Pixel) 
											// 		SpoofScore = 		04 bytes    				u32  nSpoofScore;			// Spoof Score(u32 max will indicate spoof is turned off)
											//		ImageDataSize = 04 bytes 						u32  nImageDataSize;	// Image data size in bytes
											//
											//	ImageData = {...Data...}
											
											//*******************************************************************
											// Tem que desconsiderar 44 bytes...
											//*******************************************************************
											const SizeANSOL = 16;
											const SizeImageMode = 4;
											const SizeRecordMode = 4;
											const SizeImageWidth = 4;
											const SizeImageHeight = 4;
											const SizeImageBPP = 4;
											const SizeSpoofScore = 4;
											const SizeImageDataSize = 4;
											const SizeImageHeader = SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth + SizeImageHeight + SizeImageBPP + SizeSpoofScore +  SizeImageDataSize;
																					
											var BufferANSOL = Buffer.alloc(SizeANSOL);
											var BufferImageMode = Buffer.alloc(SizeImageMode);
											var BufferRecordMode = Buffer.alloc(SizeRecordMode);
											var BufferImageWidth = Buffer.alloc(SizeImageWidth);
											var BufferImageHeight = Buffer.alloc(SizeImageHeight);
											var BufferImageBPP = Buffer.alloc(SizeImageBPP);
											var BufferSpoofScore = Buffer.alloc(SizeSpoofScore);
											var BufferImageDataSize = Buffer.alloc(SizeImageDataSize);
											var BufferImageHeader = Buffer.alloc(SizeImageHeader);
											var BufferImageData = Buffer.alloc(BufferImageDataPacket.length - SizeImageHeader);								
																					
											//******************************************************************
											// Pega ImageHeader
											//******************************************************************
											BufferImageDataPacket.copy(BufferImageHeader, 0, 0, SizeImageHeader);
											//console.log("BufferImageHeader: ", BufferImageHeader.toString("hex"));
											
											//******************************************************************
											// Pega ANSOL
											//******************************************************************
											BufferImageHeader.copy(BufferANSOL, 0, 0, SizeANSOL);
											//console.log("BufferANSOL: ", BufferANSOL.toString("hex"));

											//******************************************************************
											// Pega ImageMode
											//******************************************************************
											BufferImageHeader.copy(BufferImageMode, 0, SizeANSOL, (SizeANSOL + SizeImageMode));
											//console.log("BufferImageMode: ", BufferImageMode.toString("hex"));
											var intImageMode = this.fncConvertU32(BufferImageMode);
											
											//******************************************************************
											// Pega RecordMode
											//******************************************************************
											BufferImageHeader.copy(BufferRecordMode, 0, (SizeANSOL + SizeImageMode), (SizeANSOL + SizeImageMode + SizeRecordMode));
											//console.log("BufferRecordMode: ", BufferRecordMode.toString("hex"));
											var intRecordMode = this.fncConvertU32(BufferRecordMode);
											
											//******************************************************************
											// Pega ImageWidth
											//******************************************************************
											BufferImageHeader.copy(BufferImageWidth, 0, (SizeANSOL + SizeImageMode + SizeRecordMode), (SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth));
											//console.log("BufferImageWidth: ", BufferImageWidth.toString("hex"));
											var intImageWidth = this.fncConvertU32(BufferImageWidth);

											//******************************************************************
											// Pega ImageHeight
											//******************************************************************
											BufferImageHeader.copy(BufferImageHeight, 0, (SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth), (SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth + SizeImageHeight));
											//console.log("BufferImageHeight: ", BufferImageHeight.toString("hex"));
											var intImageHeight = this.fncConvertU32(BufferImageHeight);

											//******************************************************************
											// Pega ImageBPP
											//******************************************************************
											BufferImageHeader.copy(BufferImageBPP, 0, (SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth + SizeImageHeight), (SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth + SizeImageHeight + SizeImageBPP));
											//console.log("BufferImageBPP: ", BufferImageBPP.toString("hex"));
											var intImageBPP = this.fncConvertU32(BufferImageBPP);
											
											//******************************************************************
											// Pega SpoofScore
											//******************************************************************
											BufferImageHeader.copy(BufferSpoofScore, 0, (SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth + SizeImageHeight + SizeImageBPP), (SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth + SizeImageHeight + SizeImageBPP + SizeSpoofScore));
											//console.log("BufferSpoofScore: ", BufferSpoofScore.toString("hex"));
											var intSpoofScore = this.fncConvertU32(BufferSpoofScore);
											
											//******************************************************************
											// Pega ImageDataSize
											//******************************************************************
											BufferImageHeader.copy(BufferImageDataSize, 0, (SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth + SizeImageHeight + SizeImageBPP + SizeSpoofScore), (SizeANSOL + SizeImageMode + SizeRecordMode + SizeImageWidth + SizeImageHeight + SizeImageBPP + SizeSpoofScore + SizeImageDataSize));
											//console.log("BufferImageDataSize: ", BufferImageDataSize.toString("hex"));										
											var intImageDataSize = this.fncConvertU32(BufferImageDataSize);
											
											const imageCapturedInfosTemp = {
												'ANSOL(hex)' : BufferANSOL.toString("hex"),
												'ImageMode': intImageMode,
												'RecordMode': intRecordMode,
												'ImageWidth': intImageWidth,
												'ImageHeight': intImageHeight,
												'ImageBPP': intImageBPP,
												'SpoofScore': intSpoofScore,
												'ImageDataSize': intImageDataSize
											}
											
											//this.imageCapturedInfos = JSON.stringify(imageCapturedInfosTemp);
											
											//******************************************************************
											// Pega ImageData
											//******************************************************************
											BufferImageDataPacket.copy(BufferImageData, 0, SizeImageHeader);
											//console.log("BufferImageData: ", BufferImageData.toString("hex"));
																					
											const wsqdataimage:any = { 
												wsqDataImage: {
																				data: BufferImageData.toString('base64'),
																				dataSize: BufferImageData.length
												}
											}
											
											this.ScannerService.convertImageWsqToJpg(wsqdataimage)
											.subscribe((res: any) => {
																								
												console.log("Washington - convertImageWsqToJpg OK");
												//console.log(res);
												
												var BufferJpgImage = Buffer.from(res.imageData, "base64");
												//console.log("BufferJpgImage: ", BufferJpgImage.toString("hex"));
												
												//this.dataDecrypt = "Dados Hex: " + BufferJpgImage.toString("hex");

												// Mostra a imagem no Front End
												// ANTIGO
												//this.livePreviewImage = 'data:image/bmp;base64,' + res.imageData;
												// NOVO
												this.livePreviewImage = this.getSantizeUrl('data:image/bmp;base64,' + res.imageData);												
												
												this.currentwsqimagebase64 = BufferImageData.toString('base64');
												this.currentjpgimagebase64 = res.imageData;
												
												this.fncScannerSaveFingerCapturedImage();
												
												clearTimeout(timerCheckTimeout);
												resolve("getImage promise resolved");				
												
												},
												(error) => {
													console.log("Washington - promiseGetImage - convertImageWsqToJpg ERROR");
													this.error = error;
													clearTimeout(timerCheckTimeout);
													reject("getImage promise rejected");
												}
											)																					

										},
										(error) => {
											console.log("Washington - promiseGetImage - DecryptData ERROR");
											this.error = error;
											clearTimeout(timerCheckTimeout);
											reject("getImage promise rejected");
										}
									)	
																	
								},
								(error) => {
									console.log("Washington - promiseGetImage - ExtractImage ERROR");
									this.error = error;
									clearTimeout(timerCheckTimeout);
									reject("getImage promise rejected");
								}
							)							
							
						},
						(error) => {
							console.log("Washington - promiseGetImage - CryptData ERROR");
							this.error = error;
							clearTimeout(timerCheckTimeout);
							reject("getImage promise rejected");																		
						}
					)				
					
				},
				(error) => {
					console.log("Washington - promiseGetImage - GetParametersData ERROR");
					this.error = error;
					clearTimeout(timerCheckTimeout);
					reject("getImage promise rejected");
				}
			)					
		
		});							
		
	}
	
	//******************************************************************
	// Function promiseGetTemplate()
	//******************************************************************		
	promiseGetTemplate(){
		
		console.log("Washington - ENTROU na função promiseGetTemplate...");
		
		return new Promise((resolve, reject) => {

			this.result = null;
			this.error = null;		
			
			var PARAM_TEMPLATE = 3;
			
			const timerCheckTimeout = setTimeout(() => { 
				
				console.log("Washington - promiseGetTemplate - TIMEOUT de Aplicacao");
				clearTimeout(timerCheckTimeout);
				reject("Capture ERROR - TIMEOUT"); 
									
			}, 5000);					
			
			
			this.ServerService.getParametersData(PARAM_TEMPLATE)
			.subscribe((res: any) => {
				
					console.log("Washington - promiseGetTemplate - GetParametersData:PARAM_IMAGE OK");
				
					//console.log(res);
					this.result = res;

					// Resposta como dados Hexa em string
					const _bufferHexData = Buffer.from(res.data, "hex");
					//console.log("Hex Data: ", _bufferHexData.toString("hex"));

					const strBufferBase64 = _bufferHexData.toString('base64')
					//console.log("Base64: ", strBufferBase64.toString());
					
					var objConfigHex = { rawData : strBufferBase64};
					
					this.ServerService.cryptData(objConfigHex, PARAM_TEMPLATE, "")
					.subscribe((res: any) => {
							
							console.log("Washington - promiseGetTemplate - CryptData OK");

							//console.log(res);
							this.result = res;
							
							const encrypteddata:IEncryptedData = {
								encryptedData: {
																data: res.data,
																dataSize: res.dataSize,
																signature: res.signature
								}
							}					
					
							// _lumiService.setReaderInfo
							this.ScannerService.extract(encrypteddata)
							.subscribe((res: any) => {
								
									console.log("Washington - promiseGetTemplate - Extract OK");
								
									//console.log(res);
									this.result = res;	

									this.ServerService.decryptData(res.encryptedData, PARAM_TEMPLATE)
									.subscribe((res: any) => {
											
											console.log("Washington - promiseGetTemplate - DecryptData OK");

											var BufferTemplateDataPacket = Buffer.from(res.data, "base64");
											//console.log("BufferTemplateDataPacket: ", BufferTemplateDataPacket.toString("hex"));
											
											var dataDecrypt = "Dados Hex: " + BufferTemplateDataPacket.toString("hex");

											//*******************************************************************
											// Washington - Template
											//*******************************************************************
											// Resposta = Payload = TemplateDataPacket = { TemplateHeader + TemplateData}
											//
											// 	ImageHeader = { ANSOL + TemplateMode + RecordMode + SpoofScore + TemplateDataSize} = 32 Bytes
											// 	Onde:
											// 		ANSOL = 						16 bytes						u128 nANSOL;						// Random number generated by trusted host
											// 		TemplateMode = 			04 bytes     				u32  nTemplateMode;  		// The mode of the template data returned (_V100_ENC_IMAGE_MODE). Either IMAGE_RAW or IMAGE_WSQ_COMPRESSED
											// 		RecordMode = 				04 bytes    				u32  nRecordMode;  			// How to wrap the template data(_V100_ENC_RECORD_MODE). Either RAW_RECORD or BIR_RECORD 
											// 		SpoofScore = 				04 bytes    				u32  nSpoofScore;				// Spoof Score(u32 max will indicate spoof is turned off)
											//		TemplateDataSize = 	04 bytes 						u32  nTemplateDataSize;	// Template data size in bytes
											//
											//	TemplateData = {...Data...}
											
											//*******************************************************************
											// Tem que desconsiderar 32 bytes...
											//*******************************************************************										
											
											const SizeANSOL = 16;
											const SizeTemplateMode = 4;
											const SizeRecordMode = 4;
											const SizeSpoofScore = 4;
											const SizeTemplateDataSize = 4;
											const SizeTemplateHeader = SizeANSOL + SizeTemplateMode + SizeRecordMode + SizeSpoofScore +  SizeTemplateDataSize;
																					
											var BufferANSOL = Buffer.alloc(SizeANSOL);
											var BufferTemplateMode = Buffer.alloc(SizeTemplateMode);
											var BufferRecordMode = Buffer.alloc(SizeRecordMode);
											var BufferSpoofScore = Buffer.alloc(SizeSpoofScore);
											var BufferTemplateDataSize = Buffer.alloc(SizeTemplateDataSize);
											var BufferTemplateHeader = Buffer.alloc(SizeTemplateHeader);
											var BufferTemplateData = Buffer.alloc(BufferTemplateDataPacket.length - SizeTemplateHeader);											
											
											//******************************************************************
											// Pega TemplateHeader
											//******************************************************************
											BufferTemplateDataPacket.copy(BufferTemplateHeader, 0, 0, SizeTemplateHeader);
											//console.log("BufferTemplateDataPacket: ", BufferTemplateHeader.toString("hex"));
											
											//******************************************************************
											// Pega ANSOL
											//******************************************************************
											BufferTemplateHeader.copy(BufferANSOL, 0, 0, SizeANSOL);
											//console.log("BufferANSOL: ", BufferANSOL.toString("hex"));

											//******************************************************************
											// Pega ImageMode
											//******************************************************************
											BufferTemplateHeader.copy(BufferTemplateMode, 0, SizeANSOL, (SizeANSOL + SizeTemplateMode));
											//console.log("BufferTemplateMode: ", BufferTemplateMode.toString("hex"));
											var intTemplateMode = this.fncConvertU32(BufferTemplateMode);
											
											//******************************************************************
											// Pega RecordMode
											//******************************************************************
											BufferTemplateHeader.copy(BufferRecordMode, 0, (SizeANSOL + SizeTemplateMode), (SizeANSOL + SizeTemplateMode + SizeRecordMode));
											//console.log("BufferRecordMode: ", BufferRecordMode.toString("hex"));
											var intRecordMode = this.fncConvertU32(BufferRecordMode);										
											
											//******************************************************************
											// Pega SpoofScore
											//******************************************************************
											BufferTemplateHeader.copy(BufferSpoofScore, 0, (SizeANSOL + SizeTemplateMode + SizeRecordMode), (SizeANSOL + SizeTemplateMode + SizeRecordMode + SizeSpoofScore));
											//console.log("BufferSpoofScore: ", BufferSpoofScore.toString("hex"));
											var intSpoofScore = this.fncConvertU32(BufferSpoofScore);
											
											//******************************************************************
											// Pega ImageDataSize
											//******************************************************************
											BufferTemplateHeader.copy(BufferTemplateDataSize, 0, (SizeANSOL + SizeTemplateMode + SizeRecordMode + SizeSpoofScore), (SizeANSOL + SizeTemplateMode + SizeRecordMode + SizeSpoofScore + SizeTemplateDataSize));
											//console.log("BufferTemplateDataSize: ", BufferTemplateDataSize.toString("hex"));										
											var intTemplateDataSize = this.fncConvertU32(BufferTemplateDataSize);
											
											const templateCapturedInfosTemp = {
												'ANSOL(hex)' : BufferANSOL.toString("hex"),
												'TemplateMode': intTemplateMode,
												'RecordMode': intRecordMode,
												'SpoofScore': intSpoofScore,
												'TemplateDataSize': intTemplateDataSize
											}
											
											//this.templateCapturedInfos = JSON.stringify(templateCapturedInfosTemp);	

											//******************************************************************
											// Pega TemplateData
											//******************************************************************
											BufferTemplateDataPacket.copy(BufferTemplateData, 0, SizeTemplateHeader);
											//console.log("BufferTemplateData: ", BufferTemplateData.toString("hex"));
											
											//this.templateCaptured = JSON.stringify(BufferTemplateData.toString("hex"));

											this.currenttemplatebase64 = BufferTemplateData.toString('base64');
											
											this.fncScannerSaveFingerCapturedTemplate();

											clearTimeout(timerCheckTimeout);
											resolve("getTemplate promise resolved");
														
										},
										(error) => {
											console.log("Washington - DecryptData ERROR");
											this.error = error;
											clearTimeout(timerCheckTimeout);
											reject("getTemplate promise rejected");
										}
									)	
																	
								},
								(error) => {
									console.log("Washington - promiseGetTemplate - Extract ERROR");
									this.error = error;
									clearTimeout(timerCheckTimeout);
									reject("getTemplate promise rejected");
								}
							)							
							
						},
						(error) => {
							console.log("Washington - promiseGetTemplate - CryptData ERROR");
							this.error = error; 
							clearTimeout(timerCheckTimeout);
							reject("getTemplate promise rejected");
						}
					)				
					
				},
				(error) => {
					console.log("Washington - promiseGetTemplate - GetParametersData ERROR");
					this.error = error;
					clearTimeout(timerCheckTimeout);
					reject("getTemplate promise rejected");			
				}
			)					

		});							
		
	}	
		
	
	
	
	
	//###########################################################
	// CAM WEBSERVICE FUNCTIONS
	//###########################################################	
	
	//***********************************************************
	// fncCamWebSocketConnect
	//***********************************************************		
	fncCamWebSocketConnect(){	
	
    const self = this;
    self.eventBusCam = new EventBus(this.hostCam + '/ws');
    self.eventBusCam.onopen = function () {

      // set a handler to receive a message
      self.eventBusCam.registerHandler('ws-to-client', function (error, message) {		
				
				if(message){
				
					self.strTimestamp = Math.round(new Date().getTime()/1000);
					//console.log('Timestamp: ', self.strTimestamp);
					
					//console.log('Received a Message: ', JSON.stringify(message));	
					
					self.objMessage = JSON.parse(message.body);
					
					self.strTipoEvento = self.objMessage.eventType;
					//console.log('Tipo Evento: ', self.strTipoEvento);

					self.strMensagem = self.objMessage.message;
					//console.log('Mensagem: ', self.strMensagem);					
					
					if((self.strTipoEvento == "faceEventListener") || (self.strTipoEvento == "captureEventListener")){
						
						if(self.strTipoEvento == "faceEventListener"){

							if(self.strMensagem == "faceImagePreview"){
								
								self.strImage = self.objMessage.image.Image;
								//console.log('Image: ', self.strImage);									
								
								//self.showWebSocketPosition(self.strMessage);
								
								// ANTIGO
								self.fncCamShowImageFromWebSocket(self.strImage);
								
							}

						}
						else{
							
							if(self.strMensagem == "0"){
								
								self.strImage = self.objMessage.image.Image;
								console.log('Image: ', self.strImage);									
								
								self.fncCamCaptureImageFromWebSocket(self.strImage);							
								
							}
							
						}
						
						
					}
	
				}
				
      });
			
    };
		
    self.eventBusCam.enableReconnect(true);		
	
	}


	//***********************************************************
	// fncCamWebSocketConnect2
	//***********************************************************		
	fncCamWebSocketConnect2(){	
	
    const self = this;
    self.eventBusCam = new EventBus(this.hostCam + '/ws');
    self.eventBusCam.onopen = function () {

      // set a handler to receive a message
      self.eventBusCam.registerHandler('ws-to-client', function (error, message) {		
				
				if(message){
				
					self.strTimestamp = Math.round(new Date().getTime()/1000);
					//console.log('Timestamp: ', self.strTimestamp);
					
					//console.log('Received a Message: ', JSON.stringify(message));	
					
					self.objMessage = JSON.parse(message.body);
					
					self.strTipoEvento = self.objMessage.eventType;
					console.log('Tipo Evento: ', self.strTipoEvento);

					self.strMensagem = self.objMessage.message;
					console.log('Mensagem: ', self.strMensagem);


					if (typeof self.objMessage.image !== 'undefined') {
						self.strImage = self.objMessage.image.Image;
					}
					else{
						self.strImage = "";
					}

					self.fncCamWebSocketParseMessageAndExtractInfos(self.strTipoEvento, self.strMensagem, self.strImage);
					
				}
				
      });
			
    };
		
    self.eventBusCam.enableReconnect(true);		
	
	}		
	
	//***********************************************************
	// fncCamWebSocketParseMessageAndExtractInfos
	//***********************************************************		
	fncCamWebSocketParseMessageAndExtractInfos(strTipoEvento, strMensagem, strImage){
		
		if((strTipoEvento == "faceEventListener") || (strTipoEvento == "captureEventListener")){
			
			if(strTipoEvento == "faceEventListener"){

				if(strMensagem == "faceImagePreview"){

					this.fncCamShowImageFromWebSocket(strImage);
					
				}

			}
			else{
				
				if(strMensagem == "0"){						
					
					this.fncCamCaptureImageFromWebSocket(strImage);
					
					// Emitindo Evento
					console.log("Washington - parseWebSocketMessage - Emitindo Evento de Captura Completa");
					this.subject2.next("Capture_complete_ok");									

				}
				
			}
			
			
		}
			
		
	}
	
	//***********************************************************
	// fncCamShowImageFromWebSocket
	//***********************************************************			
	fncCamShowImageFromWebSocket(imagem) {
    
		// Exemplo com Imagem
		this.livrePreviewDataImage = this.getSantizeUrl('data:image/bmp;base64,' + imagem);
		
	}

	//***********************************************************
	// fncCamCaptureImageFromWebSocket
	//***********************************************************	
	fncCamCaptureImageFromWebSocket(imagem){
		
		// Parameter imagem - vem em base 64
		
		this.finalPhotoDataImage = this.getSantizeUrl('data:image/bmp;base64,' + imagem);
		this.portraitDataImage = this.getSantizeUrl('data:image/bmp;base64,' + imagem);
		
		const imageBase64:any = {
			bmpDataImage: {
										 data: imagem
			}
		}			
		
		this.CamService.convertImageBmpToJpg(imageBase64)
		.subscribe((res: any) => {
				console.log("Washington - convertImageBmpToJpg OK");
				//console.log(res);
				
				this.captureImageJpg = res.imageData;
				
			},
			(error) => {
				console.log("Washington - convertImageBmpToJpg ERROR");
			}
		)		
		
	}	
	
	//***********************************************************
	// fncCamInitialize
	//***********************************************************			
	fncCamInitialize(){
		
		var result;		
		
		this.fncCamWebSocketConnect2();
		
		result = this.fncCamWebServiceInitialize();	

	}
	
	//***********************************************************
	// fncCamWebServiceInitialize
	//***********************************************************		
	fncCamWebServiceInitialize(){
		
		var initializeStatus = this.STATUR_ERROR_OK;
				
    this.CamService.initializeIsActive()
		.subscribe((res: any) => {
				
				console.log(res);
				
				if(res.statuscode == 0){
				
					console.log("Washington - InitializeIsActive OK");
				
					if(res.initializeIsActive == false){

						this.CamService.initializeCamera()
						.subscribe((res: IResponse) => {
								
								console.log(res);
								
								if(res.statuscode == 0){
								
									console.log("Washington - InitializeCamera OK");
								
									this.cameraOptions = {
										"info" : "MODE=MANUAL"
									};	
									
									this.CamService.setCameraOptions(this.cameraOptions)
									.subscribe((res: IResponse) => {
											
											console.log(res);
											
											if(res.statuscode == 0){
												console.log("Washington - SetCameraOptions OK");
												this.fncShowNotificationSuccess("Camera inicializada com SUCESSO...");				
											}
											else{
												initializeStatus = this.STATUS_ERROR_CAM_SET_OPTIONS;
												this.fncCamMostraMsgStatus(initializeStatus);
												console.log("Washington - SetCameraOptions ERROR");												
											}
											
										},
										(error) => {
											initializeStatus = this.STATUS_ERROR_CAM_SET_OPTIONS;
											this.fncCamMostraMsgStatus(initializeStatus);
											console.log("Washington - SetCameraOptions ERROR");
										}
									)							
								}
								else{
									initializeStatus = this.STATUS_ERROR_CAM_INITIALIZE;
									this.fncCamMostraMsgStatus(initializeStatus);
									console.log("Washington - InitializeCamera ERROR");									
								}
								
							},
							(error) => {
								initializeStatus = this.STATUS_ERROR_CAM_INITIALIZE;
								this.fncCamMostraMsgStatus(initializeStatus);
								console.log("Washington - InitializeCamera ERROR");
							}
						)
						
					}
					else{
						
						this.cameraOptions = {
							"info" : "MODE=MANUAL"
						};	
						
						this.CamService.setCameraOptions(this.cameraOptions)
						.subscribe((res: IResponse) => {
								
								console.log(res);
								
								if(res.statuscode == 0){
									console.log("Washington - SetCameraOptions OK");
									this.fncShowNotificationSuccess("Camera inicializada com SUCESSO...");	
								}
								else{
									initializeStatus = this.STATUS_ERROR_CAM_SET_OPTIONS;
									this.fncCamMostraMsgStatus(initializeStatus);
									console.log("Washington - SetCameraOptions ERROR");												
								}
								
							},
							(error) => {
								initializeStatus = this.STATUS_ERROR_CAM_SET_OPTIONS;
								this.fncCamMostraMsgStatus(initializeStatus);
								console.log("Washington - SetCameraOptions ERROR");
							}
						)							
						
					}
			
				}
				else{
					initializeStatus = this.STATUS_ERROR_CAM_INITIALIZE_IS_ACTIVE;
					this.fncCamMostraMsgStatus(initializeStatus);
					console.log("Washington - InitializeIsActive ERROR");					
				}
		},
			(error) => {
				initializeStatus = this.STATUS_ERROR_CAM_INITIALIZE_IS_ACTIVE;
				this.fncCamMostraMsgStatus(initializeStatus);
				console.log("Washington - InitializeIsActive ERROR");
			}
		)		
		
		return initializeStatus;
		
	}
	
	//***********************************************************
	// fncCamWebSetCameraOptions
	//***********************************************************		
	fncCamWebServiceSetCameraOptions(){

    this.cameraOptions = {
			"info" : "MODE=MANUAL"
    };	

		var setCameraOptionStatus = this.STATUR_ERROR_OK;
		
		this.CamService.setCameraOptions(this.cameraOptions)
		.subscribe((res: IResponse) => {
				
				console.log(res);
				
				if(res.statuscode == 0){
					console.log("Washington - SetCameraOptions OK");
				}
				else{
					setCameraOptionStatus = this.STATUS_ERROR_CAM_SET_OPTIONS;
					this.fncCamMostraMsgStatus(setCameraOptionStatus);
					console.log("Washington - SetCameraOptions ERROR");					
				}
				
			},
			(error) => {
				setCameraOptionStatus = this.STATUS_ERROR_CAM_SET_OPTIONS;
				this.fncCamMostraMsgStatus(setCameraOptionStatus);
				console.log("Washington - SetCameraOptions ERROR");
			}
		)

		return setCameraOptionStatus;

	}
	
	//***********************************************************
	// fncCamWebStartCapture
	//***********************************************************		
	fncCamWebServiceStartCapture(){
		
		var startCaptureStatus = this.STATUR_ERROR_OK;

    this.CamService.captureIsActive()
		.subscribe((res: any) => {
			
			console.log(res);
			
			if(res.statuscode == 0){
			
				console.log("Washington - CaptureIsActive OK");
			
				if(res.captureIsActive == false){			

					console.log("Washington - Capture esta Inativa");
					
					console.log("Washington - Chamandp StartCapture");

					this.finalPhotoDataImage = "../../../assets/img/default-user.jpg";

					this.disableIniciarCaptura = true;
					this.disableCapturaManual = false;	
					this.disableCancelarCaptura = false;	

					this.CamService.startCapture(this.cameraId)
					.subscribe((res: any) => {
							
							// So acontece quando a captuar e completada...
							
							console.log(res);
							
							if(res.statuscode == 0){
								
								console.log("Washington - StartCapture OK");								
								
							}
							else{
								startCaptureStatus = this.STATUS_ERROR_CAM_START_CAPTURE;
								this.fncCamMostraMsgStatus(startCaptureStatus);
								console.log("Washington - StartCapture ERROR");									
							}

					},
						(error) => {
							startCaptureStatus = this.STATUS_ERROR_CAM_START_CAPTURE;
							this.fncCamMostraMsgStatus(startCaptureStatus);
							console.log("Washington - StartCapture ERROR");
						}
					)
				}
				else{
				
					console.log("Washington - Capture ja esta Ativa");			
				
				}
					
			}
			else{
				startCaptureStatus = this.STATUS_ERROR_CAM_CAPTURE_IS_ACTIVE;
				this.fncCamMostraMsgStatus(startCaptureStatus);
				console.log("Washington - CaptureIsActive ERROR");					
			}			
			
		},
			(error) => {
				startCaptureStatus = this.STATUS_ERROR_CAM_INITIALIZE_IS_ACTIVE;
				this.fncCamMostraMsgStatus(startCaptureStatus);
				console.log("Washington - CaptureIsActive ERROR");
			}
		)					
						
		return startCaptureStatus;			
		
	}
	
	//***********************************************************
	// fncCamWebStartCapture
	//***********************************************************		
	async fncCamWebServiceStartCapture2(){
		
		console.log("Washington - Entrou na fnc fncCamWebServiceStartCapture2");
		
		var startCaptureStatus = this.STATUR_ERROR_OK;

		console.log("Washington - Chamando captureIsActive");

    this.CamService.captureIsActive()
		.subscribe( async (res: any) => {
			
			console.log(res);
			
			if(res.statuscode == 0){
			
				console.log("Washington - CaptureIsActive OK");
			
				if(res.captureIsActive == false){			

					console.log("Washington - Capture esta Inativa");
					
					console.log("Washington - Chamando StartCapture");

					this.disableIniciarCaptura = true;
					this.disableCapturaManual = false;	
					this.disableCancelarCaptura = false;

					this.CamService.startCapture(this.cameraId)
					.subscribe((res: any) => {
							
							// So acontece quando a captuar e completada...
							
							console.log(res);
							
							if(res.statuscode == 0){
								
								console.log("Washington - StartCapture OK");								
								
							}
							else{
								startCaptureStatus = this.STATUS_ERROR_CAM_START_CAPTURE;
								this.fncCamMostraMsgStatus(startCaptureStatus);
								console.log("Washington - StartCapture ERROR");									
							}

					},
						(error) => {
							startCaptureStatus = this.STATUS_ERROR_CAM_START_CAPTURE;
							this.fncCamMostraMsgStatus(startCaptureStatus);
							console.log("Washington - StartCapture ERROR");
						}
					)
					
					if(startCaptureStatus == this.STATUR_ERROR_OK){
					
						//WASHINGTON - IMPLEMENTAR AQUI
						const execPromiseWaitCaptureComplete = async () => {
									
							console.log("Washington - startCapture - COMECOU WAIT_CAPTURE_COMPLETE");
				
							// Call promiseWaitCaptureComplete
							await this.promiseCamWaitCaptureComplete()
								.then(async (statusWaitCaptureComplete) => {
									
									console.log("Washington - startCapture - promise WaitCaptureComplete RESOLVED");
									
									this.disableIniciarCaptura = false;
									this.disableCapturaManual = true;	
									this.disableCancelarCaptura = true;	
									
								})
								.catch((statusWaitCaptureComplete) => {
									
									console.log("Washington - startCapture - " + statusWaitCaptureComplete);
																	
									this.finalPhotoDataImage = "../../../assets/img/default-user.jpg";

									this.disableIniciarCaptura = false;
									this.disableCapturaManual = true;	
									this.disableCancelarCaptura = true;	
									
									this.fncCamWebServiceStopCapture();
																		
									
								});	
						};
						
						await execPromiseWaitCaptureComplete();					
					
					}
					
				}
				else{
				
					console.log("Washington - Capture ja esta Ativa");			
				
				}
					
			}
			else{
				startCaptureStatus = this.STATUS_ERROR_CAM_CAPTURE_IS_ACTIVE;
				this.fncCamMostraMsgStatus(startCaptureStatus);
				console.log("Washington - CaptureIsActive ERROR");					
			}			
			
		},
			(error) => {
				startCaptureStatus = this.STATUS_ERROR_CAM_INITIALIZE_IS_ACTIVE;
				this.fncCamMostraMsgStatus(startCaptureStatus);
				console.log("Washington - CaptureIsActive ERROR");
			}
		)					
						
		return startCaptureStatus;			
		
	}	
	
	//***********************************************************
	// fncCamWebStopCapture
	//***********************************************************		
	fncCamWebServiceStopCapture(){

		var stopCaptureStatus = this.STATUR_ERROR_OK;
		
		this.CamService.stopCapture(this.cameraId)
		.subscribe((res: IResponse) => {
				
				console.log(res);
				
				if(res.statuscode == 0){
					console.log("Washington - StopCapture OK");
					
					this.livrePreviewDataImage = "";
					
					this.disableIniciarCaptura = false;
					this.disableCapturaManual = true;	
					this.disableCancelarCaptura = true;						
					
				}
				else{
					stopCaptureStatus = this.STATUS_ERROR_CAM_STOP_CAPTURE;
					this.fncCamMostraMsgStatus(stopCaptureStatus);
					console.log("Washington - StopCapture ERROR");					
				}
				
			},
			(error) => {
				stopCaptureStatus = this.STATUS_ERROR_CAM_STOP_CAPTURE;
				this.fncCamMostraMsgStatus(stopCaptureStatus);
				console.log("Washington - StopCapture ERROR");
			}
		)
		
		return stopCaptureStatus;

	}
	
	//***********************************************************
	// fncCamWebStopCapture
	//***********************************************************		
	async fncCamWebServiceStopCapture2(){

		console.log("Washington - Entrou na fnc fncCamWebServiceStopCapture2");

		var stopCaptureStatus = this.STATUR_ERROR_OK;

		//WASHINGTON - IMPLEMENTAR AQUI
		const execPromiseWaitStopCapture = async () => {
					
			console.log("Washington - startCapture - COMECOU WAIT_STOP_CAPTURE");

			// Call promiseCamStopCapture
			await this.promiseCamStopCapture()
				.then(async (statusWaitStopCapture) => {
					
					console.log("Washington - stopCapture - promise WaitStopCapture RESOLVED");

					this.livrePreviewDataImage = "";
					
					this.disableIniciarCaptura = false;
					this.disableCapturaManual = true;	
					this.disableCancelarCaptura = true;	

					
					
				})
				.catch((statusWaitStopCapture) => {
					
					console.log("Washington - stopCapture - promise WaitStopCapture REJECTED");
					
					console.log("Washington - stopCapture - " + statusWaitStopCapture);
													
					this.livrePreviewDataImage = "";
					
					this.disableIniciarCaptura = false;
					this.disableCapturaManual = true;	
					this.disableCancelarCaptura = true;	
					
					stopCaptureStatus = this.STATUS_ERROR_CAM_STOP_CAPTURE;
														
					
				});	
		};
		
		await execPromiseWaitStopCapture();

		return stopCaptureStatus;

	}	
	
	//***********************************************************
	// fncCamWebServiceManualCapture
	//***********************************************************	
	/*
	fncCamWebServiceManualCapture(){
		
		var manualCaptureStatus = this.STATUR_ERROR_OK;
		
		this.CamService.manualCapture(this.cameraId)
		.subscribe((res: IResponse) => {
				
				console.log(res);
				
				if(res.statuscode == 0){

					console.log("Washington - ManualCapture OK");
				
					this.CamService.captureIsActive()
					.subscribe((res: any) => {
							
							console.log(res);
							
							if(res.statuscode == 0){
							
								console.log("Washington - CaptureIsActive OK");
							
								if(res.captureIsActive == false){

									this.CamService.startCapture(this.cameraId)
									.subscribe((res: IResponse) => {
											
											console.log(res);
											
											if(res.statuscode == 0){
												console.log("Washington - StartCapture OK");
											}
											else{
												manualCaptureStatus = this.STATUS_ERROR_CAM_START_CAPTURE;
												this.fncCamMostraMsgStatus(manualCaptureStatus);
												console.log("Washington - StartCapture ERROR");												
											}
											
									},
										(error) => {
											manualCaptureStatus = this.STATUS_ERROR_CAM_START_CAPTURE;
											this.fncCamMostraMsgStatus(manualCaptureStatus);
											console.log("Washington - StartCapture ERROR");
										}
									)
									
								}
								
							}
							else{
								manualCaptureStatus = this.STATUS_ERROR_CAM_CAPTURE_IS_ACTIVE;
								this.fncCamMostraMsgStatus(manualCaptureStatus);
								console.log("Washington - StartCapture ERROR");								
							}
					},
						(error) => {
							manualCaptureStatus = this.STATUS_ERROR_CAM_CAPTURE_IS_ACTIVE;
							this.fncCamMostraMsgStatus(manualCaptureStatus);
							console.log("Washington - StartCapture ERROR");
						}
					)				
					
				}
				else{
					manualCaptureStatus = this.STATUS_ERROR_CAM_MANUAL_CAPTURE;
					this.fncCamMostraMsgStatus(manualCaptureStatus);
					console.log("Washington - ManualCapture ERROR");					
				}
			},
			(error) => {
				manualCaptureStatus = this.STATUS_ERROR_CAM_MANUAL_CAPTURE;
				this.fncCamMostraMsgStatus(manualCaptureStatus);
				console.log("Washington - ManualCapture ERROR");
			}
		)
		
		return manualCaptureStatus;		
		
	}
	*/
	
	//***********************************************************
	// fncCamWebServiceManualCapture
	//***********************************************************		
	fncCamWebServiceManualCapture(){
		
		var manualCaptureStatus = this.STATUR_ERROR_OK;
		
		this.CamService.manualCapture(this.cameraId)
		.subscribe((res: IResponse) => {
				
				console.log(res);
				
				if(res.statuscode == 0){

					console.log("Washington - ManualCapture OK");
					
					//this.livrePreviewDataImage = "";
					
					this.disableIniciarCaptura = false;
					this.disableCapturaManual = true;	
					this.disableCancelarCaptura = true;								

				}
				else{
					manualCaptureStatus = this.STATUS_ERROR_CAM_MANUAL_CAPTURE;
					this.fncCamMostraMsgStatus(manualCaptureStatus);
					console.log("Washington - ManualCapture ERROR");					
				}
			},
			(error) => {
				manualCaptureStatus = this.STATUS_ERROR_CAM_MANUAL_CAPTURE;
				this.fncCamMostraMsgStatus(manualCaptureStatus);
				console.log("Washington - ManualCapture ERROR");
			}
		)
		
		return manualCaptureStatus;		
		
	}	
	
	//***********************************************************
	// fncCamWebServiceManualCapture
	//***********************************************************		
	async fncCamWebServiceManualCapture2(){
		
		console.log("Washington - Entrou na fnc fncCamWebServiceManualCapture2");
		
		var manualCaptureStatus = this.STATUR_ERROR_OK;
		
		this.disableIniciarCaptura = true;
		this.disableCapturaManual = true;	
		this.disableCancelarCaptura = true;			
		
		//WASHINGTON - IMPLEMENTAR AQUI
		const execPromiseWaitManualCapture = async () => {
					
			console.log("Washington - manualCapture - COMECOU WAIT_MANUAL_CAPTURE");

			// Call promiseCamManualCapture
			await this.promiseCamManualCapture()
				.then(async (statusWaitManualCapture) => {
					
					console.log("Washington - manualCapture - promise WaitManualCapture RESOLVED");

					//this.livrePreviewDataImage = "";
					
					this.disableIniciarCaptura = false;
					this.disableCapturaManual = true;	
					this.disableCancelarCaptura = true;	
					
				})
				.catch((statusWaitManualCapture) => {
					
					console.log("Washington - manualCapture - promise promiseCamManualCapture REJECTED");
					
					console.log("Washington - manualCapture - " + statusWaitManualCapture);
													
					this.livrePreviewDataImage = "";
					
					this.disableIniciarCaptura = false;
					this.disableCapturaManual = true;	
					this.disableCancelarCaptura = true;	
					
					manualCaptureStatus = this.STATUS_ERROR_CAM_MANUAL_CAPTURE;
														
					
				});	
		};
		
		await execPromiseWaitManualCapture();

		return manualCaptureStatus;			
		
	}		
	
	//***********************************************************
	// fncCamMostraMsgStatus
	//***********************************************************		
	fncCamMostraMsgStatus(intResult){
		
		if(intResult != this.STATUR_ERROR_OK){
		
			switch(intResult) {
				
				case this.STATUS_ERROR_GLOBAL_GET_PARAMETERS:
					this.fncShowNotificationError('Scanner - ERROR_GET_PARAMETERS');
					break;
				case this.STATUS_ERROR_GLOBAL_ENCRYPT_DATA:
					this.fncShowNotificationError('Scanner - ERROR_ENCRYPT_DATA');
					break;
				case this.STATUS_ERROR_GLOBAL_DECRYPT_DATA:
					this.fncShowNotificationError('Scanner - ERROR_DECRYPT_DATA');
					break;
				case this.STATUS_ERROR_CAM_INITIALIZE:
					this.fncShowNotificationError('Camera - ERROR_CAM_INITIALIZE');
					break;	
				case this.STATUS_ERROR_CAM_SET_OPTIONS:
					this.fncShowNotificationError('Camera - ERROR_CAM_SET_OPTIONS');
					break;					
				case this.STATUS_ERROR_CAM_START_CAPTURE:
					this.fncShowNotificationError('Camera - ERROR_CAM_START_CAPTURE');
					break;	
				case this.STATUS_ERROR_CAM_STOP_CAPTURE:
					this.fncShowNotificationError('Camera - ERROR_CAM_STOP_CAPTURE');
					break;	
				case this.STATUS_ERROR_CAM_MANUAL_CAPTURE:
					this.fncShowNotificationError('Camera - ERROR_CAM_MANUAL_CAPTURE');
					break;					
				case this.STATUS_ERROR_CAM_INITIALIZE_IS_ACTIVE:
					this.fncShowNotificationError('Camera - ERROR_CAM_INITIALIZE_IS_ACTIVE');
					break;
				case this.STATUS_ERROR_CAM_CAPTURE_IS_ACTIVE:
					this.fncShowNotificationError('Camera - ERROR_CAM_CAPTURE_IS_ACTIVE');
					break;	
				case this.STATUS_ERROR_GLOBAL_RSA_DATA:
					this.fncShowNotificationError('Scanner - ERROR_GLOBAL_RSA_DATA');
					break;	
				default:
					this.fncShowNotificationError('Camera - ERROR_CAM_UNKNOWN');
					break;
			}			
		
		}
		
	}
	
	//**************************************************************
	// Function fncCamShowVideoAkys
	//**************************************************************		
	fncCamMostraVideoCapturado() {
		
		if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
		
			navigator.mediaDevices.enumerateDevices()
			.then(function(devices) {

				var objCamera = devices.find(device => ((device.kind == "videoinput") && (device.label == "USB Camera (30c6:0004)")));
				
				var strObjCamera = JSON.stringify(objCamera);
				
				console.log("Info objCamera" + strObjCamera);
				
				if (objCamera) {
					
					var constraints = { deviceId: { exact: objCamera.deviceId } };
					
					return navigator.mediaDevices.getUserMedia({ video: constraints });
					
				}
				else{
					alert('Sorry, Cam Akys not available.');
				}
			})
			.then(stream => this.videoElement.nativeElement.srcObject = stream)
			.catch(e => console.error(e));	

		} else {
				alert('Sorry, MediaDevices not available.');
		}		
		
	}	
	
	
	//**************************************************************
	// Function promiseCamStartCapture
	//**************************************************************	
	promiseCamStartCapture(){
		
		console.log("Washington - ENTROU na função promiseCamStartCapture...");
		
		return new Promise((resolve, reject) => {	

			const timerCheckTimeout = setTimeout(() => { 
				
				console.log("Washington - promiseCamStartCapture - TIMEOUT de Aplicacao");
				clearTimeout(timerCheckTimeout);
				reject("StartCapture ERROR - TIMEOUT"); 
									
			}, ( 2 * (60 * 1000)));	

			this.CamService.captureIsActive()
			.subscribe((res: any) => {
				
				console.log(res);
				
				if(res.statuscode == 0){
				
					console.log("Washington - CaptureIsActive OK");
				
					if(res.captureIsActive == false){			

						console.log("Washington - Capture esta Inativa");
						
						console.log("Washington - Chamando StartCapture");

						this.CamService.startCapture(this.cameraId)
						.subscribe((res: any) => {
								
								// So acontece quando a captuar e completada...
								
								console.log(res);
								
								if(res.statuscode == 0){
									
									console.log("Washington - StartCapture OK");

									clearTimeout(timerCheckTimeout);

									resolve("StartCapture OK");
									
								}
								else{
									//startCaptureStatus = this.STATUS_ERROR_CAM_START_CAPTURE;
									//this.fncCamMostraMsgStatus(startCaptureStatus);
									
									console.log("Washington - StartCapture ERROR");
									
									clearTimeout(timerCheckTimeout);
									
									reject("StartCapture ERROR - Start");
									
								}

						},
							(error) => {
								//startCaptureStatus = this.STATUS_ERROR_CAM_START_CAPTURE;
								//this.fncCamMostraMsgStatus(startCaptureStatus);
								console.log("Washington - StartCapture ERROR");
								
								clearTimeout(timerCheckTimeout);
								
								reject("StartCapture ERROR - Start");
							}
						)
					}
						
				}
				else{
					//startCaptureStatus = this.STATUS_ERROR_CAM_CAPTURE_IS_ACTIVE;
					//this.fncCamMostraMsgStatus(startCaptureStatus);
					console.log("Washington - CaptureIsActive ERROR");

					clearTimeout(timerCheckTimeout);

					reject("StartCapture ERROR - CaptureIsActive");
				}			
				
			},
				(error) => {
					//startCaptureStatus = this.STATUS_ERROR_CAM_INITIALIZE_IS_ACTIVE;
					//this.fncCamMostraMsgStatus(startCaptureStatus);
					console.log("Washington - CaptureIsActive ERROR");
					
					clearTimeout(timerCheckTimeout);
					
					reject("StartCapture ERROR - CaptureIsActive");
					
				}
			)					

		});		
		
	}
	
	//**************************************************************
	// Function promiseCamStopCapture
	//**************************************************************		
	promiseCamStopCapture(){
		
		console.log("Washington - ENTROU na função promiseCamStopCapture...");
		
		return new Promise((resolve, reject) => {
			
			const timerCheckTimeout = setTimeout(() => { 
				
				console.log("Washington - promiseCamStopCapture - TIMEOUT de Aplicacao");
				clearTimeout(timerCheckTimeout);
				reject("StopCapture ERROR - TIMEOUT"); 
									
			}, 5000);				
			
			this.CamService.stopCapture(this.cameraId)
			.subscribe((res: IResponse) => {
					
					console.log(res);
					
					if(res.statuscode == 0){
						
						console.log("Washington - StopCapture OK");

						console.log("Washington - Emitindo evento de StopCapture");
						
						// Emitindo evento de Cancelamento de Captura
						this.subject2.next("Capture_cancel_ok");

						clearTimeout(timerCheckTimeout);

						resolve("StopCapture OK");
						
					}
					else{
						//stopCaptureStatus = this.STATUS_ERROR_CAM_STOP_CAPTURE;
						//this.fncCamMostraMsgStatus(stopCaptureStatus);
						console.log("Washington - StopCapture ERROR");

						clearTimeout(timerCheckTimeout);

						reject("StopCapture ERROR");
						
					}
					
				},
				(error) => {
					//stopCaptureStatus = this.STATUS_ERROR_CAM_STOP_CAPTURE;
					//this.fncCamMostraMsgStatus(stopCaptureStatus);
					console.log("Washington - StopCapture ERROR");
					
					clearTimeout(timerCheckTimeout);
					
					reject("StopCapture ERROR");
					
				}
			)

		});			
		
	}
	
	//**************************************************************
	// Function promiseCamManualCapture
	//**************************************************************		
	promiseCamManualCapture(){
		
		console.log("Washington - ENTROU na função promiseCamManualCapture...");
		
		return new Promise((resolve, reject) => {

			const timerCheckTimeout = setTimeout(() => { 
				
				console.log("Washington - promiseCamStopCapture - TIMEOUT de Aplicacao");
				clearTimeout(timerCheckTimeout);
				reject("ManualCapture ERROR - TIMEOUT"); 
									
			}, (10 * 1000));	

			this.CamService.manualCapture(this.cameraId)
			.subscribe((res: IResponse) => {
					
					console.log(res);
					
					if(res.statuscode == 0){

						console.log("Washington - ManualCapture OK");

						clearTimeout(timerCheckTimeout);

						resolve("ManualCapture OK");

					}
					else{
						//manualCaptureStatus = this.STATUS_ERROR_CAM_MANUAL_CAPTURE;
						//this.fncCamMostraMsgStatus(manualCaptureStatus);
						console.log("Washington - ManualCapture ERROR");

						clearTimeout(timerCheckTimeout);

						reject("ManualCapture ERROR");
						
					}
				},
				(error) => {
					//manualCaptureStatus = this.STATUS_ERROR_CAM_MANUAL_CAPTURE;
					//this.fncCamMostraMsgStatus(manualCaptureStatus);
					console.log("Washington - ManualCapture ERROR");
					
					clearTimeout(timerCheckTimeout);					
					
					reject("ManualCapture ERROR");
					
				}
			)

		});			
		
	}
	
	//**************************************************************
	// Function promiseCamWaitCaptureComplete
	//**************************************************************		
	promiseCamWaitCaptureComplete(){
		
		console.log("Washington - ENTROU na função promiseCamWaitCaptureComplete...");
		
		return new Promise((resolve, reject) => {
			
			console.log("Washington - promiseCamWaitCaptureComplete - Ligando o timeout..");
			
			const timerCheckTimeout = setTimeout(() => { 
				
				console.log("Washington - promiseCamWaitCaptureComplete - TIMEOUT de Aplicacao");
				clearTimeout(timerCheckTimeout);
				reject("Capture ERROR - TIMEOUT"); 
									
			}, 65000);			

			// Handle Capture Event Complete
			this.subject2.pipe(take(1)).subscribe((data) => {
				
				console.log("Washington - promiseCamWaitCaptureComplete - Subscriber - Recebeu Evento:" + data);
				
				if(data == "Capture_complete_ok"){
				
					console.log("Washington - promiseCamWaitCaptureComplete - Capture OK");
					
					clearTimeout(timerCheckTimeout);
					resolve("Capture OK");
				
				}
				else if(data == "Capture_cancel_ok"){
				
					console.log("Washington - promiseCamWaitCaptureComplete - Capture Cancel OK");
					
					clearTimeout(timerCheckTimeout);
					resolve("Capture Cancel OK");
				
				}				
				else{
					
					console.log("Washington - promiseCamWaitCaptureComplete - Capture ERROR");
					clearTimeout(timerCheckTimeout);
					reject("Capture ERROR - ERROR");							

				}	

			});
			
			// Reset Handle Capture Event
			//this.subject.unsubscribe();

		});			
		
	}
	
	
	
	
	
	
	
	
	//###########################################################
	// GERAL FUNCTIONS
	//###########################################################

	//***********************************************************
	// SHOW DIVS
	//***********************************************************
	
	//***********************************************************
	// fncShowBiographicalInformationPage
	//***********************************************************		
	fncShowBiographicalInformationPage(){
		
		this.propBiographicalInformationHidden = false;
		this.propFingersEnrollmentHidden = true;
		this.propFaceEnrollmentHidden = true;
		this.propConfirmDetailsHidden = true;			
		
	}
	
	//***********************************************************
	// fncShowFingersEnrollmentPage
	//***********************************************************		
	fncShowFingersEnrollmentPage(){
		
		this.propBiographicalInformationHidden = true;
		this.propFingersEnrollmentHidden = false;
		this.propFaceEnrollmentHidden = true;
		this.propConfirmDetailsHidden = true;			
		
	}

	//***********************************************************
	// fncShowFaceEnrollmentPage
	//***********************************************************	
	fncShowFaceEnrollmentPage(){
		
		this.propBiographicalInformationHidden = true;
		this.propFingersEnrollmentHidden = true;
		this.propFaceEnrollmentHidden = false;
		this.propConfirmDetailsHidden = true;			
		
	}
	
	//***********************************************************
	// fncShowConfirmDetailsPage
	//***********************************************************		
	fncShowConfirmDetailsPage(){
		
		this.propBiographicalInformationHidden = true;
		this.propFingersEnrollmentHidden = true;
		this.propFaceEnrollmentHidden = true;
		this.propConfirmDetailsHidden = false;			
		
	}	
	
	
	
	
	
	//***********************************************************
	// NAVIGATE
	//***********************************************************
	
	//***********************************************************
	// fncCallBiographicalInformationPage
	//***********************************************************		
	fncCallBiographicalInformationPage(){
		this.fncShowBiographicalInformationPage();
	}
	
	//***********************************************************
	// fncCallFingersEnrollmentPage
	//***********************************************************	
	fncCallFingersEnrollmentPage(){
		
		this.fncShowFingersEnrollmentPage();
		
		this.livrePreviewDataImage = "";
		
		var result;
		
		result = this.fncCamWebServiceStopCapture();
		
		if(result != this.STATUR_ERROR_OK){
			this.fncCamMostraMsgStatus(result);
		}				
		
	}	
	
	//***********************************************************
	// fncCallFaceEnrollmentPage
	//***********************************************************			
	fncCallFaceEnrollmentPage(){
		
		this.fncShowFaceEnrollmentPage();

	}		
	
	//***********************************************************
	// fncCallConfirmDetailsPage
	//***********************************************************
	fncCallConfirmDetailsPage(){
		
		this.fncShowConfirmDetailsPage();		

		this.livrePreviewDataImage = "";
		
		var result;
		
		result = this.fncCamWebServiceStopCapture();
		
		if(result != this.STATUR_ERROR_OK){
			this.fncCamMostraMsgStatus(result);
		}			
		
	}

	
	
	
	
	//***********************************************************
	// BIOGRAPHICAL
	//***********************************************************

	//***********************************************************
	// fncClearBiographicalInformationFields
	//***********************************************************
	fncClearBiographicalInformationFields(){
		
		this.selectedValueUFRG	= null;
		this.selectedValueUF	= null;
		this.selectedValueSexo	= null;	
		
		this.cpfnumber = "";
		this.rgnumber = "";
		this.tituloeleitornumber = "";
		this.ufrg = "";
		this.unidade = "";
		this.datanascimento = "";
		this.municipionascimento = "";
		this.uf = "";
		this.beneficionome = "";
		this.beneficionumero = "";
		this.firstname = "";
		this.lastname = ""
		this.mothername = ""
		this.fathername = ""
		this.sexo = "";
		this.matricula = "";
		this.dataemissao = "";
		
	}
	
	
	//***********************************************************
	// FINGER
	//***********************************************************	
	
	//***********************************************************
	// fncCaptureRightLittle
	//***********************************************************	
	async fncCaptureRightLittle(){
		
		//alert("RightLittle");
		
		var result;
		
		this.currenthand = "right";
		this.currentfinger = "little";
		this.currentwsqimagebase64 = "";
		this.currentjpgimagebase64 = "";
		this.currenttemplatebase64 = "";
		
		this.structFingerTagRL.dedo.dedoAusente = "0";
		this.structFingerTagRL.dedo.idDedo = "rl";
		this.structFingerTagRL.dedo.imagem = "";
		this.structFingerTagRL.dedo.qualidade = "";
		this.structFingerTagRL.dedo.template = "";			

		if(this.TEST_MODE == "VERSAO_01"){
			result = this.fncScannerWebServiceStartCapture();
		}
		else if(this.TEST_MODE == "VERSAO_02"){
			result = await this.fncScannerWebServiceStartCapture2();
		}
		else{
			result = await this.fncScannerWebServiceStartCapture3();
		}
		
		//if(result != this.STATUR_ERROR_OK){
		//	this.fncScannerMostraMsgStatus(result);
		//}
				
	}

	//***********************************************************
	// fncCaptureRightRing
	//***********************************************************
	async fncCaptureRightRing(){
		
		//alert("RightRing");
		
		var result;
		
		this.currenthand = "right";
		this.currentfinger = "ring";	
		this.currentwsqimagebase64 = "";
		this.currentjpgimagebase64 = "";
		this.currenttemplatebase64 = "";
		
		this.structFingerTagRR.dedo.dedoAusente = "0";
		this.structFingerTagRR.dedo.idDedo = "rr";
		this.structFingerTagRR.dedo.imagem = "";
		this.structFingerTagRR.dedo.qualidade = "";
		this.structFingerTagRR.dedo.template = "";				
		
		if(this.TEST_MODE == "VERSAO_01"){
			result = this.fncScannerWebServiceStartCapture();
		}
		else if(this.TEST_MODE == "VERSAO_02"){
			result = await this.fncScannerWebServiceStartCapture2();
		}
		else{
			result = await this.fncScannerWebServiceStartCapture3();
		}
		
		//if(result != this.STATUR_ERROR_OK){
		//	this.fncScannerMostraMsgStatus(result);
		//}		
		
	}
	
	//***********************************************************
	// fncCaptureRightMiddle
	//***********************************************************	
	async fncCaptureRightMiddle(){
		
		//alert("RightMiddle");
		
		var result;
		
		this.currenthand = "right";
		this.currentfinger = "middle";
		this.currentwsqimagebase64 = "";
		this.currentjpgimagebase64 = "";
		this.currenttemplatebase64 = "";
		
		this.structFingerTagRM.dedo.dedoAusente = "0";
		this.structFingerTagRM.dedo.idDedo = "rm";
		this.structFingerTagRM.dedo.imagem = "";
		this.structFingerTagRM.dedo.qualidade = "";
		this.structFingerTagRM.dedo.template = "";			
		
		if(this.TEST_MODE == "VERSAO_01"){
			result = this.fncScannerWebServiceStartCapture();
		}
		else if(this.TEST_MODE == "VERSAO_02"){
			result = await this.fncScannerWebServiceStartCapture2();
		}
		else{
			result = await this.fncScannerWebServiceStartCapture3();
		}
		
		//if(result != this.STATUR_ERROR_OK){
		//	this.fncScannerMostraMsgStatus(result);
		//}		
		
	}
	
	//***********************************************************
	// fncCaptureRightIndex
	//***********************************************************	
	async fncCaptureRightIndex(){
		
		//alert("RightIndex");
		
		var result;
		
		this.currenthand = "right";
		this.currentfinger = "index";
		this.currentwsqimagebase64 = "";
		this.currentjpgimagebase64 = "";
		this.currenttemplatebase64 = "";

		this.structFingerTagRI.dedo.dedoAusente = "0";
		this.structFingerTagRI.dedo.idDedo = "ri";
		this.structFingerTagRI.dedo.imagem = "";
		this.structFingerTagRI.dedo.qualidade = "";
		this.structFingerTagRI.dedo.template = "";				
		
		if(this.TEST_MODE == "VERSAO_01"){
			result = this.fncScannerWebServiceStartCapture();
		}
		else if(this.TEST_MODE == "VERSAO_02"){
			result = await this.fncScannerWebServiceStartCapture2();
		}
		else{
			result = await this.fncScannerWebServiceStartCapture3();
		}
		
		//if(result != this.STATUR_ERROR_OK){
		//	this.fncScannerMostraMsgStatus(result);
		//}		
		
	}
	
	//***********************************************************
	// fncCaptureRightThumb
	//***********************************************************	
	async fncCaptureRightThumb(){
		
		//alert("RightThumb");
		
		var result;
		
		this.currenthand = "right";
		this.currentfinger = "thumb";
		this.currentwsqimagebase64 = "";
		this.currentjpgimagebase64 = "";
		this.currenttemplatebase64 = "";
		
		this.structFingerTagRT.dedo.dedoAusente = "0";
		this.structFingerTagRT.dedo.idDedo = "rt";
		this.structFingerTagRT.dedo.imagem = "";
		this.structFingerTagRT.dedo.qualidade = "";
		this.structFingerTagRT.dedo.template = "";			
		
		if(this.TEST_MODE == "VERSAO_01"){
			result = this.fncScannerWebServiceStartCapture();
		}
		else if(this.TEST_MODE == "VERSAO_02"){
			result = await this.fncScannerWebServiceStartCapture2();
		}
		else{
			result = await this.fncScannerWebServiceStartCapture3();
		}
		
		//if(result != this.STATUR_ERROR_OK){
		//	this.fncScannerMostraMsgStatus(result);
		//}		
		
	}
	
	//***********************************************************
	// fncCaptureLeftIndex
	//***********************************************************		
	async fncCaptureLeftIndex(){
		
		//alert("LeftIndex");
		
		var result;
		
		this.currenthand = "left";
		this.currentfinger = "index";
		this.currentwsqimagebase64 = "";
		this.currentjpgimagebase64 = "";
		this.currenttemplatebase64 = "";

		this.structFingerTagLI.dedo.dedoAusente = "0";
		this.structFingerTagLI.dedo.idDedo = "li";
		this.structFingerTagLI.dedo.imagem = "";
		this.structFingerTagLI.dedo.qualidade = "";
		this.structFingerTagLI.dedo.template = "";			
		
		if(this.TEST_MODE == "VERSAO_01"){
			result = this.fncScannerWebServiceStartCapture();
		}
		else if(this.TEST_MODE == "VERSAO_02"){
			result = await this.fncScannerWebServiceStartCapture2();
		}
		else{
			result = await this.fncScannerWebServiceStartCapture3();
		}
		
		//if(result != this.STATUR_ERROR_OK){
		//	this.fncScannerMostraMsgStatus(result);
		//}		
		
	}
	
	//***********************************************************
	// fncCaptureLeftMiddle
	//***********************************************************			
	async fncCaptureLeftMiddle(){
		
		//alert("LeftMiddle");
		
		var result;
		
		this.currenthand = "left";
		this.currentfinger = "middle";
		this.currentwsqimagebase64 = "";
		this.currentjpgimagebase64 = "";
		this.currenttemplatebase64 = "";

		this.structFingerTagLM.dedo.dedoAusente = "0";
		this.structFingerTagLM.dedo.idDedo = "lm";
		this.structFingerTagLM.dedo.imagem = "";
		this.structFingerTagLM.dedo.qualidade = "";
		this.structFingerTagLM.dedo.template = "";	
		
		if(this.TEST_MODE == "VERSAO_01"){
			result = this.fncScannerWebServiceStartCapture();
		}
		else if(this.TEST_MODE == "VERSAO_02"){
			result = await this.fncScannerWebServiceStartCapture2();
		}
		else{
			result = await this.fncScannerWebServiceStartCapture3();
		}
		
		//if(result != this.STATUR_ERROR_OK){
		//	this.fncScannerMostraMsgStatus(result);
		//}		
		
	}
	
	//***********************************************************
	// fncCaptureLeftRing
	//***********************************************************		
	async fncCaptureLeftRing(){
		
		//alert("LeftRing");
		
		var result;
		
		this.currenthand = "left";
		this.currentfinger = "ring";
		this.currentwsqimagebase64 = "";
		this.currentjpgimagebase64 = "";
		this.currenttemplatebase64 = "";

		this.structFingerTagLR.dedo.dedoAusente = "0";
		this.structFingerTagLR.dedo.idDedo = "lr";
		this.structFingerTagLR.dedo.imagem = "";
		this.structFingerTagLR.dedo.qualidade = "";
		this.structFingerTagLR.dedo.template = "";	

		if(this.TEST_MODE == "VERSAO_01"){
			result = this.fncScannerWebServiceStartCapture();
		}
		else if(this.TEST_MODE == "VERSAO_02"){
			result = await this.fncScannerWebServiceStartCapture2();
		}
		else{
			result = await this.fncScannerWebServiceStartCapture3();
		}

		//if(result != this.STATUR_ERROR_OK){
		//	this.fncScannerMostraMsgStatus(result);
		//}
		
	}
	
	//***********************************************************
	// fncCaptureLeftLittle
	//***********************************************************		
	async fncCaptureLeftLittle(){
		
		//alert("LeftLittle");
		
		var result;
		
		this.currenthand = "left";
		this.currentfinger = "little";
		this.currentwsqimagebase64 = "";
		this.currentjpgimagebase64 = "";
		this.currenttemplatebase64 = "";

		this.structFingerTagLL.dedo.dedoAusente = "0";
		this.structFingerTagLL.dedo.idDedo = "ll";
		this.structFingerTagLL.dedo.imagem = "";
		this.structFingerTagLL.dedo.qualidade = "";
		this.structFingerTagLL.dedo.template = "";	

		if(this.TEST_MODE == "VERSAO_01"){
			result = this.fncScannerWebServiceStartCapture();
		}
		else if(this.TEST_MODE == "VERSAO_02"){
			result = await this.fncScannerWebServiceStartCapture2();
		}
		else{
			result = await this.fncScannerWebServiceStartCapture3();
		}
		
		//if(result != this.STATUR_ERROR_OK){
		//	this.fncScannerMostraMsgStatus(result);
		//}		
		
	}
	
	//***********************************************************
	// fncCaptureLeftThumb
	//***********************************************************		
	async fncCaptureLeftThumb(){
		
		//alert("LeftThumb");
		
		var result;
		
		this.currenthand = "left";
		this.currentfinger = "thumb";
		this.currentwsqimagebase64 = "";
		this.currentjpgimagebase64 = "";
		this.currenttemplatebase64 = "";	

		this.structFingerTagLT.dedo.dedoAusente = "0";
		this.structFingerTagLT.dedo.idDedo = "lt";
		this.structFingerTagLT.dedo.imagem = "";
		this.structFingerTagLT.dedo.qualidade = "";
		this.structFingerTagLT.dedo.template = "";	

		if(this.TEST_MODE == "VERSAO_01"){
			result = this.fncScannerWebServiceStartCapture();
		}
		else if(this.TEST_MODE == "VERSAO_02"){
			result = await this.fncScannerWebServiceStartCapture2();
		}
		else{
			result = await this.fncScannerWebServiceStartCapture3();
		}
		
		//if(result != this.STATUR_ERROR_OK){
		//	this.fncScannerMostraMsgStatus(result);
		//}		
		
	}
	
	//***********************************************************
	// fncCancelCaptureFinger
	//***********************************************************			
	async fncCancelCaptureFinger(){
		
		var result;
		
		this.currenthand = "";
		this.currentfinger = "";		
		
		result = await this.fncScannerWebServiceStopCapture();
		
		if(result != this.STATUR_ERROR_OK){
			this.fncScannerMostraMsgStatus(result);
		}		
		
	}
	

	
	
	
	//***********************************************************
	// FACE
	//***********************************************************
	
	//***********************************************************
	// fncTakeManualImage
	//***********************************************************		
	async fncTakeManualImage(){
		
		var result;
		
		result = await this.fncCamWebServiceManualCapture2();
		
		if(result != this.STATUR_ERROR_OK){
			this.fncCamMostraMsgStatus(result);
		}		
		
	}
	
	//***********************************************************
	// fncStartCaptureImage
	//***********************************************************			
	async fncStartCaptureImage(){
		
		var result;
		
		result = await this.fncCamWebServiceStartCapture2();
		
		if(result != this.STATUR_ERROR_OK){
			this.fncCamMostraMsgStatus(result);
		}				
		
	}
	
	//***********************************************************
	// fncCancelCaptureImage
	//***********************************************************		
	async fncCancelCaptureImage(){
		
		var result;
		
		this.livrePreviewDataImage = "";
		
		result = await this.fncCamWebServiceStopCapture2();
		
		if(result != this.STATUR_ERROR_OK){
			this.fncCamMostraMsgStatus(result);
		}		
		
	}




	//***********************************************************
	// CONFIRM
	//***********************************************************
	
	//***********************************************************
	// fncNewRegister
	//***********************************************************		
	fncNewRegister(){
		
		this.fncInitializeVariables();

		// Chamar pagina principal de novo
		this.fncShowBiographicalInformationPage();
		
	}
	
	//***********************************************************
	// fncSaveXMLFile
	//***********************************************************		
	fncSaveXMLFile(){
		
		console.log("Washington - fncSaveXMLFile");
		
		var result;
		
		result = this.fncSaveXMLFileOnTheLocalFileSystem();
		
		if(result != this.STATUR_ERROR_OK){
			console.log("Washington - Error fncSaveXMLFileOnTheServer");
		}
		
	}
	
	//***********************************************************
	// fncCreateStructClientTag
	//***********************************************************			
	fncCreateStructClientTagData(){
	
		console.log("Washington - fncCreateStructBaseXMLFile");
		
	let date_ob = new Date();

	// current date
	// adjust 0 before single digit date
	let date = ("0" + date_ob.getDate()).slice(-2);

	// current month
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

	// current year
	let year = date_ob.getFullYear();		
	
		// Dados da tag clienteCriptografado
		/*
		<cliente>
			<documentoCPF>01786654873</documentoCPF>
			<tituloEleitor></tituloEleitor>
			<documentoRG>11111111</documentoRG>
			<ufRg>BA</ufRg>
			<unidade>0004</unidade>
			<dataNascimento>1940/03/12</dataNascimento>
			<municipioNascimento>ACOPIARA</municipioNascimento>
			<uf>CE</uf>
			<beneficios>
				<beneficio>
					<nome></nome>
					<numero></numero>
				</beneficio>
			</beneficios>
			<nome>ARTHUR MARTINS</nome>
			<nomeMae>FLAVIA MUNIZ MARTINS</nomeMae>
			<nomePai>PEDRO MARTINS</nomePai>
			<sexo>M</sexo>
			<dataEmissao>03/07/1980</dataEmissao>
			<foto>
				<ini>/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCARtA1IDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDwTbRtp1GaAGbaXbTs0tFgGbaNtOozigBu2jFPJ4pAaAE20m2n5ozQAzbRtp+aM0AM20bafmjNADNtG2n5ozQAzZRsp+aM0AM20bafmjNADNtGwmn5pc0AM2UbKfmjNADNtG2n7qM0AM20bafmjNADNtG2n7qM0wGbaNtPzRmkAzbRtp+aN1ADNtG2nbqXNADNtG2n5o3UAM20bafuxQW4oAZto2U/dRuoAbso2U7dRuoAZsxRtp+6jdQAzZS7Kduo3UAN20bKdupd1ADdtG2lzRuoAbto2U7dRupgJto20u6jdSATZSFKduo3UARkYppqQ80wigBO9FLjmg0AJRS4JoxQAgqUJxTAKfuoANlLtozRuoATbRtpd1G6gA2UbaN1GaADaKNlGaM0wDZRsozRmgA20baM0ZoAXaKAtN3Uu6kAu0Um0Ck3UbqYDsA9qNvtTd1LvNABto20m6jfSAXbSgU0uaNx70AOIpAopN1BbNADsCjGKbuozTAdRim5oBpWAdxRgd6bnFBbIFADuO1GKZuo3UAPAxRwaZupc0AOwKMCm5o3YoAeQKQgU3dmjNADhxSUm6k3YpgOopu+ikBrHQLpeShpp0S6BwY2/Kvbj4fg7fnimnw7bnt+ld/sImPOeJf2JdHpGaBol0BzGRXtZ8OQ+g/KnDw7BjGB+VHsIhzniX9iXZ/5ZGg6Jd4/1TV7aPDkHHA49qePDsPYD8qPYRDnZ4a2jXQx+6am/wBj3Q/5ZNXuf/CNwYIwMn2pp8NQknp+VHsYhzs8N/sm5z/qmpP7JueP3bc17g3hqLBwF/KmjwzEOy+3FHsYhzniJ0u5H/LJvypP7MucZ8tvyr3A+G4sYwPypp8NRYwAPyodGPQameIf2dcA48pvyoOn3A/5Zt+Ve3N4Yiz91fypo8LRdkUfSpVBB7Q8S/s+4P8AyyY/hSfYZx/yzavcB4WiwflWo28KxdPLXPrin9XQe0PE/sM5/wCWbfkaBYz/APPNvyr2z/hFoj/DTR4Ujz90fjS+roPaHipsZ8H923FNFnN02N+Ve3f8IrCAf3a80weFIhn5F/Kj2CH7Q8UNnN2jY/hQLObrsb8q9rXwtGMnYv5Uh8Kxk5CLmj2CF7Q8VNnN1CH8qPsc2fuH8q9q/wCEUjxgopoHhWPoEUD6U/YIftDxX7HP3jP5Uv2Ob+4fyr2o+FIumwflQfCkRx8i8e1HsIi9oeKfZJs/6s0ospv7hr2k+FIjgiNfxFOHhaEEkRr6dKPYRD2h4p9jlz9w/lSG0mz9xh+Fe2DwrEefLWkPhWP/AJ5p+VHsIi9oeJ/ZZQDlDQLaU9EP5V7T/wAIpFnPlIePSnDwrEP+WS/jR7GI+c8VNpP/AM82pPssmfuMPwr2s+Fof+eSj8KQeFIQeYVOfQUexQc54p9llz91vypfs0g/hP5V7V/wikTE/uVGfahvCUOf9UuPcUvq6DnPFfssp/gNH2WUfwN+Ve1DwjD3jXH0pv8AwiUYGPLUmj6ug9oeL/ZZdudjflSC1lI+435V7X/wikWP9UuKb/wiUOciMfSj6uh+0PFzaTD+BgPWgWsv9xvyr2n/AIRSI8eUuPcUv/CLQkZ8lffij6uhe0PFfs0n9xvyoNrKP4D+Ve1f8IpCekS07/hEoj1iXFH1dB7Q8S+yy/3D+VH2aXH3D+Ve3t4Uh4xEv5UxfCcOQTEhx7UfV0HtDxP7NKf4DR9ml/uH8q9qPhOEZKwpSDwnDgAwLR9XQe0PFjayjqh/Kl+zS/3DXtB8KRHjyVpj+FoyQRCnHtS+roPaHjP2aU/wN+VJ9mkz9w/lXsv/AAi8feJRj0FKvhiEn/Ur+VHsEHtDxr7LL/cNL9llP8B/KvZx4WiPHlJj6U7/AIRWLgiFOPSj2KH7Q8W+zSf3T+VJ9mlz9wmvaf8AhFYQMeSn5U5fCsG3/Urn6UewQe0PFPs8mcBTmj7PL3U17OPCcKjHkpnHJApV8KQk4MK4+lP2CF7Q8X+zS4zsP5UC1kP8B/KvbB4UgA/1K0i+FISeYVFHsEP2h4p9kl/55t+VKLWToEJ/CvbW8KwgDES0ieFYN24xLmj2CD2h4n9llzjYfyoNpL12N+Ve2nwpBuz5a4pzeGIdu3yl/Kj2CF7Q8R+xy/3G/Kj7HN12N+Ve3HwxCSMRr+VH/CMRH/lmmPpR7BD9oeJCzmPRG/Kj7FMD/q2P4V7cPDMW3HlJ+VH/AAjEQwfLX8qf1eIe0PERZzHpG35UfYph/wAs2/Kvcf8AhGYSuPLQZ74pn/CMw4x5aflR9XQvaHiX2KcjIjb8qQWUxONjflXto8MRDoi5+lPXwzCmcIvPtS9hEPaHiH2Gf/nm35UfYZ/+ebV7h/wjMOPuJ+VMPhqIjGxPyo9hEPaHif8AZ9wOsTUHT58Z8tsV7YPDcPI2rz7Uo8NW/QxpjvxR7BD9oeI/YJx/yzf8qd/Z9wBkxPj6V7b/AMI3ExxtTH+7S/8ACNwqMBV/Kj2CD2h4h9gnzjym/Kl/s657Qt+Ve2r4cizlgvftUo8PwgcKvT0o9gg9oeHf2bcZx5TflSf2dcc/uicV7iPDsW3oufcUx/DsIOVVB68UvYoXtDxH+zrj/nkaX+zLk/8ALJq9oPh6Et91fyqVfDsIBwq/lR7FD9oeJHTLj/nk1NbTp0ODGRXt58PQbTlFP4VnS6BG9zyiY7YFDooPaHki6Xct/wAsmoGlXJ6RNXtcfh+Egbgo+gqQaBBjG1fyo9ig9oeIjSrk/wDLJqX+yLng+Wea9tHh+DHIX8qX+wYMAALx/s01RQe0PEv7Hus8xNSf2RdA48pjXtp0CAnOB+VH9hw/3Rn6UexQe0PE/wCyLrP+qb8qd/Y11x+6PNe2DQYM5Kj8qUaDBnoKPYoPaHiX9i3mMiI0v9iXh/5Yt+Ve1jRYR2H5U4aNBu4A/Kl7FC5zxP8AsO8HWJvypP7EvOR5LZHavcv7HgPYY7jFIdGgPAUY7HFWqcRc54f/AGFdn/liw70o0O76eWc+le3HRIMYKDp1AoTRISeQOmM4o9nEfMeJjQbz/nkRQdBu8Z8s17a2iw4xgce1KNHtwMYqfZIOc8RGg3Wf9WaU+H7zI/dGvbBo8BP/ANalbR7fH3aPZIXOeJ/8I9eZx5TflTh4bvGIHltXtUekW4wcU/8Asy3X+Gn7ND5jxX/hF7z/AJ5mivav7Ot/Sil7NBzM18UmKlwDTSvNdBkMxS4pwp2OKAI8U7ApCtL2oAAOaUigGlY0ANwKNgpAwzT6AGFBSbPapKWgCLHtRgelPIoC8UDGAc0ECpNtJigRGo5p20Zpw4NHU0AMKjrSBQPxqXHFIB60WGRbeacE+lP20/HFAiLZ9KbtANTkc1Gw70mMjbAoFB5pwWkhBtBpClPHFOwCKYDNnHamFOKmGaCM0wIAtO28ZqTbSgZosBDtHTFG2pdvNG2iwEfSgqKcy4puKABR9KdtB9KVR1pO9ACFABSBRzUnWkxikMZtpCntTu9PA4oERqlPKAYNLwKDTAQgEUmwU8UtAEZRSOlAiGKeRTlHFAEJjFNMINWCBTT7UAVjCPSm+Tg9KtgetBFFhlUoB2/SnbMD/wCtU2zNLt4osBAEFOVRUoTmlxzRYCPYPak8v2FTEUmDmgRFs+lIAM//AFqmIzSbcUDIyo/yKPLHXipMU7FKwEBWjbkVKRQBRYCLyxS7eKkxS7aAIgnFG31qYCmmmBHt4pNo9KkxmlxxQCItvPSlIA7U/bijbSsAymlalC0FaAIQgBpQvPFPIpyigCMjFIVz2qZlyKQLxTsBX280pWrAUelGyiwESrgU1kzU+3igLz0osIq+VzTivFWCnNG3NKwys64Q1QEeZc1pT4CYqtCoLdKLASqMDml2g1IVzQExRYBm3FGypCKXFFgIioNHl9xUmOacBRYCLbRtqXFAGaLAQeXSbOaslRimbaLAM2Um0g1MBShOaLAR7eKVVp5GKcuMUWGQsvtSBKmIpOgpWEQheaCtSgc0EZosBEFprJmp8U09KVhkHl0VLRRYLljFLinAcUuKsRHtxQKlK8U0qaBDTzSEU7GDSkUwISKO1SlabtoAiA5qQdKULTsCkA2in7aQCgBuKMU80DFADKKkIpmKYDcUuKXFLjNACcCkpcUAUgADNKeBSZwak4IoAZ1FMcU89aQjNDGRhadinBaXFCAiK808DAp4XNKB7U7AR4oxUu2k20hEdKuM0pWkxg0AOIFJSjkUuKAGlc03ZzUuKXAAoGRhaQpUuKMc0CIgmKXZUuBS4FAEBWmkVORSYFFgIMUuKmwKUqKAIsUYqXbQVoAjI4oBpzDApAvFACGmgU7BpMUDQYoUZpcUgPNADttJjmgnmnqM0CEwKaRg1IRRgUAMAyKXbTsCj2oAjxRjNOK0Y4oAbtxS8UtJigBrDNAFSBaXbQBFilAqTbSbaAGUFadjmndBTGRhOKQripM0mMmgQ3HFIRgcVJjFNbpSGMHNKRSqKcaAI9tAHNSAZpNvNAMaRxSCnkcUgFMQ/bxTcU/PFNoATANBWlUc04ikMjIxTe9S7c03HNAFS4HFMgTFTzLxTokwM0hBtwacAPSnY5p2OKYyIgUbc1Jto20CISuKUCpccUgXmgYwLmnBaeAKcBzQBCy8UgWpmFNC4oENC0uMU7oKME0ARkZNGMVLtwKZjmgZHzSN0qTFBXikBGKdil24pQM0wGYoK5p+2jHNJjIdlFT4FFIB+KWkFO2mrJAc0hHNOA5pkmQRigBcc0uKRTmn9aAGkCm7aeRSheKBERGKTGamK0mygYztQBzTsUoFIBhFJinmjNADRSYp1N70AGKXFLjilHSgBpFNA5qXFG2gCMpmlAxUgHFGOaAGFaNvtTyKOtADAOaXHNOxzSgUxDQBRjBpTigHPWgBDTelPxSMKBkdIeTUm3ikC80gGhakHFO28UgoAQ0AZpeTSgHvQAw8GlABpxANGKAAL6UFaUGkzQAm3mkIp+c0hFMBmKWnAU7AoAjNG6nkVE4pCEY5pVpmKeBjFAxSuabtqXtTTTAjA5pdmeaFHNSjpQFyApzT1GKecUmOaQCEUhGKkzxTTzQAgo709RQRQA3jFIRThQRQBF3p+BRjmlI4oASlBpOlJ0oAf2pMUClHWgAK4pnWnk0gxTAZt5p6gUHFIKAHcGmMtOGaOpoAYBRin4xxSYpAIvWjoaXGKRqBiNSAZpRSimITGKXtTgMmgigBoOKOtHrSg0hhTGqXGajk4FAiu/LYNTIBgVGRlxmpgOlACheadgUh4oHJoAMUhFPppPNADaUDmgcmnAUANxTxRinY4oAjbrSCnnGaMDNADCM1KqYGaSn5wKAGMtN2Zp5OakRc0AQGOl2cVMQKQjikMrlaAtSlaULTFqR7aQpzU+AKaRzQGpFsoqbFFFguQ4pwpop2M0xCZwaVhlaTbT8cUDI1GDUgpoGKUUAKBzTsUAc0poENIo7UdKUmgBuKXFANPpARFTSBampMUAR7aaUPpUxFIBQMjCnvQRxUuKQrQBEDT+1LtoAoAbS9qdig4oAZ9aAKfjIpuKAFApKcKCKYiPqaMc07HNGKADFOxxTe9P6CgYzFGBT8Cg9aQCHpSY4p2RSE0ANxS4xQATTscUAJRikPFOHNADcUYpxpKYgIo4p1IaAGAc0pNKabSGL2qJjzink8U0c0AN285p4FKAKcRjFADaUgYzQelOA+UUARAc08DinbaQDmgBmKXoKcRzRjmgBpwBSAUrA5xTgOKYABSd6eCKQjmkAxhzSDOOalGCKTaDQIj70uMmn7MUuKBkeKMCpCopm2gA2ik24p4WlI4oAhIzSbalC80pWgCHGKXBp2KAKYCHpSCnMO1IBSGGaM8UpXNG3FAhh6U3BNSHGKb0FCGJSjrSHI6U5RTEOxijqaDxQOaAGMMGlRacVzSgYNIB+Bio3XOakzSYoArhPnzUgXBqUKBSECgCNuaaAalxSii4EXNLsyKdjmn44oAgxipFXinbKOgoAQ0DpSNQo4oAawoWnkcUgGKAEp2OOaKAetACAc1IDTB1pc0APJppbAppzmkGc0ALnIpy03BzUqgYoGNIoFKeaSgB2BRSZooEV8U4dKbQDzTEOBpd1M60mRSuMfnNLio80u6mBIGpM81GGpwOaBDqU80lLigAFPpgpwNAC0UhpRQAhpRRRigApcUgp2aQCGm8ZpTzTWFAD8DFMIpwoxTGIopcCiikAUUUUCExzS4BpQKMYoAbtwaWlIyaQ8GgBvNFOpO9ACClIzQOtPFADB6U7oKXaKTFAxMZFG3FKaTPagAxQRSilLUARmkGacaAKAACkKmn9KOtAEJHNAQ5p7daVelADCOacOaUgUgoAMU7FAIooAKAKKUUAJjmg0daac5oAUjNBFLRnFADcU4Cjqad0oAaRSDrT+1NIoAWg0gpTyKAG5pCaQ5zR2poB4NGc01adigQpGBTafnikNIY3FGBSmk6Ci4CEDNGOKTvSk8cUAIB60uKaDT+1ADMUm2nEgUmeaYAVBFCjBpc0DrQAMKaBUlHFIBopDTjTTQAAnNPBqLvT+1AATzRSDmnjGKAEFL0pMc0hosA8YoJ9Kjyc0uKAJM000CgnigQYoAwKQHNO7UDEIpvSng0HrQAynAUuKUcdaAG4p2KXFIKADbTCOafmkAyaVwACjvTsYptAxe1M5zTu1AGaYhKKfRQBTyTSjNHamgkHFMBec0pBpM+tKDxSABTgKBThxQAYGKbipcZFJjnmmAgp1LtpcUCExzS4opwxikMZilApTRQAhpAaeBmgJQIQUjdKk2iggUAyJaccEU4r6U1etACL1p1KeBQOlADR1pSvFLto6UANApSKDThgigBvaj2p2KMUwAcCmU/HFNxzSAXHFMIxUuOKTFAyMClpT1p2OKAG0lPAoYCgCOk707FGOaAENAp5HHFNApAGKUYxRRjNMQjUgoNGaAArQBinKaQ0DE7GmkYpc4oyKAEp1FLxigBtPFNIpcGgBTTO9OxxTcGgBwwKQ0uKTFACg4NKeabTsZFAhO1IOaQ8UCgB22k6U7tTc0DExmlK5pMd6cCaBiAYpxpetGOKCWNpcUUhoGhaaeaXBphzmgAxg0uM5pM5xTqAGgUuKDRQAw0hBGKcODTsZoBjKUDNOKUKMUB0EGR1pc804jmmEc0dQFxmkIpQaUjNADAOadgEUEUGgBNoAoxS44pBmmIU9KYDk1JikIxSGAFFN3HNOzmgAPFJjNO60CgBNuKM040mKAG0c07GaCtACA0UKMGlIyaAFzQO9JtIpcUBcQcmn4xTO9HNJgOPSkAo5xSZpDFxmlxikFBpiFoptFAFcDil2UCngZpgQsMU5elK4pq5oAfig0LTsUxCrT8ZpoFOoADxQDS9RRigYhNFOC07AoEMAJp2KMYoBzSAMU6kpKQxTSBqTNO4pgKGzSYGaTpSgZoABjPNLik20poAd2ph60ueKaTzSELiilHNKRTAReaCOaFp4FADccU2nE0cUhjRTqCKSgBrUoNKRQBQAUdaXbkUmKYhMUhFOpKBgOaAOTS9OlKOlADGoFONNzjrQIGFN28U7OaUc0AMHFGeadijFBSGmm4zUmKTHNAhAKAcU6jbQA2l7UnQ04c0ANPWnAcUEc0uKQCGgLRThyKAGEDFOAwKRgaUdKBDCvNJipDzRjimAwc0u2lC4NPoYERFIKlJpuKSGIDTqMUvamIYabmnmmlc0DFByKaR608DbSNQBGRgUqnNHWjGKAHGmmnAE0FTQAzHNKKCKVaBC5pKU0lA+g4dOaaRzTgcijvSAYRS0pFAFAC0hFL9KKYCcUuKb3pwoAMUpUYopTQBEyc5oAqXHFM6GkA4CjAoHNLimAw8Uo5pWFNzg4oAXGKOtO7UCgCM9aO9PIyaTbmkMUNmggU5VApGGaBWG4oAoxxzSgcUwAimkVIB3oIpDI+lKKfsz1pu3FAhMUU7iigRV20oNOHIppXvVDGnmnKtJinrQAAYNOo4o6GkAooozRigQoNBoxQRQA4U/FMHSnDpQAEU0cGnHOKQCgYtJS0UgG4pwFIOtOoEIRSjgUdaXtTAbmlpMc0tAAOaQjApy0jCgBoNOBpAKdQAmOacOKbzQDSAUiijvQaGMDSAUtApAFBooNMQZxTuCKZTu1ACYpKXNIaBiGlHSjqKTkUAO4pjLTs9KWmIj24pwHFOxkUgBouAYpDS0lIYLS4GaUUEZoAYeKBTiKQigBODmkHBoxijGKAHCl4ptHOaYBjmn9qb3p1IBpFJ3p2RQOaBDRzS4peg4pVPHNMBtKKCKAcUAIRSU/GaNtIBoFLS4oxTAbikbgin4ppxmgYdqTbml60vSgCMrimgZNSnmlAFIBgGKdjilxRigCPbzTivFKetGRTEMxSVJgU3ac0DGgUuKkC8UYpARZoHJpSKUCgGO7Uw0+kxTATjFHenAUEc0AIKQ9aeRxSAUAL2xSbRTd2Gp/UZpAG0daO9JkmkGaAHGmqMtS0ZFACNxQOlL1pcACgBBS8U3BzS9aAFyMUlKBQaAG4pwHFKKXFJgJ0pDSmkxxQAAg01gacAM0rcigCPBop+KKYisvWlPSkzxxQeaoYmRS9KaKeBQAZpKdilxxQIVeRS4pBkGlzSAQU/FM708GgYhFKKCaTrQA6l6U3pQaAFJopBzTsUgDilHNGM0AUCExg8U8DNBHFIMigAIoxSHNIDQA4UUvakNACdaXFNpaAHAU0jmlBpxxQAylxQRSjpQA2ilxRihgIOelBFKM54p3WkBHS5pxFJtoAbmlop2OKBjAOaXFOxRjFCGMIpRyKUiimIB0oxRmnCgBmKQ9aeRTCKLgLRSgcUuKAGUhp+KQigQgFGKWigYgFKaM0daLgN5zSmnEcUlICPnNOpcUmKdxCilAxSAZp2aAEpMYpe9BoAQNS5zSEUnQ0ALmk3c04DmgrQAnWkIpR1oNAwXmnEUi0MaADikIoFL1FACClpOlGQaQCEUmKdkHilx2pgMGad0oxinAUAJ1o7UoFBFSwGGlFLjIpKaACMmlxxRijNMAopDQATQAYpcUc5pDQAm0ZpegpM04DilcBM5FN707GKOKYAelMIqSkI5oAjBOadTwBSHGaAE3cUbqdtFJgUhibuadTdvNLj0pksU0CkIOKADikUhTTgOKbnFG40CFPBopvejdQAuKKTNFAFfHFFMVweKfkVYhtOBptKvNAD6M4opCMmkMcCM07imDindaLAFLSYpccUCAc04CmgYNPHIoACKbUoGRTStIYxRTjR0NKBzQAgNKDS4xRigQueKNwpdvFIVpIBM5pp607FG3imAgNOxmk28UKKADbikp4OaCKAGUtHSlxmgYoNLSDil4JpdQGkjNGeKQjmkxzTEOBxS5poFLjFIYGm5xTwKRlyPpQFhFGakxxTFFOJxSYDScGlFHWkzQA7FNI5pVNL3p3AbtoAOaeCKB1psBtJipMUhGKkBo4FLmg80zkGmA7ig9KbThzQA3FL1pWWgDFADSKKU02kAtFHakX3pgGMUuMig80o6UAJgihQaUmnA8UANIxTeppSaAaOgARxSYpSaUc0IQ3vS5oIpQKYCDk80rYoxg0hOaSAUAUjDNNBNGaBi4xRRS4oATGRSBakI4poPNADCpBp3an4yaCMCgCOgZpwHNP20AMFBNOwCaQigBAaOKMYo70ALSY5oo5oACKUGmk0UXAdScUDpRQAhFAozQOtAAe1GDS5waUnNADRRjNHenHigBMUmKdRxQA2inHmkAoATNApcUoU4oBB1pdvFJg5p3akMZig4FIevFJTQhTTcc0/HFNA60wCiiikBQHWpAD3pAvNScYqgDHFAGKM0vegBaBzRQtAhaXvSHigUAPBooFLQACnYpvenZNIBRS44pvelzxQAnenAc03vTs4NAD9tKAKbmlU80gFPBpDg0ppjGhAIaXrxSUopsBcUYwaXNHWkAlBIoORR1oATg04CjGKcKQDCuDQBTyKaODSuAhHNIRTyO9MPWqTGIKeKAOKAKGAlFLTaQBmikIpaAFFJtA5o7UZ4oASlxRRmmAu2gcGjtSZoEPJpCcim5oJ4pDCkpV5p2ARxTAbkUmcGlIzTdtAD85pOtGDSYNADgOKNtIDxThSAaVpuKezdhTR600AmTSjkUDk1IAMU2IiwaXOBipDgVGetIYzrRnmpQBim7cmn0Ab1pRwadt5prCkIM0CjbxQBQMdTSaX6U0igBwANG2gdKXoKYCgCkPWgZoPNIAzTSKXoKAc0AAOKCcigjNJ3oABTt2BRik74pgApR70YpccUgEOM0U3vS0AOxSEA0c0oGaQDCtLjilIxxRg0wEFJ3pelFACGkNPpD0oAaBS9acBxTc80ABFIc5p3WlwBQAgOB0pwwR0pDikpAO4ppIozmkxmgBwp2RUdL2xQA7IpDSbcUhJxQAoxRimg0ZpjHUmKSlFAhNpop+RRQBno2KcTk1GrZp+aoB2M04CmgkU/qaAFoFLilA4oEDCkxTs+tKBmgBBSmjbTqAG4pwoFKKQCUuKMUp4oGJjFBpRRjJouAg5NP6CmkEU8dKTEJnIoApdvFJQmAY5pccUDmg0XATijODQB60oHNAB1oxigg4ozgUhgTSiggUUALSYpaTNIBc4FBGaO1ANMApKf1puOaLgJikxTqCOKLiGkUAU7FGKBjcUoAxSmkNADDS4zTsUuKAGdsUYp4FGKLgMIoxkU8rQFoAYARSc9KkxSYoAYeKQNTyAaTZ6UAKOaaRinhaQ80AMFKQQKUDmnGgCMe9OGKQilCU+gAB3ozSmm5oEL1NIwpRyaD1oGN5pw6UcU3BzQA/IpOCabyKcCKAHEDFNxS9aTODQAmMGlI4pwGaDQAwU4jIopw4FIBgFKRgUZOaU9KAIyMim8ipQOKbtxTATqKQLilp1ADc4pQeKNoPWnADFAhoPNOpO9KPWkAhGaAtLRnBp9BiYxQOKXINHFIAxRSZ5pcigBppccUpx60E4FACKvXNNI604HNKRQBGATS7TThSZ7UwEPFNJJpWFIKQC5xRnNL1FIKBh0NOzS7aTFMQE0A80BaTBFIB5GRTSppAxp+7igZFgilwacTmjOBTuBGcijmnNzQKLiG80U/FFAzNXin0wCpAKsQ9RmngUxeKeKQC9KUUlOwKBAVzSqMUD0p2PSgBeKWkzSA0gFpcUlOoGHamnmlNLihgIKkA4pm3vShqQh1GMUn0p3XrSATNBFBGaMYoABRzRRQAlKDS0nQ0ABoPSjNJjigBQCadSDpS0AIaTFKTQKBiHBpOlP9qCuKAEBpCeaXFIRQIM0Z4oxSd6LDHUZpM0ZoAUml7UzGaMUrDHZBPFLwKj6U4HNFhC5FKKaelA4oEPzim5yaO1NPJosMeRSYzTQead0NAABxThxTRSigBaaaUnmjtQA2lpQKSmA09ad2oPWk70rgBGKTFK1KOlO4DDwaAeKfwaQ8UbiG4FKBQelKBQMYRzRtqQjim9qLgIOtDDvRjmnkECgCNTzTiaAOaDQAo9aM80gBNLtoAPSg9KKOtACDvQeaQg0c4NABxS4FMAOeafnigdxetIaUHApueaBBjrSrSjFBIFABTSN1OHIoAoAQDApOpp1JjBoGNK4NAFSdabjmgQ3GKOoqTtTTQMaOKUkUpAIpoHNAgpO9OI6UFcUAIeabgE0/bTMc0DFIHFKFoC06gBBkGlxnmg0bu1AgLUjNxTW60h5FAADzTz0pinFOByaBihc0pXijpS0CG7aTGKePegrxmgBuKKNtFAGeBTxSKOKcBWgCinDrTO9KDQIeRxQCRQKKQDwc0YNIKCaAHU3kGlFKRxQAU4dKZzTxyKljF6ilFN6Uo60gbHYBpp4NPFIw5oEC0uaBwKKADNHWlIpBzQAUUmKUA0ALmjrSUd6AFI5pCOKXvR1oABSnmgUoFIBppKkOKTFADQeaeTxTCOaXPFAw3UnWloxQAuKTbThQaBDMUqijg0o6cUhiEU0innpSYppgM60oFLjFKD2ouA0ikqQ+9NxTATPFNFPxRigAHWg804DijFIQylBoIpVFMYhPNFKVOab0NADgaQmg0EcUgEo6UCl6igAIzS44pKAcCgBOlI1OPNIelNAA5FKKQcUtDAKMUZopAKBQTg0CkPWgA70GgCigAxRRQaACk47UdeKAuDTAUUh5FKfam0AAFKaBzRigBMGilpetABjimladnFHUUAIo4o6Uopp5NABmlpmOaeDQAZxTd2eaeeRTMYpAOB4oxmlGMUnSgYUDFL1pO9MQEZoxRzRmgApMAnNKTQOlAxTSGiikAACjbRuFKDxTAbt5pCuKeKCOKQiIrnpQoIp+OKBxTAQg0m6pD0poXmgBu6k3GnEUbOlABuNFLtFFAFBTT6YOtPFaCEpwHFFLQA3ODTu9GM07bSGAJopQKU0AJmlFJ3py80hBinr0oIxQBQwF60dKMUAUgYo6Uvammm5NAElFNU0vagB3ajpSDpS0hgOaUCkFL0pABGKMc0ZzRmgGKVptOBGKQgHmncQnen03GKM80mMU0oo60d6QCMOabTz0pp60wE6UueKCM0oXIoATPFFOwAKTFAAOaDSUtIBCKXoKKMigBKB1oJGKBQAtKBTaXmmApFN70uTRQAE8UlLS44oATtQpweaUCk25pAO3CmkU08GnrzQA2nA8UHrRTAb1NBFGcU7tQA3bmkxing54oGKAG9qSpMcU0gUAIBmkPFKoxSkZpgMBpSaAlLt4pAIDSmk6Uc0AKBwaSnKPWgigY2jtS4pO9AhKd2pGFKvSgAo20Zo3UAAGKWm96d1BoAT3oxzSU4UANIoxSk0ZzQAgPFIRTgPWjFAEbClUcU/HFJ0oABQRmjBowaADoKQdaWkxQA8Digim9KXNACYpNpp45pMii4CdqBS0UDENNPSn0oFAEQSnAYFSECm0XENFLRRigBCaSnbaMcUAIDSk0gHNIRzQMD1pe1IacBxQwE4oowaKQFBeaeBxSAUo61sSApaXFJSAUdafmmCnGgBc0dabmnYNIBaVeKbSrQA8k0ZOKXHFHagBM5pRnNN6U4c0MBxFNxS96XHFIAAoNFJ3pXAcBxRSUooAXoKKCKTPFIYYope1AoAMUU6kyKBCUYp2ARSgDFACdKAeKcQKYfSkMU0Y4ppNOzxTABRnB4pCM0hJ6UAKx4pAaD0oUUAGDmnCjvRmgA4pGFIetKORSAQCkxTwKXApgMFOoIpaAEOKSkJ5pwpAIKXBoxS5zQAnSgdadjik6UAIwFIOBSnmkoAM57Uo4o70ZyKAGnk04dKbTjQAh4NJ3p1GKAFzSdaUDikJxQAlJnmlpO9MBcU0nBpwpWFIBvWlAxSgUGmAZpKTmjBpAOApSOaQUE0AIetKBRijNAAVpm30p/NGKAGbaUcCnYxSUwEA60ClNHagBpBzQBjrTxzRigBh4ozmnkUm0UANzTscUu0CjBpDEFLnmlC0jLSAa3WkPSlxRg00AgPODTscUbR1pc0AIBik6mlzQKBMXaTSYpwIFBxikMaKTPNKKOKYBzSc0/HFGMCgBgNLn0pCBQBxmgA3Ubs0hGRQvpTF1FNJipMDFMPWkMQDmnYptBNAC0UzJooAog09aaKeK1JH0nQ0maTPNMBw4NKSKSlFIBO9PpMU4GkAgFKRg0Up5oABS80nSnChgIaUUYyaULipAMUtGaUUAJg5o70tJQA4jikFANOxQMTrSkYFGKWkAg6Uh4NLikoAcOaRutKvSkODSAM0Zo4xRTAcM0uBSCk3YpAIRzQaDmkzTAUU4jvSDkUe1ACDrTsd6QjHNANAAetIOTTsZFIoxSAQilxgUvGaXFFwEFFLQOKAG5xS0GgdKAEI5pcYFGKDQAUAYoAp3akAlNNOFKQKAG4wKQ040mKYDRRTsCgCi4DRTqXFIaBhjFL9KBRnFIBMUMMCg0vagBgBxR3p9Jt5piEpeoo6UE0AGQBSEccUhNOUjFADBxTqXAJoPFAxKTilxmkxg0AKBSdDS9qO1AADS5plKKAFpDS0DmgBQMijHFKKD0oAQUHrSZozmgQpoFJR0oAf6UhNGaQ0hgM0tICMUtABgUuBSU0k0AB68UuM0UufSgQ3GKOKXOaOKBiEZFN6cU/pS8d6AI8HFAqQgYpMUwGgmlLetB4o4xQA3OaKUDmgigBRjFJxmgDIoxigAJpOlKRxSAZoAQ9aCOKXGKKBCYFFFFMChTgaAM0YxWohc0Ac0lOHWkA4cUd6Mc0vegBcil7UUhOelIAzS00U8cigBvWnjpSAUvUcUXAcBS5xTR0pM5qRjuopR0pARS0ABpOQadS8GgAAoPFL0oIpAITQKCKUCgA7UlKelIOKAF5xSY9admjrQAlGM0tGRmgBRTT1px9qTFIA6ikxS9KTNADhSdKTNLjNAATxSAZoxSg4pgLQOKMmkzSAMc8U4UUUgCkNOFNPWgBnOakHSkIoFMANGKWjrSATNIWINLjBpCp600A4HilyKaOlKKGAuKTiloxmkAnFLikxzTsc0DE6Uh5p5FMNIBAaOtJzQKYhSMUueKUgEU3GKYAaBRiikAYzSAYpRS0wG9aUcClxzS8UrgNHWgmlxmkxQMQHFHWlwKAMUAIaAOKcaQUxDTSYzUmOKTGKLgJinADFGKDxSuMCABTeSaU80AUCFAoApRxSZ5oACMU1hmn4zSEUANApTmj8KMYoGNA5peadmgCgBMUCnGm96AENJupxpMUAApRQBS4oASjNL0pDQMXPy0gNIKXGaBAeaMcUlLkUALgCkNGaQGgBRmjFANBNADcnJpwpvelzTARutJjNKBmnYAoAbgUUuRRRcCgDSmgCnY4rURH3pwFIaevSgBehopSKKBCc0oHNBpwPFJjDGKAKCc04cUgEHXFLQcU6kA0UuKWgCgBAM04DFKBS0gG4pQKWjrQAuKXtTTxRmkAuBSClpeBQAg5pO9L34oNABSAc0oo70AOxRtxS9qTNIApaSl60AIeRTMc0/FBxmgYm2inZoouAylFKaMUCExnpRin9BSdaAG0vWlxRQMTNIeTTjiigBpNAGaXFA60AGKUU4YxSd6QDSOacBQRSggUAIRzSU7IzQcUCGUuaXFIaBi5opMUtACnpTadnimGhAGaOpopQKYBmkpSKTNABRRmjOKAA0Up5oFACUAZpSKKAA47U3vTjTe9IBQKKXPFAoAQ0DpTsUhpgNpaMUvagAzR1FIaUdKQBigUuabmgBxpmcGlzRgE5pgKKd0pM0vakAmaaetL3paBjcZp2KKQmgBRSYpKUUCEIoFOJFJQAnenUYpMZoAMUmKdnFJmgBMU4CkBp1MBCuKZjmpM800jPNIYwqc0uyl707HFMQ0DFBWlzzS54pAR7aRkp560uM07gRqMUpBNO20lMBu2inZNFIZm7qerioeacBWxJIeaAcCkB44oJpASA5paYKAxzQIcaco4pufWng0MBcUvFITSZpAKfalzSDrR0NIBwpd2KQGgUAAcmng+tIAKXFAC0optKKkYuM0hX0pRS0ANUHvSkUoFLQMYODS5FKaaBQA4UuKO1JQIcelNPSloFIBtKDSmgCgAzRnJpSKaBg0DHUUCkNIBetJ0NKKKYgzxQKTFGDQA7PFHam4NJQMWnCmilzQAvWmkUDNOxSAaDine9BWkoEHekpwo70DExS0p6Ug60CCjFKRSCgYpAoGKQmgHigBSKaaWg80DG9KXNIaUUCFwaSlLUmaADFIRTh0pMUwFBGKSkFLSEFJmg0daYxc4o60EcUA4pAKVo6UE03rQA6g9KTNIM0AL2pc4FIAaQ0ALwacMYpgpaAuLikxzS0GgBp604CgCloATFGaCaMUAJ3pRzSYpcjFACE4FAORzSgZoIoGHGKbkUfWjaKBDSeacDSHFOHNABmjFLRkAUDG0Yp3FLxigQylBoooAD1ooBFOFADSKXOBSkjpTKBi9TS00GnUCGnrThwKQjnNKOlABnimmlPAoAzQA3FFOxRTAzAtLQCe1JzmtRDgcCkPNJ0pQaAGg4NPzTSOaADQBJjNOFNWnUMBcUYpc4pV5FIBBmlxzzR3pRyaAFAxS4pTSUgFpQTSDIpy0gFHIpMGlPFAOaQAKcBTRS0ABFJyacKXikA0UU7HFJ2oBCCnEUlICaBi0tFITQApFJ0ozS5pAA6UY4pc0tADBRTiKBjFACA0ppKXqKAE6UvWkIpw6UC6idKQ0+m4Pei4xAKU0CloASjOKDTcE0AO60EUoHFB9KAEXpRnmiigBwooFB5oAKQijBpSaAG4o6UoFI1ABmlApAKcKAGdDS0uKTFACGgU7HFGKADFJSmm0AFHSlHFIwzQAUCgUtAB1pccUYoY4FACHpTRSigUAFGKcKQnNAB2pKTJFOHNAAKM80tIaAsB5pBS5pcUAFIaWjvQA3HNOPSkHNKaQAOlNIp/akoGJ2op3FJ3oAaaSpMCkxTEMxTgMUuKDQMMU00pNJQIUCnUnpSE80gFyKRsUooI5pjGhacOKKWgBp60lKeaMUgG06m96WmAvUUAcUCigQ00o4pD1pQaADNFFFAzPGMU2il25rYkTFOVeKQDFPHpQIKAM0tLnFMAC4NGOaXrzRmpYxKUetA604gGgAPPNJnBpcU3BzQIeDmnU0DFP7VLGApehoxSg80AHUUAU6kpAFGKMUCkAtApQKSgBxFNNKDS0hiClwMUYpe1ADTTDnNOoxQA5RkUGgHFBpgJ3p1NFOpAIaMZpSKOlADcUo6UE0o5oAKWkIpBSAdmjrRQaYxMYopDRQIU0dKSl60ALmkzzRRigAPWgCl4pevSgBAKMUUDIoAXFJSgk0UAJSUpAzRigApBQcilBFABQaTNLmgAoozSZoGITSU7FGM0CGinZpCMUgBxQAvWlpoNKKAFNH1ppNITQA/ikxTckU4Uhi0gINO7Uw8GmAppRzQORQOKBC4pCKWkpDDFO6CikwaYCdaMUuMUooASg0H2oFIBuaWig0ABFCjrSd6ceKAENFLSUAGKMYozSZoAMUlP7UmKYCgUhxTu1NwD1oATPNLSEUtIApTwKSmmmAoNLSDpSd6AAnmgd6TvT8cUANxSjml7YpDxQAEc0lANBoEFFFFAzNB4pc4pAKUitiQBzTgeabzmnKKAFJxR1pWWkAGaLgOHpSkccUgXFSADFJgMHWpBSEc0UrgKeKBSZpR0pALS9qb1p2KAFzxijpQKdjNIBA3rS0mOadQMTrS4pBS0gFpOtGaBSAXFBOBThQRmgBF5FLSDrS0AGKQinUGgBoFLilooGMxzR3pwooEHNNbmn0lADBTxxRjmlxkUAIaQClpexoAKKB0pO9ABijgUUdaAFpDS0negAxRS0UANNA4pwFIRQAuaTNGDTgKACilpvegB1AIpCabQA5qb2pRQRQMAOKBSc04UCGnrSGnHrSHAoATJ6U4UgwRR3oAQ04ClP3abmgAI5opN1KDmgBpFA607FIOtAARSilooGJQQO9LR1pAIoxStiikNFxCjpSd6B0pRyaBhkUooKihaAEPWloI5pD0pgFFHaloAbRQSKBSAXFIeTS0nfNAC0gHNKKD14piAjiminUnegYmKcKTPNKKQB3ozzSdTR3oAWjFJS9hTAQ8Cm1JwaaRQA1aXHNLjFITzQFhQOaXvQDiikAUh60tNPWmgDoaODxSd6UdaBC4opaKQzKX1p3akA5pTW5IuKctNHSlFDAdRQKKQC5pw9qaBTwMCkAn1pwpp5605elAB0NOxmkp/GKQDCMUtFLQAmKeDSUuKQC0AUUA0gA0AGjrS0DAjFGKKXcKQC8YopuOaXigBeKCRSYooAUY70tJ3paACkNLmkoAKM80hNApALSd6WigBelO7UwmlycUwCg9OKAM0vSgBo4p2OKaTSA8UAOxSE4pQaQ0gEpwpBjFAoAWkzzS0UwFHSkpaMUAJjmnUneg0DEooFHSgQUUmaKBgeDRnNKaUCgQnejrS4pMc0AJilAoNLigBMUYpc0hoACeKTtR1FL2oAQLSkUZozSASkpwooASkp/WkxQAg460uaXikJoATpRmjrSjmgYg5pwGKTpTgc0AHWgAijpSk0DG55oo70GgQUClppoAQjJpRRRmgApDRQOvNACgcUdKQnml60AKWpKQ0daAAjminUYoAbRTqMUANFO7UhooAKBSUooAKMUY4FFABRSZozmgBcigjpSUCmAEUlPpCKBBmiiikMzM009acMUcVuSANKKD0zSc0CJQeKUCowTTxQBIMUdaQGlzUsYhGKTNOIz1qMj0pgOBOKcp4pgp1JoCQAGlxzxTFqRTSAb3pc4oxzRjNIAzThSAUtABRmikzmkMU9KAKUDIpe1IABpTSUuKAEo6HFFJQA40dqBzS0ANopaTFACYNOB4o6UHrQAtBopD0pAJ1pw6U0ClxTAWjrSUtAxpGKXjFLijFACAig0EdKUCgQgpRQBS4oGFJiige9AgzS0AZoPSgAo60DpSmgBOlGMikzSkmgBMUhFOxRjNAxop4FJjFKDQAlIKXHNFAB3pTQOlIaBCUUUopDEopSKSmAZxSjpSEcUnSkAvSikxmloAKBS4ooASikooAKMYo6UtAAOaOlA4NBOaAFJBo6UlOoAQGjrSiloGNzQelL3pTzQIZQOaU9KUDigBKQilpSaYDNppOhqQGm4yaQCCnYxSdKXJoAQ5zSiiimMUjpikzS5zSdDQIKOtIaUUgACjFGaTpQAppp60uaTNAC44oxSA5ozkUAFLj0pAKXoKACg0gNBoANwoptFAGeFwKMUoOaB6VuSA96eCKaaUChgOpKXFGMUgAGnZNAHFAFIBQfWk4pcUAYFAAMUbeaO9OouADinA803vSipGOpRxSDilzmgAFOAptKDzSAccUgFGeaDSAU+1IDQG4ozzQAuKXtRRQAYpSKQU6gBo4p2M0gpQcCgBKKU0goACOKb1p5poGDSAMUhBp2KM0ANGc089KaDzmn5zTAbjIpe1HFJzQAtJmjNRtnPtQMkDClzUNOUnPNFhEnSkyaOtFACk0mM0GlHSgBeQKTtTscUh6UDG0ooAzS0CExSiilxQAHpTaDmm0DHg0Ypopc0ADUDmg0lADugpKXtS0ANxSU7ilxQAzOKAaU9aQ8UAKTRTQadmgQYwKQUp6UzPNIB+aMUDmkPWgYYpM4pRSY5oAWlB4oxSYzQAE0tJilFACU4UYpCKYC5oNGKWgBKKQ8UhNAxwFBPYUg6UAHOaBBiilooAaaUCnYpMigBMYpMHNPxmigBBQelL2pCMmgBo5pwFHApM0ABFJSk03BpDDvS4yKMUo6UCExQelLRjNADQMUo4oo70BYKQ0tIRQADpS/WgCg0CE4ooooGZvIFKppOooHy9a3JHZpQKAueacOKGAh4NLnil4NHQVICryKdioxmnigB2aM5o7UmOaQABS0hBoFADwKKTOKSkMdThTV5pwoAXNL2ptLSAKdim45p+OKQCYpCOadijFAAKKAMGloAQ9aBS0ooAB1pT0o4pDQAlJS0UhiiiikJ5oAd2o20gOaXNADSKUcUdTRTEB5ozSHNFAC0YGeaBQaBiFR2pMU4UEUAA6UlLQRxQA2nCkApelAC9qAKOooBoAOlBNBoxQAA0tJijNAheKTApCaM0DA0AUnU04CgA20hp9IRQAzmnrSYNLQAh60GkIOaUdKAG96UjNOxQelADMUtBFJQAGkAp+eKUUAJ0pD1p2aaaAF4xSUHmjjHFIBe1NzS0lAADSnrRil60AA4FHWl7Ug4pgLRRmjOKAG0uOKRjSg8UAIaXtRQaAEpaXHFAoACaTFLQe1ABjFFHWlFAwptPxxTSKBCA0EUuKKAG0ZpxptIYmaUdKTFLimIUUvSmjrR3oAQnmjNKaSkMKQ0tBOBQIBQeaaM9afQA2iiigRnAU4gGkHNKODW4iQDio2PNLuOKTaDSAN1LmjaBShR1FIByjIpcGgGloAF5pTkCkX1oJNIADGlAJpBTs4oAQ8UUpGaCBjigAFSVEOvNSA0mAuM9KTHNLmlpAGOKcDTaUUhjqKKTPNAC0UUUAKtFAooASiiigAoopcUDE6Gk7048UlIBwHFNOacDSHimAimlzRigCgQUUpHFJ2pDA9KTNP6im9KYCU4UUgOKAFNB6UE0h5IoAQ5oFOxRigAHSk706mnrQAtHSk60pAIoAM0HpRjFLQIb2pQM0hBpV4oGHegnFKab1pAKGp2RSYFJimAtGaOgpOtAC0nelHFISKAFNJ1opRQA2loJo60AFFFIaAAHJp2Kao5p2cUAJQaByaQjmkAcGkxilApTQAClpBRTGFA60Uh60CF6UtIeaO1IYEZpQOKKM0xBjFLjNNzThQMCOKTFKTSigQlHWlNGKYBjFJTsUYpDEzSdTTsUoFADeKbTzTKACkIpe1HagBuOaUilpCaBCCgkc0CjFACdqKKDSAKQ0UmeaAAGnZ4oIo7UAFFFFAGYOnFOzRwKMCt2QLmnDGKZThzSGP4xTc4oHWg470AHPWnLzSAVIAKTATpQ1GOeaCKQCA07rQBTgMUMAoIpwpSOKQDRilxQBThQAmKWlxRikMKKWkFIB1FGaKAF60YpBSigApDSk80GgBKUUCg9aBjsUlApTQAw0hoOc04UAIMil60poxQACikoFAC0hpaMigBM4FJ1petHSgBvNLTsAigCgAFFLTTQApNJSiigQuKTFLmkJoGBNFHWloATpRQaO1MQuM0hoGaWkMZnNLS4FAFIBO9OoxSYNMBaTFJSjpQAHrSEUGigBetKKQUCgAIoxS0hoAXFJQDS0AAGKQ9aXPakxQAClopDSGFBpvINO60AGaMUYoNACZ5p2Kb3p3amAdqO1HWjFAgFLikpaAExThwKSlFAw60YpwFPVc0AR4zUgTipVQelTLEoFJsCttpNpFW3VdvAqAnihMZCaQinMaaTTAbTTQetFAhKKRjSA0AOIpMUuaKBDcYoFKelIOKQw5NJS5oFAhCKbinUdaAEBoJoxRQAZoptFAGepyKd2qMDBqQdK3JE6GnqaaaWjoA4EZoPNMB5p3ekIXmnqabTlFIYveloxSDrQA4cUuc0lGaQCinCmg80uaQx9GaAcikqQClU9aSjNADs0lJmnLzQAooNLjFAoABS0Ac0mKADNNJOadikxQMUNSjmkC04CgAPFJmlNGQaAEI4oFFBFAC5ozmmmgGgB2KTmjNKDmgBKKUigUgEBoNGKXFACdqd2pKKYC000tGKAGg0vWkxg0ooEGDQKdSYoGKBRRSdKBjsZpKM0CgQlFBoB5oAU9KKXGaSgApDS0hoGJQKQU7FAhaSloIoABTscU3FKaACkxijNFAwApelANBoAaeTTh0pmDSg0AONJQaAMCgBDSig0CkIKQ0tJTGGKUUUooAKKKKBBS4pKcKBoKUDNIBmrEceQSaBkYQmpVjOQADVq3hVuat+QAOBWcqiQWKKxMOoqQJkc1a24HNQyFQtTzXCxA44qqx5qd2+U1UY81qgENNpSabTEIRzQcCkPWigBKKU0gpAGaAaCtNxigB9JikooAUik6UA0HmgAyMUlKKDQIbTc0+kNACZopcUUAZwFOpvPagEnrWxIvWnAUnakB5oAU8GnKaQjNA60gH8Zpc00DmnKOfagBRS0UnWkA4UuKSnd6QxMUoFOHNFFwFFJRQTSAKWm0uaAFxSqMUnalB4pAOzSUoFBFIAFBpoNOoGApRSUd6YDsUtNpR0oADSdKDSA0AL0pSaQjNLjikAw0oFLijpQAuKOhoBzS0wCkINOooAZThQRRSGFIelLSHpQA3mlBpKUYouIWijFFMBaKSlFAwooooEFFFGaAE70uKQ9aXNABzikFLRQMKKKKBCYpxHFJ3px6UDGUoNAFFAhc0lGKKBhRSGlHSgApMmndKSgApKd2pKAEp3aminUgEAooJpKYC0oFJS5oAXim9KWk60AFL2oHSjtQAtKKRacKAHKM1agiLkVBGuTWraR4AyKmcrIpaksEPlip6MVDJNsrl1ky9iK5kCGqDyE96Lqcs5qszE10wjZEMcz5zUJOaCaTNWIM0maDzSUCDBpOaMmjOaACkzS02kIfmjOai3YNP3DFACmjtTM56UuSBQAZyaUCm9OaXNADjgU3OTQcmgDpQAUAUd6KAFxRSUUAZop2Bimqc0ua3ZIUg60vWnAZNIBQRQAM0oFKBmkAqignBopCKAHdqB0pAeKUUgHA1IBxUVPGcUmA/pSZ5oxmkxikMWgiijtQAChhilA5p2KAGj3opRQRSAcKO9IDS0AG0E0pGKAaXOaQxtLigU6mAwU7NHFIetADuopmOad2ooAQU6m45p1IApMUtFACdKM5oNFABzTu1MJpQc0wFopDRQAGlpKKQBRikNFAx1ApvSlXmgQtLikxzS9KYxDSAc0ZpaBARSU7NNoAKMUoooAKQ0uKTvQAClooBoAMUoPHNGaSgY6m96cKMUAJRQeKKAEyKMikooAU0gFL2pRigA6UlOOKKAGdKXrS4oxQAzBzTwKDilHNIBvejvSkUmKAFPSgUAUvSmAhpRx1o60uKAAVIo4pFFSqKBk1vHucCtdF2qKz7XCsM1f38Vz1G2xxdh5rNuSdxFSyTkMQDVOSUkkk5p04dRtleQfNUZpzNkk0zNbEiGkFDGkFACmm0p5opiG4pMc089KaKAF7UmKXPakPakA0rmkK4p9HWgCIDBp3UUpHNGOKBB2oFFLigBKcDim9KXORQAEc5opAeaWgBMUUtFAGUDilOc01TxzT63JHKKf16UwUoOKlgPHPFL0600HmnCgBKWlOKBSACM0oGBSg07tQMbinA4FAxikzSAUE5pxpg604mkAtKKaKcKAA8UvUUvWjpSAAKXp1oBzSEUgE707FNxinCgYYopRSGmAuaU02l60AOxmkI5pRS0ANzzRS009aAFxS00migB1JRRigAooxS4pDE60YwRR0pw5piENJilPWj0oATFJTqOKAEApaAKKAENKKKKQxaOtIKUUwE6UuOM0hHNGeKAFyDRikFLQAlGaXFJjFAAetFFFABQaKDQA3nNOBpAMmnUAHSlBpCM0lADutIeKUDFBFADKKdijGaBCUUtJQMdSZozSUALnNAoxRSGBoFFKelAhrGlXpSU4dKAAGlptApgOxilpKBQBKgzVlFAFQJx1qQOMUMCwrhelPe5JXFUyxPSmlz3qeRMCR5Cx5qFjQWphOadrAITTDS5pO9AxppRQaQUxC0GkJooAXqKQ8UUhpAJzTsZptLmgBegpODQelIAaADFL2pKdQIb1paD1pCaBgaSlwaSgAx3paQdeaXPNABzRRRQBlqKdijGKK2IHYpMUoNL1pAKF4zS5oHSlzQAAZ5pc0galzzSAXpTs000ooGKOlJgk0velHWkAqilxSZ5p1IBMUE0HrS9RQAqmlJpvSjrSAcPWgmgHAoxSGA5paTpS5oAUDNIfSnCgrk0AJijbS4xRTAcBQRTRTwaAGkHFM5zUueKaaQCHpSdaXrRigAAp2KSlJoASjrRRQMbTlNFFMBGoFLijFAgNIKWjFAAaBS4ooATpR1petGKQCdBQDQRSCgYpo7UuARRjFMBM0pOBSYooAM5opcYNHegA7UmDTjSZoAQA0tFGKAEHWnCkFOzQAmKTFKaTNABmg0nenYoAQUClIpAaAFpDS0UAM706ggYpBSAdTadSYoAQdacaAKQ9aAFPSkFJmloGOFGKB0opiADmnAUg606gY7dxSZpKKAsLuIpCxNIabQFgJNGeKCRimc0AOBopMijNIAJpKQ0oNMQUZoJ4pKAFzR1opTxSASkxS9KBzQAUUYoxTATvQaQ5zSn3pCEzzRSUtAw7UmKUU44xQBGaUUoxQcUAG4UUm00UCM880opFNKR6VqSOxRjmmg08etACdKXBxR3pc0DGA461IOaAARQBg0hBninDpRigYpDFxSrSYINKKADvT+1MxTlpAFHeg89KKQC9aXpTaWgBc0vam4zTgKQDe9L3pwAoxzQMAacDmkpcUABppp/akxTAFpwNJiigBTTM08dKaaQxaKaBmndKYBRRRQIKBzQRQOKQBS4pMYNLmmMSkINLilpANFKKKQ0AOzSYpAcU7OaYCZpQaQUvSgQZzTcc0opRxQMTNHWijpQAUuKKKAAmikNLQAUCjFHegBcUpxTaO1IAyKSilFAAM0uMUlJTAdRkUgpcUABNIOaCKB0oAKM0CjFACnpSYoPFFAC0hoBoNIBR0oxSUoNAwxRilopgGKMUAU6gBBTqbjBpTQAtJmgUUAGKQ0tNagApOtJQp5pABGDR0pTzSUAHWg8UZooENoBpaTGKAFpKCaM5oAXNAopc8UwEJ5opMUZxQIWmmlzQBQMb1pcYpRwaU0gEFNOadnFJSAbSigj0pV96YC0UuKKBGSM5p4NMpwPNbEjs0tMJwaUGkA+ndqZTxzQAgzmpMU2jJzSGPoUHNIOKcDikAtBFNJpc5NIAxilWloAoAMUY5pSaO9AC4pcUdRS1LATvS0gpTxigYoo70dqUdKAENCn1pxHFNpgOzR1puacOlAB2o6UCnYoAbmg0uMUlIYlFLRigBM0ZpcUmMigBQaXvTRS0wFNGKKWgQlJQaKAClxTSaUdKLAFKMUHpSCkMWkpaSgAFKOaQc0oGKYDgKCKTNFABikBpaQg0ADc9KTNABxR3oAcKQ9aWgdaQCUhpaKAExSindqQ8CgBKKSlHrQAU6m0ZxQA40hpM5peooAQGg0UhpgB7UdaO9LjNABRR0paQCUYpTQKAAHFKDmkIoFMBwpQabS5FAx1JRmm5oAdnFJmkzRQAZoJpDRQAUAZoopALjFNNKab3oAWkNKaSgQlKaBTttADKBTsUYoATrS4pM4pc8UAJSUtBoABS4pBS5oATFGaPWkzzQAUo5pDRmkAtFNzRmmA7NFJkUUAZOacKAKdWxAhFKtBPpSrnNIB+KUU4YxSYpAGKXFNzSgmgY6l7UzPanZ4pAKRQKKO9ADxRmgUVIC0nelzxTTzQBICCKXtTFWnYNACd6dTR1p1IBc5pc4puaXGTQMWmmlPFAHPNABiinUYpgIKdmmHrTqAAmkFLikFIYtFL2o4oAbmk5p2KMUAIDTsU0nFAbNACnikzS5o60AJS0GkFMAxS5wKKUCgQmaKUikoAAKXFIKXp1pDEAxS5pO9LimAlOzTaUDigBaSl600igB1J0pKCeaQBkk0oNFFABRnFIaSgB4NB9KBTc80AOApccUCmk0AKRikznikzmgUALjFLmkopgA70Ac0ZpM80AOIopOtHSkMWik60oFAgpaaTRmmA/FBFJmjNAwpKWigBabTjSUAIaWg0gpABopQM1KltK/wB2M49aG0twsQ0Zqx9klxkpikFtjqQKE0wIKMZqXYg6mmlgOlADdtIRSlqYTQA4CgnFJnFITmgQZozTCDSZ9aAH9aUUwGng0AGQDQeaQjJpOaAHDik5oFLTAD0ptK3FIAaQCE0qjJpcUYwaQARSYxTs03FMAooxRQBmLUgGaYBT+RWxAu2lA5oBzSgAGkAtAo6GlFIBCKBSmmg5oGLjmlpQKXFACjkUUA7RSg5FIAoBpeKTFIBRTsUzODTqQDhS5pgzSmgBaXFNFOpAJTu1JilzQMByaO9IOtBPNAD80dqQUopgAXNO200HBpc5oAWm0ppKBhnilNJRSAXPFFJS0ABGaQClooAMUYooBoAMUlLmkoAMUU7tSdTTAMUEUvSkzQAClNIOaWgA4pAadim0AGKUilpCeaAE6UgGad1oPFIBuMHFLtNFKKAE70YpQKUDHWgBuKSn9aSgBo607FIKKYxScU2loIpAC0Hg0neloAARSkZ6UmM0vSgBAKXFJ3pwoEIeBUZzmpaaRzQAgpw6UnSnZzTAbS0YpaADtTe9OooAKTNOI4puKBi0UCnZFAhApNPCA0hfimbjmkMtQCNJQWwa1hPCqA7gB6Vz5JJpPMPQ1M4cw0zQur8M2EHFU2mJ6moc5NBNOKsrCFLd6aTzkUdqUCmAA5pDSmkGTQIKUUYNKF9aAENNxmnnApM0ANAp4FNJpM0AP4pB1pM0CgBSaKKQsBT6AKeaSmbqM5pAPBxQTTd1JuoAfmk3UzPNJnFAiTNFMzRTAoA07dmmYwKFzurUkk6UAnNA96UDJpAKMmn9KZ0NOpAKKMCkBpQaBi8mgGlBxSE0gF60opAKWgAI9aUUuMijpSASnAUnelBoAKKUUtIYY4oPtQelApAL2oXml4IoHBoAU9aTGTTqQ9aADpQDQeaKYDgKOlJRmgBeopKKAKAENHNLRQAUA0UYpDFooFIaAFNJRRigAozS0hFAC5oHWk604dKAA0h6UZ5opgAoozRQAUtGKSkAEilFNYZNAGBQA40mcmgUEUAFFLkYpKYC5ozSUdTQAoNBPNIeKKAFyM0meaM0DrQAU6k70p4oAKSjrRSGFBNGaKAACkJwad2puKBADSijFLQAmKWiigY3BzTqDSigBKKU0maAFyKQ0hNIaYDutFM6UoNAhTTc8040wjnNIY4HmkPWgUuM0AIKUD1p6x5PWpVWNGBY0ANjtpZBlUJFK1rIgBdCAa1o723WMYIAHaqVzqIlUxovGetZpyb2K0sU2hIphIHSh5WPU1HmtCGSbqTJNM3YpN1MLinNAphY0BvWgLjyabTWbNIDjrQIduo3UhoHSiwDg3rTG5NBNIDmgAyKM008mnYAFFguLupN1IOTQadguG6jdk0AUYwRQAuaKKKBFXA60d6SnVYhcClx6UAUuTQAgHNPxSAGnCkAmMUU7FIaAAUuPWkWn0DEFLjNJQKTAeDQetIKXrUgJSgcUbc0oGBQAg604Ak0g4NOzikAUAdaM5ozigYdKcKbnNOHSgBaMUlLmmAUUlAoAdxiikpQOKAEpRSGigYGigmikAUuRQRikoAdSYpKKADFLmlxRimAlGKDRQAmKWnUhpAJRiiigAxS0hNJmgB9NPFKDQSKAEpccUUhNAC9KSjrS4oASlxTe9PxQAlFL0oNADcUvXig0g60DDFOAopBQAUpoxRQAmKXtRRQAmKAMUYNJQA6m96WkzzQIWgUdqUDigAoNFFMBvOaUGl4ppoAdmim80CkMDSD0p3FIOtAhp4pVpzYpgOKAHmmk8UhbNITkUAOB4o3EU0Hik3UASbz2pCSeppoOaRqAHbqTPvTBmkJxQA4nNITxTc0daYgozRjmnbMigBop1KEwKcAMc0AMwKYV5qbbSke1K4EOOM0oGRT8Z60oFO4WGFRik2cVLijFK4EQT0pCpqYDHNGOc0XAiUYHSnbafigLRcLEZSk21Nimmi4Eew0VJmincLGbnmlHWgClxWhI8HHNLmmCnkigBwPHNOyMVFmnDgUgHg8UmM03mgE0gHgYpRTRSg4oAKUUHpTQeaBj80oNGOKMUgHjpRmm9uKOTUgOoJoAoxQAmaOtLilAxQMQCnZxSZFKOaAAUuKTvTqYCdKUUYo6UABpQeKQnNFAC5oNNpc0DCl70dqAeaQCkikNGKD0oASiilFABmjNFKeKYCE0UlFAC80ULTqAG0UuKSkAGkpwFBFACCjHNKBQRTABSEUUUAA60rGkHWlNIBKXNIaOlAC5oPFIKCeaYBmgUgFKODQApNApaTOKQxTSZpcikPNAhaKQGg0ABoHSkpcUAKOlIRS4ppoAKUHNA6c0nSgAzg0daSigBaXIpM0hFAC7qTNIBR0oACabk5pSaTFAD6aaTJpRzQAwnFHUUOMmgDigQoHFIeKd0FGKAGg07FAHNSEcUDI+lNI5qTjNGBQBGFzShcVJgUmMUAN2804LilzS5oEJilxigk0maBi0g60GigBW6Ug6Up6UnagBaKM0lMBaSkJxRSAWlopKBgTTeppTxSd6BDsCikzRQBmCl6UmaMk1qQLmlJpApFPCkigYgz1p4PFIBgYpw6UCAHNJThQaQApp5ximqAacQAKkAXkUhHNOAxSHrQMUUtJt70uKAFFO4zTRTqQAaAaWkpALSigCm/x0DHdaUCm9DS0ALik70tGRTAWjtQOaKBgBRilFApCG9aOhpxFNPWgYtJilo6UAKcijNBNIBmgBaKQ8UCgBQeaDzRSUAKBxS9KTtQBQAvakzSnpTaAFBoPWgCigBaKbmlAoAWjPFBo7UwAc0tNooAXFIaXPFJQAoIoo4ox6UgEA5oxzS9DRigAoxRS9KBhRSGgUABoBFLikxQAY5paKKYBikpaKQCmmYyacKKBCHimE088000ANDU4c0mKToaAHUtJRQAhFJTh0oxQAz8KKkzjtTcUAJinAUYpw6UWENK0m2nilI4oGMC8UuKXpRQAmKU9KM0UDGdKd1FG2jtQISl60dDRnmgYbaOlLmkzQICaQZNAHWl6UDAikpabQIWj2pB1pe9MBcUlOoNAhtFHSjPNIYmcUZpcZoxQAmaWikGc0AHFFLiigDK3c1IpFRgAilA9K1IJiRRmo8807NAC96XNJnNOC5oAXOaBSdKcKQADinDk00rSrxSAXoadxScUUhh7U7PFIBzSmgAzTqYKXNIB1GcUg4paQDgc0hxQOKOtAxO9OpcUd6AG5paTHNKKAFFLgmkpc80wHY4oHFNHNLQMXODQeaaaM0gHY4phpc0dqAE7UoNN704UAB60ClxRjFACYpRSGgUALQKKKADrRSHiigBaSlPSgCmAAUtIaSgBxo7U2igBe9B60gpSKBBQaTNKDQMAaDQRmk6UAGeadTQKXNIA70tA5paAEFLikxS9qAAmkORSZ5pxpgJnFITS0YoATNKKMUYNAC0hoFIaQCig4ptLQAUmKWloAQClxRSUAOxRTaXNABxmgik70vWmMQEUppMUUCAdaCaBQTSAM0p5FJQSRQMTOOKUUnU0ooAd2puKM0ZoAQ0YpO9LnFAC5oFNp3agQUdOtJSGgB2RQcU0dadQAUnNLSjFAxM0ppMc0p6UCEpppQ1BNAxoJzS5oBANLQIKXIzR2ptADsiimZNFAGYDS0U7FbEgATS0ZwKM5pXEANPVjTQvPFSAYpMYc96AKDzRSAUHH0ozzSHpQKAHinY5ptLSAdQKXtTehpAKRRijNLjmgYUdaXFLSAKWjNGaAEozRSGgBSaWkUZNKetACgUYoBpc0AKKKAaaaAHYoPFJmigYUtFFACGgUuRTc0APzRjIptOoAQjFJSmjFAAKB1pOhxRQAtGKTBpQaAF7UlBNKKACiiigApCKWigBKTNOpMUANxThSYo6UALRRmgUAGMUlPpMc0AItKetHQ0tAxBRml7UmKYhDxR1pxHFIKAEFB4pcc0GkAmaXNAoPFAwxTTSkmgUAJRS0tAhAaWjHNLQAlBFA70UDEpcUpxSUCF4pKQ0mcUDHim96TdmlFACZpw5pDS9qBABQaOaSgYUUUYoAMUnenY4pp60CHEcU360HNJQAE04dKbSigAxRQTnigdaAA8UmaVsE03bzQA8UZoHSkoGLnmlJ4pAKXFADKMZpT1pQKAGYwaWhutC0ALmkPJxQetJzQA7bRSc0UCM3FLupM0laogduoAptSAcU2A9cAU49KjGadnFSMBS0daADQAGlFGKTFADs0ueaQLSgYqWA4HiigUuKQBilozRjNAxwooHFLmkAgIpTTSOaOlAC0Ypy0UAIKXGaAMUtACYoAxS0UAAFHSilxQAlFHeigYU7tSYo6UAIaTrS0UwCnAYFIKXNAhD1ozQaSkMOppc4NIelJTAeKTFHakzQA6kFJRSAdQaTNGaAF7U3vS5xRQAlGaUCkIxQA4UhpM0ZpgFHeijrQA4UuabSd6QC8Zp1IcUCgA70nel70lMBc0DrQKDQAtIaKTNIBQaDSCigAooHemk80DHUUgpw6UAFLTc0uaYCUDNFGaAFxzRSdaWgQUh6UHpR2pAIFpcYpRxS0DEPSkFFIeKBDs8UYpo6UUALSZwaXNIRk0ALuozyKMYpppgPPNNoBopAFKKQUnO6gB5xzTad2ptACZozzSUoHNADhS4pvelzQMdRikzRmgBD1ozSdTR0oAKKTNBoELRikFLQAlFLRSAySeacDTcU4VuQL3p4NIBSA80ASA8UHrS5GKRqkB2QBSg0wcmnd6Bik5NIOtKeaBSAcOOKM84oAzzS45pALjFO7U2lJpAJTwaZThyaQx1FGcUgoAXGaUikHNLQAA0h4PFLikxQAuacKbS5oGKaDSZpaBCAGloooAKAaOtNxg8UAOzRRS0DACjFLRTAOKKQ8UdqAEooBGaUikAnUUgFO4ooAO1JSmkoAXFJjFHNLQAlFOppIoAKcKZmnDigBe9HWjIpM0AKRSUpphNADjRSDkUxic0wJMiioiTTg3FIB9HNIDxShqAFFFITQDQAUGjNIaBju1NxS54oHSgQCg9adTcZNAAaSnYpDSAKUCijoKYwxSYpc0GgBpNJmnYpD0oAUUU0c0tFxC0opvIpRTAWgUhopAB60h5FAp2KAGDilpSKKAEpaSndaAEoNB4pe1AxtFFKBQISlFLikNAxCc0uOKTFOzxQISkpCaFoAXvSgU00qnmkMXGKKd1pCKYCEikJpKMc0AFGaXbig8UCEFBozS0ANop2KKAMw0AUYpw6VqQKvWgjmkB5pQeaADkHNL2pcZ6UbaQxAcU4HmlCil2igB/GKABSfSjpUgL0oBpKUcUAOFGKM0maQCgU7AFN5oDUAKRTh0pO1ApDF70nU0pFN2kUAPoqIkimrMpfbnmnYCelAo4xQKQDhSHigdaDzQMQ0Up6UgoAUUh60tFAhBS0YxRTGGaUGkpRSAD1pe1GKaTQAY5o70UCgBSKQUvNGc0AJmigCigApaSigBc0dab3p1AxMUE0uaQ0CCiiigB2aaaOlLQA2mk0+mlaAGCpMU0ClwaAHCkPWkwaMUAHOaeKQUtAAaTNLim4oAcDS0zpS0AOoFNzS9KAHGmmjNIc0hi0p6UmKWmAgpWptLjNAAKRhS9BQMY5oAatLnmikxzQIdSikooAXHNKabzQaADFKKYTSg0AKeKSlJyKSgBM0tN706gYuKTtRmk70AKOOtLmjFJmgQuaTOaKKAFopKSgAyKMigjFIBSAdSClxS4p2AM0madSEUDGk80A4oA5peKQC5pDQSKTrQAg606gik5piFxRRk0UAZoODTgKZTga1IFxRjmimlqAH78GjfUfWl24GaQEitk1IMGoV5NSICKAH4xSZzSZpwFIYKOcml5JooHWkAtFLSUhjhyKAKQZp2KBB0FJjNBOKUdKQxcUoooHWkBHKp2nHWqkFu3mGRs9a0CM0YxVJ2AaD2pwppGDSikgHYopQeaTvQMQ9KUUUtAC4pvSnCkagA60nSlpDQAmacMimY5qQcimAmc0UuKMUAN604CmjrTs0gENJS9aaetAC5paBRQAmacMU3FKKAFxSGndqb3oAAMUEUE0gNAC4oNIaSgBx6ZoXmk7Uq0AGOaU4NFHFADelFO60hoAKQ0uKXFADQcU7rSGloAXjFJQelJmgAI4pO1LnmlIzQA0c06kAoNABRSgcU3vQA6igGk70DDFHIopTQAh5FJinCg0ANoPFKRilAyKBDeaUA0uKSgBelIelBozQMQClxRnmkJwaBC9BSEUmc0ooAb3p1IRTgKQDcHNLiloNMYA4ppGTQelAoEOFBpKUdKAGlsUZyKCuaAMCgBKUCgU7igBvNLS0lACg0E0mKQ0AGaYSc0p4pQM0hh2oGc0uKBQAtGaQnmlxmmIKKNtFAGYaF5NIKcMZrVEDscU3rTx3pu2kxiqKeAM00U7vQAYA6U4NxTe1C0AL1p4pvQ08UgFFLTeQaUGkAUA80pGaQCkA/FLTeacDmkMTHPNKOKDSCgB2c0g4NLjNJigBec0uaSigBTRSHpSUAPFBIJpop2KAClFIKQigBxpM0tNoGKKcaaKXNACU4U2igB9I3Ao7Uh5FADR1pe9FKKAFppFFHJoAWgUlFAC59KTNFBFACjNBFKOlFADKUA07bRnFADTQKXrRjNACUo4pDSgUAKOlGKSloAOlIeaTNOxQMKTNFJQAvWlHSm0oNAhSaTFJ3petAxaM8UmaSgQ7FJilHSigBKSnZptAAOtKaQUHNAC4zSHg0q5pSKAEzSd6dTT1oGBNKDxRjikNAhTSA0UUDFxSUuaQ0CEzzS0nWloAMUlLQaAEp3am0bqQBS5oFKRTAaRxSAGnGk7UAA607NMFFDAdRg0gJpc0rjEpRzRR0NAAeKaT6UpNIBTEKDQTzSYNHehgBFKOBSUpPFSAtGaQdKQimMcSDSA0Y4pBxTELRRRQBmAHNKPem7sGngg1qiR49qB1pRxSYyeKBC4wafimgUZ5pMY7bRjFGaN3rSAAMmpAMGkXFLnmkwAigUpOaaMk0gH5AoGKTHrTttAC8GjFJ0pSaQxaSiigBR0pTSCjvQAuKQ9KdSEZoAMGjFLSE80DFxSkU0GnZoAMUh4pQaRuaADtSd6XtRjmgBcClGMUlJQA40UgNJnmgB/bFJ0pvNGaACnLTaXtQAHrQKMUdKACjNJnNFAC5FJSiigBaAaSlFABSUvSjOaYDelKDSYooAXrS00UoPrSAWkpaO9ABilozSZoGJSU4dKQ80AApcUg4p1AhMUdKWigY3FJT+1NPpQAUUoFBFAgHIpCOaUUhODQAoxQTSCg9KADNHNAGRQeKAA0YoFITQMCeKQGl60CgQhNA6UuMml70AR5OacOaUiloAQdaDRjmg80AHWl7UgpT0oASkFOA4ooAMUvak70pPFADe9Bo70tADcUvFFFAABR3ozSe9FhijrSkU1eSacTQIaRQKWigApDTsU0ihgJRmgUEVIwBoJpKUChAJnilFLigEUxCUU7IooAytuacBg0AU4CtiRc0ufSkIpMUhEgPNHemDg0ZOaAJM0gGTSgZ5pcelAx3QcUtNOQOacOakABoBxR0NL34oAXJpSeKSmswzikA7NOFRg08HBpWAWlFHWgUhjjQKSimA7NJmgU09aBj8009aUUhFACjmlJoUU4igBlLRQOuaAEpaXFJQAE0AUCloATFGKUUpoAaaKXHNGKAACkPWlHFL3oAAaKSl60ANooPBpM0AFLzSCnCgAozRS4oAQHNIetOpOhoAQUGlzSZNABRQOaXFAAKXNNFKKAFxSd6dTe9Axe1JSE04cCgBMUopTzSDjigQtJmg0maAFzSUgzSigAzRmlxSGgBQeaRhzSUuaAFFIelKKQ9KADPFFIDQTQA7tTTS5pO1AABRQOKU9KACik5oFAC0maWm0AOPNNzTqaRQAoNLnmmgUtAC0U00gNAD6Q0mKMYoAM80Gk707FACc0ClzjrRjNABjimmlHWhutAAOlHNApc0AA6UUUGmAZpCaTvQetSwQoopDSikMTGacBikzzQTQhAabThSNTAM0UlFAFBetPpq07OBWxAhOBSDJo7804HFIBdtLtoDU4mgYKPWn8AVHmlzmkAp5FOWmbqUHmlYB5HelWmg5OKcODSAGzniqxOHNWqqSHDk01uBMDmng5qFDkCpFFNoEPzinA5FRlTThnAqRj80tM5zThSAcOtBFJmlOaAAdadgGowcGng0DHUU3NGaAFOMU2g80AUAOFJS0lAAKXqaTvSg0ALRSGjvQA7pRTSaTNMB+KAKbQTigANKKZzThSACKbTqYTQAopwqMU4HFADu9LUeTmnDpzQA7vSGkowTQAUc04UGgBuMUtJ1paAEpQaSlxQA4mmijtR0oACKd/BSZyaQnmgYZoFJiigQ402lzTaAHDpSd6XtS7aAEozThTTQAmc0UUUDHZpOuaWkNAAtLTRRQIUikoBpc0ANp1NNGaAHnpTQMmjNC9aAFxik704mm96AFooyMUmaAFpDSE0CgBccU3oadmkJpAL1opAKDTAKAT3pRig9aAExzSiim85oAXvQRk0daWkAlFOxSUwCjmg0buKAE5pKUnNNzg0mAucUuaYSc8U7tSAD1ooooADRS0lMBtFP4opgZw4FL1pO9P4rUgSnYppBpRSAUU7FN+lOBoASlFKcUoxSGR804Zp2M0oGKLgL9KcvFNpalgOJqpKpLVbpMDoRQtAIY0IAqUAjtTwMU4UNsCPHFIM1MRxTcCkMQcmnYxSgAUE80AIBS0UYoATbS4pScCkFAxccUd6M0mKACnL1ptHOOKAHE0lHam96AHUUUUAHJoHBoB4NFMANFFFAC0GigUAJSig0lIBc4puM06jpQAgWjFBNKKAExxQOlKelIKADHNL2pM0ufWgBKMZp3FFADSMUA04jNJQAlLRS9qAG0UopD1oABS/WkFKaAAkEUYzSUA0AOAxRijNLQAlBNKRmmkUAGcUhPNFJjBoAdTadSUAKDQeaQ0UAAoJopDxQAClpuaWgBaMUUUALSGiigBuaUUYpaAEIzSDjinGjigBAKDTjTSKQwzSUuKOtAhaKKMUwEo70UUAHejIoxmk20AOFITzQDijOaQCnpTMnNOPSkpgKelN9KWncUCDHFNxTs0mRzQMSiloPSkAlGKUUpoAb0pKU0nemAlFOxRQBQFOxTV60/ORWpAdaKaCc07OaQC4OadwKTNLwaQBwaeBSKBS54oGJjml6UmaQ5NIB2aUUgFLigB1FN6UvOKQCg8UoJpBxSigYpJpRSGlFIANGOKXFJigBQaWk4AoBzTADzSdBSjNKeRSABzRQCKWgY3rRS96WgBBRig9aM0gEzTgKbS0wFPSkpRQaAEoooxQAtGabzQKAF6mgilFIaAACnGm0uaACkp2KSgBaKO1IaAAijbnvQKUnAoAaRilpM5p1ACE0Dmg9KFoARqM8UpFAxigBBS4ooFABSGg0CgApQKO1KDQAUZzS0lABnikoJzRQAlKBQaSgB3amkc0oPFGRmgBDSCnGmigBaD0oIo7UAJilooPSgBaSk5paACjNFIRmgBaSgDAooAU0lLSZ5pALmikpaADtQKKQcGgBTRmkNBoAWkxg0vQUlAARRg0E8UmaAFwCKaBilyaXNMA68Ug4pexpooAdRmgc0uKQDe9GPSlIpKYBSjmkozQA6kNJmg9KQBSd6TJzS0ALkUUmaKAKAp44pq8GnZzWxAUopMc08DFJjDGacBTaUHmkApOKCeKKNvFACAUuaWgjFIB6ilI5pgalGc0gFpc0YoC0AFFLjmjFIYCnCkCmigBx6U2lpQKAEHIoFKOtLigApDSig8igBMYp1IOlJjmgY40lKCMUlACZpT0pD1oPIpAJTgeKb2pRTAd1oApOaUdKADIpaTFOFACYpMU4ikoAbRTsUUANoFBFJmgB2aSkNAoAUUtJS0AFB6UUhOKAACnEYpo4NKTQAlKKKSgB1JjmjmjNACnFNPWlJzSCgApRRQOlACd6cBTaXNAAaAaM5pvQ0AOxilzSdaXFACE8UgHFLilNADaOtLjikoAUUmMUUUAKaSiigApCcUuKM0AJ2pOaXmjtSABS0ClpgJRRRQAGm06jigApCaU0nagAprU7tRjNIBFFFOA4pMUABNFB6UlAC44pMUuaTvQAUdxRjNBoAKOgoDUvBFADQ1O3ZpuMUopgLmgUUCgANJilJ5ozQAHpRzSE9qXNIBDSjmkzQOtAC4oo5ooAogDtR0NIDzTu9bEigZozijNHBpCA0opcCigY7HFN5JpeaVetSAYxQPelPNIOuKADNPBpmKUUASA880meaaDzS4pAL3pcmm55pR1pDHZNOFNyBSd80APzSZ4ozkUYoAcKM0mKOlIANKOlNBzSmmMM80tNFOoEFFFJmhjAigUhOaAKkBT7UDrRmlUc00AvSjOaGoFMBM0oNLRQAZpKQ0CgAozRRQAvakApRTScUCFIoFAooGKBSmkzRnNABSdTS5xQPWgBcUYopM0ANINApaKADNKaTvQT2oAKTNBwKB60gFoNJmigAzS0w5oGRTAfmjGaQDNKOKADkUtJRQAtITmlpaAEHSkpcikzQAEUnSlooAAc0ZxQKKQADRRiimAUZoxQRQAZpc0lFAAaKKWgBuaWkNJzQA8UGmjNFABQDQaTGKQDs8Ug5pKUUgF7UYpM0daYBjJoNKOKYx5oAUUE9qaaWgBQKXFIKXvQAYoxRmjrTAXtSDigUHmgBp5PFA4pwGKKBCUCijjFIYUAc0DrRQAuaKbzRQBSHWnVHzTlrYgUigGnEgCmZFIB9OFMFOoAM05aaFzTwMCkxhnFJ3px5oxSAKD7UU6gBBT+1Mpy+9IBQKQinUhOaQxMGil6UhNADu1FIKUUAOpMHNGaDSAOlO6imjrTulMBCMUtB5pMUDFopBRQAuKXFNU80Z5pAKaQHBpetNHWmA7OaKKKADmlzxSUmaAHYoxTeadnigBKO9FA60ABpDTjTe9AB6U4ECkFFAg70UUEUDAnNAPFApcUAANIaUCmk/NQApoFL2ppoAWg03OKXrQACkJp1JigBAKWjFLQA1uBTQfWnsMimAYoAkBpvOaVadgUCEopTSUDClpAaXPFACd6DxQPWg80AJmlpDS9qADGaSlzgUlAC5opD0pB1oAXPNLSYpeooEFA5pAKTvQMd0pQaQ9KBQAN1pM0poyKQDeaXmlzQTxQAgPrTiMimdaXoKACkNFGaAExTh0oozQAE0zvSmkAoAcOaMUg4NBJoAUHmjIqPkGnKMUAKOtO702g5pgOoFJg0hBoEPNJTaMGgANKKTFBBFIYtHSgdKSgQuaKSimBn5pQTSU8GtSRpyRzSgYp/UUYpXAM4p2c00inAUDHLxTs8dKb2ozgVIDhQDg0gNLQAd6dSUtABmlzmm5pcd6QDqTHNICSaXIpALQcUmaXFAwAp69Kb0FAOKAFPWhqTPNDdqQAKdnNNxg0vFMB2KKTNHegYnWilyOtJmkIM4NGM0dTS4oGHakp1NoABTxTQKUUwHU00UnNACiigUUAHalFIelIOBQICTmkHOaWlAxSGNNANO4pMUwFoyKKCO5pAJTgaQYpaYATSADvSkUlACjApCaWkFADTS5xSkUdqQCZozRxmhhk8UwFzSZo5xTRQA4tzSjmmindKBARSjmm5pwoGFIaDTTmgApR0pBThSAO1FFFACGloopgGKDxSE0A5pAJSilxQKYCUopDQKQC0hoPAoHIoATnNL2oxS9BQA05oB5pc0mOaAFzSGgikxQA7tSUHpSA0ALR3opcUAJRQKQ0AL1oApBTu1ABSdqOtFACEGlxxRnFLnIoAb3pc0h60uKYC5zSg00nHFAoEL0oyKTiigAJpoky2CKdxSYBNIYEA9KQDFOxtFJTEJmijFFAFCnDmjGKcozWpI5RTiOaaBg5pSc0nuAtKKZzTqQAaSlApR15oGB6UinnmnGmkUAOGSadimjpSjNIBxHFN9qdupxxSAaKMZopwFADQMGn+lHFGaQxT0pvWndaDxSATFDDpSk4FJyaAFHJp1IOtLQAUGgnFJnNAxuKUUuOKBQAoFNJxTulNNAgzR3oBpe9AxRRRSkU0A3OKXOaTvS0AFFLSZoAQ0Z4pCeKSkA4UuaTtQKYC0UE80UAFKeRSd6Q0mAEEUopBzTh0oQATTTQaMHFMBAafjimDg07dQAHJpKCab3pAO4ooooAKMc0ZoJoAOnNJnNJyaXGKAEwadmkzgUdaBC5paQDikPFAxTRRnNHegBcUlOpp60ALRSUdKYBSHik3Umc0CH5wKQNTc8YoXrQAvOaeKYeDSg8UDBqQNgUhOaaKAH7uKXqOaaOTT+lJiE6UGgmk9qQxaXFJ0paEA3vS/SlxRjimADijPPNGRRigANNwaWjPFADcUE4pwoOKAEB5pW602nDpzQAmKUcCg9KbmgBe9OHNR5py0wFI5pOlLnFIaBDTnNOBoFKcCgBmeaWgUuM0hhnNHSk70p6UAGaKSimBU20o4NNBpc81qQOzxQp4pnWnjApALijNL1pMUAOBApRzTaUDipGOHSg4pBzS4zQAA0pNNxzS4oAXtRnijtRSAUGnA8U0c0tACk0g5pKO9IY8U7BFMBpd1IBM5p3akxiigBQaKbzS9KAFNKKQDiigYUtJg0GgBSwpO1JS4oAUYoNNBpxNACZp2aaBR0pgOopuaKBDqO9AHNI3BoAQ9aSlFKRikA2lFLRQMB15peppMUucCgBDQKO2aQ0AO6Um70o6imnrQA7dQW4pvNAoAO9OxRxSg5oAaRSig80CgQZpCc0Uo60DE6UHpSmk25FACDjpT85puMCgGgBCKcOlITQCaGAtIVpc0GkgACjvQaKYC5pp5NGaU0AJnFITQeuKKACjoKWkpiEBpO9KRRtJoAQ0ZoIpNtACUDrTsUYFADh1oPNIOtLSYwpRTTSr0pDF70tJmgd6EIKUU3pRmmAueaWm0UAJzmlFI1AoELSc0uaKBidKCacOaQjmgAU9qRuDTsDFMNMAHNPHFMXinZoEIaRSc89KU0nNADz7U2jJApM80AOFFJmlBpDDvRQeelIMg0wDFFO4ooEZ/IqRRxzTKeDxWjJDb3poPNOB9aTjNIY7PakzzimFsGlRhmmBJuxxSg0cUoFSAq8UE+lB4ooAdmimZyacDQAGlzxQRxSYNIAB5p+Kao5qTjFACYpQKQ0KaQxTR2p3Smk0gAGjvSAUpOKAFApTTAaXNADs8UlHahcdaGAtIetKWxSZyKQw7UDmlxRQgExQTS9qaeaYhQaXNM4FPByKADFFFHamAmeaGzSgUHmkA0GnZpuOacOlAwpM0Gm80APoNItOAoYCdqXHFIaTmkgHU2lFKcZpgJQO+aRhyMUtIANIDijBpcUwG55paXgU2gApRQKDQIKAaSk70DHnBpuOaOlFACkYFC9KOoo6ChiFxQOabnNFJDFBGadjNMxSg0wADmlNAoPWgBAKDTsjFMPNAADS02nUCFwCKTNJmg0DFopKMUCCmkU6kNAxQMUZ5oBpP46AFoFA70UAGKAaORRmkAlB6UEc0ZFMAFBpR0pKAEHWlNLikxzQAYoxgUZoPSgBVobg0gpaAG5OaD1p3WkxQAooNKMCgimAw0vaignigQZ9aQCgClHFACd6U9KQ8mlxxSABSnpmk6UUwG80UtFAymeKATSGl46VqQIOtSACm4p3Qc0gF2AjBpAgFLuzS0hgKcD7U0GnBvWgBDSijqaUDFIBAOacBSHrTh0oAAKXFJRmkAopelA6UhNACg5oBxSdKByaQx+aTPPNLjikxSAdkUnU0dKM4oAQ9aWk6mndqAGk04dKaaUUDF60opo4paBBuxSg5ppoFADscU2n9aTFADDzThSEU4CgBaTNHegUwCjtSGkzQAd6XNJRSAKDwKXFGOKABTS5pvenUAIeTRSHrQOtIYvQUA8UuKQjFMApabmjNAC5pc8UwnmlzQAoGetLgCkFO7UAN7UAE0oxS5FAhppKUkZoHFACUoo4pcZoGGKQ9KdwBTM9qAEC5pwFKoAFFAg4xTT0paQ0DFHIoNIOlIc5oAU0oGRTacDgUAJgA0tHWlNADSOaWjIpKAFNJmlyMU0jmgBRSHmlzQCM4oEJgig9KcaaTQMUdKQsM0Ak0EUAL1FNNKKB1NABniilprGgB1FM5NO5pgGaD0ppzS5yKQgFLSdKM+1AxegoGaQHOaWgQDig0macKAEpwOKTIpDQMUmm96TNKKYC5FJmg9aOxoEApc4pAeaCaBi9aKap5pTyaBBRRgetFAFMigdaOtOArQkXtQzZGKSkxmgBVHpTwKaoxTs0hikUgNANHWgBR1qTFRDrmn7qQARzS4o75p1ADcUYpxFNzzQAtKKTtRgikA4jpSYxRTqQxc0tNJ6UAZoAccGkp2BScZpANpc0ppKAGnNKOlLiigY0HmnUmMUoNAgpQOaDxThQMTpRmkamjOaGIWlJooApIBRzThTQMUuaoAxSbaM80ZoAQ0AZoxmnUhiYxRSmm5oEGOaXFHagGgAJFGRTe9FAxwNFN5ozQAp4pOtGCaAKAEAxSHrT+lJigQUuaKQjNAxeDzSUYxQOlACAU7vSdKXNACUA4oJooEOxkUbRSE4oDUDFNAoyKQ8UALSY4pMmjORQAdqM4opduRzQA3dntSjmjHWk6UALQDmjtSCgQ40nWg8ikxigBdo60daKKAACkIwacOtKRQAwHNB4pelIRnFAwFLQKXFIEN70GlPWl4oQMYc0Y4pxpG6VQCdKXNItK1AhDSrTc0uaBgRQM0A0v0oEIAKUmkzSnpQAgFKaAOKTvQMMc0Ud6U9qQDSMmlK8UUppgNHWnZ6000A0AJnmjvS4yaAOeaBAQQKM8Uu7migBM0UtFAFIGng5ppAFIDWgh+ecU7FIKXtQAhFKKReadikAmKXFBpe1ADsYFApM8UgbFIB9Lmo+tOU460APNJ2pQc0vGKQxAc0pORSCl7UCG9KXNAFOHApDAD1paQmkoAeTSCkHNKKQC5FITSE80UAFL2opeKBjc80vSjigmgAJpymmdRSjigBxFJgCkJpQM0MQGgGl+tIaSGLmkpBS0wEPWlpuDmpAKBDc4pQaQ9aBxQMU009acDRQITORSUtFACYpKeOlIRQMTNAoIoHFAh1B5HFJmkJPagBQtKaaCaU0AFHekFLkUDHY4puOaU0meeaGAEUgFONIOKSAMUYpTQOlNiDrTcUtGKQwwaQ+lKTSd6EAYpCDTsUmTTEIAadyKKSgABoNLim5oGHalHSkHNGKAA9aBSgHPNBoEFFFA5OKACjNFFAwxS0lANABnFN3EmloxQAtBIpM0ppAFJ1opAcmqAMUtITg0ZFAgPTigCkzQDQMdgGkHFNORRmgB5pMig0lAhc0lA5ooGOzScmkpQKAEJ6Up+7RjmjGaBCLgjmlwO1GNtITQMUA7qDQvXNB6UAN6mn44qMU/nFAhcUUzJooGU+SKcq0daeDxWpIoFIxpc03rSAetITg0DikJFADs8UDrSDpRQA8+lIBzSr70vPapAQnFJnmlPWnYzQMQNilyaNuKcBxQISjvRS0gFApcUgNOpDDHFGOKCaB0pAJ0NIDzTsUgFACd6dSY5paAENJTqKBjec07FFLQwGn0pw6UYoz2pIANKKQjNKBTYCHNFKaSkgDOKUZpKUUxATRnikxml7UAJS03NGaAHAUHikB5p1ADc0cmkanL0oGIeKQZzzQTg0mc0gHGkoBNHWmIKKXHFJQADijOaCOKQcUAKOtJjmlooGBpO1LSHOeKBC80E0ZwKXqKADPFIOtNPWnDrQAd6XNBFNzQAuc0tIBikPWkgFzSUoNFMYUUUhoAXGaQClXvmg0AFFNxmlxigQtBpBSigYlGKUikIoEKDmg8U0ZzSnrQAZ5oPBpCD1oxQMM0mc0tAoAUU7tTQKU0AIeopMelHU0GgQnelxQR3pRzimA3nNOwMUNSDPrQAuKQjig8UZ4oASinKOKa3BoAO1JmnDmmkUDHqKXpTFJzinbuKBBQKQGlpDEY0nalNANNAJnApDnFKR6UnoKBAKXOKMYpGBoAduFFMwaKBlUU8UynA1qQP7U3OWpc8UBe9IY49Kbil60tABSikzQDSAfijNGc0gGaQC9acDTaUelADutOpucCkzSAfimnrRuoPNABmnAE00U/tSGIRxSDNByaUUALmgUtFIBM0UlFAC96KDRQAZxTgajJwacDQA/FGKQGl7UAJR0opDQAjdKQZpScikBoAXmjkUtJmgAzQDRQBQMWko6UooAQUdTS0gHOaBCkelANKKOKAGHk0YpSQDRQAdKKCKVRQAZ7UUvSkNAARkU3pSk8UCgBc0E0Gm4oAM0uKTHNL2oATtRmgc0uKBjcZpwGKMUoPNDEKaMUGikhje9FL3pDTAMUdKAaXrQA3vTulL0puSSaSAM0UUUwCg9KDQOlACUUtJigBRR2oBoJzQAgpM80vQUg5oEO60hFKTimk0ABpO9FKKBigUppM0uaAExiilpDxQAtN6GnA5FGKYhjZNHIpxxSGgBueeaXvS9qTvQMWmkHNONA5oATpSetOI4pBQIF4NOxTTijpQAuKDSZNKDmkMUZpDxQDzSNTAcDmmnrQKUgGgBQRijtSYAFKOlAgooooAoCnU0U6tSRc5pwbik7UnTrSGOyetO6imbgacDQAdqQHmnY71WkZg1JAWwRQDzUCEnGalxQ0BJikpBSgE0gF5ooozQAUZ5pelHXpSAKd0poFPxxQMM0oBoApaQCZpuacRSAcUgEpaXFBoGBNKOmaTFHagQjDmlFAGetOwMcUDG04c0hFKpoEL0ppNO602gBtA60tAwKAFFBGKM+lISTQAA0oIpKKQCt2oFIBSigYEUlOphpiFBpQaQUUAB5NGcUUhoAXqKQHFL2puKAJMgikJ4pMcUlAATxSr0o7UlADqDTc0daQxM0tLiimIaeDS0GnUAJTQeacaTHNDAU5oBNLjIpCMUkMWijqKKbEIaXOKTrQaQxT0puaXPFNHWgB2aQUUCmAtBoooEIKCaDSGgBe1FGeMUCgANIAaWloGFIcUMaZmgQ7igYpKKBjqDSClJGMUAGaQ80goNMBRxS5poopABzQMmgccUvemAE8U0GlPJoAFAAeabnBqTjFNoEGeKAaSg8UAB60oFIKeKAEPFGOM0HmkwaBgDzTsZpuKM9qAADnilPApM4pd2etACdRSjgUZoxmgQUU38aKAKYp1N3Ypc5rUkePrQRxnNR5NGTikA4KM1ItRrUg4oGOzjikZQe1J3paQDQuKfmkoBpAOzgUKSaCeKAaAHYpQKZmnZxQA44pKTrR0pAGeacDio880uaBku7NL3pi07PNIQ402lzzQSKBiE4GaBzSA5pRQA6kJpaa1IBc0o6UwU9TQAdaTGKU9eKMGgYdKbnmnGmE4oAfSYpu+lzTEL0pcU3OaXNIApDR1pQMUAIMing0lLQAh602nmmkjFIYo6UGkWlNMQgNIDQelIOtADsig9KSkzQA7tSUmSacKACg89KQ0CmAdOtFIeaUdKTAdS4poo5pDFIpKOaAeaEAhHc0mc0poHSmwFFHWkoGRSAfSZ4puaUnAosAUUmaXtRYAPSmjrS9aTvTAU0tJ2oA9aYC0GjFITQAgBNBFKGyKPWgQCimk4ozQA6kzzQD3o4JoADyaXbRjFIaAEIpRTe9OoGKMUjcGlFNbOcUCAGlNJjApOc0AOFBFGKdQAwHmndqbjmndqBiYpKU9KQEUAHNGM0GgZyKBCHik605xxUYoAd0pwpMZp2MUANwQaCcDNLnIpKAAHIo70UuKAEPWlxR3pD1oAWlAGKbS0AG33ooxRQBQxmnLSGlBrUkcOtAHNKoo70AOApetJQKkY4DmlIpoNKaACgUgpaAFNKq0hpRQApxnijtQKdilcBKQ5obrS0MBoFPApKcOlK4wFOxxTB1p/akwEpPrQaUUAJjBp1J3pe9ACg0jUpoPSkA2nKKCOKUUAL0oJzS0hoYDaawp1I1CAYOKUZJpKKYDwKXvSClzgUgE6GlFJnNLQAvU0vam0ZoC4E02looAUUUUUAIaQDNKelJ2oAdxikxQOlNzzQA4CihaDTGJ3oBOeaB1oPWgQZ5ooFOxxQA0HmnZpB1oakAhNCmm05aAHHpTQDTqbQAtAPFN70uKAEIFKSMYpDRimAUo54pvQ0q9aAH5wKYT606kHJoGG4YozSHrS9qBBupDmkxTgcigBgGTTwOKSnDpQMTGaQ8DFOpnegTAGnUmKTPNAh3IpKU9KBQMb3pe1B60L96gAB4oB5pW4NJQA484ptIDTqAFxxSZINLSZoGBNJmlxxSHpQIOopO9KOlAoAM0DrQaB1oADzSYwKX1o7UAANL1po6UvagAIwKAc0dqQUhjsUGkB60maYC45oNJSigQlKOlFKKACiiigD//2Q==</ini>
				<jpg>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</jpg>
			</foto>
			<dedos>
				<dedo>
					<dedoAusente>0</dedoAusente>
					<idDedo>rt</idDedo>
					<imagem>INSIRA O IMAGEM AQUI</imagem>
					<qualidade>173</qualidade>
					<template>INSIRA O TEMPLATE AQUI</template>
				</dedo>
				<dedo>
					<dedoAusente>amputated</dedoAusente>
					<idDedo>ri</idDedo>
				</dedo>
				<dedo>
					<dedoAusente>0</dedoAusente>
					<idDedo>rm</idDedo>
					<imagem>INSIRA O IMAGEM AQUI</imagem>
					<qualidade>65</qualidade>
					<template>INSIRA O TEMPLATE AQUI</template>
				</dedo>
				<dedo>
					<dedoAusente>0</dedoAusente>
					<idDedo>rr</idDedo>
					<imagem>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</imagem>
					<qualidade>54</qualidade>
					<template>Rk1SACAyMAAAAAHCAFEDIAL0AMUAxQEABAAeRkEYAF0uGYGPAGSCEoFaAGUWDIGtAGXmDEEIAHM2DIG5AHRmOIHMAHpmMoGkAJFuK0D6AJIyEkFXAJYiPoGKAKGKGUD3AKayEkHsAKxWDEEMALO2DIG5ALTaDEEVALk2GYHfAL7KJUEuAMYyPkHiAMrOOIHQAMtWMkH9AM7SMkEKANY2DEEpANu+OIHkAObKPoIAAOlSH0G+AOq+DIGKAO7KH0GWAPlKMkEgAP2+MkHWAQDGH4HvAQPCGUHVAQ++OEFIASjCPoF2ASvSDEG+ASuyDIExATG6DIHjATLCDEH5ATI+K0GJATsGEkGiATySDIGSAUV2K4GyAUyiDEGTAVAaDIHaAVa6GYE2AVq6DIFxAVpaH4EJAVyyEoEgAWE2DEGVAWR+DIGaAWoSOIEtAW46DEGeAXL+OIF5AXxyGYHoAX/2K0G8AYSCH4FIAYZGDEFhAYZuK4EFAYwaK4D0AZEaK4GPAZR+OEHxAZduOIHCAaEKPkFwAbV+DIGLAbgGMoG3AcICOIFhAfyCMoFNAg8GK0FhAhCCJUGvAhWKH4GFAjAKHwAA</template>
				</dedo>
				<dedo>
					<dedoAusente>bandaged</dedoAusente>
					<idDedo>rl</idDedo>
				</dedo>
				<dedo>
					<dedoAusente>damaged</dedoAusente>
					<idDedo>lt</idDedo>
				</dedo>
				<dedo>
					<dedoAusente>0</dedoAusente>
					<idDedo>li</idDedo>
					<imagem>INSIRA O IMAGEM AQUI</imagem>
					<qualidade>75</qualidade>
					<template>INSIRA O TEMPLATE AQUI</template>
				</dedo>
				<dedo>
					<dedoAusente>bypassed</dedoAusente>
					<idDedo>lm</idDedo>
				</dedo>
				<dedo>
					<dedoAusente>0</dedoAusente>
					<idDedo>lr</idDedo>
					<imagem>INSIRA O IMAGEM AQUI</imagem>
					<qualidade>56</qualidade>
					<template>INSIRA O TEMPLATE AQUI</template>
				</dedo>
				<dedo>
					<dedoAusente>0</dedoAusente>
					<idDedo>ll</idDedo>
					<imagem>INSIRA O IMAGEM AQUI</imagem>
					<qualidade>33</qualidade>
					<template>INSIRA O TEMPLATE AQUI</template>
				</dedo>
			</dedos>
			<matricula>c112312</matricula>
			<dataGeracao>23/10/2018</dataGeracao>
		</cliente>			
		*/	
		
		/*
		// Cliente
		var structBaseXMLFile = {
													 cliente: {
																		 documentoCPF: "01786654873",
																		 tituloEleitor: "",
																		 documentoRG: "11111111",
																		 ufRg: "BA",
																		 unidade: "0004",
																		 dataNascimento: "1940/03/12",
																		 municipioNascimento: "ACOPIARA",
																		 uf: "CE",
																		 beneficios: [{
																									 beneficio:{
																															nome: "",
																															numero: "" 
																									 }
																		 }],
																		 nome: "ARTHUR MARTINS",
																		 nomeMae: "FLAVIA MUNIZ MARTINS",
																		 nomePai: "PEDRO MARTINS",
																		 sexo: "M",
																		 dataEmissao: "03/07/1980",
																		 foto: {
																					  ini: "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",
																					  jpg: "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"
																		 },
																		 dedos: [
																							this.structFingerTagRL,
																							this.structFingerTagRR,
																							this.structFingerTagRM,
																							this.structFingerTagRI,
																							this.structFingerTagRT,
																							this.structFingerTagLL,
																							this.structFingerTagLR,
																							this.structFingerTagLM,
																							this.structFingerTagLI,
																							this.structFingerTagLT
																		 ],
																		 matricula: "c060385",
																		 dataGeracao: date + "/" + month + "/" + year
																 }
		};			
		*/
		
		
		// Cliente
		var structBaseXMLFile = {
													 cliente: {
																		 documentoCPF: this.cpfnumber,
																		 tituloEleitor: this.tituloeleitornumber,
																		 documentoRG: this.rgnumber,
																		 ufRg: this.selectedValueUFRG,
																		 unidade: this.unidade,
																		 dataNascimento: this.datanascimento,
																		 municipioNascimento: this.municipionascimento,
																		 uf: this.selectedValueUF,
																		 beneficios: [{
																									 beneficio:{
																															nome: this.beneficionome,
																															numero: this.beneficionumero 
																									 }
																		 }],
																		 nome: this.firstname + " " + this.lastname,
																		 nomeMae: this.mothername,
																		 nomePai: this.fathername,
																		 sexo: this.selectedValueSexo,
																		 dataEmissao: this.dataemissao,
																		 foto: {
																					  ini: this.captureImageJpg,
																					  jpg: this.captureImageJpg
																		 },
																		 dedos: [
																							this.structFingerTagRL,
																							this.structFingerTagRR,
																							this.structFingerTagRM,
																							this.structFingerTagRI,
																							this.structFingerTagRT,
																							this.structFingerTagLL,
																							this.structFingerTagLR,
																							this.structFingerTagLM,
																							this.structFingerTagLI,
																							this.structFingerTagLT
																		 ],
																		 matricula: this.matricula,//"c060385",
																		 dataGeracao: date + "/" + month + "/" + year
																 }
		};
		
		console.log("Mostrando dados do arquivo...");
		console.log(structBaseXMLFile);
		
		return structBaseXMLFile;
		
	}
	
	//***********************************************************
	// fncCryptRSAStructClientTag
	//***********************************************************
	/*
	fncCreateStructCryptoClientTagData(){
		
		console.log("Washington - fncCreateStructCryptoClientTagData");		
		
		var createStructCryptoStatus = this.STATUR_ERROR_OK;
		
		var structClientTagData = this.fncCreateStructClientTagData();
		console.log("Washington - structClientTagData");
		console.log(structClientTagData);

		this.ServerService.cryptClientTagData(structClientTagData)
		.subscribe((res: any) => {
				
				console.log("Washington - cryptClientTagData OK");
				console.log(res);				
				
			},
			(error) => {
				createStructCryptoStatus= this.STATUS_ERROR_GLOBAL_RSA_DATA;
				console.log("Washington - cryptClientTagData ERROR");
			}
		)

		return createStructCryptoStatus;
		
	}		
	*/
	
	//***********************************************************
	// fncCreateStructCryptoKeyXMLFile
	//***********************************************************
	/*	
	fncCreateStructCryptoKeyTagData(){
		
		console.log("Washington - fncCreateStructCryptoKeyTagData");		
		
		var createStructCryptoStatus = this.STATUR_ERROR_OK;

		this.ServerService.cryptKeyTagData()
		.subscribe((res: any) => {
				
				console.log("Washington - cryptKeyTagData OK");
				console.log(res);				
				
			},
			(error) => {
				createStructCryptoStatus= this.STATUS_ERROR_GLOBAL_RSA_DATA;
				console.log("Washington - cryptKeyTagData ERROR");
			}
		)

		return createStructCryptoStatus;		
		
	}
	*/
	
	//***********************************************************
	// fncCreateStructCryptoXMLFile
	//***********************************************************	
	/*
	fncCreateStructCryptoXMLFile(){
		
		// Dados do Arquivo		
		//<ArquivoCriptografado>
		//	<clienteCriptografado>DADOS CRIPTOGRAFADOS COM AES E CODIFICADOS COM BASE64</clienteCriptografado>
		//	<chaveAleatoria>CHAVE CRIPTOGRAFADA COM RSA E CODIFICADOS EM BASE 64 </chaveAleatoria>
		//	<hash>HASH SHA256 DOS DADOS RAW</hash>
		//	<nomeArquivo>021020181307SP7266NB556.xml</nomeArquivo>
		//	<versao>2.0</versao>
		//</ArquivoCriptografado>			
					
		
		var createStructCryptoStatus = this.STATUR_ERROR_OK;
		
		var structClientTagData = this.fncCreateStructClientTagData();
		console.log("Washington - structClientTagData");
		console.log(structClientTagData);

		this.ServerService.cryptClientTagData(structClientTagData)
		.subscribe((resClient: any) => {
				
				console.log("Washington - cryptClientTagData OK");
				console.log(resClient);

				this.ServerService.cryptKeyTagData()
				.subscribe((resKey: any) => {
						
						console.log("Washington - cryptKeyTagData OK");
						console.log(resKey);	

						var structCrypt = {
							ArquivoCriptografado: {
								clienteCriptografado: resClient.clienteCriptografado,
								chaveAleatoria: resKey.chaveAleatoria,
								hash: resClient.hash,
								nomeArquivo: "021020181307SP7266NB556.xml",
								versao: "2.0"
							}
						}

						console.log(structCrypt);	
						
					},
					(error) => {
						createStructCryptoStatus = this.STATUS_ERROR_GLOBAL_RSA_DATA;
						console.log("Washington - cryptKeyTagData ERROR");
					}
				)
				
			},
			(error) => {
				createStructCryptoStatus = this.STATUS_ERROR_GLOBAL_RSA_DATA;
				console.log("Washington - cryptClientTagData ERROR");
			}
		)		

		return createStructCryptoStatus;

	}
	*/
	
	//***********************************************************
	// fncCreateStructCryptoXMLFile
	//***********************************************************		
	fncSaveXMLFileOnTheLocalFileSystem(){
		
		// Dados do Arquivo
		/*
		<ArquivoCriptografado>
			<clienteCriptografado>DADOS CRIPTOGRAFADOS COM AES E CODIFICADOS COM BASE64</clienteCriptografado>
			<chaveAleatoria>CHAVE CRIPTOGRAFADA COM RSA E CODIFICADOS EM BASE 64 </chaveAleatoria>
			<hash>HASH SHA256 DOS DADOS RAW</hash>
			<nomeArquivo>021020181307SP7266NB556.xml</nomeArquivo>
			<versao>2.0</versao>
		</ArquivoCriptografado>			
		*/			
		
		var saveXMLFileOnTheServerStatus = this.STATUR_ERROR_OK;
		
		var structClientTagData = this.fncCreateStructClientTagData();
		console.log("Washington - structClientTagData");
		console.log(structClientTagData);
		
		const objCliente:any = {
			dataXmlFile: structClientTagData
		}		

		this.ScannerService.saveXMLFile(objCliente)
		.subscribe((res: any) => {
				
				console.log("Washington - fncSaveXMLFile OK");
				console.log(res);
				
				this.fncShowNotificationSuccess("Arquivo XML salvo com SUCESSO...");
				
			},
			(error) => {
				saveXMLFileOnTheServerStatus = this.STATUS_ERROR_GLOBAL_RSA_DATA;
				console.log("Washington - fncSaveXMLFile ERROR");
			}
		)		

		return saveXMLFileOnTheServerStatus;

	}		





	//***********************************************************
	// MODULE
	//***********************************************************	

	//***********************************************************
	// fncChangeEndianness
	//***********************************************************	
	fncChangeEndianness(string){
		let result = [];
		let len = string.length - 2;
		while (len >= 0) {
			result.push(string.substr(len, 2));
			len -= 2;
		}
		return result.join('');
	}
	
	//***********************************************************
	// fncConvertU32
	//***********************************************************		
	fncConvertU32(buffer){		
		var strAux = buffer.toString("hex");
		strAux = this.fncChangeEndianness(strAux);
		//console.log("strAux: ", strAux);
		var bufAux = Buffer.from(strAux, "hex");
		var intAux = bufAux.readInt32BE(0);
		//console.log("intAux: ", intAux);
		return intAux;		
	}
	
	//***********************************************************
	// fncShowNotificationError
	//***********************************************************			
  fncShowNotificationError(message) {
		
		this.toastr.error(
		('<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' + message +' </span>'),
			"",
			{
				timeOut: 4000,
				enableHtml: true,
				closeButton: true,
				toastClass: "alert alert-danger alert-with-icon",
				positionClass: "toast-top-center"
			}
		);		

	}
	
	//***********************************************************
	// fncShowNotificationSuccess
	//***********************************************************			
  fncShowNotificationSuccess(message) {
		
		this.toastr.error(
		'<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' + message +' </span>',
			"",
			{
				timeOut: 4000,
				enableHtml: true,
				closeButton: true,
				toastClass: "alert alert-success alert-with-icon",
				positionClass: "toast-top-center"
			}
		);		

	}	
	
	//**************************************************************************
	// Function delay
	//**************************************************************************
  delay(ms: number): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }	

}
