import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { IResponse, ICameraID, ICameraOptions, ICameraInfo } from '../interfaces/interface';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SiabmCamService {
	
		//Antigo
    //baseUrl = 'http://localhost:9913/api';
		
		//Novo
		baseUrl = 'https://siabmdevices.caixa:9913/api';		

    constructor(private httpClient: HttpClient) { }

		//**************************************************************************
		// GET initializeCamera
		//**************************************************************************
    initializeCamera(): Observable<IResponse> {
        return this.httpClient.get<IResponse>(this.baseUrl + '/initializeCamera');
    }
		
		//**************************************************************************
		// POST setCameraOptions
		//**************************************************************************		
    setCameraOptions(cameraoptions: ICameraOptions): Observable<IResponse> {
			
				let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																					 'Access-Control-Allow-Origin': '*'
																					});
				let options = {headers: httpHeaders}; 				
			
        return this.httpClient.post<IResponse>(this.baseUrl + '/setCameraOptions', cameraoptions, options)
				    .pipe(
                catchError((e) => this.handleError(e))
            );				
    }	

		//**************************************************************************
		// POST startCapture
		//**************************************************************************
    startCapture(cameraid: ICameraID): Observable<IResponse> {
			
				let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																					 'Access-Control-Allow-Origin': '*'
																					});
				let options = {headers: httpHeaders}; 					
			
        return this.httpClient.post<IResponse>(this.baseUrl + '/startCapture', cameraid, options)
				    .pipe(
                catchError((e) => this.handleError(e))
            );				
    }			
		
		//**************************************************************************
		// POST manualCapture
		//**************************************************************************		
    manualCapture(cameraid: ICameraID): Observable<IResponse> {
			
				let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																					 'Access-Control-Allow-Origin': '*'
																					});
				let options = {headers: httpHeaders}; 				
			
        return this.httpClient.post<IResponse>(this.baseUrl + '/manualCapture', cameraid, options)
				    .pipe(
                catchError((e) => this.handleError(e))
            );				
    }			
		
		//**************************************************************************
		// POST getCaptureInfo
		//**************************************************************************	
    getCaptureInfo(cameraid: ICameraID): Observable<IResponse> {
				
				let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																					 'Access-Control-Allow-Origin': '*'
																					});
				let options = {headers: httpHeaders}; 					
				
        return this.httpClient.post<IResponse>(this.baseUrl + '/getCaptureInfo', cameraid, options)
				    .pipe(
                catchError((e) => this.handleError(e))
            );				
    }	
		
		//**************************************************************************
		// POST stopCapture
		//**************************************************************************
    stopCapture(cameraid: ICameraID): Observable<IResponse> {
			
				let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																					 'Access-Control-Allow-Origin': '*'
																					});
				let options = {headers: httpHeaders}; 			
			
        return this.httpClient.post<IResponse>(this.baseUrl + '/stopCapture', cameraid, options)
				    .pipe(
                catchError((e) => this.handleError(e))
            );
    }

		//**************************************************************************
		// POST finalizaCapture
		//**************************************************************************
    finalizaCapture(): Observable<IResponse> {
        
				let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																					 'Access-Control-Allow-Origin': '*'
																					});
				let options = {headers: httpHeaders}; 				
				
				return this.httpClient.post<IResponse>(this.baseUrl + '/finalizeCapture', "", options)
				    .pipe(
                catchError((e) => this.handleError(e))
            );				
    }

		//**************************************************************************
		// POST getCameraInfo
		//**************************************************************************		
    getCameraInfo(camerainfo: ICameraInfo): Observable<IResponse> {
			
				let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																					 'Access-Control-Allow-Origin': '*'
																					});
				let options = {headers: httpHeaders}; 			
			
        return this.httpClient.post<IResponse>(this.baseUrl + '/getCameraInfo', camerainfo, options)
            .pipe(
                catchError((e) => this.handleError(e))
            );
    }

		//**************************************************************************
		// GET initializeIsActive
		//**************************************************************************
    initializeIsActive(): Observable<IResponse> {
        return this.httpClient.get<IResponse>(this.baseUrl + '/initializeIsActive');
    }

		//**************************************************************************
		// GET captureIsActive
		//**************************************************************************
    captureIsActive(): Observable<IResponse> {
        return this.httpClient.get<IResponse>(this.baseUrl + '/captureIsActive');
    }
		
		//**************************************************************************
		// PUT convertImageBmpToJpg()
		//**************************************************************************		
    convertImageBmpToJpg(bmpdata: any): Observable<IResponse> {
			
			console.log("Entrou na fnc convertImageBmpToJpg");			
			
			const requestBody = JSON.stringify(bmpdata);
				
			let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json',
																				 'Access-Control-Allow-Origin': '*'
																				});																
																				
			let options = {headers: httpHeaders};

			return this.httpClient.put<IResponse>(this.baseUrl + '/convertImageBmpToJpg', requestBody, options )						
            .pipe(
                catchError((e) => this.handleError(e))
            );			
    }			

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
          'Something bad happened; please try again later.');
    };
		
}
