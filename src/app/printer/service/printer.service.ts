import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrintService {

  // serverUrl = 'http://10.81.235.16:3000';

  constructor(private http: HttpClient) {}

  // printOrder(order: any,design: string) {
  //   return this.http.post(`${environment.printServerUrl}print-order`, order);
  // }
  printOrder(payload: { order: any, categoryDesigns: { [key:string]: string } }): Observable<any> {
    return this.http.post(`${environment.printServerUrl}print`, payload);
  }

}
