import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { IResponse, ICrypto, ISensorID, IReaderInfo, IKeyExchange, IEncryptedData } from '../interfaces/interface';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Buffer } from 'buffer';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
    })
};

@Injectable({
  providedIn: 'root'
})
export class SimulateServerService {
	
    baseUrl = 'http://localhost:8080/cef';

    constructor(private httpClient: HttpClient) { }
		
		
		//**************************************************************************
		// GET SetFixedKey
		//**************************************************************************
    setFixedKey(): Observable<IResponse> {	
			
			//console.log("Entrou na fnc setFixedKey");
			
			let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																				 'Access-Control-Allow-Origin': '*'
																				});
			let options = {headers: httpHeaders}; 			
			
			return this.httpClient.get<IResponse>(this.baseUrl + '/set_fixed_key', options);
						
    }

		//**************************************************************************
		// GET SetSessionKey
		//**************************************************************************
    setSessionKey(): Observable<IResponse> {	
			
			//console.log("Entrou na fnc setSessionKey");
			
			let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																				 'Access-Control-Allow-Origin': '*'
																				});
			let options = {headers: httpHeaders}; 				
			
			return this.httpClient.get<IResponse>(this.baseUrl + '/set_session_key', options);
						
    }	
		
		//**************************************************************************
		// GET getKeyData()
		//**************************************************************************
    getKeyData(randomNumber: any, key: any): Observable<IResponse> {
			
			//console.log("Entrou na fnc getKeyData");				
			
			const httpParameters = new HttpParams()
				.set('random_number', randomNumber)	
			  .set('key', key);		
			
			let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																				 'Access-Control-Allow-Origin': '*'
																				});
			let options = {headers: httpHeaders,
										 params: httpParameters
			}; 
		
			return this.httpClient.get<IResponse>(this.baseUrl + '/get_key_data', options);
    
		}	

		//**************************************************************************
		// GET getParametersData()
		//**************************************************************************
    getParametersData(parameter: any): Observable<IResponse> {
			
			//console.log("Entrou na fnc getParametersData");
			
			const httpParameters = new HttpParams()
				.set('parameter', parameter);	

			let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																				 'Access-Control-Allow-Origin': '*'
																				});
			let options = {headers: httpHeaders,
										 params: httpParameters
			}; 
		
			return this.httpClient.get<IResponse>(this.baseUrl + '/get_parameters_data', options);
    
		}	
		
		//**************************************************************************
		// PUT cryptData()
		//**************************************************************************
    cryptData(rawData: any, parameter: any, optionalRandomNumber: any): Observable<IResponse> {
		
			//console.log("Entrou na fnc cryptData");										

			var paramType;

			if(optionalRandomNumber){

				paramType = new HttpParams()
					.set('random_number', optionalRandomNumber)
					.set('parameter', parameter);	
				
			}
			else{
				
				paramType = new HttpParams()
					.set('parameter', parameter);	
				
			}
			
			const requestBody = JSON.stringify(rawData);
						
			let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																				 'Access-Control-Allow-Origin': '*'
																				});    
			
			let options = {headers: httpHeaders,
										 params: paramType
										}; 	
		
			return this.httpClient.put<any>(this.baseUrl + '/crypt_data', requestBody, options )						
			
    }			
		
		//**************************************************************************
		// PUT decryptData()
		//**************************************************************************
    decryptData(encryptedData: any, parameter: any): Observable<IResponse> {
		
			//console.log("Entrou na fnc decryptData");
			
			const paramType = new HttpParams().set('parameter', parameter);			

			let encrypteddata:IEncryptedData = {
				encryptedData: {
												data: encryptedData.data,
												dataSize: encryptedData.dataSize,
												signature: encryptedData.signature
				}
			}											

			const requestBody = JSON.stringify(encrypteddata);
			//console.log("encryptedData: ", requestBody);

			let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																				 'Access-Control-Allow-Origin': '*'
																				});    
			let options = {headers: httpHeaders,
										 params: paramType
										}; 			
		
			return this.httpClient.put<any>(this.baseUrl + '/decrypt_data', requestBody, options)						
			
    }
		
		//**************************************************************************
		// PUT createCryptXMLFile()
		//**************************************************************************
    cryptClientTagData(rawData: any): Observable<IResponse> {
		
			//console.log("Entrou na fnc cryptClientTagData");										
			
			const requestBody = JSON.stringify(rawData);
						
			let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																				 'Access-Control-Allow-Origin': '*'
																				});
			let options = {headers: httpHeaders
										}; 	
		
			return this.httpClient.put<any>(this.baseUrl + '/crypt_client_tag_data', requestBody, options )						
			
    }

		//**************************************************************************
		// PUT createCryptKeyXMLFile()
		//**************************************************************************
    cryptKeyTagData(): Observable<IResponse> {
		
			//console.log("Entrou na fnc cryptKeyTagData");										
			
			const requestBody = "";
						
			let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																				 'Access-Control-Allow-Origin': '*'
																				});
			let options = {headers: httpHeaders
										}; 	
		
			return this.httpClient.put<any>(this.baseUrl + '/crypt_key_tag_data', requestBody, options )						
			
    }


		//**************************************************************************
		// PUT saveXMLFile()
		//**************************************************************************
		/*
    saveXMLFile(rawData: any, cpf: any): Observable<IResponse> {
		
			console.log("Entrou na fnc saveXMLFile");
			
			const paramCPF = new HttpParams().set('cpf', cpf);				
			
			const requestBody = JSON.stringify(rawData);
						
			let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																				 'Access-Control-Allow-Origin': '*'
																				});
			let options = {headers: httpHeaders,
										 params: paramCPF
										}; 	
		
			return this.httpClient.put<any>(this.baseUrl + '/save_xml_file', requestBody, options )						
			
    }
		*/
		
		//**************************************************************************
		// PUT saveCaptureData()
		//**************************************************************************
    saveCaptureData(hand: any, finger: any, data: any, parameter: any): Observable<IResponse> {
		
			//console.log("Entrou na fnc saveCaptureData");

			const parameters = new HttpParams()
				.set('hand', hand)
				.set('finger', finger)	
				.set('parameter', parameter);						

			const requestBody = JSON.stringify(data);
			console.log("data: ", requestBody);

			let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																				 'Access-Control-Allow-Origin': '*'
																				});    
			let options = {headers: httpHeaders,
										 params: parameters
										}; 				
		
			return this.httpClient.put<any>(this.baseUrl + '/save_capture_data', requestBody, options)						
			
    }

		//**************************************************************************
		// GET readCaptureData()
		//**************************************************************************
    readCaptureData(hand: any, finger: any, parameter: any): Observable<IResponse> {
		
			//console.log("Entrou na fnc readCaptureData");	

			const parameters = new HttpParams()
				.set('hand', hand)
				.set('finger', finger)	
				.set('parameter', parameter);

			let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																				 'Access-Control-Allow-Origin': '*'
																				});
																				
			let options = {headers: httpHeaders,
										 params: parameters
										}; 	
		
			return this.httpClient.get<IResponse>(this.baseUrl + '/read_capture_data', options);
			
    }	
}
