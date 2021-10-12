import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { IResponse, ICrypto, ISensorID, IReaderInfo, IKeyExchange, IEncryptedData } from '../interfaces/interface';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
    })
};

@Injectable({
  providedIn: 'root'
})
export class SiabmScannerService {
    //Antigo
		//baseUrl = 'http://localhost:9912/api';
		
		//Novo
		baseUrl = 'https://siabmdevices.caixa:9912/api';

    constructor(private httpClient: HttpClient) { }
		
		/*
		// WebService FingerScanner
		
		m__router.get("/api/initializeCapture").handler(this::initializeCapture);
		m__router.post("/api/finalizeCapture").handler(this::finalizeCapture);
		m__router.post("/api/startCapture").handler(this::startCapture);
		m__router.post("/api/stopCapture").handler(this::stopCapture);
		m__router.post("/api/setCrypt").handler(this::setCrypt);
		m__router.get("/api/getRandom").handler(this::getRandom);
		m__router.get("/api/extract").handler(this::getTemplate);            
		m__router.get("/api/getReaderInfo").handler(this::getReaderInfo);
		m__router.put("/api/setReaderInfo").handler(this::setReaderInfo);
		m__router.put("/api/keyExchange").handler(this::keyExchange);
		m__router.get("/api/getCaptureInfo").handler(this::getCaptureInfo);
		m__router.get("/api/getCaptureScore").handler(this::getCaptureScore);
		m__router.get("/api/getFirmwareVersion").handler(this::getFirmwareVersion);
		m__router.get("/api/getAPIProjectVersion").handler(this::getAPIProjectVersion);
		m__router.get("/api/getWebServiceProjectVersion").handler(this::getWebServiceProjectVersion);
		
		//************************************************************
		// Washington
		//************************************************************
		m__router.get("/api/extractImage").handler(this::getImage);
		m__router.get("/api/matchTwoFingers").handler(this::matchTwoFingers);		
		*/		

		//**************************************************************************
		// GET initializeCapture()
		//**************************************************************************
    initializeCapture(): Observable<IResponse> {
        return this.httpClient.get<IResponse>(this.baseUrl + '/initializeCapture');
    }
		
		//**************************************************************************
		// GET setActiveKey
		//**************************************************************************
    setActiveKey(keySlot: any): Observable<IResponse> {
        
			let params = new HttpParams().set('keySlot', keySlot);	
			
			return this.httpClient.get<IResponse>(this.baseUrl + '/setActiveKey', {params});
						
    }	
		
		//**************************************************************************
		// PUT setKey
		//**************************************************************************
    setKey(encrypteddata: IEncryptedData, keySlot: any): Observable<IResponse> {
				
				const paramsKeySlot = new HttpParams().set('keySlot', keySlot);	
				
				const requestBody = JSON.stringify(encrypteddata);
				
				
				let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																				   'Access-Control-Allow-Origin': '*'
																					});    
				let options = {headers: httpHeaders,
											 params: paramsKeySlot
											}; 				
				
        return this.httpClient.put<IResponse>(this.baseUrl + '/setKey', requestBody, options)
            .pipe(
                catchError((e) => this.handleError(e))
            );
    }			
		
		//**************************************************************************
		// GET getRamdom()
		//**************************************************************************		
    getRamdom(): Observable<IResponse> {
        return this.httpClient.get<IResponse>(this.baseUrl + '/getRandom');
    }		
		
		//**************************************************************************
		// PUT keyExchange()
		//**************************************************************************		
    keyExchange(encrypteddata: IEncryptedData): Observable<IResponse> {
			
				const requestBody = JSON.stringify(encrypteddata);
			
        return this.httpClient.put<IResponse>(this.baseUrl + '/keyExchange', requestBody, { headers: { 'Content-Type': 'application/json' } })
            .pipe(
                catchError((e) => this.handleError(e))
            );
    }			
		
		//**************************************************************************
		// POST startCapture()
		//**************************************************************************
    startCapture(): Observable<IResponse> {
        return this.httpClient.post<IResponse>(this.baseUrl + '/startCapture', "")
				    .pipe(
                catchError((e) => this.handleError(e))
            );
    }			
		
		//**************************************************************************
		// GET getCaptureInfo()
		//**************************************************************************
		//Entra ANSOL criptografado com a SK
		//Sai ANSOL + SPOOF criptografado com SK
		getCaptureInfo(encrypteddata: IEncryptedData): Observable<IResponse>{
			
				//let params = new HttpParams().set('logNamespace', encrypteddata);
				
				/*
				const criteria = [ {a: 25}, {b: 23} ];
				http.get(url + '/?encrypteddata='+ encodeURIComponent( JSON.stringify(encrypteddata)));				
				*/
				
				const requestBody = JSON.stringify(encrypteddata);
			
        return this.httpClient.put<IResponse>(this.baseUrl + '/getCaptureInfo', requestBody, { headers: { 'Content-Type': 'application/json' } })
            .pipe(
                catchError((e) => this.handleError(e))
            );				
    }

		//**************************************************************************
		// GET getCaptureScore()
		//**************************************************************************
		//Entra ANSOL criptografado com a SK
		//Sai ANSOL + SPOOF criptografado com SK
		getCaptureScore(encrypteddata: IEncryptedData): Observable<IResponse>{
			
				//let params = new HttpParams().set('logNamespace', encrypteddata);
				
				/*
				const criteria = [ {a: 25}, {b: 23} ];
				http.get(url + '/?encrypteddata='+ encodeURIComponent( JSON.stringify(encrypteddata)));				
				*/
				
				const requestBody = JSON.stringify(encrypteddata);
			
        return this.httpClient.put<IResponse>(this.baseUrl + '/getCaptureScore', requestBody, { headers: { 'Content-Type': 'application/json' } })
            .pipe(
                catchError((e) => this.handleError(e))
            );				
    }	
		
		//**************************************************************************
		// PUT extractImage()
		//**************************************************************************		
    extractImage(encrypteddata: IEncryptedData): Observable<IResponse> {
			
			const requestBody = JSON.stringify(encrypteddata);
			
			return this.httpClient.put<any>(this.baseUrl + '/extractImage', requestBody, { headers: { 'Content-Type': 'application/json' } })
					.pipe(
							catchError((e) => this.handleError(e))
					);				
    }				
		
		//**************************************************************************
		// GET extract()
		//**************************************************************************		
    extract(encrypteddata: IEncryptedData): Observable<IResponse> {
			
			const requestBody = JSON.stringify(encrypteddata);
			
			return this.httpClient.put<any>(this.baseUrl + '/extract', requestBody, { headers: { 'Content-Type': 'application/json' } })
					.pipe(
							catchError((e) => this.handleError(e))
					);	
    }				
		
		//**************************************************************************
		// POST stopCapture()
		//**************************************************************************		
    stopCapture(): Observable<IResponse>{
				//console.log('POST stopCapture');
        return this.httpClient.post<IResponse>(this.baseUrl + '/stopCapture', "")
				    .pipe(
                catchError((e) => this.handleError(e))
            );				
    }				
		
		//**************************************************************************
		// POST finalizeCapture()
		//**************************************************************************		
    finalizeCapture(): Observable<IResponse> {
        return this.httpClient.post<IResponse>(this.baseUrl + '/finalizeCapture', "")
				    .pipe(
                catchError((e) => this.handleError(e))
            );
    }			
		
		//**************************************************************************
		// POST setCrypto()
		//**************************************************************************		
    setCrypto(crypto: ICrypto): Observable<IResponse> {
        return this.httpClient.post<IResponse>(this.baseUrl + '/setCrypt', crypto)
            .pipe(
                catchError((e) => this.handleError(e))
            );
    }

		//**************************************************************************
		// PUT setReaderInfo()
		//**************************************************************************		
    setReaderInfo(encrypteddata: IEncryptedData): Observable<IResponse> {
			
			const requestBody = JSON.stringify(encrypteddata);
			
			return this.httpClient.put<any>(this.baseUrl + '/setReaderInfo', requestBody, { headers: { 'Content-Type': 'application/json' } })
					.pipe(
							catchError((e) => this.handleError(e))
					);	
    }		
		
		//**************************************************************************
		// PUT getReaderInfo()
		//**************************************************************************		
    getReaderInfo(encrypteddata: IEncryptedData): Observable<IResponse> {
				
			const requestBody = JSON.stringify(encrypteddata);
			
			return this.httpClient.put<any>(this.baseUrl + '/getReaderInfo', requestBody, { headers: { 'Content-Type': 'application/json' } })
					.pipe(
							catchError((e) => this.handleError(e))
					);						
				
    }		

		//**************************************************************************
		// GET getSessionKey()
		//**************************************************************************		
    getSessionKey(): Observable<IResponse> {
        return this.httpClient.get<IResponse>(this.baseUrl + '/getSessionKey');
    }

		//**************************************************************************
		// GET initializeIsActive()
		//**************************************************************************		
    initializeIsActive(): Observable<IResponse> {
        return this.httpClient.get<IResponse>(this.baseUrl + '/initializeIsActive');
    }

		//**************************************************************************
		// GET captureIsActive()
		//**************************************************************************		
    captureIsActive(): Observable<IResponse> {
        return this.httpClient.get<IResponse>(this.baseUrl + '/captureIsActive');
    }	
		
		//**************************************************************************
		// PUT convertImageWsqToJpg()
		//**************************************************************************		
    convertImageWsqToJpg(wsqdata: any): Observable<IResponse> {
			
				const requestBody = JSON.stringify(wsqdata);
			
        return this.httpClient.put<IResponse>(this.baseUrl + '/convertImageWsqToJpg', requestBody, { headers: { 'Content-Type': 'application/json' } })
            .pipe(
                catchError((e) => this.handleError(e))
            );
    }	
		
		//**************************************************************************
		// PUT saveXMLFile()
		//**************************************************************************
    saveXMLFile(rawData: any): Observable<IResponse> {
		
			//console.log("Entrou na fnc saveXMLFile");			
			
			const requestBody = JSON.stringify(rawData);
						
			let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																				 'Access-Control-Allow-Origin': '*'
																				});
			let options = {headers: httpHeaders}; 	
		
			return this.httpClient.put<any>(this.baseUrl + '/saveXmlDemoFile', requestBody, options )						
			
    }		
		
		//**************************************************************************
		// 
		//**************************************************************************		
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,				
					console.log('Backend returned code', error.status);
          console.log('Backend returned message', error.error.message);
        }
        // return an observable with a user-facing error message
        //return throwError('Something bad happened; please try again later.');
				return throwError(error);
      };
}
