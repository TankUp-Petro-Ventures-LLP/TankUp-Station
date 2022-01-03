/* eslint-disable @typescript-eslint/naming-convention */
export class Config {
  // static API_URL = 'http://3.109.101.84:9000/'; //staging
  // static API_URL = 'http://localhost:3000/'; //prod
  static API_URL = 'http://192.168.102.165:3000/'; //local
  // static API_URL_LOCK = 'http://15.206.96.109:3100/api/automation'
  static makeCall(number : number){
    let location ='tel:+91'+number+'';
    window.location.href = location;
    return;
}
}
