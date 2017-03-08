import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Customer } from '../../models/customer';
import { LoginService } from '../login/login.service';

import { environment } from '../../../../environments/environment';

const customerUrl = environment.backend_sdk + '/customers';
const customersCountUrl = customerUrl + '/count'

@Injectable()
export class CustomerService {

  constructor(private http: Http, private loginService: LoginService) { }

  count(): Observable<number> {
    const requestOptions: RequestOptions = this.buildRequestOptions();

    return this.http.get(customersCountUrl, requestOptions)
    .map(this.extractNumberBody)
    .catch(this.handleError);
  }

  getAll(limit?: number, offset?: number): Observable<Customer[]> {
    const requestOptions: RequestOptions = this.buildRequestOptions();

    return this.http.get(customerUrl, requestOptions)
    .map(this.extractDataArray)
    .catch(this.handleError);
  }

  loadById(id: string): Promise<Customer> {
    const requestOptions: RequestOptions = this.buildRequestOptions();

    return this.http.get(this.buildByIdUrl(id), requestOptions).toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  insert(customer: Customer): Promise<Customer> {
    const requestOptions: RequestOptions = this.buildRequestOptions('application/json');

    return this.http.post(customerUrl, JSON.stringify(customer), requestOptions).toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  update(customer: Customer): Promise<boolean> {
    const requestOptions: RequestOptions = this.buildRequestOptions('application/json');

    return this.http.put(this.buildByIdUrl(customer.id), JSON.stringify(customer), requestOptions).toPromise()
    .then((res: Response) => {return true;})
    .catch(this.handleError);
  }

  delete(id: string): Promise<boolean> {
    const requestOptions: RequestOptions = this.buildRequestOptions();

    return this.http.delete(customerUrl, requestOptions).toPromise()
    .then((res: Response) => {return true;})
    .catch(this.handleError);
  }

  private buildByIdUrl(id: string) {
    return customerUrl + '/' + id;
  }

  private buildRequestOptions(contentType?: string): RequestOptions {
    const headers: Headers = new Headers();

    if (this.loginService.isLoggedIn()) {
      headers.append('X-Auth-Token', this.loginService.getToken());
    }

    if (contentType) {
      headers.append('Content-Type', contentType);
    }

    return new RequestOptions({ 'headers': headers });
  }

  private extractNumberBody(res: Response): number {
    return Number(res.text());
  }

  private extractTextBody(res: Response): string {
    return res.text();
  }

  private extractDataArray(res: Response) {
    const body = res.json();
    return body || [];
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}