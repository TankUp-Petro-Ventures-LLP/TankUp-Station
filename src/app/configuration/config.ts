/* eslint-disable @typescript-eslint/naming-convention */
export class Config {
  // static API_URL = 'http://3.109.101.84:9000/'; //staging
  static API_URL = 'http://15.206.96.109:3200/'; //prod
  // static API_URL = 'http://3.109.101.84:3200/'; //local
  static makeCall(number : number){
    let location ='tel:+91'+number+'';
    window.location.href = location;
    return;
}
}
