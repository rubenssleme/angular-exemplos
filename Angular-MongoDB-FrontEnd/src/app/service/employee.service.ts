import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private http: HttpClient
  ) { }

  getEmployee(id: number): Observable<any> {
    return this.http.get(`${environment.baseUrl}/${id}`);
  }
  createEmployee(employee: Object): Observable<Object> {
    return this.http.post(`${environment.baseUrl}`, employee);
  }
  updateEmployee(id: number, employee: Object): Observable<Object> {
    return this.http.put(`${environment.baseUrl}/${id}`, employee);
  }
  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/${id}`, { responseType: 'text' });
  }
  getEmployeesList(): Observable<any> {
    return this.http.get(`${environment.baseUrl}`);
  }
}
