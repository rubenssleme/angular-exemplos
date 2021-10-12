

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Imagens } from './../models/placeholder.model';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  constructor(private http: HttpClient) { }
  /**
   * getPhotos
   */
  public getPhotos(): Observable<any> {
   return this.http.get('http://localhost:8080/topicos');
  }
}
