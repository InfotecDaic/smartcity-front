import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { VehicleTypesModel } from '../../models/vehicle-types';
import { LoginService } from '../login/login.service';

import { environment } from '../../../../environments/environment';

const vehicleTypesUrl = environment.backend_sdk;

@Injectable()
export class VehicleTypesService {

  loginServ: LoginService;
  private url: string;

  constructor(private http: Http, private loginService: LoginService) { }

  getAll(limit?: number, offset?: number): Observable<VehicleTypesModel[]> {
    const requestOptions: RequestOptions = this.buildRequestOptions();

    return this.http.get(this.buildByIdUserUrl() , requestOptions)
    .map(this.extractDataArray)
    .catch(this.handleError);
  }

  insert(vehicleTypesModel: VehicleTypesModel): Promise<VehicleTypesModel> {
    const requestOptions: RequestOptions = this.buildRequestOptions('application/json');

    return this.http.post(this.buildByIdUserUrl(), JSON.stringify(vehicleTypesModel), requestOptions).toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  update(vehicleTypesModel: VehicleTypesModel, id: string): Promise<boolean> {
    const requestOptions: RequestOptions = this.buildRequestOptions('application/json');

    return this.http.put(this.buildByIdUserUrl() + id, JSON.stringify(vehicleTypesModel), requestOptions).toPromise()
    .then((res: Response) => {return true;})
    .catch(this.handleError);
  }

  delete(id: string): Promise<boolean> {
    const requestOptions: RequestOptions = this.buildRequestOptions();

    return this.http.delete(this.buildByIdUserUrl() + id, requestOptions).toPromise()
    .then((res: Response) => {return true;})
    .catch(this.handleError);
  }

  private buildByIdUserUrl() {
    return vehicleTypesUrl + '/vehiclesType/';
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