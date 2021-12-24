import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentService } from '../components/component.service';

@Injectable({
  providedIn: 'root'
})
export class ApiTalkService {

  constructor(public http: HttpClient, private cp: ComponentService) {}

  async getToken() {
    let currentUser = await this.cp.storageGet('user');
    let token = currentUser && currentUser.token;
    token = 'Bearer' + ' ' + token;
    return token;
  }

  async getData(passed_url: any) {
    let token = await this.getToken();
    return this.http
      .get(passed_url, {
        headers: { Authorization: token, 'Content-Type': 'application/json' },
      })
      .toPromise()
      .then(
        (result) => {
          let res: any = {};
          res['json'] = result;
          res['status'] = 200;
          return res;
        },
        (err) => {
          return err.error;
        }
      )
      .catch((Error) => {
        Error['json'] = JSON.parse(Error['_body']);
        return Error;
      });
  }

  async putData(passed_url: any, data: any) {
    let token = await this.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: token,
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .put(passed_url, JSON.stringify(data), httpOptions)
      .toPromise()
      .then(
        (result) => {
          let res: any = {};
          res['json'] = result;
          res['status'] = 200;
          return res;
        },
        (err) => {
          console.log(err);
          return err.error;
        }
      )
      .catch((Error) => {
        Error['json'] = JSON.parse(Error['_body']);
        return Error;
      });
  }

  async patchData(passed_url: any, data: any) {
    let token = await this.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: token,
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .patch(passed_url, JSON.stringify(data), httpOptions)
      .toPromise()
      .then(
        (result) => {
          let res: any = {};
          res['json'] = result;
          res['status'] = 200;
          return res;
        },
        (err) => {
          console.log(err);
          return err.error;
        }
      )
      .catch((Error) => {
        Error['json'] = JSON.parse(Error['_body']);
        return Error;
      });
  }

  async postData(passed_url: any, data: any) {
    let token = await this.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: token,
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .post(passed_url, JSON.stringify(data), httpOptions)
      .toPromise()
      .then(
        (result) => {
          let res: any = {};
          res['json'] = result;
          res['status'] = 200;
          return res;
        },
        (err) => {
          return err.error;
        }
      )
      .catch((Error) => {
        Error['json'] = JSON.parse(Error['_body']);
        return Error;
      });
  }

  async deleteData(passed_url: any) {
    let token = await this.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: token,
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .delete(passed_url, httpOptions)
      .toPromise()
      .then(
        (result) => {
          let res: any = {};
          res['json'] = result;
          res['status'] = 200;
          return res;
        },
        (err) => {
          return err.error;
        }
      )
      .catch((Error) => {
        Error['json'] = JSON.parse(Error['_body']);
        return Error;
      });
  }

  loggedIn() {
    return !!localStorage.getItem('currentUser');
  }
}
